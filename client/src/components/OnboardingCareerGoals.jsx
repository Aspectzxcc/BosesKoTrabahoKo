import React, { useState } from 'react'
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

const OnboardingCareerGoals = () => {
  const navigate = useNavigate()
  const [dreamJob, setDreamJob] = useState('')
  const [workEnvironment, setWorkEnvironment] = useState('')
  const [selectedGoals, setSelectedGoals] = useState([])

  // Work environment options
  const workEnvironmentOptions = [
    'Remote',
    'In-office',
    'Hybrid',
    'Flexible'
  ]

  // Career goals with descriptions
  const careerGoals = [
    {
      id: 'high-salary',
      title: 'High Salary',
      description: 'Competitive compensation and financial growth'
    },
    {
      id: 'work-life-balance',
      title: 'Work-Life Balance',
      description: 'Flexible schedule and personal time'
    },
    {
      id: 'career-growth',
      title: 'Career Growth',
      description: 'Advancement opportunities and skill development'
    },
    {
      id: 'job-security',
      title: 'Job Security',
      description: 'Stable employment and benefits'
    },
    {
      id: 'meaningful-work',
      title: 'Meaningful Work',
      description: 'Purpose-driven and impactful projects'
    },
    {
      id: 'creative-freedom',
      title: 'Creative Freedom',
      description: 'Autonomy and innovative thinking'
    },
    {
      id: 'team-collaboration',
      title: 'Team Collaboration',
      description: 'Working with diverse, talented people'
    },
    {
      id: 'learning-opportunities',
      title: 'Learning Opportunities',
      description: 'Continuous education and skill building'
    }
  ]

  const handleGoalToggle = (goalId) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    )
  }

  const handleFinishSetup = () => {
    // Here you would typically save all the onboarding data
    console.log('Dream Job:', dreamJob)
    console.log('Work Environment:', workEnvironment)
    console.log('Selected Goals:', selectedGoals)
    
    navigate('/onboarding/loading')
  }

  const GoalCard = ({ goal, isSelected, onClick }) => (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        height: '100%',
        border: isSelected ? '2px solid #2980b9' : '2px solid #ecf0f1',
        backgroundColor: isSelected ? 'rgba(41, 128, 185, 0.05)' : 'white',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          border: '2px solid #2980b9',
          backgroundColor: isSelected ? 'rgba(41, 128, 185, 0.1)' : 'rgba(41, 128, 185, 0.02)',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(41, 128, 185, 0.15)'
        }
      }}
    >
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            color: isSelected ? '#2980b9' : '#2c3e50',
            fontWeight: 600,
            mb: 1,
            fontSize: '1rem'
          }}
        >
          {goal.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: isSelected ? '#2980b9' : '#7f8c8d',
            fontSize: '0.875rem',
            lineHeight: 1.4
          }}
        >
          {goal.description}
        </Typography>
      </CardContent>
    </Card>
  )

  return (
    <Box
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: '#e6f2fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: '16px',
            backgroundColor: 'white',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* Main Header */}
          <Typography
            variant="h4"
            component="h1"
            sx={{
              color: '#2c3e50',
              fontWeight: 600,
              textAlign: 'center',
              mb: 5,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
            }}
          >
            Where do you see yourself in the future?
          </Typography>

          {/* Dream Job Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                color: '#2c3e50',
                fontWeight: 600,
                mb: 2,
                fontSize: '1.125rem'
              }}
            >
              If you could have any job in the world, what would it be?
            </Typography>
            
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Software Engineer at Google, Marketing Manager, Creative Director..."
              value={dreamJob}
              onChange={(e) => setDreamJob(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ecf0f1',
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: '#bdc3c7'
                  },
                  '&:hover fieldset': {
                    borderColor: '#2980b9'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2980b9'
                  }
                }
              }}
            />
          </Box>

          {/* Work Environment Section */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                color: '#2c3e50',
                fontWeight: 600,
                mb: 2,
                fontSize: '1.125rem'
              }}
            >
              Preferred Work Environment
            </Typography>
            
            <FormControl fullWidth>
              <Select
                value={workEnvironment}
                onChange={(e) => setWorkEnvironment(e.target.value)}
                displayEmpty
                sx={{
                  backgroundColor: '#ecf0f1',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#bdc3c7'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2980b9'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2980b9'
                  }
                }}
              >
                <MenuItem value="" disabled>
                  <Typography sx={{ color: '#7f8c8d' }}>
                    Select your preferred work setup
                  </Typography>
                </MenuItem>
                {workEnvironmentOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Career Goals Section */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                color: '#2c3e50',
                fontWeight: 600,
                mb: 1,
                fontSize: '1.125rem'
              }}
            >
              What's most important to you in a career?
            </Typography>
            
            <Typography
              variant="body2"
              sx={{
                color: '#7f8c8d',
                mb: 3,
                fontSize: '0.875rem'
              }}
            >
              Select all that apply
            </Typography>
            
            <Grid container spacing={2}>
              {careerGoals.map((goal) => (
                <Grid item xs={12} sm={6} key={goal.id}>
                  <GoalCard
                    goal={goal}
                    isSelected={selectedGoals.includes(goal.id)}
                    onClick={() => handleGoalToggle(goal.id)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Finish Setup Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleFinishSetup}
              sx={{
                background: 'linear-gradient(135deg, #2980b9 0%, #e67e22 100%)',
                color: 'white',
                px: 6,
                py: 2,
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 6px 20px rgba(41, 128, 185, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1e6091 0%, #d35400 100%)',
                  boxShadow: '0 8px 25px rgba(41, 128, 185, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease-in-out'
              }}
            >
              Finish Setup & Go to Dashboard
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default OnboardingCareerGoals
