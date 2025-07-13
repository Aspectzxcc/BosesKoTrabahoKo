import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import customTheme from './theme/theme'
import OnboardingWelcome from './components/OnboardingWelcome'
import OnboardingSkills from './components/OnboardingSkills'
import OnboardingCareerGoals from './components/OnboardingCareerGoals'
import AILoadingScreen from './components/AILoadingScreen'
import ExploreJobs from './components/ExploreJobs'
import JobDetail from './components/JobDetail'

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Default route redirects to onboarding welcome */}
          <Route path="/" element={<Navigate to="/onboarding/welcome" replace />} />
          
          {/* Onboarding Routes */}
          <Route path="/onboarding/welcome" element={<OnboardingWelcome />} />
          <Route path="/onboarding/skills" element={<OnboardingSkills />} />
          <Route path="/onboarding/career-goals" element={<OnboardingCareerGoals />} />
          <Route path="/onboarding/loading" element={<AILoadingScreen />} />
          
          {/* Main App Routes (placeholder for now) */}
          <Route path="/dashboard" element={<div>Dashboard Coming Soon</div>} />
          <Route path="/jobs" element={<ExploreJobs />} />
          <Route path="/job-detail" element={<JobDetail />} />
          <Route path="/skills" element={<div>My Skills Coming Soon</div>} />
          <Route path="/profile" element={<div>Profile Coming Soon</div>} />
          
          {/* Catch all route - redirect to welcome */}
          <Route path="*" element={<Navigate to="/onboarding/welcome" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
