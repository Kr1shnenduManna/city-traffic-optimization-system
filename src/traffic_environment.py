import numpy as np


class TrafficEnvironment:
    def __init__(self, scenarios_df, traffic_data_df):
        self.scenarios = scenarios_df
        self.traffic_data = traffic_data_df
        self.current_cluster = 0
        self.vehicles = {"ns": [], "ew": []}
        self.signal_state = "green-ns"
        self.signal_timer = 0
        self.time_step = 0
        self.avg_speed = 50.0

        # For sudden cluster changes (incidents / disruptions)
        self.cluster_override = False
        self.cluster_override_until = 0

    def reset(self):
        self.current_cluster = 0
        self.vehicles = {"ns": [], "ew": []}
        self.signal_state = "green-ns"
        self.signal_timer = 0
        self.time_step = 0
        self.avg_speed = 50.0
        return self.get_state()

    def get_state(self):
        return {
            "cluster": self.current_cluster,
            "queue_ns": self.get_queue_length("ns"),
            "queue_ew": self.get_queue_length("ew"),
            "signal_state": self.signal_state,
            "avg_speed": self.avg_speed,
        }

    def step(self, action):
        timings = self.apply_action(action)

        # Possibly change cluster suddenly to simulate real-world incidents
        self.maybe_change_cluster()

        self.spawn_vehicles()
        self.update_signal(timings)
        passed = self.move_vehicles()

        self.time_step += 1
        reward = self.calculate_reward(passed)

        info = {
            "avg_wait_time": self.get_avg_wait_time(),
            "total_queue": self.get_total_queue(),
            "vehicles_passed": passed,
        }

        return self.get_state(), reward, False, info

    def apply_action(self, action):
        timings = {"green-ns": 45, "green-ew": 35, "yellow": 3}
        if action == 1:
            timings["green-ns"] = 55
            timings["green-ew"] = 30
        elif action == 2:
            timings["green-ns"] = 35
            timings["green-ew"] = 45
        elif action == 3:
            timings["green-ns"] = 30
            timings["green-ew"] = 25
        elif action == 4:
            timings["green-ns"] = 60
            timings["green-ew"] = 45
        return timings

    def spawn_vehicles(self):
        scenario = self.scenarios.iloc[self.current_cluster]
        if np.random.rand() < scenario["spawn_rate"]:
            direction = "ns" if np.random.rand() < 0.5 else "ew"
            self.vehicles[direction].append(
                {
                    "position": 0,
                    "wait_time": 0,
                    "speed": scenario["Average Speed"] / 3.6,
                }
            )

    def maybe_change_cluster(self):
        """Introduce sudden cluster changes to simulate incidents or disruptions.
        Behavior:
        - If currently in an override (incident), keep it until override duration expires.
        - Otherwise, with a small probability a sudden event occurs and switches to a different cluster for a random duration.
        """
        # If currently forced into a cluster due to an incident, check end condition
        if self.cluster_override:
            if self.time_step >= self.cluster_override_until:
                self.cluster_override = False
                # revert to a random normal cluster (allow all clusters)
                clusters = list(self.scenarios["cluster_id"].values)
                self.current_cluster = int(np.random.choice(clusters))
            return

        # Small chance of sudden event each step
        # You can tune this probability (e.g., 0.01 means ~1% chance per step)
        sudden_event_prob = 0.01
        if np.random.rand() < sudden_event_prob:
            clusters = list(self.scenarios["cluster_id"].values)
            # Prefer more severe clusters when picking an incident (higher cluster id ~ more disruption)
            weights = np.array([int(c) + 1 for c in clusters], dtype=float)
            # avoid selecting current cluster
            for i, c in enumerate(clusters):
                if int(c) == int(self.current_cluster):
                    weights[i] = 0.0
            if weights.sum() == 0:
                weights = np.ones_like(weights)
            probs = weights / weights.sum()
            target = int(np.random.choice(clusters, p=probs))

            # Set override and duration (random between 50 and 200 steps)
            duration = np.random.randint(50, 200)
            self.cluster_override = True
            self.cluster_override_until = self.time_step + duration
            self.current_cluster = target
            # Note: spawn_rate / avg speed etc. will be pulled from scenarios for current_cluster

    def update_signal(self, timings):
        self.signal_timer += 1
        if self.signal_state == "green-ns" and self.signal_timer >= timings["green-ns"]:
            self.signal_state, self.signal_timer = "yellow-ns", 0
        elif (
            self.signal_state == "yellow-ns" and self.signal_timer >= timings["yellow"]
        ):
            self.signal_state, self.signal_timer = "green-ew", 0
        elif (
            self.signal_state == "green-ew" and self.signal_timer >= timings["green-ew"]
        ):
            self.signal_state, self.signal_timer = "yellow-ew", 0
        elif (
            self.signal_state == "yellow-ew" and self.signal_timer >= timings["yellow"]
        ):
            self.signal_state, self.signal_timer = "green-ns", 0

    def move_vehicles(self):
        passed = 0
        for d in ["ns", "ew"]:
            can_move = (d == "ns" and "green-ns" in self.signal_state) or (
                d == "ew" and "green-ew" in self.signal_state
            )
            updated = []
            for v in self.vehicles[d]:
                if can_move or v["position"] < 50:
                    v["position"] += v["speed"]
                else:
                    v["wait_time"] += 1
                if v["position"] < 100:
                    updated.append(v)
                else:
                    passed += 1
            self.vehicles[d] = updated
        return passed

    def get_queue_length(self, d):
        return len(
            [v for v in self.vehicles[d] if v["position"] >= 50 and v["wait_time"] > 0]
        )

    def get_total_queue(self):
        return self.get_queue_length("ns") + self.get_queue_length("ew")

    def get_avg_wait_time(self):
        all_v = self.vehicles["ns"] + self.vehicles["ew"]
        if not all_v:
            return 0
        return np.mean([v["wait_time"] for v in all_v])

    def calculate_reward(self, passed):
        return (
            passed * 10 - 0.1 * self.get_avg_wait_time() - 0.5 * self.get_total_queue()
        )
