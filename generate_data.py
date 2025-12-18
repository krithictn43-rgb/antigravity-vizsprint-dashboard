import csv
import random
import json
from datetime import datetime, timedelta
from typing import List, Dict

# Configuration
NUM_USERS = 1000
NUM_EVENTS = 50000
START_DATE = datetime(2023, 1, 1)
END_DATE = datetime(2024, 1, 1)  # 90 days of data

# Constants
DEVICES = ['Mobile', 'Desktop', 'Tablet']
COUNTRIES = ['US', 'IN', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'BR', 'SG']
SUBSCRIPTION_STATUS = ['Free', 'Premium', 'Enterprise']
AB_VARIANTS = ['A', 'B']

EVENT_TYPES = [
    'signup_success',
    'view_dashboard',
    'start_project',
    'complete_task',
    'invite_user',
    'upgrade_subscription',
    'export_data',
    'share_report',
    'create_chart',
    'delete_project'
]

# Event funnel stages (in order)
FUNNEL_EVENTS = [
    'signup_success',
    'view_dashboard',
    'start_project',
    'complete_task',
    'invite_user'
]

def random_date(start: datetime, end: datetime) -> datetime:
    """Generate a random datetime between start and end."""
    delta = end - start
    random_seconds = random.randint(0, int(delta.total_seconds()))
    return start + timedelta(seconds=random_seconds)

def generate_users() -> List[Dict]:
    """Generate realistic user data."""
    users = []
    
    for i in range(1, NUM_USERS + 1):
        user_id = f"u_{i:04d}"
        joined_at = random_date(START_DATE, END_DATE - timedelta(days=7))  # Ensure users have time to generate events
        device = random.choices(DEVICES, weights=[0.6, 0.3, 0.1])[0]  # Mobile-heavy
        country = random.choices(COUNTRIES, weights=[0.3, 0.2, 0.1, 0.08, 0.07, 0.06, 0.05, 0.05, 0.05, 0.04])[0]
        subscription = random.choices(SUBSCRIPTION_STATUS, weights=[0.7, 0.25, 0.05])[0]  # Most are free
        ab_variant = random.choice(AB_VARIANTS)
        
        users.append({
            'user_id': user_id,
            'joined_at': joined_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
            'device': device,
            'country': country,
            'subscription_status': subscription,
            'ab_variant': ab_variant
        })
    
    return users

def generate_events(users: List[Dict]) -> List[Dict]:
    """Generate realistic event data with proper patterns."""
    events = []
    event_id = 1
    
    # Create a mapping of users for quick lookup
    user_map = {u['user_id']: u for u in users}
    
    for user in users:
        user_id = user['user_id']
        joined_at = datetime.strptime(user['joined_at'], '%Y-%m-%dT%H:%M:%SZ')
        ab_variant = user['ab_variant']
        
        # Determine user engagement level (some users are more active)
        engagement_level = random.choices(['low', 'medium', 'high'], weights=[0.5, 0.3, 0.2])[0]
        
        if engagement_level == 'low':
            num_events = random.randint(1, 5)
        elif engagement_level == 'medium':
            num_events = random.randint(5, 20)
        else:  # high
            num_events = random.randint(20, 80)
        
        # Always start with signup_success
        signup_time = joined_at + timedelta(minutes=random.randint(0, 5))
        source = random.choices(['ads', 'organic', 'referral', 'social'], weights=[0.3, 0.4, 0.2, 0.1])[0]
        
        events.append({
            'event_id': f"e_{event_id}",
            'user_id': user_id,
            'event_name': 'signup_success',
            'timestamp': signup_time.strftime('%Y-%m-%dT%H:%M:%SZ'),
            'metadata': json.dumps({'source': source, 'variant': ab_variant})
        })
        event_id += 1
        
        # Funnel progression with decay
        current_time = signup_time
        funnel_position = 1  # Already did signup
        
        # A/B variant B has better conversion rates (15% boost)
        conversion_boost = 1.15 if ab_variant == 'B' else 1.0
        
        # Progress through funnel with decreasing probability
        funnel_probabilities = [0.8, 0.6, 0.4, 0.2]  # Probability of reaching next stage
        
        for i, next_event in enumerate(FUNNEL_EVENTS[1:]):
            if random.random() < (funnel_probabilities[i] * conversion_boost):
                # User progresses to next funnel stage
                time_delta = timedelta(minutes=random.randint(1, 60))
                current_time += time_delta
                
                if current_time > END_DATE:
                    break
                
                events.append({
                    'event_id': f"e_{event_id}",
                    'user_id': user_id,
                    'event_name': next_event,
                    'timestamp': current_time.strftime('%Y-%m-%dT%H:%M:%SZ'),
                    'metadata': json.dumps({'funnel_stage': i + 2, 'variant': ab_variant})
                })
                event_id += 1
                funnel_position = i + 2
            else:
                # User dropped off from funnel
                break
        
        # Generate additional random events based on engagement
        remaining_events = num_events - funnel_position
        
        for _ in range(remaining_events):
            # Random event type (excluding signup)
            event_name = random.choice([e for e in EVENT_TYPES if e != 'signup_success'])
            
            # Events spread over time after signup
            days_since_signup = (END_DATE - joined_at).days
            if days_since_signup > 0:
                event_time = joined_at + timedelta(
                    days=random.randint(0, days_since_signup),
                    hours=random.randint(0, 23),
                    minutes=random.randint(0, 59)
                )
                
                if event_time > END_DATE:
                    continue
                
                # Generate appropriate metadata based on event type
                metadata = {'variant': ab_variant}
                
                if event_name == 'upgrade_subscription':
                    metadata['plan'] = random.choice(['Premium', 'Enterprise'])
                elif event_name == 'create_chart':
                    metadata['chart_type'] = random.choice(['bar', 'line', 'pie', 'scatter'])
                elif event_name == 'export_data':
                    metadata['format'] = random.choice(['csv', 'json', 'pdf'])
                
                events.append({
                    'event_id': f"e_{event_id}",
                    'user_id': user_id,
                    'event_name': event_name,
                    'timestamp': event_time.strftime('%Y-%m-%dT%H:%M:%SZ'),
                    'metadata': json.dumps(metadata)
                })
                event_id += 1
    
    # Sort events by timestamp
    events.sort(key=lambda x: x['timestamp'])
    
    # Reassign event IDs to maintain order
    for i, event in enumerate(events, 1):
        event['event_id'] = f"e_{i}"
    
    return events

def save_to_csv(data: List[Dict], filename: str):
    """Save data to CSV file."""
    if not data:
        print(f"No data to save for {filename}")
        return
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = data[0].keys()
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        
        writer.writeheader()
        writer.writerows(data)
    
    print(f"Generated {filename} with {len(data)} records")

def main():
    """Main execution function."""
    print("VizSprints Data Generator")
    print("=" * 50)
    
    # Generate users
    print("\nGenerating user data...")
    users = generate_users()
    save_to_csv(users, 'users.csv')
    
    # Generate events
    print("\nGenerating event data...")
    events = generate_events(users)
    save_to_csv(events, 'events.csv')
    
    # Print statistics
    print("\n" + "=" * 50)
    print("Generation Summary:")
    print(f"   - Total Users: {len(users)}")
    print(f"   - Total Events: {len(events)}")
    print(f"   - Date Range: {START_DATE.date()} to {END_DATE.date()}")
    print(f"   - Avg Events per User: {len(events) / len(users):.1f}")
    
    # A/B variant distribution
    variant_a = sum(1 for u in users if u['ab_variant'] == 'A')
    variant_b = sum(1 for u in users if u['ab_variant'] == 'B')
    print(f"   - A/B Split: A={variant_a} ({variant_a/len(users)*100:.1f}%), B={variant_b} ({variant_b/len(users)*100:.1f}%)")
    
    print("\nData generation complete!")

if __name__ == "__main__":
    main()
