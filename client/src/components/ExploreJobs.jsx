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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Paper,
  Fade,
  Badge,
  Skeleton,
  Stack
} from '@mui/material'
import {
  Search,
  FilterList,
  Work,
  Schedule,
  Person,
  School,
  BusinessCenter,
  Close,
  Clear,
  LocationOn,
  TrendingUp,
  Star,
  Refresh,
  KeyboardArrowDown,
  Sort,
  FilterAlt
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const ExploreJobs = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')
  const [jobType, setJobType] = useState('')
  const [filteredJobs, setFilteredJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Advanced filter states
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [matchScoreRange, setMatchScoreRange] = useState([70, 100])
  const [selectedSkills, setSelectedSkills] = useState([])
  const [workEnvironment, setWorkEnvironment] = useState('')
  const [salaryRange, setSalaryRange] = useState('')
  const [sortBy, setSortBy] = useState('match')

  // Get user profile from localStorage
  const getUserProfile = () => {
    try {
      const storedData = localStorage.getItem('bktk_onboarding_data')
      if (storedData) {
        return JSON.parse(storedData)
      }
    } catch (error) {
      console.error('Error retrieving user profile from localStorage:', error)
    }
    return null
  }

  // Function to get job data from localStorage
  const getJobDataFromStorage = () => {
    try {
      const storedData = localStorage.getItem('bktk_job_data')
      if (storedData) {
        const jobData = JSON.parse(storedData)
        // Check if data is not too old (24 hours)
        const isDataFresh = jobData.timestamp && (Date.now() - jobData.timestamp) < 24 * 60 * 60 * 1000
        if (isDataFresh) {
          return jobData
        } else {
          // Remove old data
          localStorage.removeItem('bktk_job_data')
          return null
        }
      }
      return null
    } catch (error) {
      console.error('Error retrieving job data from localStorage:', error)
      return null
    }
  }

  // Get all data from localStorage
  const storedJobData = getJobDataFromStorage()
  const userProfile = getUserProfile()
  const finalJobListings = storedJobData?.jobListings || []
  const finalGenerationSuccess = storedJobData?.generationSuccess || false
  const finalTotalPositions = storedJobData?.totalPositions || 0
  const generationType = storedJobData?.generation_type || 'initial'

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

  // Store the converted jobs to avoid recreating them on every filter
  const [convertedJobs, setConvertedJobs] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize component with data from various sources
  useEffect(() => {
    if (isInitialized) return // Prevent re-initialization
    
    console.log('ExploreJobs: Initializing component')
    
    // Check for fresh data from navigation first
    if (finalJobListings.length > 0) {
      console.log('ExploreJobs: Using fresh data from navigation')
      initializeWithFreshData(finalJobListings)
    } else {
      // Try to get previously converted jobs from localStorage
      console.log('ExploreJobs: Checking for stored converted jobs')
      const storedConverted = getStoredConvertedJobs()
      if (storedConverted && storedConverted.length > 0) {
        console.log('ExploreJobs: Using stored converted jobs')
        setConvertedJobs(storedConverted)
        setFilteredJobs(storedConverted)
        setIsLoading(false)
        setIsInitialized(true)
      } else {
        console.log('ExploreJobs: Using fallback data')
        const sortedFallbackJobs = [...fallbackJobData].sort((a, b) => b.matchScore - a.matchScore)
        setConvertedJobs(sortedFallbackJobs)
        setFilteredJobs(sortedFallbackJobs)
        setIsLoading(false)
        setIsInitialized(true)
      }
    }
  }, [finalJobListings, isInitialized])

  const getStoredConvertedJobs = () => {
    try {
      const storedConverted = localStorage.getItem('bktk_converted_jobs')
      if (storedConverted) {
        const convertedData = JSON.parse(storedConverted)
        const isDataFresh = convertedData.timestamp && (Date.now() - convertedData.timestamp) < 24 * 60 * 60 * 1000
        if (isDataFresh && convertedData.convertedJobs?.length > 0) {
          return convertedData.convertedJobs.sort((a, b) => b.matchScore - a.matchScore)
        }
      }
    } catch (error) {
      console.error('Error retrieving converted jobs from localStorage:', error)
    }
    return null
  }

  const initializeWithFreshData = (jobListings) => {
    const converted = jobListings.map((apiJob, index) => {
      // Create a more reliable job ID
      const jobId = apiJob.position_id || `${apiJob.position_title?.replace(/\s+/g, '-').toLowerCase()}-${index}`
      
      return {
        id: jobId,
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
        detailedDescription: apiJob.role_description,
        // Add the original API job data for reference
        originalData: apiJob
      }
    })
    
    // Sort by match score
    const sortedJobs = converted.sort((a, b) => b.matchScore - a.matchScore)
    
    // Store in localStorage
    try {
      const convertedJobsData = {
        convertedJobs: sortedJobs,
        timestamp: Date.now()
      }
      localStorage.setItem('bktk_converted_jobs', JSON.stringify(convertedJobsData))
      console.log('ExploreJobs: Stored converted jobs in localStorage')
    } catch (error) {
      console.error('Error storing converted jobs in localStorage:', error)
    }
    
    setConvertedJobs(sortedJobs)
    setFilteredJobs(sortedJobs)
    setIsLoading(false)
    setIsInitialized(true)
  }

  // Filter jobs based on search criteria and maintain sorting by match score
  useEffect(() => {
    let filtered = [...convertedJobs] // Use spread to avoid mutating original array

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

    // Apply match score range filter
    filtered = filtered.filter(job => 
      job.matchScore >= matchScoreRange[0] && job.matchScore <= matchScoreRange[1]
    )

    // Apply skills filter
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(job =>
        selectedSkills.some(skill => 
          job.skills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      )
    }

    // Apply work environment filter
    if (workEnvironment) {
      filtered = filtered.filter(job =>
        job.workEnvironmentFit && job.workEnvironmentFit.toLowerCase().includes(workEnvironment.toLowerCase())
      )
    }

    // Apply salary range filter
    if (salaryRange) {
      filtered = filtered.filter(job => {
        if (!job.originalData?.typical_salary_range) return true
        const salaryText = job.originalData.typical_salary_range.toLowerCase()
        switch (salaryRange) {
          case 'entry':
            return salaryText.includes('15,000') || salaryText.includes('18,000') || salaryText.includes('20,000')
          case 'junior':
            return salaryText.includes('25,000') || salaryText.includes('30,000') || salaryText.includes('35,000')
          case 'mid':
            return salaryText.includes('40,000') || salaryText.includes('45,000') || salaryText.includes('50,000')
          default:
            return true
        }
      })
    }

    // Sort filtered results by selected criteria
    const sortedFiltered = sortJobs(filtered)

    setFilteredJobs(sortedFiltered)
  }, [searchQuery, industryFilter, jobType, convertedJobs, matchScoreRange, selectedSkills, workEnvironment, salaryRange, sortBy])

  const handleViewDetails = (job) => {
    // Navigate to job detail page with job data
    navigate('/job-detail', { 
      state: { 
        job,
        userProfile: userProfile,
        fromExploreJobs: true 
      } 
    })
  }

  // Get all available skills from converted jobs for filter options
  const getAllSkills = () => {
    const allSkills = new Set()
    convertedJobs.forEach(job => {
      if (job.skills) {
        job.skills.forEach(skill => allSkills.add(skill))
      }
    })
    return Array.from(allSkills).sort()
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('')
    setIndustryFilter('')
    setJobType('')
    setMatchScoreRange([70, 100])
    setSelectedSkills([])
    setWorkEnvironment('')
    setSalaryRange('')
  }

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const getMatchScoreColor = (score) => {
    if (score >= 90) return '#27ae60' // Green
    if (score >= 80) return '#f39c12' // Orange
    if (score >= 70) return '#e67e22' // Dark Orange
    return '#e74c3c' // Red
  }

  const getMatchScoreLabel = (score) => {
    if (score >= 95) return 'Excellent Match'
    if (score >= 90) return 'Great Match'
    if (score >= 80) return 'Good Match'
    if (score >= 70) return 'Fair Match'
    return 'Low Match'
  }

  const sortJobs = (jobs) => {
    switch (sortBy) {
      case 'match':
        return jobs.sort((a, b) => b.matchScore - a.matchScore)
      case 'recent':
        return jobs.sort((a, b) => new Date(b.originalData?.posted_date || 0) - new Date(a.originalData?.posted_date || 0))
      case 'title':
        return jobs.sort((a, b) => a.title.localeCompare(b.title))
      default:
        return jobs
    }
  }

  const JobCard = ({ job }) => (
    <Fade in={true} timeout={300}>
      <Card
        sx={{
          mb: 2,
          borderRadius: '16px',
          border: '1px solid #e8eaed',
          backgroundColor: 'white',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(41, 128, 185, 0.15)',
            transform: 'translateY(-3px)',
            borderColor: '#2980b9',
            '& .job-card-actions': {
              opacity: 1,
              transform: 'translateY(0)'
            }
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >

        <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Header Section with Match Score */}
          <Box sx={{ px: 3, pt: 3, pb: 0, display: 'flex', flexDirection: 'column' }}>
            {/* Title and Match Score Row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 2 }}>
              <Box sx={{ flex: 1, minWidth: 0, maxWidth: 'calc(100% - 90px)' }}>
                <Typography
                  variant="h6"
                  component="h3"
                  onClick={() => handleViewDetails(job)}
                  sx={{
                    color: '#1a1a1a',
                    fontWeight: 600,
                    mb: 0.5,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    lineHeight: 1.4,
                    wordBreak: 'break-word',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    textOverflow: 'ellipsis',
                    '&:hover': {
                      color: '#2980b9'
                    }
                  }}
                >
                  {job.title}
                </Typography>
              </Box>
              
              {/* Match Score Badge - Properly positioned */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '20px',
                  backgroundColor: getMatchScoreColor(job.matchScore),
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  minWidth: '70px',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  justifyContent: 'center'
                }}
              >
                <Star sx={{ fontSize: '0.875rem' }} />
                {job.matchScore}%
              </Box>
            </Box>

            {/* Industry, Experience Level and Salary */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
              {job.industrySection && (
                <Chip
                  icon={<BusinessCenter sx={{ fontSize: '0.75rem' }} />}
                  label={job.industrySection}
                  size="small"
                  sx={{
                    backgroundColor: '#e6f2fa',
                    color: '#2980b9',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    height: '28px',
                    maxWidth: '140px',
                    '& .MuiChip-label': {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    },
                    '& .MuiChip-icon': {
                      color: '#2980b9'
                    }
                  }}
                />
              )}
              <Chip
                icon={<School sx={{ fontSize: '0.75rem' }} />}
                label={job.experienceLevel}
                size="small"
                sx={{
                  backgroundColor: '#f8f9fa',
                  color: '#7f8c8d',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  height: '28px',
                  maxWidth: '120px',
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  },
                  '& .MuiChip-icon': {
                    color: '#7f8c8d'
                  }
                }}
              />
              {/* Salary Range - Inline with other chips */}
              {job.originalData?.typical_salary_range && (
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#27ae60',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    backgroundColor: '#e8f5e8',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    height: '28px',
                    lineHeight: 1
                  }}
                >
                  💰 {job.originalData.typical_salary_range}
                </Typography>
              )}
            </Stack>

            {/* Match Score Description and Description */}
            <Typography
              variant="caption"
              sx={{
                color: getMatchScoreColor(job.matchScore),
                fontWeight: 600,
                fontSize: '0.8rem',
                mb: 1,
                display: 'block'
              }}
            >
              {getMatchScoreLabel(job.matchScore)}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                mb: 1.5,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis'
              }}
            >
              {job.description}
            </Typography>

            {/* Skills Section */}
            <Box sx={{ mb: 1.5 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#2c3e50',
                  fontWeight: 600,
                  mb: 1,
                  fontSize: '0.85rem'
                }}
              >
                Key Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {job.skills && job.skills.slice(0, 4).map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    size="small"
                    sx={{
                      backgroundColor: '#27ae60',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      height: '26px',
                      maxWidth: '110px',
                      '& .MuiChip-label': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        px: 1.5
                      },
                      '&:hover': {
                        backgroundColor: '#219a52',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
                {job.skills && job.skills.length > 4 && (
                  <Chip
                    label={`+${job.skills.length - 4}`}
                    size="small"
                    sx={{
                      backgroundColor: '#e6f2fa',
                      color: '#2980b9',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      height: '26px',
                      minWidth: '40px'
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {/* Footer Actions */}
          <Box
            className="job-card-actions"
            sx={{
              px: 3,
              py: 2,
              backgroundColor: '#fafbfc',
              borderTop: '1px solid #e8eaed',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 1.5,
              opacity: { xs: 1, md: 0.7 },
              transform: { xs: 'translateY(0)', md: 'translateY(5px)' },
              transition: 'all 0.3s ease',
              flexShrink: 0
            }}
          >
            <Button
              variant="contained"
              size="medium"
              onClick={() => handleViewDetails(job)}
              sx={{
                backgroundColor: '#2980b9',
                color: 'white',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                boxShadow: '0 4px 12px rgba(41, 128, 185, 0.3)',
                '&:hover': {
                  backgroundColor: '#1e6091',
                  boxShadow: '0 6px 16px rgba(41, 128, 185, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              View Details
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  )

  return (
    <Box
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: '#f8fafe',
        backgroundImage: 'linear-gradient(135deg, #f8fafe 0%, #e6f2fa 100%)'
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Enhanced Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #2980b9 0%, #3498db 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, rgba(41, 128, 185, 0.8), rgba(52, 152, 219, 0.8), rgba(46, 204, 113, 0.3), rgba(52, 152, 219, 0.8), rgba(41, 128, 185, 0.8))',
              backgroundSize: '400% 400%',
              animation: 'gradientShift 8s ease-in-out infinite',
              zIndex: 1
            },
            '@keyframes gradientShift': {
              '0%': {
                backgroundPosition: '0% 50%'
              },
              '50%': {
                backgroundPosition: '100% 50%'
              },
              '100%': {
                backgroundPosition: '0% 50%'
              }
            }
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(50%, -50%)',
              zIndex: 2
            }}
          />
          
          <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 3 }}>
            <Grid item xs={12} md={8}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  color: 'white',
                  textShadow: '0 3px 6px rgba(0, 0, 0, 0.3)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2
                }}
              >
                Discover Your Dream Career
              </Typography>
              
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.95,
                  mb: 3,
                  fontSize: '1.1rem',
                  lineHeight: 1.4,
                  color: 'rgba(255, 255, 255, 0.95)',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  fontWeight: 500,
                  maxWidth: '90%'
                }}
              >
                {finalJobListings.length > 0 
                  ? `${finalTotalPositions} AI-curated ${generationType === 'refresh' ? 'refreshed' : ''} opportunities tailored for ${userProfile?.welcome?.fullName || 'you'}`
                  : 'Explore personalized job recommendations based on your skills and aspirations'
                }
              </Typography>

              {/* Quick Stats */}
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Box 
                    sx={{ 
                      textAlign: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '16px',
                      p: 2,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 0.5,
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      {filteredJobs.length}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontWeight: 500,
                        fontSize: '0.9rem'
                      }}
                    >
                      Job Matches
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box 
                    sx={{ 
                      textAlign: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '16px',
                      p: 2,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 0.5,
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      {filteredJobs.filter(job => job.matchScore >= 90).length}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontWeight: 500,
                        fontSize: '0.9rem'
                      }}
                    >
                      Excellent Matches
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <TrendingUp sx={{ fontSize: 80, opacity: 0.8 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Generation Status Alert */}
        {finalJobListings.length > 0 && (
          <Alert 
            severity={finalGenerationSuccess ? "success" : "info"} 
            sx={{ 
              mb: 3, 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            icon={<Star />}
          >
            {finalGenerationSuccess 
              ? `✨ Successfully generated ${finalTotalPositions} ${generationType === 'refresh' ? 'fresh' : 'personalized'} job recommendations based on your profile!`
              : "⚡ Showing personalized recommendations - some positions generated with fallback data."
            }
          </Alert>
        )}

        {/* No Results Alert */}
        {finalJobListings.length === 0 && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3, 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            📝 No personalized recommendations available. Complete your profile setup to get AI-curated job matches!
          </Alert>
        )}

        {/* Enhanced Filter and Search Panel */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: '16px',
            backgroundColor: 'white',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden'
          }}
        >
          {/* Search Header */}
          <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid #f0f0f0' }}>
            <Typography
              variant="h6"
              sx={{
                color: '#2c3e50',
                fontWeight: 600,
                mb: 2
              }}
            >
              Find Your Perfect Match
            </Typography>
            
            {/* Main Search Bar */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search by job title, company, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#2980b9', fontSize: '1.5rem' }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery('')}
                      sx={{ color: '#7f8c8d' }}
                    >
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  '& fieldset': {
                    borderColor: 'transparent'
                  },
                  '&:hover fieldset': {
                    borderColor: '#2980b9'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2980b9',
                    borderWidth: '2px'
                  }
                }
              }}
            />
          </Box>

          {/* Filter Controls */}
          <Box sx={{ p: 3, pt: 2 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#7f8c8d' }}>Industry</InputLabel>
                  <Select
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    sx={{
                      backgroundColor: '#f8f9fa',
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2980b9'
                      }
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

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#7f8c8d' }}>Experience Level</InputLabel>
                  <Select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    sx={{
                      backgroundColor: '#f8f9fa',
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2980b9'
                      }
                    }}
                  >
                    <MenuItem value="">All Levels</MenuItem>
                    <MenuItem value="entry-level">Entry-Level</MenuItem>
                    <MenuItem value="no experience">No Experience Required</MenuItem>
                    <MenuItem value="internship">Internship</MenuItem>
                    <MenuItem value="fresh graduate">Fresh Graduate</MenuItem>
                    <MenuItem value="part-time">Part-time</MenuItem>
                    <MenuItem value="contract">Contract</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#7f8c8d' }}>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{
                      backgroundColor: '#f8f9fa',
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'transparent'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2980b9'
                      }
                    }}
                  >
                    <MenuItem value="match">Best Match</MenuItem>
                    <MenuItem value="recent">Most Recent</MenuItem>
                    <MenuItem value="title">Job Title</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={3}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<FilterAlt />}
                  onClick={() => setShowMoreFilters(true)}
                  sx={{
                    borderColor: '#2980b9',
                    color: '#2980b9',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: 'rgba(41, 128, 185, 0.05)',
                      borderColor: '#1e6091'
                    }
                  }}
                >
                  Advanced Filters
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Active Filters Display */}
          {(selectedSkills.length > 0 || workEnvironment || salaryRange || matchScoreRange[0] > 70 || matchScoreRange[1] < 100) && (
            <Box sx={{ px: 3, pb: 3, pt: 1, borderTop: '1px solid #f0f0f0', backgroundColor: '#f8f9fa' }}>
              <Typography variant="subtitle2" sx={{ color: '#7f8c8d', mb: 1.5, fontWeight: 600 }}>
                Active Filters:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {selectedSkills.map(skill => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleSkillToggle(skill)}
                    size="small"
                    sx={{ 
                      backgroundColor: '#e6f2fa', 
                      color: '#2980b9',
                      '& .MuiChip-deleteIcon': {
                        color: '#2980b9'
                      }
                    }}
                  />
                ))}
                {workEnvironment && (
                  <Chip
                    label={`Work: ${workEnvironment}`}
                    onDelete={() => setWorkEnvironment('')}
                    size="small"
                    sx={{ 
                      backgroundColor: '#e6f2fa', 
                      color: '#2980b9',
                      '& .MuiChip-deleteIcon': {
                        color: '#2980b9'
                      }
                    }}
                  />
                )}
                {salaryRange && (
                  <Chip
                    label={`Salary: ${salaryRange}`}
                    onDelete={() => setSalaryRange('')}
                    size="small"
                    sx={{ 
                      backgroundColor: '#e6f2fa', 
                      color: '#2980b9',
                      '& .MuiChip-deleteIcon': {
                        color: '#2980b9'
                      }
                    }}
                  />
                )}
                {(matchScoreRange[0] > 70 || matchScoreRange[1] < 100) && (
                  <Chip
                    label={`Match: ${matchScoreRange[0]}-${matchScoreRange[1]}%`}
                    onDelete={() => setMatchScoreRange([70, 100])}
                    size="small"
                    sx={{ 
                      backgroundColor: '#e6f2fa', 
                      color: '#2980b9',
                      '& .MuiChip-deleteIcon': {
                        color: '#2980b9'
                      }
                    }}
                  />
                )}
                <Button
                  size="small"
                  onClick={clearAllFilters}
                  startIcon={<Clear />}
                  sx={{ 
                    ml: 1, 
                    color: '#7f8c8d', 
                    fontSize: '0.75rem',
                    textTransform: 'none'
                  }}
                >
                  Clear All
                </Button>
              </Stack>
            </Box>
          )}
        </Paper>

        {/* Job Results Section */}
        <Box>
          {isLoading ? (
            <Paper
              sx={{ 
                p: 4, 
                borderRadius: '16px',
                textAlign: 'center',
                backgroundColor: 'white',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}
            >
              <CircularProgress size={60} sx={{ color: '#2980b9', mb: 3 }} />
              <Typography variant="h6" sx={{ color: '#2c3e50', mb: 2 }}>
                Finding Your Perfect Matches
              </Typography>
              <Typography sx={{ color: '#7f8c8d' }}>
                Our AI is analyzing thousands of opportunities to find the best matches for your profile...
              </Typography>
              
              {/* Loading Skeleton */}
              <Box sx={{ mt: 4 }}>
                <Grid container spacing={3}>
                  {[1, 2, 3].map((item) => (
                    <Grid item xs={12} md={4} key={item}>
                      <Card sx={{ p: 3, borderRadius: '16px' }}>
                        <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: '8px', mb: 2 }} />
                        <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Skeleton variant="rounded" width={80} height={24} />
                          <Skeleton variant="rounded" width={100} height={24} />
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>
          ) : filteredJobs.length > 0 ? (
            <>
              {/* Results Header */}
              <Paper
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: '16px',
                  backgroundColor: 'white',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                }}
              >
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#2c3e50',
                        fontWeight: 700,
                        mb: 0.5
                      }}
                    >
                      {filteredJobs.length} Perfect {filteredJobs.length === 1 ? 'Match' : 'Matches'} Found
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#7f8c8d'
                      }}
                    >
                      {searchQuery || industryFilter || jobType 
                        ? `Filtered results based on your search criteria`
                        : `Showing all available positions sorted by ${
                            sortBy === 'match' ? 'best match' : 
                            sortBy === 'recent' ? 'most recent' : 'job title'
                          }`
                      }
                    </Typography>
                  </Grid>
                  
                  <Grid item>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Chip
                        icon={<TrendingUp />}
                        label={`${Math.round((filteredJobs.filter(job => job.matchScore >= 80).length / filteredJobs.length) * 100)}% High Match Rate`}
                        sx={{
                          backgroundColor: '#e8f5e8',
                          color: '#27ae60',
                          fontWeight: 600
                        }}
                      />
                      
                      <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={() => navigate('/onboarding/loading')}
                        sx={{
                          borderColor: '#2980b9',
                          color: '#2980b9',
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        Refresh
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>

              {/* Job Cards List */}
              <Box>
                {filteredJobs.map((job, index) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </Box>
            </>
          ) : (
            <Paper
              sx={{ 
                p: 6, 
                borderRadius: '16px',
                textAlign: 'center',
                backgroundColor: 'white',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 3rem auto'
                }}
              >
                <Search sx={{ fontSize: 60, color: '#7f8c8d' }} />
              </Box>
              
              <Typography
                variant="h5"
                sx={{
                  color: '#2c3e50',
                  fontWeight: 600,
                  mb: 2
                }}
              >
                No matching opportunities found
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#7f8c8d',
                  mb: 4,
                  maxWidth: 500,
                  margin: '0 auto 2rem auto'
                }}
              >
                Don't worry! Try adjusting your search criteria or clearing filters to discover more opportunities that match your profile.
              </Typography>
              
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  onClick={clearAllFilters}
                  sx={{
                    backgroundColor: '#2980b9',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5
                  }}
                >
                  Clear All Filters
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/onboarding/loading')}
                  sx={{
                    borderColor: '#2980b9',
                    color: '#2980b9',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5
                  }}
                >
                  Get New Recommendations
                </Button>
              </Stack>
            </Paper>
          )}
        </Box>

        {/* Enhanced Advanced Filters Dialog */}
        <Dialog
          open={showMoreFilters}
          onClose={() => setShowMoreFilters(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              pb: 2,
              borderBottom: '1px solid #f0f0f0'
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 700, mb: 0.5 }}>
                Advanced Job Filters
              </Typography>
              <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                Fine-tune your search to find the perfect match
              </Typography>
            </Box>
            <IconButton 
              onClick={() => setShowMoreFilters(false)}
              sx={{ 
                color: '#7f8c8d',
                '&:hover': { backgroundColor: 'rgba(127, 140, 141, 0.1)' }
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ py: 3 }}>
            <Grid container spacing={4}>
              {/* Match Score Range */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, color: '#2c3e50', fontWeight: 600 }}>
                    Match Score Range
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: '#7f8c8d' }}>
                    Show only jobs with match scores within this range
                  </Typography>
                  <Slider
                    value={matchScoreRange}
                    onChange={(e, newValue) => setMatchScoreRange(newValue)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                    min={50}
                    max={100}
                    marks={[
                      { value: 50, label: '50%' },
                      { value: 70, label: '70%' },
                      { value: 85, label: '85%' },
                      { value: 100, label: '100%' }
                    ]}
                    sx={{ 
                      color: '#2980b9',
                      '& .MuiSlider-thumb': {
                        backgroundColor: '#2980b9',
                        boxShadow: '0 2px 8px rgba(41, 128, 185, 0.3)'
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: '#2980b9'
                      }
                    }}
                  />
                </Paper>
              </Grid>

              {/* Skills Filter */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, color: '#2c3e50', fontWeight: 600 }}>
                    Required Skills
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: '#7f8c8d' }}>
                    Filter jobs that require specific skills
                  </Typography>
                  <Box 
                    sx={{ 
                      maxHeight: 200, 
                      overflow: 'auto', 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '8px', 
                      p: 2,
                      backgroundColor: 'white'
                    }}
                  >
                    <FormGroup>
                      {getAllSkills().map(skill => (
                        <FormControlLabel
                          key={skill}
                          control={
                            <Checkbox
                              checked={selectedSkills.includes(skill)}
                              onChange={() => handleSkillToggle(skill)}
                              sx={{ color: '#2980b9' }}
                            />
                          }
                          label={skill}
                          sx={{ mb: 0.5 }}
                        />
                      ))}
                    </FormGroup>
                  </Box>
                </Paper>
              </Grid>

              {/* Work Environment and Salary */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: '12px', height: '100%' }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, color: '#2c3e50', fontWeight: 600 }}>
                    Work Environment
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={workEnvironment}
                      onChange={(e) => setWorkEnvironment(e.target.value)}
                      displayEmpty
                      sx={{ 
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        }
                      }}
                    >
                      <MenuItem value="">All Environments</MenuItem>
                      <MenuItem value="remote">Remote Work</MenuItem>
                      <MenuItem value="hybrid">Hybrid</MenuItem>
                      <MenuItem value="office">In-Office</MenuItem>
                      <MenuItem value="flexible">Flexible</MenuItem>
                    </Select>
                  </FormControl>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: '12px', height: '100%' }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, color: '#2c3e50', fontWeight: 600 }}>
                    Salary Range
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.value)}
                      displayEmpty
                      sx={{ 
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#e0e0e0'
                        }
                      }}
                    >
                      <MenuItem value="">All Salary Ranges</MenuItem>
                      <MenuItem value="entry">Entry Level (₱15,000 - ₱25,000)</MenuItem>
                      <MenuItem value="junior">Junior Level (₱25,000 - ₱40,000)</MenuItem>
                      <MenuItem value="mid">Mid Level (₱40,000 - ₱60,000)</MenuItem>
                    </Select>
                  </FormControl>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, borderTop: '1px solid #f0f0f0' }}>
            <Button
              onClick={clearAllFilters}
              sx={{ 
                color: '#7f8c8d',
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Clear All Filters
            </Button>
            <Button
              onClick={() => setShowMoreFilters(false)}
              variant="contained"
              sx={{
                backgroundColor: '#2980b9',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:hover': { 
                  backgroundColor: '#1e6091' 
                }
              }}
            >
              Apply Filters
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bottom Navigation */}
        {filteredJobs.length > 0 && (
          <Paper
            sx={{
              mt: 4,
              p: 4,
              borderRadius: '16px',
              backgroundColor: 'white',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              textAlign: 'center'
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#2c3e50',
                fontWeight: 600,
                mb: 2
              }}
            >
              Want to see more opportunities?
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#7f8c8d',
                mb: 3,
                maxWidth: 600,
                margin: '0 auto 1.5rem auto'
              }}
            >
              Our AI continuously finds new matches based on your profile. Get fresh recommendations or update your preferences for better results.
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/onboarding/loading')}
                sx={{
                  backgroundColor: '#2980b9',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  boxShadow: '0 4px 12px rgba(41, 128, 185, 0.3)',
                  '&:hover': {
                    backgroundColor: '#1e6091',
                    boxShadow: '0 6px 16px rgba(41, 128, 185, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Get Fresh Recommendations
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  localStorage.removeItem('bktk_job_data')
                  localStorage.removeItem('bktk_converted_jobs')
                  navigate('/')
                }}
                sx={{
                  borderColor: '#7f8c8d',
                  color: '#7f8c8d',
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: 'rgba(127, 140, 141, 0.05)',
                    borderColor: '#5a6c6d'
                  }
                }}
              >
                Update Profile & Preferences
              </Button>
            </Stack>
          </Paper>
        )}
      </Container>
    </Box>
  )
}

export default ExploreJobs
