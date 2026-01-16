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


def main():
    """Main entry point."""
    print("Fetching blocks from database...")
    blocks = fetch_all_blocks()
    
    if not blocks:
        print("No blocks found in database.")
        sys.exit(0)
    
    print(f"Fetched {len(blocks)} blocks.")
    
    coverage, all_topics = analyze_coverage(blocks)
    
    print_coverage_report(coverage, all_topics)
    
    print("Report complete.")


if __name__ == "__main__":
    main()
