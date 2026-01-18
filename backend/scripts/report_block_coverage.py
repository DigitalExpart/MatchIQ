#!/usr/bin/env python3
"""
Block Coverage Report - Analyze block distribution across topics, types, and stages.

Usage:
    python backend/scripts/report_block_coverage.py

This script generates a report showing how many blocks exist for each:
- Topic (e.g., heartbreak, divorce, cheating)
- Block type (REFLECTION, NORMALIZATION, INSIGHT, EXPLORATION, REFRAME)
- Stage (1-4)

Use this to identify gaps in content coverage.
"""
import os
import sys
from collections import defaultdict
from typing import Dict, List, Set
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Block type ordering for consistent display
BLOCK_TYPE_ORDER = [
    'reflection',
    'normalization',
    'insight',
    'exploration',
    'reframe'
]

# Core topics we intentionally grow to 30+ blocks
# Focus on main relationship/dating issues, not stray keywords
CORE_TOPICS = [
    "heartbreak",
    "breakup",
    "cheating",
    "infidelity",
    "cheating_self",
    "divorce",
    "separation",
    "marriage_strain",
    "constant_fighting",
    "communication",  # "communication_problems" in data
    "mismatched_expectations",
    "feeling_unappreciated",
    "long_distance",
    "one_sided_effort",
    "talking_stage",  # "talking_stage_or_situationship"
    "situationship",
    "unclear",  # "unclear_relationship_status"
    "lust_vs_love",
    "pretense",  # "pretense_or_inauthenticity"
    "inauthenticity",
    "jealousy",  # "jealousy_or_trust_issues"
    "trust",
    "stuck_on_ex",
    "comparison_to_others",
    "low_self_worth_in_love",
    "unlovable",  # Related to low self-worth
    "online_dating_burnout",
    "toxic_or_abusive_dynamic",
    "partner_mental_health_or_addiction",
    "intimacy_mismatch",
    "sexual_compatibility",
    "core_values_conflict",
    "coparenting_and_family_dynamics",
    "non_monogamy_open_or_poly",
    "asexual_or_low_desire_identity",
    "lgbtq_identity_and_family_pressure"
]

# Minimum target blocks per core topic
MIN_BLOCKS_PER_CORE_TOPIC = 30


def get_supabase_client() -> Client:
    """Create Supabase client from environment variables."""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_ANON_KEY")
    
    if not url or not key:
        print("Error: SUPABASE_URL and SUPABASE_ANON_KEY environment variables required")
        print("Please create a .env file in the backend directory with these variables")
        sys.exit(1)
    
    return create_client(url, key)


def fetch_all_blocks():
    """Fetch all active blocks from the database."""
    supabase = get_supabase_client()
    
    try:
        response = supabase.table("amora_response_blocks") \
            .select("id, block_type, topics, stage, active") \
            .eq("active", True) \
            .execute()
        
        return response.data
    except Exception as e:
        print(f"Error fetching blocks: {e}")
        sys.exit(1)


def analyze_coverage(blocks: List[Dict]) -> tuple[Dict, List[str]]:
    """
    Analyze block coverage across topics, types, and stages.
    
    Returns a nested dict:
    {
        'topic_name': {
            'block_type': {
                stage: count
            }
        }
    }
    """
    coverage = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))
    all_topics = set()
    
    for block in blocks:
        block_type = block.get('block_type', 'unknown')
        stage = block.get('stage', 1)
        topics = block.get('topics', [])
        
        # Each block can have multiple topics
        for topic in topics:
            all_topics.add(topic)
            coverage[topic][block_type][stage] += 1
    
    return dict(coverage), sorted(all_topics)


def print_coverage_report(coverage: Dict, all_topics: List[str]):
    """Print a formatted coverage report."""
    print("\n" + "=" * 80)
    print(" AMORA BLOCK COVERAGE REPORT")
    print("=" * 80)
    print()
    
    # Summary statistics
    total_blocks = 0
    total_topics = len(all_topics)
    
    for topic in all_topics:
        if topic in coverage:
            for block_type in coverage[topic]:
                for stage, count in coverage[topic][block_type].items():
                    total_blocks += count
    
    print(f"Total Topics: {total_topics}")
    print(f"Total Block Assignments: {total_blocks}")
    print(f"(Note: Blocks with multiple topics are counted once per topic)")
    print()
    print("=" * 80)
    print()
    
    # Detailed coverage by topic
    for topic in all_topics:
        if topic not in coverage:
            print(f"Topic: {topic}")
            print("  No blocks found")
            print()
            continue
        
        print(f"Topic: {topic}")
        
        topic_total = 0
        for block_type in BLOCK_TYPE_ORDER:
            if block_type not in coverage[topic]:
                continue
            
            stages = coverage[topic][block_type]
            if not stages:
                continue
            
            print(f"  {block_type.upper()}:")
            
            # Sort stages numerically
            for stage in sorted(stages.keys()):
                count = stages[stage]
                topic_total += count
                print(f"    stage {stage}: {count}")
        
        print(f"  TOTAL: {topic_total}")
        print()
    
    print("=" * 80)
    print()
    
    # Summary by block type across all topics
    print("SUMMARY BY BLOCK TYPE (across all topics):")
    print()
    
    type_totals = defaultdict(int)
    for topic in coverage:
        for block_type in coverage[topic]:
            for stage, count in coverage[topic][block_type].items():
                type_totals[block_type] += count
    
    for block_type in BLOCK_TYPE_ORDER:
        if block_type in type_totals:
            print(f"  {block_type.upper()}: {type_totals[block_type]}")
    
    print()
    print("=" * 80)
    print()
    
    # Identify gaps (topics with low coverage)
    print("COVERAGE GAPS (topics with < 10 total blocks):")
    print()
    
    gaps_found = False
    for topic in all_topics:
        if topic not in coverage:
            print(f"  {topic}: 0 blocks (CRITICAL GAP)")
            gaps_found = True
            continue
        
        topic_total = sum(
            count
            for block_type in coverage[topic]
            for count in coverage[topic][block_type].values()
        )
        
        if topic_total < 10:
            print(f"  {topic}: {topic_total} blocks")
            gaps_found = True
    
    if not gaps_found:
        print("  No significant gaps found. All topics have >= 10 blocks.")
    
    print()
    print("=" * 80)


def print_core_topics_report(coverage: Dict, all_topics: List[str]):
    """Print focused report on CORE_TOPICS only."""
    print()
    print("=" * 80)
    print(f" CORE TOPICS COVERAGE (target: {MIN_BLOCKS_PER_CORE_TOPIC}+ blocks per topic)")
    print("=" * 80)
    print()
    
    # Filter to core topics that exist in coverage
    core_topics_in_data = [t for t in CORE_TOPICS if t in coverage]
    
    if not core_topics_in_data:
        print("No core topics found in database.")
        return
    
    # Calculate totals for each core topic
    core_topic_totals = {}
    for topic in core_topics_in_data:
        total = sum(
            count
            for block_type in coverage[topic]
            for count in coverage[topic][block_type].values()
        )
        core_topic_totals[topic] = total
    
    # Sort by total (ascending) so we see gaps first
    sorted_core_topics = sorted(core_topics_in_data, key=lambda t: core_topic_totals[t])
    
    # Print each core topic
    topics_below_target = []
    for topic in sorted_core_topics:
        total = core_topic_totals[topic]
        status = "[OK]" if total >= MIN_BLOCKS_PER_CORE_TOPIC else "[NEED MORE]"
        
        print(f"{status} Topic: {topic}")
        print(f"  TOTAL BLOCKS: {total} / {MIN_BLOCKS_PER_CORE_TOPIC}")
        
        if total < MIN_BLOCKS_PER_CORE_TOPIC:
            topics_below_target.append((topic, total))
        
        # Show breakdown by type/stage
        for block_type in BLOCK_TYPE_ORDER:
            if block_type not in coverage[topic]:
                continue
            
            stages = coverage[topic][block_type]
            if not stages:
                continue
            
            stage_str = ", ".join([f"s{s}:{count}" for s, count in sorted(stages.items())])
            print(f"  {block_type.upper()}: {stage_str}")
        
        print()
    
    print("=" * 80)
    print()
    
    # Summary of topics below target
    if topics_below_target:
        print(f"TOPICS BELOW {MIN_BLOCKS_PER_CORE_TOPIC} BLOCKS:")
        print()
        for topic, total in topics_below_target:
            needed = MIN_BLOCKS_PER_CORE_TOPIC - total
            print(f"  {topic}: {total} blocks (need {needed} more)")
        print()
        print(f"Total topics below target: {len(topics_below_target)} / {len(core_topics_in_data)}")
    else:
        print(f"[OK] All core topics have >= {MIN_BLOCKS_PER_CORE_TOPIC} blocks!")
    
    print()
    print("=" * 80)


def main():
    """Main entry point."""
    print("Fetching blocks from database...")
    blocks = fetch_all_blocks()
    
    if not blocks:
        print("No blocks found in database.")
        sys.exit(0)
    
    print(f"Fetched {len(blocks)} blocks.")
    
    coverage, all_topics = analyze_coverage(blocks)
    
    # Print core topics report first (most important)
    print_core_topics_report(coverage, all_topics)
    
    # Then full report
    print_coverage_report(coverage, all_topics)
    
    print("Report complete.")


if __name__ == "__main__":
    main()
