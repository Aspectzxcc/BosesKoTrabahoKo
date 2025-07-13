import React, { useState, useEffect } from 'react'
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
  Divider,
  Alert,
  CircularProgress
} from '@mui/material'
import {
  Search,
  FilterList,
  Work,
  Schedule,
  Bookmark,
  BookmarkBorder,
  Person,
  School,
  BusinessCenter
} from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'

const ExploreJobs = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')
  const [jobType, setJobType] = useState('')
  const [savedJobs, setSavedJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Get job listings from navigation state (passed from AI Loading Screen)
  const apiJobListings = location.state?.jobListings || []
  const userProfile = location.state?.userProfile || null
  const generationSuccess = location.state?.generationSuccess || false
  const totalPositions = location.state?.totalPositions || 0

  // Initialize jobs from API results
  useEffect(() => {
    if (apiJobListings.length > 0) {
      // Convert API response to component format
      const convertedJobs = apiJobListings.map((apiJob, index) => ({
        id: apiJob.position_id || `job_${index}`,
        title: apiJob.position_title,
        description: apiJob.position_summary || apiJob.role_description,
        matchScore: apiJob.match_score,
        skills: apiJob.required_skills || [],
        experienceLevel: apiJob.experience_level,
        industrySection: apiJob.industry_sector,
        keyResponsibilities: apiJob.key_responsibilities || [],
        requiredQualifications: apiJob.required_qualifications || [],
        skillDevelopment: apiJob.skill_development_opportunities || [],
        careerGrowth: apiJob.career_growth_path,
        workEnvironmentFit: apiJob.work_environment_fit,
        careerAlignment: apiJob.career_priorities_alignment,
        detailedDescription: apiJob.role_description
      }))
      setFilteredJobs(convertedJobs)
      setIsLoading(false)
    } else {
      // Fallback to sample data if no API results
      setFilteredJobs(fallbackJobData)
      setIsLoading(false)
    }
  }, [apiJobListings])

  // Fallback sample data for development/error scenarios
  const fallbackJobData = [
    {
      id: 'fallback_1',
      title: 'Marketing Assistant',
      description: 'Support marketing campaigns and assist with brand promotion activities',
      matchScore: 94,
      skills: ['Social Media', 'Content Writing', 'Analytics'],
      experienceLevel: 'Entry-Level',
      industrySection: 'Marketing & Advertising'
    },
    {
      id: 'fallback_2',
      title: 'Content Creator',
      description: 'Create engaging visual and written content for digital platforms',
      matchScore: 89,
      skills: ['Video Editing', 'Photography', 'Social Media'],
      experienceLevel: 'Entry-Level',
      industrySection: 'Digital Media'
    }
  ]

  // Filter jobs based on search criteria
  useEffect(() => {
    let filtered = apiJobListings.length > 0 ? 
      apiJobListings.map((apiJob, index) => ({
        id: apiJob.position_id || `job_${index}`,
        title: apiJob.position_title,
        description: apiJob.position_summary || apiJob.role_description,
        matchScore: apiJob.match_score,
        skills: apiJob.required_skills || [],
        experienceLevel: apiJob.experience_level,
        industrySection: apiJob.industry_sector,
        keyResponsibilities: apiJob.key_responsibilities || [],
        requiredQualifications: apiJob.required_qualifications || [],
        skillDevelopment: apiJob.skill_development_opportunities || [],
        careerGrowth: apiJob.career_growth_path,
        workEnvironmentFit: apiJob.work_environment_fit,
        careerAlignment: apiJob.career_priorities_alignment,
        detailedDescription: apiJob.role_description
      })) : fallbackJobData

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply industry filter
    if (industryFilter) {
      filtered = filtered.filter(job =>
        job.industrySection && job.industrySection.toLowerCase().includes(industryFilter.toLowerCase())
      )
    }

    // Apply job type filter
    if (jobType) {
      filtered = filtered.filter(job =>
        job.experienceLevel.toLowerCase().includes(jobType.toLowerCase())
      )
    }

    setFilteredJobs(filtered)
  }, [searchQuery, industryFilter, jobType, apiJobListings])

  const handleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    )
  }

  const handleViewDetails = (job) => {
    // Navigate to job detail page with job data
    navigate('/job-detail', { 
      state: { 
        job,
        userProfile,
        fromExploreJobs: true 
      } 
    })
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
                mb: 0.5,
                fontSize: '1.125rem',
                cursor: 'pointer',
                '&:hover': {
                  color: '#2980b9'
                }
              }}
            >
              {job.title}
            </Typography>

            {/* Experience Level and Industry */}
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
              <Chip
                icon={<School />}
                label={job.experienceLevel}
                size="small"
                sx={{
                  backgroundColor: '#e6f2fa',
                  color: '#2980b9',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  height: '24px'
                }}
              />
              {job.industrySection && (
                <Chip
                  label={job.industrySection}
                  size="small"
                  sx={{
                    backgroundColor: '#f8f9fa',
                    color: '#7f8c8d',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    height: '24px'
                  }}
                />
              )}
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: '#7f8c8d',
                mb: 1.5,
                fontSize: '0.875rem',
                lineHeight: 1.4
              }}
            >
              {job.description}
            </Typography>

            {/* Skills */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
              {job.skills && job.skills.slice(0, 5).map((skill, index) => (
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
              {job.skills && job.skills.length > 5 && (
                <Chip
                  label={`+${job.skills.length - 5} more`}
                  size="small"
                  sx={{
                    backgroundColor: '#ecf0f1',
                    color: '#7f8c8d',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    height: '24px'
                  }}
                />
              )}
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
              onClick={() => handleViewDetails(job)}
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
        <Box sx={{ mb: 4 }}>
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
              mb: 2,
              fontSize: '1rem'
            }}
          >
            {apiJobListings.length > 0 
              ? `Discover ${totalPositions} AI-curated roles tailored to your skills and aspirations${userProfile?.welcome?.fullName ? `, ${userProfile.welcome.fullName}` : ''}`
              : 'Discover roles tailored to your skills and aspirations'
            }
          </Typography>

          {/* Generation Status Alert */}
          {apiJobListings.length > 0 && (
            <Alert 
              severity={generationSuccess ? "success" : "info"} 
              sx={{ mb: 2, borderRadius: '8px' }}
            >
              {generationSuccess 
                ? `✨ Successfully generated ${totalPositions} personalized job recommendations based on your profile!`
                : "⚡ Showing personalized recommendations - some positions generated with fallback data."
              }
            </Alert>
          )}

          {/* No Results Alert */}
          {apiJobListings.length === 0 && (
            <Alert 
              severity="info" 
              sx={{ mb: 2, borderRadius: '8px' }}
            >
              📝 No personalized recommendations available. Complete your profile setup to get AI-curated job matches!
            </Alert>
          )}
        </Box>

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
                  <InputLabel>Industry</InputLabel>
                  <Select
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: '8px'
                    }}
                  >
                    <MenuItem value="">All Industries</MenuItem>
                    <MenuItem value="marketing">Marketing & Advertising</MenuItem>
                    <MenuItem value="technology">Technology</MenuItem>
                    <MenuItem value="media">Digital Media</MenuItem>
                    <MenuItem value="finance">Finance</MenuItem>
                    <MenuItem value="healthcare">Healthcare</MenuItem>
                    <MenuItem value="education">Education</MenuItem>
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
                    <MenuItem value="entry-level">Entry-Level</MenuItem>
                    <MenuItem value="no experience">No Experience Required</MenuItem>
                    <MenuItem value="internship">Internship</MenuItem>
                    <MenuItem value="fresh graduate">Fresh Graduate</MenuItem>
                    <MenuItem value="part-time">Part-time</MenuItem>
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
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress size={40} sx={{ color: '#2980b9' }} />
              <Typography sx={{ ml: 2, color: '#7f8c8d' }}>
                Loading your personalized job recommendations...
              </Typography>
            </Box>
          ) : filteredJobs.length > 0 ? (
            <>
              {/* Results Summary */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#2c3e50',
                    fontWeight: 600,
                    mb: 1
                  }}
                >
                  {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#7f8c8d'
                  }}
                >
                  {searchQuery || industryFilter || jobType 
                    ? `Filtered results based on your search criteria`
                    : `Showing all available positions`
                  }
                </Typography>
              </Box>

              {/* Job Cards List */}
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#7f8c8d',
                  mb: 2
                }}
              >
                No jobs found matching your criteria
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#7f8c8d',
                  mb: 3
                }}
              >
                Try adjusting your search filters or clearing all filters to see more results.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchQuery('')
                  setIndustryFilter('')
                  setJobType('')
                }}
                sx={{
                  borderColor: '#2980b9',
                  color: '#2980b9',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Clear All Filters
              </Button>
            </Box>
          )}
        </Box>

        {/* Load More Button - Only show if there are results and not all positions are shown */}
        {filteredJobs.length > 0 && filteredJobs.length >= 4 && (
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
              Refresh Recommendations
            </Button>
          </Box>
        )}

        {/* Back to Dashboard Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="text"
            onClick={() => navigate('/dashboard')}
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
            ← Back to Dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default ExploreJobs
