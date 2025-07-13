import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Typography,
  CircularProgress,
  Fade,
  Alert
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getJobListings } from '../services/api'

const AILoadingScreen = () => {
  const navigate = useNavigate()
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const hasCalledAPI = useRef(false) // Ref to track if API has been called

  // Get user profile from localStorage (onboarding data) or use fallback
  const getOnboardingData = () => {
    try {
      const storedData = localStorage.getItem('bktk_onboarding_data')
      if (storedData) {
        const onboardingData = JSON.parse(storedData)
        console.log('Retrieved onboarding data from localStorage:', onboardingData)
        return onboardingData
      }
    } catch (error) {
      console.error('Error retrieving onboarding data from localStorage:', error)
    }
    return null
  }

  // Check if this is a refresh by looking for existing job data
  const getIsRefreshMode = () => {
    try {
      const existingJobData = localStorage.getItem('bktk_job_data')
      const existingConvertedJobs = localStorage.getItem('bktk_converted_jobs')
      const isRefresh = !!(existingJobData || existingConvertedJobs)
      console.log('🔄 Refresh mode detection:', {
        hasExistingJobData: !!existingJobData,
        hasExistingConvertedJobs: !!existingConvertedJobs,
        isRefresh: isRefresh
      })
      return isRefresh
    } catch (error) {
      console.error('Error checking refresh mode:', error)
      return false
    }
  }

  const isRefreshMode = getIsRefreshMode()
  const profileData = getOnboardingData() || {
    fullName: 'User',
    majorCourse: 'General Studies',
    highestEducation: 'Undergraduate',
    graduationYear: new Date().getFullYear(),
    hardSkills: ['Communication', 'Microsoft Office', 'Teamwork'],
    softSkills: ['Adaptability', 'Problem Solving', 'Time Management'],
    careerInterests: 'Open to various opportunities',
    dreamJob: 'Seeking meaningful career opportunities',
    workEnvironment: 'Flexible',
    careerPriorities: ['learning-opportunities', 'career-growth']
  }

  console.log('Final profile data being used:', profileData)

  // Dynamic progress messages that cycle automatically
  const progressMessages = isRefreshMode ? [
    "Exploring fresh career opportunities...",
    "Discovering alternative career paths...",
    "Finding creative applications for your skills...",
    "Generating innovative job recommendations...",
    "Crafting your refreshed career roadmap..."
  ] : [
    "Analyzing your academic background...",
    "Mapping your current skills to industry demands...",
    "Identifying potential career paths...",
    "Generating tailored job recommendations...",
    "Crafting your personalized learning roadmap..."
  ]

  useEffect(() => {
    let messageInterval
    let progressInterval
    
    // Reset API call ref on component mount to allow fresh generation
    hasCalledAPI.current = false
    
    const generateJobListings = async () => {
      // Prevent multiple API calls using ref
      if (hasCalledAPI.current) {
        console.log('API call already made, preventing duplicate call');
        return;
      }
      
      hasCalledAPI.current = true;
      
      try {
        setIsGenerating(true)
        setError(null)
        
        // Start cycling through progress messages
        messageInterval = setInterval(() => {
          setCurrentMessageIndex(prev => (prev + 1) % progressMessages.length)
        }, 2000) // Change message every 2 seconds

        // Simulate initial progress while API loads
        progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 85) {
              return prev // Stop at 85% until API responds
            }
            return prev + 3 // Increase by 3% every 200ms
          })
        }, 200)

        // Make the actual API call to generate job listings
        console.log('Making API call to generate job listings...');
        console.log('🔄 Generation mode:', isRefreshMode ? 'REFRESH' : 'INITIAL');
        const response = await getJobListings(profileData, isRefreshMode)
        console.log('API call successful:', response);
        
        // Store job data in localStorage for persistence
        const jobData = {
          jobListings: response.job_positions,
          userProfile: profileData,
          generationSuccess: response.success,
          totalPositions: response.total_positions,
          timestamp: Date.now() // Add timestamp for cache management
        }
        localStorage.setItem('bktk_job_data', JSON.stringify(jobData))
        console.log('Job data stored in localStorage:', jobData);
        
        // Complete the progress
        setProgress(100)
        
        // Navigate to jobs page with the generated listings
        setTimeout(() => {
          navigate('/jobs', { 
            state: { 
              jobListings: response.job_positions,
              userProfile: profileData,
              generationSuccess: response.success,
              totalPositions: response.total_positions
            } 
          })
        }, 1000)
        
      } catch (error) {
        console.error('Error generating job listings:', error)
        
        // Reset the ref on error so user can retry by refreshing/navigating back
        hasCalledAPI.current = false;
        
        // Provide more specific error messages
        let errorMessage = 'Failed to generate personalized job recommendations. Please try again.';
        
        if (error.message.includes('connect')) {
          errorMessage = 'Unable to connect to server. Please make sure the backend is running.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please check your connection and try again.';
        } else if (error.message.includes('Server error')) {
          errorMessage = 'Server encountered an error. Please try again in a moment.';
        }
        
        setError(errorMessage)
        setProgress(0)
        
        // Show error for 3 seconds then navigate back
        setTimeout(() => {
          navigate(-1) // Go back to previous page
        }, 3000)
      } finally {
        setIsGenerating(false)
        if (messageInterval) clearInterval(messageInterval)
        if (progressInterval) clearInterval(progressInterval)
      }
    }

    // Start the job generation process
    generateJobListings()

    // Cleanup function
    return () => {
      if (messageInterval) clearInterval(messageInterval)
      if (progressInterval) clearInterval(progressInterval)
    }
  }, []) // Empty dependency array since we're not using any props or state

  return (
    <Box
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: '#e6f2fa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background animated elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: `
            radial-gradient(circle at 20% 20%, #2980b9 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, #e67e22 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, #2980b9 0%, transparent 50%)
          `,
          animation: 'pulse 4s ease-in-out infinite'
        }}
      />

      {/* Main Content Container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 1
        }}
      >
        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4,
              maxWidth: 600,
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              color: '#d32f2f',
              '& .MuiAlert-icon': {
                color: '#d32f2f'
              }
            }}
          >
            {error}
          </Alert>
        )}

        {/* Central Animated Graphic */}
        <Box
          sx={{
            position: 'relative',
            mb: 6,
            opacity: error ? 0.5 : 1,
            transition: 'opacity 0.3s ease'
          }}
        >
          {/* Outer rotating circle */}
          <CircularProgress
            variant="determinate"
            value={progress}
            size={120}
            thickness={3}
            sx={{
              color: '#e67e22',
              position: 'absolute',
              top: 0,
              left: 0,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round'
              }
            }}
          />
          
          {/* Inner pulsing circle */}
          <CircularProgress
            variant="indeterminate"
            size={80}
            thickness={4}
            sx={{
              color: '#2980b9',
              position: 'absolute',
              top: 20,
              left: 20,
              animation: 'spin 2s linear infinite'
            }}
          />

          {/* Central AI brain/network icon */}
          <Box
            sx={{
              width: 120,
              height: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            {/* Interconnected nodes pattern */}
            <Box
              sx={{
                width: 60,
                height: 60,
                position: 'relative',
                '&::before, &::after': {
                  content: '""',
                  position: 'absolute',
                  width: 8,
                  height: 8,
                  backgroundColor: '#2980b9',
                  borderRadius: '50%',
                  animation: 'pulse 2s ease-in-out infinite'
                },
                '&::before': {
                  top: 0,
                  left: 0,
                  animationDelay: '0s'
                },
                '&::after': {
                  bottom: 0,
                  right: 0,
                  animationDelay: '1s'
                }
              }}
            >
              {/* Additional nodes */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 12,
                  height: 12,
                  backgroundColor: '#e67e22',
                  borderRadius: '50%',
                  animation: 'pulse 2s ease-in-out infinite',
                  animationDelay: '0.5s'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 6,
                  height: 6,
                  backgroundColor: '#27ae60',
                  borderRadius: '50%',
                  animation: 'pulse 2s ease-in-out infinite',
                  animationDelay: '1.5s'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 6,
                  height: 6,
                  backgroundColor: '#27ae60',
                  borderRadius: '50%',
                  animation: 'pulse 2s ease-in-out infinite',
                  animationDelay: '0.75s'
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Primary Message */}
        <Typography
          variant="h3"
          component="h1"
          sx={{
            color: error ? '#d32f2f' : '#2c3e50',
            fontWeight: 700,
            mb: 4,
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            lineHeight: 1.2,
            transition: 'color 0.3s ease'
          }}
        >
          {error 
            ? 'Oops! Something went wrong...' 
            : isGenerating 
              ? isRefreshMode
                ? `Discovering fresh opportunities for you, ${profileData.fullName}...`
                : `Crafting your personalized career path, ${profileData.fullName}...`
              : isRefreshMode
                ? 'Discovering fresh opportunities for you...'
                : 'Crafting your personalized career path...'
          }
        </Typography>

        {/* Dynamic Progress Messages */}
        <Box
          sx={{
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4
          }}
        >
          {!error && (
            <Fade in={true} timeout={500} key={currentMessageIndex}>
              <Typography
                variant="h6"
                component="p"
                sx={{
                  color: '#7f8c8d',
                  fontWeight: 400,
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  textAlign: 'center',
                  maxWidth: 600,
                  px: 2
                }}
              >
                {progressMessages[currentMessageIndex]}
              </Typography>
            </Fade>
          )}
          {error && (
            <Typography
              variant="body1"
              component="p"
              sx={{
                color: '#7f8c8d',
                fontWeight: 400,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                textAlign: 'center',
                maxWidth: 600,
                px: 2
              }}
            >
              Redirecting you back in a moment...
            </Typography>
          )}
        </Box>

        {/* Progress Indicator */}
        {!error && (
          <Box
            sx={{
              width: { xs: 280, sm: 350 },
              textAlign: 'center'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#2980b9',
                fontWeight: 600,
                mb: 1,
                fontSize: '0.875rem'
              }}
            >
              {Math.round(progress)}% Complete
            </Typography>
            
            <Box
              sx={{
                width: '100%',
                height: 6,
                backgroundColor: '#ecf0f1',
                borderRadius: 3,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #2980b9 0%, #e67e22 100%)',
                  transition: 'width 0.3s ease-in-out',
                  borderRadius: 3
                }}
              />
            </Box>
          </Box>
        )}
      </Box>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Box>
  )
}

export default AILoadingScreen
