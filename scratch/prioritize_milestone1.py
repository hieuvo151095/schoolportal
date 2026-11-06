#!/usr/bin/env python3
"""Prioritize features in feature_list.json according to the 3 Milestones."""
import json

FL_PATH = ".harness-state/feature_list.json"

# Milestone 1: Pre-requisites (Foundation) + Finance (M4)
M1_FOUNDATION = [
    # M7 Auth
    "DN-01", "DN-02", "DN-03", "DN-04", "DN-05", "DN-06",
    # M6 Core Settings
    "CH-01", "CH-02", "CH-11", "CH-03", "CH-10",
    # M5 Core Master Data
    "NT-14", "NT-06", "NT-04", "NT-03", "NT-01", "NT-13"
]

M1_FINANCE = [
    # Fee Catalog & Pricing
    "TC-03", "TC-04", "TC-19", "TC-20",
    # Discounts & Policies
    "TC-09", "TC-10", "TC-15", "TC-16", "TC-17", "TC-18",
    # Invoicing & Billing
    "TC-01", "TC-02", "TC-22", "TC-21",
    # Reconciliation, Expenses, Reporting
    "TC-06", "TC-05", "TC-07",
    # Meal refund calculations & transitions
    "TC-11", "TC-12", "TC-13", "TC-14", "TC-08"
]

M1_ALL = M1_FOUNDATION + M1_FINANCE

# Milestone 2: Operations (M2) + Supporting M5/M6
M2_ALL = [
    # M2 Operations
    "VH-01", "VH-02", "VH-03", "VH-04", "VH-09", "VH-10",
    "VH-05", "VH-06", "VH-07", "VH-08",
    # Supporting
    "NT-10", "CH-04", "CH-12", "CH-05", "CH-06"
]

# Milestone 3: Academics (M3), Rest of M5, Overview (M1), Rest of M6/M7
M3_ALL = [
    # M3 Academics
    "HT-01", "HT-02", "HT-06", "HT-03", "HT-04", "HT-05",
    # M5 remaining
    "NT-05", "NT-07", "NT-08", "NT-09", "NT-11", "NT-12", "NT-02", "NT-15", "NT-16", "NT-17",
    # M1 Overview
    "TQ-01", "TQ-02", "TQ-03",
    # M6/M7 remaining
    "CH-07", "CH-08", "CH-09"
]

with open(FL_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

features = {f["id"]: f for f in data["features"]}

# Assign priorities and reorder
ordered_features = []

# M1 features -> P0
for fid in M1_ALL:
    if fid in features:
        feat = features[fid]
        feat["priority"] = "P0"
        ordered_features.append(feat)

# M2 features -> P1
for fid in M2_ALL:
    if fid in features:
        feat = features[fid]
        feat["priority"] = "P1"
        ordered_features.append(feat)

# M3 features -> P2
for fid in M3_ALL:
    if fid in features:
        feat = features[fid]
        feat["priority"] = "P2"
        ordered_features.append(feat)

# Any leftovers
accounted_ids = set(M1_ALL + M2_ALL + M3_ALL)
for fid, feat in features.items():
    if fid not in accounted_ids:
        feat["priority"] = "P3"
        ordered_features.append(feat)

print(f"Total features ordered: {len(ordered_features)}")
print(f"Milestone 1 (P0): {sum(1 for f in ordered_features if f['priority'] == 'P0')}")
print(f"Milestone 2 (P1): {sum(1 for f in ordered_features if f['priority'] == 'P1')}")
print(f"Milestone 3 (P2): {sum(1 for f in ordered_features if f['priority'] == 'P2')}")

data["features"] = ordered_features

with open(FL_PATH, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Updated {FL_PATH} successfully!")
