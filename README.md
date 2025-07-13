# BosesKoTrabahoKo

**"My Voice, My Job"** - An AI-powered web application that intelligently guides undergraduates and fresh graduates towards suitable job opportunities or structured learning paths to bridge skill gaps for their desired careers.

## Prerequisites
- Node.js (v16 or higher)
- npm

## Setup

### Clone the repository
```bash
git clone https://github.com/Aspectzxcc/BosesKoTrabahoKo.git
cd BosesKoTrabahoKo
```

### Install dependencies

#### Option 1: Quick Setup (Recommended)
```bash
# Install dependencies for both server and client from root directory
npm run install-all
```

#### Option 2: Manual Setup
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment setup

```bash
# Create environment file in server directory
cd ../server
cp .env.example .env
# Edit .env with your configuration
```

**Note:** Use `GROQ_API_KEY` as the key. Get yours at [https://console.groq.com/home](https://console.groq.com/home)

## Running the Application

### Option 1: Development Mode (Both Server & Client) - Recommended
```bash
# From root directory - runs both server and client simultaneously
npm run dev
```
This will start:
- Backend on http://localhost:3000
- Frontend on http://localhost:5173

### Option 2: Individual Services

#### Backend (Node.js + Express)
```bash
# From root directory
npm run server
# or from server directory
cd server
npm run dev    # Development mode (auto-restart)
# or
npm start      # Production mode
```
The backend will run on http://localhost:3000 (or your configured port)

#### Frontend (React + Vite)
```bash
# From root directory
npm run client
# or from client directory
cd client
npm run dev    # Development mode
```
The frontend will run on http://localhost:5173

### Additional Scripts
```bash
# Build client for production
npm run build

# Start production server only
npm run start
```

## Features

- **AI-Powered Job Matching**: Personalized job recommendations based on user profile and skills
- **Course Validation**: Real-time validation of academic programs for accurate career guidance
- **Interactive Onboarding**: Comprehensive skill assessment and career goal setting
- **Smart Career Guidance**: AI-driven advice for career development and skill improvement
- **Responsive Design**: Optimized for desktop and tablet experiences
- **Real-time Job Filtering**: Advanced search and filtering capabilities
- **Easy Development Setup**: Concurrent server and client development with single commands

## Project Structure & Scripts

The project uses a root-level package.json with convenient scripts for development:

- **`npm run install-all`**: Install dependencies for both server and client
- **`npm run dev`**: Run both server and client in development mode simultaneously
- **`npm run server`**: Run only the backend development server
- **`npm run client`**: Run only the frontend development server
- **`npm run start`**: Start the production server
- **`npm run build`**: Build the client for production

This setup uses `concurrently` to run multiple services simultaneously, making development more efficient.

## Technology Stack

- **Frontend**: React, Vite, Material-UI (MUI)
- **Backend**: Node.js, Express
- **AI Integration**: Groq API for intelligent job matching and career advice
- **Routing**: React Router for seamless navigation