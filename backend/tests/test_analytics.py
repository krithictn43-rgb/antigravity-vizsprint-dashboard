import unittest
import json
import sys
import os

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app, get_funnel

class TestFunnelCalculator(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Create dummy data for structure test
        import pandas as pd
        cls.dummy_events = pd.DataFrame({
            'user_id': ['u1', 'u1', 'u2'],
            'event_name': ['signup_success', 'view_dashboard', 'signup_success'],
            'timestamp': pd.to_datetime(['2023-01-01', '2023-01-02', '2023-01-03'])
        })
        cls.dummy_users = pd.DataFrame({
            'user_id': ['u1', 'u2'],
            'joined_at': pd.to_datetime(['2023-01-01', '2023-01-03']),
            'subscription_status': ['Free', 'Free']
        })

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_funnel_calculator_returns_zero_if_no_data(self):
        """Test if funnel calculator returns 0s when no data exists (mocked)"""
        import pandas as pd
        from unittest.mock import patch

        with patch('app.events_df', pd.DataFrame(columns=['user_id', 'event_name', 'timestamp'])), \
             patch('app.users_df', pd.DataFrame(columns=['user_id', 'joined_at', 'subscription_status'])):
             
             response = self.app.get('/api/funnel')
             data = json.loads(response.data)
             
             self.assertEqual(response.status_code, 200)
             self.assertEqual(data['total_users'], 0)
             self.assertEqual(len(data['funnel']), 5)
             for stage in data['funnel']:
                 self.assertEqual(stage['users'], 0)

    def test_funnel_structure(self):
        """Test the structure of the funnel response with data"""
        from unittest.mock import patch
        
        with patch('app.events_df', self.dummy_events), \
             patch('app.users_df', self.dummy_users):
            
            response = self.app.get('/api/funnel')
            self.assertEqual(response.status_code, 200)
            data = json.loads(response.data)
            
            self.assertIn('funnel', data)
            self.assertIn('total_users', data)
            self.assertTrue(isinstance(data['funnel'], list))
            self.assertEqual(data['total_users'], 2)

if __name__ == '__main__':
    unittest.main()
