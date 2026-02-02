"""
Flask Backend Server for Traffic Simulation
Handles Q-Learning Agent and Fixed-Time Controller simulations
"""

from flask import Flask, jsonify, request, Response, make_response
from flask_cors import CORS
import numpy as np
import pandas as pd
import json
import os
from pathlib import Path
import sys

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.traffic_environment import TrafficEnvironment
from src.q_learning_agent import QLearningAgent
from src.predictor import TrafficPredictor
from src.signal_controllers import FixedTimeController, AgentController
from src.metrics_tracker import MetricsTracker

app = Flask(__name__)
CORS(app)

# Global state
simulation_state = {
    "fixed_env": None,
    "agent_env": None,
    "agent": None,
    "predictor": None,
    "agent_controller": None,
    "fixed_controller": None,
    "metrics_tracker": None,
    "is_running": False,
    "current_step": 0,
}


def load_data():
    """Load required data files"""
    project_root = Path(__file__).parent.parent

    # Load traffic data
    traffic_data = pd.read_csv(
        project_root / "data" / "processed" / "bangalore_traffic_processed.csv"
    )

    # Load scenarios
    scenarios = pd.read_csv(
        project_root / "data" / "processed" / "traffic_scenarios_from_clusters_k4.csv"
    )

    # Load trained agent
    agent_path = project_root / "results" / "trained_q_agent.npy"

    # Load transition matrix
    transition_matrix_path = project_root / "results" / "transition_matrix.npy"
    if transition_matrix_path.exists():
        transition_matrix = np.load(transition_matrix_path)
    else:
        # Create a default transition matrix if not found
        transition_matrix = np.ones((4, 4)) / 4

    return traffic_data, scenarios, agent_path, transition_matrix


def initialize_simulation():
    """Initialize traffic simulation with both controllers"""
    try:
        # Load data
        traffic_data, scenarios, agent_path, transition_matrix = load_data()

        # Initialize environments
        simulation_state["fixed_env"] = TrafficEnvironment(scenarios, traffic_data)
        simulation_state["agent_env"] = TrafficEnvironment(scenarios, traffic_data)

        # Initialize Q-Learning agent
        simulation_state["agent"] = QLearningAgent(
            n_states=4,
            n_queue_bins=10,
            n_actions=5,
            lr=0.1,
            gamma=0.95,
            epsilon=0.0,  # No exploration during simulation
        )

        # Load trained weights
        if agent_path.exists():
            simulation_state["agent"].q = np.load(agent_path)

        # Initialize predictor with transition matrix
        simulation_state["predictor"] = TrafficPredictor(transition_matrix)

        # Initialize controllers
        simulation_state["fixed_controller"] = FixedTimeController(scenarios)
        simulation_state["agent_controller"] = AgentController(
            simulation_state["agent"], simulation_state["predictor"]
        )

        # Initialize metrics tracker
        simulation_state["metrics_tracker"] = MetricsTracker()

        # Initialize history trackers for fixed and agent metrics
        simulation_state["history_fixed"] = []
        simulation_state["history_agent"] = []

        return True
    except Exception as e:
        print(f"Error initializing simulation: {e}")
        import traceback

        traceback.print_exc()
        return False


@app.route("/api/init", methods=["POST"])
def init_simulation():
    """Initialize the simulation"""
    try:
        print("Starting simulation initialization...")
        if initialize_simulation():
            simulation_state["current_step"] = 0
            simulation_state["fixed_env"].reset()
            simulation_state["agent_env"].reset()
            print("Simulation initialized successfully")
            return jsonify({"status": "success", "message": "Simulation initialized"})
        else:
            print("Initialization failed - initialization function returned False")
            return jsonify({"status": "error", "message": "Failed to initialize"}), 500
    except Exception as e:
        print(f"Error in init_simulation endpoint: {e}")
        import traceback

        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/step", methods=["POST"])
def step_simulation():
    """Run one step of simulation for both controllers"""
    try:
        # Check if simulation is initialized
        if (
            simulation_state["fixed_env"] is None
            or simulation_state["agent_env"] is None
        ):
            return jsonify(
                {
                    "status": "error",
                    "message": "Simulation not initialized. Call /api/init first.",
                }
            ), 400

        data = request.json
        if data is None:
            data = {}
        num_steps = data.get("steps", 1)

        fixed_metrics = []
        agent_metrics = []

        for _ in range(num_steps):
            # Fixed Time Controller
            fixed_state = simulation_state["fixed_env"].get_state()
            fixed_action = simulation_state["fixed_controller"].get_action(
                fixed_state["cluster"]
            )
            _, _, _, fixed_info = simulation_state["fixed_env"].step(fixed_action)
            fixed_entry = {
                "step": simulation_state["current_step"],
                "cluster": fixed_state.get("cluster", 0),
                "queue_ns": fixed_state["queue_ns"],
                "queue_ew": fixed_state["queue_ew"],
                "avg_wait_time": fixed_info.get("avg_wait_time", 0),
                "vehicles_passed": fixed_info.get("vehicles_passed", 0),
            }
            fixed_metrics.append(fixed_entry)
            # store in history for later summary
            simulation_state["history_fixed"].append(fixed_entry)

            # Q-Learning Agent
            agent_state = simulation_state["agent_env"].get_state()
            prediction = simulation_state["predictor"].predict(
                agent_state["cluster"],
                agent_state["queue_ns"],
                agent_state["queue_ew"],
                agent_state.get("avg_speed", 0),
            )
            agent_action = simulation_state["agent_controller"].get_action(
                agent_state["cluster"],
                agent_state["queue_ns"],
                agent_state["queue_ew"],
                prediction,
            )
            _, _, _, agent_info = simulation_state["agent_env"].step(agent_action)
            agent_entry = {
                "step": simulation_state["current_step"],
                "cluster": agent_state.get("cluster", 0),
                "queue_ns": agent_state["queue_ns"],
                "queue_ew": agent_state["queue_ew"],
                "avg_wait_time": agent_info.get("avg_wait_time", 0),
                "vehicles_passed": agent_info.get("vehicles_passed", 0),
            }
            agent_metrics.append(agent_entry)
            # store in history for later summary
            simulation_state["history_agent"].append(agent_entry)

            simulation_state["current_step"] += 1

        return jsonify(
            {
                "status": "success",
                "fixed_metrics": fixed_metrics,
                "agent_metrics": agent_metrics,
                "current_step": simulation_state["current_step"],
            }
        )
    except Exception as e:
        print(f"Error in step_simulation: {e}")
        import traceback

        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/state", methods=["GET"])
def get_state():
    """Get current state of both simulations"""
    try:
        fixed_state = simulation_state["fixed_env"].get_state()
        agent_state = simulation_state["agent_env"].get_state()

        return jsonify(
            {
                "status": "success",
                "fixed_state": fixed_state,
                "agent_state": agent_state,
                "current_step": simulation_state["current_step"],
            }
        )
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/reset", methods=["POST"])
def reset_simulation():
    """Reset the simulation"""
    try:
        simulation_state["fixed_env"].reset()
        simulation_state["agent_env"].reset()
        simulation_state["current_step"] = 0
        simulation_state["metrics_tracker"] = MetricsTracker()
        # clear stored histories
        simulation_state["history_fixed"] = []
        simulation_state["history_agent"] = []

        return jsonify({"status": "success", "message": "Simulation reset"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/stats", methods=["GET"])
def get_stats():
    """Get aggregated statistics and per-cluster summary"""
    try:
        fixed_hist = simulation_state.get("history_fixed", [])
        agent_hist = simulation_state.get("history_agent", [])

        total_steps = max(len(fixed_hist), len(agent_hist))

        def safe_mean(values):
            return float(np.mean(values)) if len(values) > 0 else 0.0

        fixed_total_passed = sum([h.get("vehicles_passed", 0) for h in fixed_hist])
        agent_total_passed = sum([h.get("vehicles_passed", 0) for h in agent_hist])

        fixed_avg_wait = safe_mean([h.get("avg_wait_time", 0) for h in fixed_hist])
        agent_avg_wait = safe_mean([h.get("avg_wait_time", 0) for h in agent_hist])

        fixed_avg_queue = safe_mean(
            [h.get("queue_ns", 0) + h.get("queue_ew", 0) for h in fixed_hist]
        )
        agent_avg_queue = safe_mean(
            [h.get("queue_ns", 0) + h.get("queue_ew", 0) for h in agent_hist]
        )

        improvement = {
            "vehicles_passed_improvement_pct": (
                (agent_total_passed - fixed_total_passed)
                / max(fixed_total_passed, 1)
                * 100
            )
            if fixed_total_passed > 0
            else 0.0,
            "wait_time_reduction_pct": (
                (fixed_avg_wait - agent_avg_wait) / max(fixed_avg_wait, 1) * 100
            )
            if fixed_avg_wait > 0
            else 0.0,
            "queue_reduction_pct": (
                (fixed_avg_queue - agent_avg_queue) / max(fixed_avg_queue, 1) * 100
            )
            if fixed_avg_queue > 0
            else 0.0,
        }

        # Per-cluster aggregation
        per_cluster = []
        scenarios = simulation_state["fixed_env"].scenarios
        for c in sorted(scenarios["cluster_id"].unique()):
            name = scenarios.loc[
                scenarios["cluster_id"] == c, "traffic_state_name"
            ].values[0]
            fixed_entries = [h for h in fixed_hist if h.get("cluster") == c]
            agent_entries = [h for h in agent_hist if h.get("cluster") == c]

            fixed_avg_wait_c = safe_mean(
                [h.get("avg_wait_time", 0) for h in fixed_entries]
            )
            agent_avg_wait_c = safe_mean(
                [h.get("avg_wait_time", 0) for h in agent_entries]
            )

            fixed_avg_queue_c = safe_mean(
                [h.get("queue_ns", 0) + h.get("queue_ew", 0) for h in fixed_entries]
            )
            agent_avg_queue_c = safe_mean(
                [h.get("queue_ns", 0) + h.get("queue_ew", 0) for h in agent_entries]
            )

            fixed_passed_c = sum([h.get("vehicles_passed", 0) for h in fixed_entries])
            agent_passed_c = sum([h.get("vehicles_passed", 0) for h in agent_entries])

            wait_reduction_pct = (
                ((fixed_avg_wait_c - agent_avg_wait_c) / max(fixed_avg_wait_c, 1) * 100)
                if fixed_avg_wait_c > 0
                else 0.0
            )
            queue_reduction_pct = (
                (
                    (fixed_avg_queue_c - agent_avg_queue_c)
                    / max(fixed_avg_queue_c, 1)
                    * 100
                )
                if fixed_avg_queue_c > 0
                else 0.0
            )
            passed_improvement_pct = (
                ((agent_passed_c - fixed_passed_c) / max(fixed_passed_c, 1) * 100)
                if fixed_passed_c > 0
                else 0.0
            )

            per_cluster.append(
                {
                    "cluster": int(c),
                    "name": str(name),
                    "steps": max(len(fixed_entries), len(agent_entries)),
                    "fixed_avg_wait": fixed_avg_wait_c,
                    "agent_avg_wait": agent_avg_wait_c,
                    "wait_reduction_pct": wait_reduction_pct,
                    "fixed_avg_queue": fixed_avg_queue_c,
                    "agent_avg_queue": agent_avg_queue_c,
                    "queue_reduction_pct": queue_reduction_pct,
                    "fixed_passed": fixed_passed_c,
                    "agent_passed": agent_passed_c,
                    "passed_improvement_pct": passed_improvement_pct,
                }
            )

        return jsonify(
            {
                "status": "success",
                "total_steps": total_steps,
                "fixed_total_passed": fixed_total_passed,
                "agent_total_passed": agent_total_passed,
                "fixed_avg_wait": fixed_avg_wait,
                "agent_avg_wait": agent_avg_wait,
                "fixed_avg_queue": fixed_avg_queue,
                "agent_avg_queue": agent_avg_queue,
                "improvement": improvement,
                "per_cluster": per_cluster,
            }
        )
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/summary_csv", methods=["GET"])
def get_summary_csv():
    """Return simulation summary as CSV attachment"""
    try:
        fixed_hist = simulation_state.get("history_fixed", [])
        agent_hist = simulation_state.get("history_agent", [])

        def safe_mean(values):
            return float(np.mean(values)) if len(values) > 0 else 0.0

        fixed_total_passed = sum([h.get("vehicles_passed", 0) for h in fixed_hist])
        agent_total_passed = sum([h.get("vehicles_passed", 0) for h in agent_hist])

        fixed_avg_wait = safe_mean([h.get("avg_wait_time", 0) for h in fixed_hist])
        agent_avg_wait = safe_mean([h.get("avg_wait_time", 0) for h in agent_hist])

        fixed_avg_queue = safe_mean(
            [h.get("queue_ns", 0) + h.get("queue_ew", 0) for h in fixed_hist]
        )
        agent_avg_queue = safe_mean(
            [h.get("queue_ns", 0) + h.get("queue_ew", 0) for h in agent_hist]
        )

        improvement = {
            "vehicles_passed_improvement_pct": (
                (agent_total_passed - fixed_total_passed)
                / max(fixed_total_passed, 1)
                * 100
            )
            if fixed_total_passed > 0
            else 0.0,
            "wait_time_reduction_pct": (
                (fixed_avg_wait - agent_avg_wait) / max(fixed_avg_wait, 1) * 100
            )
            if fixed_avg_wait > 0
            else 0.0,
            "queue_reduction_pct": (
                (fixed_avg_queue - agent_avg_queue) / max(fixed_avg_queue, 1) * 100
            )
            if fixed_avg_queue > 0
            else 0.0,
        }

        # Per-cluster aggregation
        per_cluster = []
        scenarios = simulation_state["fixed_env"].scenarios
        for c in sorted(scenarios["cluster_id"].unique()):
            name = scenarios.loc[
                scenarios["cluster_id"] == c, "traffic_state_name"
            ].values[0]
            fixed_entries = [h for h in fixed_hist if h.get("cluster") == c]
            agent_entries = [h for h in agent_hist if h.get("cluster") == c]

            fixed_avg_wait_c = safe_mean(
                [h.get("avg_wait_time", 0) for h in fixed_entries]
            )
            agent_avg_wait_c = safe_mean(
                [h.get("avg_wait_time", 0) for h in agent_entries]
            )

            fixed_avg_queue_c = safe_mean(
                [h.get("queue_ns", 0) + h.get("queue_ew", 0) for h in fixed_entries]
            )
            agent_avg_queue_c = safe_mean(
                [h.get("queue_ns", 0) + h.get("queue_ew", 0) for h in agent_entries]
            )

            fixed_passed_c = sum([h.get("vehicles_passed", 0) for h in fixed_entries])
            agent_passed_c = sum([h.get("vehicles_passed", 0) for h in agent_entries])

            wait_reduction_pct = (
                ((fixed_avg_wait_c - agent_avg_wait_c) / max(fixed_avg_wait_c, 1) * 100)
                if fixed_avg_wait_c > 0
                else 0.0
            )
            queue_reduction_pct = (
                (
                    (fixed_avg_queue_c - agent_avg_queue_c)
                    / max(fixed_avg_queue_c, 1)
                    * 100
                )
                if fixed_avg_queue_c > 0
                else 0.0
            )
            passed_improvement_pct = (
                ((agent_passed_c - fixed_passed_c) / max(fixed_passed_c, 1) * 100)
                if fixed_passed_c > 0
                else 0.0
            )

            per_cluster.append(
                {
                    "cluster": int(c),
                    "name": str(name),
                    "steps": max(len(fixed_entries), len(agent_entries)),
                    "fixed_avg_wait": fixed_avg_wait_c,
                    "agent_avg_wait": agent_avg_wait_c,
                    "wait_reduction_pct": wait_reduction_pct,
                    "fixed_avg_queue": fixed_avg_queue_c,
                    "agent_avg_queue": agent_avg_queue_c,
                    "queue_reduction_pct": queue_reduction_pct,
                    "fixed_passed": fixed_passed_c,
                    "agent_passed": agent_passed_c,
                    "passed_improvement_pct": passed_improvement_pct,
                }
            )

        # Build CSV
        import io, csv

        output = io.StringIO()
        writer = csv.writer(output)

        # Overall metrics
        total_steps = max(len(fixed_hist), len(agent_hist))
        writer.writerow(["metric", "value"])
        writer.writerow(["total_steps", total_steps])
        writer.writerow(["fixed_total_passed", fixed_total_passed])
        writer.writerow(["agent_total_passed", agent_total_passed])
        writer.writerow(["fixed_avg_wait", fixed_avg_wait])
        writer.writerow(["agent_avg_wait", agent_avg_wait])
        writer.writerow(["fixed_avg_queue", fixed_avg_queue])
        writer.writerow(["agent_avg_queue", agent_avg_queue])
        writer.writerow(
            [
                "vehicles_passed_improvement_pct",
                improvement["vehicles_passed_improvement_pct"],
            ]
        )
        writer.writerow(
            ["wait_time_reduction_pct", improvement["wait_time_reduction_pct"]]
        )
        writer.writerow(["queue_reduction_pct", improvement["queue_reduction_pct"]])

        writer.writerow([])

        # Per-cluster header
        writer.writerow(
            [
                "cluster",
                "name",
                "steps",
                "fixed_avg_wait",
                "agent_avg_wait",
                "wait_reduction_pct",
                "fixed_avg_queue",
                "agent_avg_queue",
                "queue_reduction_pct",
                "fixed_passed",
                "agent_passed",
                "passed_improvement_pct",
            ]
        )
        for c in per_cluster:
            writer.writerow(
                [
                    c["cluster"],
                    c["name"],
                    c["steps"],
                    c["fixed_avg_wait"],
                    c["agent_avg_wait"],
                    c["wait_reduction_pct"],
                    c["fixed_avg_queue"],
                    c["agent_avg_queue"],
                    c["queue_reduction_pct"],
                    c["fixed_passed"],
                    c["agent_passed"],
                    c["passed_improvement_pct"],
                ]
            )

        response = make_response(output.getvalue())
        response.headers["Content-Type"] = "text/csv"
        response.headers["Content-Disposition"] = (
            "attachment; filename=simulation_summary.csv"
        )
        return response
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy"})


if __name__ == "__main__":
    # Initialize on startup
    initialize_simulation()
    app.run(debug=True, port=5000)
