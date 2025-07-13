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
npm run init
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

### Production Mode (Recommended)
```bash
# Build the client first (from client directory)
cd client
npm run build

# Then run the server (from server directory)
cd ../server
npm start
```
This will start the complete application on http://localhost:3000 with the server serving both the API and the built React files.

### Development Mode Options

#### Option 1: Server Only (Serves Built React Files)
```bash
# Build client for production (from client directory)
cd client
npm run build

# Run server in development mode (from server directory)
cd ../server
npm run dev    # Development mode with auto-restart
```
The complete application runs on http://localhost:3000

#### Option 2: Concurrent Development (Hot Reload)
```bash
# From root directory - runs both server and client simultaneously
npm run dev
```
This will start:
- Backend on http://localhost:3000
- Frontend with hot reload on http://localhost:5173

#### Option 3: Frontend Only (Development)
```bash
# From client directory
cd client
npm run dev    # Development mode with hot reload
```
The frontend will run on http://localhost:5173 (requires backend to be running separately for API calls)

## Features

### Currently Implemented
- **Interactive Onboarding Flow**: Multi-step user onboarding with welcome, skills assessment, and career goals
- **Course Validation**: Real-time validation of academic programs for accurate career guidance
- **AI-Powered Job Generation**: Backend integration with Groq API for intelligent job recommendations
- **Job Exploration Interface**: Browse and filter AI-generated job opportunities
- **Detailed Job Views**: Comprehensive job details with match scoring
- **Responsive Design**: Material-UI components optimized for desktop and tablet experiences
- **Modern Tech Stack**: React 19, Vite, Express, and latest dependencies

### In Development
- **Dashboard**: Personalized career hub and progress tracking
- **My Skills**: Skill development tracking and learning path recommendations  
- **Profile Management**: User settings and application history
- **Advanced Job Filtering**: Enhanced search and filtering capabilities
- **Real-time Notifications**: Job alerts and updates

## Project Structure & Scripts

The project uses a root-level package.json with convenient scripts for development:

- **`npm run init`**: Install dependencies for both server and client
- **`npm run dev`**: Run both server and client in development mode simultaneously

Individual service scripts are available in their respective directories:
- **Server** (`cd server`): `npm run dev`, `npm start`
- **Client** (`cd client`): `npm run dev`, `npm run build`, `npm run preview`

This setup uses `concurrently` to run multiple services simultaneously, making development more efficient.

## Technology Stack

- **Frontend**: React 19, Vite 7, Material-UI (MUI) 7
- **Backend**: Node.js, Express 5
- **AI Integration**: Groq SDK for intelligent job matching and career advice
- **Routing**: React Router DOM 7 for seamless navigation
- **Development**: Concurrent development setup with hot reload
- **Styling**: Material-UI theming system with custom design tokens