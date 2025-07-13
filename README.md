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

### Backend (Node.js + Express)
```bash
cd server
npm run dev    # Development mode (auto-restart)
# or
npm start      # Production mode
```
The backend will run on http://localhost:3000 (or your configured port)

### Frontend (React + Vite)
```bash
cd client
npm run dev    # Development mode
```
The frontend will run on http://localhost:5173

## Features

- **AI-Powered Job Matching**: Personalized job recommendations based on user profile and skills
- **Interactive Onboarding**: Comprehensive skill assessment and career goal setting
- **Smart Career Guidance**: AI-driven advice for career development and skill improvement
- **Responsive Design**: Optimized for desktop and tablet experiences
- **Real-time Job Filtering**: Advanced search and filtering capabilities

## Technology Stack

- **Frontend**: React, Vite, Material-UI (MUI)
- **Backend**: Node.js, Express
- **AI Integration**: Groq API for intelligent job matching and career advice
- **Routing**: React Router for seamless navigation