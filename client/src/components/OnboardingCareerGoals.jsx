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
    // Get existing onboarding data from localStorage
    const existingData = JSON.parse(localStorage.getItem('bktk_onboarding_data') || '{}')
    
    // Create career goals data object
    const careerGoalsData = {
      dreamJob,
      workEnvironment,
      selectedGoals
    }
    
    // Update localStorage with career goals data
    const updatedData = {
      ...existingData,
      careerGoals: careerGoalsData
    }
    
    localStorage.setItem('bktk_onboarding_data', JSON.stringify(updatedData))
    
    // Log for debugging
    console.log('Career Goals Data saved:', careerGoalsData)
    console.log('Complete Onboarding Data:', updatedData)
    
    navigate('/onboarding/loading')
  }

  const GoalCard = ({ goal, isSelected, onClick }) => (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        height: '100%',
        width: '100%',
        maxWidth: '280px',
        minHeight: '160px',
        border: isSelected ? 'none' : '2px solid rgba(127, 140, 141, 0.3)',
        backgroundColor: isSelected 
          ? 'linear-gradient(135deg, #2980b9 0%, #3498db 100%)' 
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        boxShadow: isSelected 
          ? '0 8px 32px rgba(41, 128, 185, 0.3), 0 4px 16px rgba(0, 0, 0, 0.1)' 
          : '0 4px 16px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        '&::before': isSelected ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #2980b9 0%, #3498db 100%)',
          zIndex: -1
        } : {},
        '&:hover': {
          border: isSelected ? 'none' : '2px solid #2980b9',
          backgroundColor: isSelected 
            ? 'linear-gradient(135deg, #1f6396 0%, #2980b9 100%)' 
            : 'rgba(236, 240, 241, 0.9)',
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: isSelected 
            ? '0 12px 40px rgba(41, 128, 185, 0.4), 0 6px 20px rgba(0, 0, 0, 0.15)' 
            : '0 8px 24px rgba(41, 128, 185, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)'
        },
        '&:active': {
          transform: 'translateY(-2px) scale(1.01)'
        },
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <CardContent 
        sx={{ 
          p: 4, 
          textAlign: 'center', 
          position: 'relative', 
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          flex: 1
        }}
      >
        <Typography
          variant="h5"
          component="h3"
          sx={{
            color: isSelected ? '#ffffff' : '#2c3e50',
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: '1.1rem', md: '1.2rem' },
            textShadow: isSelected ? '0 2px 4px rgba(0, 0, 0, 0.2)' : 'none'
          }}
        >
          {goal.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: isSelected ? 'rgba(255, 255, 255, 0.9)' : '#7f8c8d',
            fontSize: '0.95rem',
            lineHeight: 1.5,
            opacity: isSelected ? 0.95 : 0.8
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
        background: 'linear-gradient(135deg, #e6f2fa 0%, #f8fcff 50%, #ffffff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(41, 128, 185, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(230, 126, 34, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '1200px', mx: 'auto', position: 'relative', zIndex: 1 }}>
        {/* Progress Indicator */}
        <Box sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#7f8c8d',
                fontWeight: 500,
                fontSize: '0.95rem'
              }}
            >
              Step 3 of 4
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#2980b9',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}
            >
              75% Complete
            </Typography>
          </Box>
          <Box sx={{ 
            backgroundColor: '#ecf0f1', 
            borderRadius: '8px', 
            height: '8px',
            overflow: 'hidden',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <Box
              sx={{
                width: '75%',
                height: '100%',
                background: 'linear-gradient(90deg, #2980b9 0%, #3498db 100%)',
                borderRadius: '8px',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
                  borderRadius: '8px'
                }
              }}
            />
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 8 },
            borderRadius: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(41, 128, 185, 0.15), 0 8px 32px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(236, 240, 241, 0.8)',
            maxWidth: '1000px',
            mx: 'auto',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #2980b9 0%, #3498db 50%, #e67e22 100%)',
              borderRadius: '24px 24px 0 0'
            }
          }}
        >
          {/* Main Header */}
          <Typography
            variant="h1"
            component="h1"
            sx={{
              background: 'linear-gradient(135deg, #2980b9 0%, #3498db 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              textAlign: 'center',
              mb: 8,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              lineHeight: 1.2,
              textShadow: '0 2px 4px rgba(41, 128, 185, 0.1)'
            }}
          >
            Where do you see yourself in the future?
          </Typography>

          {/* Dream Job Section */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                color: '#2c3e50',
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '1.3rem', md: '1.5rem' },
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0,
                  width: '60px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #2980b9 0%, #3498db 100%)',
                  borderRadius: '2px'
                }
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
                  backgroundColor: 'rgba(236, 240, 241, 0.5)',
                  borderRadius: '16px',
                  height: '64px',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                  '& fieldset': {
                    borderColor: 'rgba(127, 140, 141, 0.3)',
                    borderWidth: 2
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(236, 240, 241, 0.8)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(41, 128, 185, 0.1)'
                  },
                  '&:hover fieldset': {
                    borderColor: '#2980b9'
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 32px rgba(41, 128, 185, 0.2)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2980b9',
                    borderWidth: 2
                  }
                }
              }}
            />
          </Box>

          {/* Work Environment Section */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                color: '#2c3e50',
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '1.3rem', md: '1.5rem' },
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0,
                  width: '60px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #27ae60 0%, #2ecc71 100%)',
                  borderRadius: '2px'
                }
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
                  backgroundColor: 'rgba(236, 240, 241, 0.5)',
                  borderRadius: '16px',
                  height: '64px',
                  fontSize: '1.1rem',
                  transition: 'all 0.3s ease',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(127, 140, 141, 0.3)',
                    borderWidth: 2
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(236, 240, 241, 0.8)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(39, 174, 96, 0.1)'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#27ae60'
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 32px rgba(39, 174, 96, 0.2)'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#27ae60',
                    borderWidth: 2
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
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                color: '#2c3e50',
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '1.3rem', md: '1.5rem' },
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0,
                  width: '60px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #e67e22 0%, #f39c12 100%)',
                  borderRadius: '2px'
                }
              }}
            >
              What's most important to you in a career?
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: '#7f8c8d',
                mb: 4,
                fontSize: '1rem',
                fontWeight: 500
              }}
            >
              Select all that apply
            </Typography>
            
            <Grid 
              container 
              spacing={3}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'stretch',
                maxWidth: '900px',
                mx: 'auto'
              }}
            >
              {careerGoals.map((goal) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4}
                  key={goal.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
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
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleFinishSetup}
              sx={{
                background: 'linear-gradient(135deg, #2980b9 0%, #e67e22 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1.2rem',
                px: 12,
                py: 3.5,
                borderRadius: '16px',
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(41, 128, 185, 0.4), 0 4px 16px rgba(0, 0, 0, 0.1)',
                border: 'none',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  transition: 'left 0.5s ease'
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, #1f6396 0%, #d35400 100%)',
                  boxShadow: '0 12px 40px rgba(41, 128, 185, 0.5), 0 6px 20px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-3px) scale(1.02)',
                  '&::before': {
                    left: '100%'
                  }
                },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Finish Profile Setup
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default OnboardingCareerGoals
