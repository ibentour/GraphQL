# GraphQL Skills Visualization Dashboard

A beautiful, interactive dashboard for visualizing programming skills and learning progress using GraphQL data from the Zone01 Oujda platform.

![Dashboard Preview](https://via.placeholder.com/800x450.png?text=Zone01+Skills+Dashboard)

## Overview

This application provides a visual representation of a student's learning journey at Zone01 Oujda, displaying skill acquisitions, module progress, XP accumulation, and audit statistics through elegant interactive graphs and data visualizations.

## Features

### 🔐 Secure Authentication
- JWT-based authentication with the Zone01 Oujda API
- Secure token storage in localStorage
- Automatic login detection for returning users

### 📊 Data Visualization

#### Skills Radar Chart
- Polygonal representation of skill levels across different domains
- Interactive tooltips showing exact percentage values
- Adaptive layout that splits when there are many skills (>10)
- Color-coded visualization with configurable styling

#### Module Progress Graph
- Time-based visualization of XP accumulation throughout modules
- Gradient-filled area chart showing progression
- Monthly time markers on the x-axis
- Interactive project data points with tooltips
- Total XP counter displayed above the graph

#### Audit Statistics
- Clear representation of audit ratio
- Success and failure rate percentages
- Total audit count
- Color-coded success/failure indicators

### ⚙️ Technical Features
- Responsive design that works across different screen sizes
- SVG-based visualizations for crisp rendering at any resolution
- Elegant loading state and no-data placeholders
- Modular JavaScript architecture with separation of concerns

## Technologies Used

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Data Visualization**: Custom SVG-based charts
- **API**: GraphQL for efficient data fetching
- **Authentication**: JWT token-based auth with Basic Auth initial handshake

## Project Structure

```
graphql/
├── index.html       # Main HTML structure
├── style.css        # Styling and layout definitions
├── main.js          # Core application logic and visualization rendering
├── graph.js         # GraphQL data fetching and data processing
└── README.md        # Project documentation
```

## Code Architecture

### graph.js
Contains the GraphQL queries and data fetching logic. The file defines two main classes:
- `Profile`: Handles user profile data such as name, audit statistics, and level
- `Data`: Manages all project data, transactions, and skills information

### main.js
Core application logic including:
- Authentication and user session management
- SVG generation for skill radar charts and module progress graphs
- DOM manipulation and event handlers
- Data formatting and display logic

### Visualization Logic

#### Skill Radar Chart
The `renderGraph()` function creates a radar/spider chart with the following properties:
- Each skill forms a point on the polygon
- The distance from the center represents the skill level percentage
- Concentric polygons provide reference levels (20%, 40%, 60%, 80%, 100%)
- Interactive tooltips show exact skill levels

#### Module Progress Graph
The `module()` function generates a temporal visualization:
- X-axis represents time (with monthly markers)
- Y-axis represents cumulative XP
- A gradient-filled area shows progression over time
- Interactive points represent individual project completions
- Tooltips display project names, XP values, and dates

## Authentication Flow

1. User enters credentials in the login form
2. Credentials are encoded and sent to the Zone01 Oujda auth endpoint
3. Upon successful authentication, a JWT token is returned and stored
4. The token is used for subsequent GraphQL API requests
5. Automatic re-login if a valid token exists in localStorage
6. Logout functionality clears the token and resets the UI

## Data Flow

1. The application initializes and checks for an existing authentication token
2. If authenticated, it fetches user profile and learning data through GraphQL
3. Data is processed and transformed into visualization-ready structures
4. SVG-based visualizations are generated and inserted into the DOM
5. Event listeners handle user interactions and state changes

## Usage

1. Clone the repository
2. Open `index.html` in a web browser
3. Log in with your Zone01 Oujda credentials
4. Explore your skills visualization and learning progress
5. Interact with the graphs to see detailed information
6. Logout to clear the session

## Deployment

This application can be deployed to GitHub Pages for easy access. Follow the instructions in [GITHUB_PAGES_DEPLOYMENT.md](GITHUB_PAGES_DEPLOYMENT.md) for a step-by-step deployment guide.

### Quick Deployment Steps

1. Create a GitHub repository
2. Push your code to the repository
3. Enable GitHub Pages in the repository settings
4. Access your deployed application at `https://your-username.github.io/repository-name`