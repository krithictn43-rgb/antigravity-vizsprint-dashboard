import sqlite3
import pandas as pd
import os

def init_db():
    print("Initializing Database...")
    
    # Paths
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    USERS_FILE = os.path.join(BASE_DIR, 'users.csv')
    EVENTS_FILE = os.path.join(BASE_DIR, 'events.csv')
    DB_FILE = os.path.join(BASE_DIR, 'backend', 'database', 'vizsprints.db')
    
    # Connect to SQLite (creates file if not exists)
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    try:
        # Load Users
        if os.path.exists(USERS_FILE):
            print(f"Loading {USERS_FILE}...")
            users_df = pd.read_csv(USERS_FILE)
            users_df.to_sql('users', conn, if_exists='replace', index=False)
            print(f" - Inserted {len(users_df)} users")
            
            # Create index on user_id
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id)")
        else:
            print(f"Warning: {USERS_FILE} not found!")

        # Load Events
        if os.path.exists(EVENTS_FILE):
            print(f"Loading {EVENTS_FILE}...")
            events_df = pd.read_csv(EVENTS_FILE)
            events_df.to_sql('events', conn, if_exists='replace', index=False)
            print(f" - Inserted {len(events_df)} events")
            
            # Create indices for performance
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_events_event_name ON events(event_name)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp)")
        else:
            print(f"Warning: {EVENTS_FILE} not found!")
            
        print("Database initialization complete!")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    init_db()
