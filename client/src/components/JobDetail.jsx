import React, { useState } from 'react'
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
  Bookmark,
  BookmarkBorder,
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
  const [isSaved, setIsSaved] = useState(false)
  const [showAIDialog, setShowAIDialog] = useState(false)

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

  const handleSavePosition = () => {
    setIsSaved(!isSaved)
  }

  const AIAdviceDialog = () => (
    <Dialog 
      open={showAIDialog} 
      onClose={() => setShowAIDialog(false)}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '12px'
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#e6f2fa', 
        color: '#2c3e50',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToy sx={{ color: '#2980b9' }} />
          AI Career Advice for this Position
        </Box>
        <IconButton onClick={() => setShowAIDialog(false)}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: '#2c3e50', mb: 2 }}>
          Why This Position Matches You ({job.matchScore}% Match)
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3, borderRadius: '8px' }}>
          Based on your profile analysis, here's why this position type is recommended for you:
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2c3e50', mb: 1 }}>
            🎯 Skills Alignment
          </Typography>
          <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 2 }}>
            {job.skills && job.skills.length > 0 
              ? `This position type typically requires skills like ${job.skills.slice(0, 3).join(', ')}, which align well with your background.`
              : 'This position type offers great opportunities to apply and develop your existing skills.'
            }
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2c3e50', mb: 1 }}>
            📈 Career Growth Potential
          </Typography>
          <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 2 }}>
            {job.careerGrowth || 'This role type offers excellent opportunities for professional development and career advancement in your field of interest.'}
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2c3e50', mb: 1 }}>
            💡 Career Preparation Tips
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircle sx={{ color: '#27ae60', fontSize: '1rem' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Develop the key skills required for this position type"
                sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem' } }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle sx={{ color: '#27ae60', fontSize: '1rem' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Build a portfolio showcasing relevant projects"
                sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem' } }}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle sx={{ color: '#27ae60', fontSize: '1rem' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Network with professionals in this field"
                sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem' } }}
              />
            </ListItem>
          </List>
        </Box>

        {job.workEnvironmentFit && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2c3e50', mb: 1 }}>
              🏢 Work Environment Fit
            </Typography>
            <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
              {job.workEnvironmentFit}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={() => setShowAIDialog(false)}
          variant="outlined"
          sx={{
            borderColor: '#2980b9',
            color: '#2980b9',
            borderRadius: '8px',
            textTransform: 'none'
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
        backgroundColor: '#e6f2fa',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        {/* Back Navigation */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => fromExploreJobs ? navigate('/jobs') : navigate(-1)}
          sx={{
            color: '#7f8c8d',
            textTransform: 'none',
            mb: 3,
            '&:hover': {
              backgroundColor: 'rgba(127, 140, 141, 0.05)'
            }
          }}
        >
          Back to Position Listings
        </Button>

        <Grid container spacing={4}>
          {/* Left Column - Position Summary & Actions */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: '12px',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                position: 'sticky',
                top: 24
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Position Header */}
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{
                    color: '#2c3e50',
                    fontWeight: 600,
                    mb: 2,
                    lineHeight: 1.3
                  }}
                >
                  {job.title}
                </Typography>

                {/* Match Score */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: getMatchScoreColor(job.matchScore),
                    color: 'white',
                    borderRadius: '12px',
                    py: 2,
                    mb: 3
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mr: 1
                    }}
                  >
                    {job.matchScore}%
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Match
                  </Typography>
                </Box>

                {/* Quick Info */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <School sx={{ fontSize: '1rem', color: '#2980b9' }} />
                    <Typography variant="body2" sx={{ color: '#2c3e50' }}>
                      {job.experienceLevel}
                    </Typography>
                  </Box>
                  
                  {job.industrySection && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Work sx={{ fontSize: '1rem', color: '#2980b9' }} />
                      <Typography variant="body2" sx={{ color: '#2c3e50' }}>
                        {job.industrySection}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Action Buttons */}
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={isSaved ? <Bookmark /> : <BookmarkBorder />}
                  onClick={handleSavePosition}
                  sx={{
                    borderColor: '#2980b9',
                    color: '#2980b9',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    mb: 2
                  }}
                >
                  {isSaved ? 'Saved Position' : 'Save Position'}
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<SmartToy />}
                  onClick={() => setShowAIDialog(true)}
                  sx={{
                    borderColor: '#27ae60',
                    color: '#27ae60',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(39, 174, 96, 0.05)'
                    }
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
                    Position Overview
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#7f8c8d',
                      lineHeight: 1.6,
                      mb: 2
                    }}
                  >
                    {job.detailedDescription || job.description}
                  </Typography>

                  {job.careerAlignment && (
                    <Alert severity="info" sx={{ borderRadius: '8px' }}>
                      <Typography variant="body2">
                        <strong>Career Alignment:</strong> {job.careerAlignment}
                      </Typography>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Key Responsibilities */}
              {job.keyResponsibilities && job.keyResponsibilities.length > 0 && (
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
                    >                    Typical Responsibilities
                  </Typography>
                  <List>
                    {job.keyResponsibilities.map((responsibility, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CheckCircle sx={{ color: '#27ae60' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={responsibility}
                          sx={{ 
                            '& .MuiListItemText-primary': { 
                              color: '#7f8c8d',
                              lineHeight: 1.5
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
                  {job.requiredQualifications && job.requiredQualifications.length > 0 && (
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
                  {job.skills && job.skills.length > 0 && (
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
              {job.skillDevelopment && job.skillDevelopment.length > 0 && (
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
                      Growth & Development Opportunities
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: '#2c3e50',
                          fontWeight: 600,
                          mb: 1
                        }}
                      >
                        Skills You'll Develop
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {job.skillDevelopment.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            icon={<TrendingUp />}
                            sx={{
                              backgroundColor: '#e6f2fa',
                              color: '#2980b9',
                              fontWeight: 500
                            }}
                          />
                        ))}
                      </Box>
                    </Box>

                    {job.careerGrowth && (
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: '#2c3e50',
                            fontWeight: 600,
                            mb: 1
                          }}
                        >
                          Career Growth Path
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#7f8c8d',
                            lineHeight: 1.5
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
