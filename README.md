# VizSprints - Product Analytics Dashboard

A full-stack product analytics dashboard built with React (Vite) and Flask.

## Features
- **Executive Summary**: High-level metrics (Active Users, Revenue, etc.)
- **Funnel Analysis**: Conversion tracking through user journey stages.
- **Retention Cohorts**: Heatmap visualization of user retention.
- **A/B Test Results**: Statistical significance testing and visualization.
- **User Sessions**: Detailed session duration and activity tracking.
- **Report Export**: Download dashboard as PDF.

## Project Structure
```
VizSprints/
├── backend/            # Flask API and data processing
│   ├── app.py          # Main application file
│   ├── init_db.py      # Database initialization script
│   └── tests/          # Backend unit tests
├── frontend/           # React application
│   ├── src/            # Source code
│   └── public/         # Static assets
└── users.csv, events.csv # Synthetic data files
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Python (3.8+)

### 1. Data Generation
Generate the synthetic data and initialize the database:
```bash
# Install backend dependencies (if not using venv yet, create one recommended)
cd backend
pip install flask flask-cors pandas numpy scipy fpdf

# Go back to root to run data generation (if using raw script)
cd ..
# If you don't have the data generation script, you can use the provided CSVs or request it.
# To initialize the SQLite database from CSVs:
cd backend
python init_db.py
```

### 2. Backend Setup
Start the Flask API server:
```bash
cd backend
python app.py
```
Server will run at `http://localhost:5000`.

### 3. Frontend Setup
Install dependencies and start the React app:
```bash
cd frontend
npm install
npm run dev
```
App will open at `http://localhost:5173`.

## Testing

### Backend Tests
Run the Python unit tests (checks funnel logic, etc.):
```bash
cd backend
python -m unittest discover tests
```

### Frontend Tests
Run the component and utility tests using Vitest:
```bash
cd frontend
npm run test
```

## Accessibility
The application uses high-contrast colors (Blue 600) to ensure readability and compliance with WCAG AA standards.
