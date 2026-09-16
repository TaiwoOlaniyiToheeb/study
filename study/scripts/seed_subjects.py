"""
Seeds sample subjects/topics (the JAMB example from the original spec) by
calling the running API's /api/subjects endpoints. Run this once after
deploying, against whichever backend URL you're using.

Usage:
    python scripts/seed_subjects.py --api-url https://your-backend.up.railway.app
    python scripts/seed_subjects.py --api-url http://localhost:8000   # local dev
"""
from __future__ import annotations

import argparse
import sys

import httpx

SUBJECTS = {
    "Mathematics": [
        {"name": "Number System", "difficulty": 2, "sequence_index": 0},
        {"name": "Linear Equations", "difficulty": 2, "sequence_index": 1},
        {"name": "Indices", "difficulty": 2, "sequence_index": 2},
        {"name": "Quadratic Equations", "difficulty": 4, "sequence_index": 3},
        {"name": "Simultaneous Equations", "difficulty": 4, "sequence_index": 4},
        {"name": "Geometry", "difficulty": 3, "sequence_index": 5},
    ],
    "Physics": [
        {"name": "Motion", "difficulty": 3, "sequence_index": 0},
        {"name": "Forces", "difficulty": 3, "sequence_index": 1},
        {"name": "Energy", "difficulty": 3, "sequence_index": 2},
    ],
    "Chemistry": [
        {"name": "Atomic Structure", "difficulty": 3, "sequence_index": 0},
        {"name": "Chemical Bonding", "difficulty": 4, "sequence_index": 1},
    ],
    "English": [
        {"name": "Comprehension", "difficulty": 2, "sequence_index": 0},
        {"name": "Lexis and Structure", "difficulty": 2, "sequence_index": 1},
    ],
}

# Sequential prerequisite chains within each subject (topic N requires topic N-1).
SEQUENTIAL_PREREQS = True


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--api-url", required=True, help="Base URL of the running backend, e.g. http://localhost:8000")
    args = parser.parse_args()

    base = args.api_url.rstrip("/") + "/api"

    with httpx.Client(timeout=15.0) as client:
        for subject_name, topics in SUBJECTS.items():
            resp = client.post(f"{base}/subjects", json={"name": subject_name})
            if resp.status_code not in (200, 201):
                print(f"Failed to create subject {subject_name}: {resp.status_code} {resp.text}", file=sys.stderr)
                continue
            subject = resp.json()
            print(f"Created subject: {subject_name} ({subject['id']})")

            previous_topic_id = None
            for topic in topics:
                payload = dict(topic)
                if SEQUENTIAL_PREREQS and previous_topic_id:
                    payload["prerequisite_topic_ids"] = [previous_topic_id]
                t_resp = client.post(f"{base}/subjects/{subject['id']}/topics", json=payload)
                if t_resp.status_code not in (200, 201):
                    print(f"  Failed to create topic {topic['name']}: {t_resp.status_code} {t_resp.text}", file=sys.stderr)
                    continue
                created_topic = t_resp.json()
                print(f"  Created topic: {topic['name']} ({created_topic['id']})")
                previous_topic_id = created_topic["id"]

    print("\nDone. Subjects and topics are shared curriculum data — this only needs to run once per deployment.")


if __name__ == "__main__":
    main()
