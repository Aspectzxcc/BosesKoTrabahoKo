import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  CircularProgress,
  Fade
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

const AILoadingScreen = () => {
  const navigate = useNavigate()
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  // Dynamic progress messages that cycle automatically
  const progressMessages = [
    "Analyzing your academic background...",
    "Mapping your current skills to industry demands...",
    "Identifying potential career paths...",
    "Generating tailored job recommendations...",
    "Crafting your personalized learning roadmap..."
  ]

  useEffect(() => {
    // Cycle through progress messages
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % progressMessages.length)
    }, 2000) // Change message every 2 seconds

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Navigate to dashboard when complete
          setTimeout(() => {
            navigate('/dashboard')
          }, 1000)
          return 100
        }
        return prev + 2 // Increase by 2% every 100ms
      })
    }, 100)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [navigate, progressMessages.length])

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
        {/* Central Animated Graphic */}
        <Box
          sx={{
            position: 'relative',
            mb: 6
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
            color: '#2c3e50',
            fontWeight: 700,
            mb: 4,
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
            lineHeight: 1.2
          }}
        >
          Crafting your personalized career path...
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
        </Box>

        {/* Progress Indicator */}
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
