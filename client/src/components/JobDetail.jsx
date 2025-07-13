import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Grid,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import {
  ArrowBack,
  SmartToy,
  Work,
  School,
  TrendingUp,
  CheckCircle,
  Psychology,
  Close
} from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'

const JobDetail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showAIDialog, setShowAIDialog] = useState(false)

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Get job data from navigation state
  const job = location.state?.job
  const userProfile = location.state?.userProfile
  const fromExploreJobs = location.state?.fromExploreJobs

  // Redirect if no job data
  if (!job) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        minWidth: '100vw',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#e6f2fa'
      }}>
        <Card sx={{ p: 4, textAlign: 'center', borderRadius: '12px' }}>
          <Typography variant="h6" sx={{ color: '#2c3e50', mb: 2 }}>
            Position details not found
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/jobs')}
            sx={{
              backgroundColor: '#2980b9',
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            Back to Positions
          </Button>
        </Card>
      </Box>
    )
  }

  const getMatchScoreColor = (score) => {
    if (score >= 90) return '#27ae60' // Green
    if (score >= 80) return '#f39c12' // Orange
    if (score >= 70) return '#e67e22' // Dark Orange
    return '#e74c3c' // Red
  }

  const AIAdviceDialog = () => (
    <Dialog 
      open={showAIDialog} 
      onClose={() => setShowAIDialog(false)}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #2980b9 0%, #3498db 100%)', 
        color: 'white',
        fontWeight: 700,
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 3,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%'
          }}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <SmartToy sx={{ color: 'white', fontSize: '1.5rem' }} />
          </Box>
          AI Career Advice for this Position
        </Box>
        <IconButton 
          onClick={() => setShowAIDialog(false)}
          sx={{ 
            color: 'white',
            position: 'relative',
            zIndex: 1,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        {/* Header section */}
        <Box sx={{ p: 3, backgroundColor: '#f8fbff', borderBottom: '1px solid rgba(127, 140, 141, 0.1)' }}>
          <Typography variant="h6" sx={{ color: '#2c3e50', mb: 1, fontWeight: 700 }}>
            Why This Position Matches You ({job.matchScore}% Match)
          </Typography>
          
          <Box
            sx={{
              backgroundColor: 'rgba(41, 128, 185, 0.1)',
              borderRadius: '12px',
              p: 2.5,
              border: '1px solid rgba(41, 128, 185, 0.2)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Psychology sx={{ color: '#2980b9', fontSize: '1.2rem' }} />
              <Typography variant="body2" sx={{ color: '#2980b9', fontWeight: 600 }}>
                AI Profile Analysis
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#2c3e50', lineHeight: 1.6 }}>
              Based on your profile analysis, here's why this position type is recommended for you:
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Skills Alignment */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%)',
                borderRadius: '16px',
                p: 3,
                border: '1px solid rgba(39, 174, 96, 0.2)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    backgroundColor: '#27ae60',
                    borderRadius: '8px'
                  }}
                >
                  <CheckCircle sx={{ color: 'white', fontSize: '1.1rem' }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2c3e50', fontSize: '1rem' }}>
                  🎯 Skills Alignment
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#2c3e50', lineHeight: 1.7, fontWeight: 500 }}>
                {job.skills && Array.isArray(job.skills) && job.skills.length > 0 
                  ? `This position type typically requires skills like ${job.skills.slice(0, 3).join(', ')}, which align well with your background.`
                  : 'This position type offers great opportunities to apply and develop your existing skills.'
                }
              </Typography>
            </Box>
          </Box>

          {/* Career Growth Potential */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
                borderRadius: '16px',
                p: 3,
                border: '1px solid rgba(243, 156, 18, 0.3)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    backgroundColor: '#f39c12',
                    borderRadius: '8px'
                  }}
                >
                  <TrendingUp sx={{ color: 'white', fontSize: '1.1rem' }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2c3e50', fontSize: '1rem' }}>
                  📈 Career Growth Potential
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#2c3e50', lineHeight: 1.7, fontWeight: 500 }}>
                {job.careerGrowth || 'This role type offers excellent opportunities for professional development and career advancement in your field of interest.'}
              </Typography>
            </Box>
          </Box>

          {/* Career Preparation Tips */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                borderRadius: '16px',
                p: 3,
                border: '1px solid rgba(156, 39, 176, 0.3)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    backgroundColor: '#9c27b0',
                    borderRadius: '8px'
                  }}
                >
                  <School sx={{ color: 'white', fontSize: '1.1rem' }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2c3e50', fontSize: '1rem' }}>
                  💡 Career Preparation Tips
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  "Develop the key skills required for this position type",
                  "Build a portfolio showcasing relevant projects", 
                  "Network with professionals in this field"
                ].map((tip, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 20,
                        height: 20,
                        backgroundColor: '#27ae60',
                        borderRadius: '50%'
                      }}
                    >
                      <CheckCircle sx={{ color: 'white', fontSize: '0.8rem' }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#2c3e50', fontWeight: 500, lineHeight: 1.6 }}>
                      {tip}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Work Environment Fit */}
          {job.workEnvironmentFit && (
            <Box
              sx={{
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                borderRadius: '16px',
                p: 3,
                border: '1px solid rgba(41, 128, 185, 0.3)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    backgroundColor: '#2980b9',
                    borderRadius: '8px'
                  }}
                >
                  <Work sx={{ color: 'white', fontSize: '1.1rem' }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2c3e50', fontSize: '1rem' }}>
                  🏢 Work Environment Fit
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#2c3e50', lineHeight: 1.7, fontWeight: 500 }}>
                {job.workEnvironmentFit}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, backgroundColor: '#f8fbff', borderTop: '1px solid rgba(127, 140, 141, 0.1)' }}>
        <Button 
          onClick={() => setShowAIDialog(false)}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #2980b9 0%, #3498db 100%)',
            color: 'white',
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            boxShadow: '0 4px 16px rgba(41, 128, 185, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #21618c 0%, #2980b9 100%)',
              boxShadow: '0 6px 20px rgba(41, 128, 185, 0.4)'
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )

  return (
    <Box
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: '#e6f2fa',
        py: 4
      }}
    >
      <Container 
        maxWidth="lg"
        sx={{
          mx: 'auto'
        }}
      >
        {/* Back Navigation */}
        <Box sx={{ width: '100%', mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => fromExploreJobs ? navigate('/jobs') : navigate(-1)}
            sx={{
              color: '#7f8c8d',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(127, 140, 141, 0.05)'
              }
            }}
          >
            Back to Position Listings
          </Button>
          
          <Button
            variant="text"
            onClick={() => {
              // Clear all stored data
              localStorage.removeItem('bktk_job_data')
              localStorage.removeItem('bktk_converted_jobs')
              // Navigate back to onboarding
              navigate('/')
            }}
            sx={{
              color: '#7f8c8d',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(127, 140, 141, 0.05)'
              }
            }}
          >
            Reset Profile & Start Over
          </Button>
        </Box>

        <Grid 
          container 
          spacing={4}
          sx={{
            maxWidth: '1200px',
            width: '100%',
            mx: 'auto',
            justifyContent: 'center'
          }}
        >
          {/* Left Column - Position Summary & Actions */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Card
              sx={{
                borderRadius: '20px',
                backgroundColor: 'white',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                border: '1px solid rgba(41, 128, 185, 0.08)',
                position: 'sticky',
                top: 24,
                width: '100%',
                maxWidth: '350px',
                overflow: 'hidden'
              }}
            >
              {/* Header section with gradient */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                  p: 3,
                  pb: 2,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Background decoration */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '50%'
                  }}
                />
                
                {/* Position Header */}
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    mb: 1,
                    lineHeight: 1.3,
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  {job.title}
                </Typography>

                {/* Position type badge */}
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '20px',
                    px: 2,
                    py: 0.5,
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  >
                    Entry-Level Position
                  </Typography>
                </Box>
              </Box>

              <CardContent sx={{ p: 3 }}>
                {/* Match Score with enhanced design */}
                <Box
                  sx={{
                    position: 'relative',
                    mb: 3
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${getMatchScoreColor(job.matchScore)} 0%, ${getMatchScoreColor(job.matchScore)}dd 100%)`,
                      color: 'white',
                      borderRadius: '16px',
                      py: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: `0 4px 20px ${getMatchScoreColor(job.matchScore)}40`
                    }}
                  >
                    {/* Background pattern */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        width: 60,
                        height: 60,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%'
                      }}
                    />
                    
                    <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 800,
                          fontSize: '2.5rem',
                          mb: 0.5
                        }}
                      >
                        {job.matchScore}%
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '1rem',
                          opacity: 0.95
                        }}
                      >
                        Career Match
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Enhanced Quick Info */}
                <Box sx={{ mb: 3 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1.5, 
                      mb: 2,
                      p: 2,
                      backgroundColor: '#f8fbff',
                      borderRadius: '12px',
                      border: '1px solid rgba(41, 128, 185, 0.1)'
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        backgroundColor: '#e6f2fa',
                        borderRadius: '8px',
                        border: '1px solid rgba(41, 128, 185, 0.2)'
                      }}
                    >
                      <School sx={{ fontSize: '1.1rem', color: '#2980b9' }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#2c3e50', fontWeight: 500 }}>
                      {job.experienceLevel}
                    </Typography>
                  </Box>
                  
                  {job.industrySection && (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1.5,
                        p: 2,
                        backgroundColor: '#f8fbff',
                        borderRadius: '12px',
                        border: '1px solid rgba(41, 128, 185, 0.1)'
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 32,
                          height: 32,
                          backgroundColor: '#e6f2fa',
                          borderRadius: '8px',
                          border: '1px solid rgba(41, 128, 185, 0.2)'
                        }}
                      >
                        <Work sx={{ fontSize: '1.1rem', color: '#2980b9' }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#2c3e50', fontWeight: 500 }}>
                        {job.industrySection}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Enhanced Action Button */}
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<SmartToy />}
                  onClick={() => setShowAIDialog(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    py: 1.5,
                    boxShadow: '0 4px 16px rgba(39, 174, 96, 0.3)',
                    border: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #229954 0%, #27ae60 100%)',
                      boxShadow: '0 6px 20px rgba(39, 174, 96, 0.4)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Ask AI about this Position
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Detailed Content */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Overview Section */}
              <Card
                sx={{
                  borderRadius: '16px',
                  backgroundColor: 'white',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(127, 140, 141, 0.1)',
                  overflow: 'hidden'
                }}
              >
                {/* Header with subtle gradient background */}
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #f8fbff 0%, #e6f2fa 100%)',
                    p: 3,
                    pb: 2,
                    borderBottom: '1px solid rgba(127, 140, 141, 0.08)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 36,
                        height: 36,
                        backgroundColor: 'rgba(41, 128, 185, 0.1)',
                        borderRadius: '10px',
                        border: '1px solid rgba(41, 128, 185, 0.2)'
                      }}
                    >
                      <Work sx={{ color: '#2980b9', fontSize: '1.3rem' }} />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#2c3e50',
                        fontWeight: 600,
                        fontSize: '1.1rem'
                      }}
                    >
                      Position Overview
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ p: 3 }}>
                  {/* Main description with better styling */}
                  <Box
                    sx={{
                      backgroundColor: '#fafbfc',
                      borderRadius: '12px',
                      p: 3,
                      mb: 3,
                      border: '1px solid rgba(127, 140, 141, 0.08)'
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#2c3e50',
                        lineHeight: 1.7,
                        fontSize: '1rem',
                        fontWeight: 500,
                        letterSpacing: '0.02em'
                      }}
                    >
                      {job.detailedDescription || job.description}
                    </Typography>
                  </Box>

                  {job.careerAlignment && (
                    <Box
                      sx={{
                        backgroundColor: '#e8f5e8',
                        border: '1px solid #c8e6c9',
                        borderRadius: '12px',
                        p: 3,
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Background decoration */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          width: 60,
                          height: 60,
                          backgroundColor: 'rgba(39, 174, 96, 0.1)',
                          borderRadius: '50%',
                          zIndex: 0
                        }}
                      />
                      
                      <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 32,
                              height: 32,
                              backgroundColor: '#27ae60',
                              borderRadius: '8px'
                            }}
                          >
                            <Psychology sx={{ color: 'white', fontSize: '1.2rem' }} />
                          </Box>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: '#2c3e50',
                              fontWeight: 600,
                              fontSize: '1rem'
                            }}
                          >
                            Career Priorities Alignment
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {/* Main alignment text */}
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#2c3e50',
                              lineHeight: 1.7,
                              fontSize: '0.95rem',
                              fontWeight: 500,
                              mb: 1
                            }}
                          >
                            {job.careerAlignment}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Key Responsibilities */}
              {job.keyResponsibilities && Array.isArray(job.keyResponsibilities) && job.keyResponsibilities.length > 0 && (
                <Card
                  sx={{
                    borderRadius: '16px',
                    backgroundColor: 'white',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(41, 128, 185, 0.1)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Header with gradient background */}
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #2980b9 0%, #3498db 100%)',
                      p: 3,
                      pb: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 36,
                          height: 36,
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '10px',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <Work sx={{ color: 'white', fontSize: '1.3rem' }} />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '1.1rem'
                        }}
                      >
                        Typical Responsibilities
                      </Typography>
                    </Box>
                  </Box>

                  {/* Content area */}
                  <CardContent sx={{ p: 0 }}>
                    <List sx={{ p: 0 }}>
                      {job.keyResponsibilities.map((responsibility, index) => (
                        <ListItem 
                          key={index} 
                          sx={{ 
                            px: 3,
                            py: 2,
                            borderBottom: index < job.keyResponsibilities.length - 1 ? '1px solid #f8f9fa' : 'none',
                            '&:hover': {
                              backgroundColor: '#f8f9fa',
                              transform: 'translateX(4px)',
                              transition: 'all 0.2s ease-in-out'
                            },
                            transition: 'all 0.2s ease-in-out'
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: '40px' }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 24,
                                height: 24,
                                backgroundColor: '#e8f5e8',
                                borderRadius: '50%',
                                border: '2px solid #27ae60'
                              }}
                            >
                              <CheckCircle 
                                sx={{ 
                                  color: '#27ae60', 
                                  fontSize: '1rem'
                                }} 
                              />
                            </Box>
                          </ListItemIcon>
                          <ListItemText 
                            primary={responsibility}
                            sx={{ 
                              '& .MuiListItemText-primary': { 
                                color: '#2c3e50',
                                lineHeight: 1.6,
                                fontSize: '0.95rem',
                                fontWeight: 500
                              } 
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              )}

              {/* What We're Looking For */}
              <Card
                sx={{
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#2c3e50',
                      fontWeight: 600,
                      mb: 2
                    }}
                  >
                    What This Position Typically Requires
                  </Typography>
                  
                  {/* Qualifications */}
                  {job.requiredQualifications && Array.isArray(job.requiredQualifications) && job.requiredQualifications.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: '#2c3e50',
                          fontWeight: 600,
                          mb: 1
                        }}
                      >
                        Typical Qualifications
                      </Typography>
                      <List dense>
                        {job.requiredQualifications.map((qualification, index) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemIcon>
                              <School sx={{ color: '#2980b9', fontSize: '1.2rem' }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={qualification}
                              sx={{ 
                                '& .MuiListItemText-primary': { 
                                  color: '#7f8c8d',
                                  fontSize: '0.875rem'
                                } 
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {/* Required Skills */}
                  {job.skills && Array.isArray(job.skills) && job.skills.length > 0 && (
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: '#2c3e50',
                          fontWeight: 600,
                          mb: 2
                        }}
                      >
                        Commonly Required Skills
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {job.skills.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            sx={{
                              backgroundColor: '#27ae60',
                              color: 'white',
                              fontWeight: 500
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Skill Development & Growth */}
              {job.skillDevelopment && Array.isArray(job.skillDevelopment) && job.skillDevelopment.length > 0 && (
                <Card
                  sx={{
                    borderRadius: '16px',
                    backgroundColor: 'white',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(39, 174, 96, 0.15)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Header with gradient background */}
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                      p: 3,
                      pb: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 36,
                          height: 36,
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '10px',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <TrendingUp sx={{ color: 'white', fontSize: '1.3rem' }} />
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '1.1rem'
                        }}
                      >
                        Growth & Development Opportunities
                      </Typography>
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    {/* Skills Development Section */}
                    <Box sx={{ mb: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 28,
                            height: 28,
                            backgroundColor: '#e8f5e8',
                            borderRadius: '8px',
                            border: '1px solid #27ae60'
                          }}
                        >
                          <School sx={{ color: '#27ae60', fontSize: '1rem' }} />
                        </Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: '#2c3e50',
                            fontWeight: 600,
                            fontSize: '1rem'
                          }}
                        >
                          Skills You'll Develop
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                        {job.skillDevelopment.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            icon={<TrendingUp sx={{ fontSize: '1rem' }} />}
                            sx={{
                              backgroundColor: '#e8f5e8',
                              color: '#27ae60',
                              fontWeight: 600,
                              fontSize: '0.875rem',
                              border: '1px solid rgba(39, 174, 96, 0.2)',
                              borderRadius: '20px',
                              px: 1,
                              '&:hover': {
                                backgroundColor: '#d4edda',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 2px 8px rgba(39, 174, 96, 0.2)'
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* Career Growth Path Section */}
                    {job.careerGrowth && (
                      <Box
                        sx={{
                          background: 'linear-gradient(135deg, #f8fbff 0%, #e6f2fa 100%)',
                          borderRadius: '12px',
                          p: 3,
                          border: '1px solid rgba(41, 128, 185, 0.1)'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 28,
                              height: 28,
                              backgroundColor: '#e6f2fa',
                              borderRadius: '8px',
                              border: '1px solid #2980b9'
                            }}
                          >
                            <Work sx={{ color: '#2980b9', fontSize: '1rem' }} />
                          </Box>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: '#2c3e50',
                              fontWeight: 600,
                              fontSize: '1rem'
                            }}
                          >
                            Career Growth Path
                          </Typography>
                        </Box>
                        
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#2c3e50',
                            lineHeight: 1.7,
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            fontStyle: 'italic'
                          }}
                        >
                          {job.careerGrowth}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* AI Advice Dialog */}
      <AIAdviceDialog />
    </Box>
  )
}

export default JobDetail
