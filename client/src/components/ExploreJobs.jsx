import React, { useState } from 'react'
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  Grid,
  Divider
} from '@mui/material'
import {
  Search,
  FilterList,
  LocationOn,
  Work,
  Schedule,
  AttachMoney,
  Bookmark,
  BookmarkBorder
} from '@mui/icons-material'

const ExploreJobs = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('')
  const [savedJobs, setSavedJobs] = useState([])

  // Sample job data matching the image
  const jobPositions = [
    {
      id: 1,
      title: 'Marketing Assistant',
      description: 'Support marketing campaigns and assist with brand promotion activities',
      matchScore: 94,
      skills: ['Social Media', 'Content Writing', 'Analytics']
    },
    {
      id: 2,
      title: 'Content Creator',
      description: 'Create engaging visual and written content for digital platforms',
      matchScore: 89,
      skills: ['Video Editing', 'Photography', 'Social Media']
    },
    {
      id: 3,
      title: 'Customer Success Associate',
      description: 'Help customers achieve their goals and ensure satisfaction with our services',
      matchScore: 87,
      skills: ['Customer Service', 'Communication', 'Problem Solving']
    },
    {
      id: 4,
      title: 'Junior Data Analyst',
      description: 'Analyze data trends and create reports to support business decisions',
      matchScore: 75,
      skills: ['Excel', 'SQL', 'Data Visualization']
    }
  ]

  const handleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  const getMatchScoreColor = (score) => {
    if (score >= 90) return '#27ae60' // Green
    if (score >= 80) return '#f39c12' // Orange
    if (score >= 70) return '#e67e22' // Dark Orange
    return '#e74c3c' // Red
  }

  const JobCard = ({ job }) => (
    <Card
      sx={{
        mb: 2,
        borderRadius: '12px',
        border: '1px solid #ecf0f1',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)'
        },
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                color: '#2c3e50',
                fontWeight: 600,
                mb: 1,
                fontSize: '1.125rem',
                cursor: 'pointer',
                '&:hover': {
                  color: '#2980b9'
                }
              }}
            >
              {job.title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#7f8c8d',
                mb: 2,
                fontSize: '0.875rem',
                lineHeight: 1.4
              }}
            >
              {job.description}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {job.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  sx={{
                    backgroundColor: '#27ae60',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    height: '24px'
                  }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: getMatchScoreColor(job.matchScore),
                fontWeight: 600
              }}
            >
              <Typography
                variant="body1"
                sx={{ 
                  fontSize: '1rem', 
                  fontWeight: 600,
                  color: getMatchScoreColor(job.matchScore)
                }}
              >
                {job.matchScore}% Match
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleSaveJob(job.id)}
                sx={{ color: '#7f8c8d' }}
              >
                {savedJobs.includes(job.id) ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
            </Box>
            
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: '#2980b9',
                color: 'white',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                py: 0.5,
                mt: 1,
                '&:hover': {
                  backgroundColor: '#1e6091'
                }
              }}
            >
              View Details
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
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
      <Container maxWidth="lg">
        {/* Main Header */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            color: '#2c3e50',
            fontWeight: 600,
            mb: 1,
            fontSize: '2rem'
          }}
        >
          Explore Job Opportunities
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: '#7f8c8d',
            mb: 4,
            fontSize: '1rem'
          }}
        >
          Discover roles tailored to your skills and aspirations
        </Typography>

        {/* Filter and Search Panel */}
        <Card
          sx={{
            mb: 4,
            borderRadius: '12px',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search by title"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#7f8c8d' }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: '8px',
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
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: '8px'
                    }}
                  >
                    <MenuItem value="">All Locations</MenuItem>
                    <MenuItem value="makati">Makati</MenuItem>
                    <MenuItem value="bgc">BGC</MenuItem>
                    <MenuItem value="ortigas">Ortigas</MenuItem>
                    <MenuItem value="remote">Remote</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Job Type</InputLabel>
                  <Select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: '8px'
                    }}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="full-time">Full-time</MenuItem>
                    <MenuItem value="part-time">Part-time</MenuItem>
                    <MenuItem value="internship">Internship</MenuItem>
                    <MenuItem value="contract">Contract</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<FilterList />}
                  sx={{
                    backgroundColor: '#2980b9',
                    color: 'white',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: '#1e6091'
                    }
                  }}
                >
                  More Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Job Cards */}
        <Box>
          {jobPositions.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </Box>

        {/* Load More Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: '#2980b9',
              color: '#2980b9',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              '&:hover': {
                borderColor: '#1e6091',
                backgroundColor: 'rgba(41, 128, 185, 0.05)'
              }
            }}
          >
            Load More Jobs
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default ExploreJobs
