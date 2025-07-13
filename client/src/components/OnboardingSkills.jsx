import React, { useState } from 'react'
import {
  Box,
  Typography,
  Container,
  Paper,
  Chip,
  TextField,
  Button,
  Grid,
  LinearProgress
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

const OnboardingSkills = () => {
  const navigate = useNavigate()
  const [selectedHardSkills, setSelectedHardSkills] = useState([])
  const [selectedSoftSkills, setSelectedSoftSkills] = useState([])
  const [careerInterests, setCareerInterests] = useState('')
  const [customSkill, setCustomSkill] = useState('')
  const [customSoftSkill, setCustomSoftSkill] = useState('')

  // Pre-defined hard skills matching the image
  const hardSkills = [
    'Microsoft Office', 'Google Workspace', 'Social Media Management', 'Content Writing',
    'Data Entry', 'Customer Service', 'Basic Accounting', 'Project Management',
    'Graphic Design', 'Video Editing', 'Web Development', 'Digital Marketing',
    'Photography', 'Public Speaking', 'Research', 'Translation'
  ]

  // Pre-defined soft skills matching the image
  const softSkills = [
    'Communication', 'Teamwork', 'Leadership', 'Problem Solving',
    'Time Management', 'Adaptability', 'Critical Thinking', 'Creativity',
    'Organization', 'Attention to Detail', 'Multitasking', 'Initiative',
    'Empathy', 'Negotiation', 'Conflict Resolution', 'Mentoring'
  ]

  const handleHardSkillToggle = (skill) => {
    setSelectedHardSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const handleSoftSkillToggle = (skill) => {
    setSelectedSoftSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const handleAddCustomSkill = () => {
    if (customSkill.trim() && !selectedHardSkills.includes(customSkill.trim())) {
      setSelectedHardSkills(prev => [...prev, customSkill.trim()])
      setCustomSkill('')
    }
  }

  const handleAddCustomSoftSkill = () => {
    if (customSoftSkill.trim() && !selectedSoftSkills.includes(customSoftSkill.trim())) {
      setSelectedSoftSkills(prev => [...prev, customSoftSkill.trim()])
      setCustomSoftSkill('')
    }
  }

  const handleNext = () => {
    // Get existing onboarding data from localStorage
    const existingData = JSON.parse(localStorage.getItem('bktk_onboarding_data') || '{}')
    
    // Create skills data object
    const skillsData = {
      selectedHardSkills,
      selectedSoftSkills,
      careerInterests
    }
    
    // Update localStorage with skills data
    const updatedData = {
      ...existingData,
      skills: skillsData
    }
    
    localStorage.setItem('bktk_onboarding_data', JSON.stringify(updatedData))
    
    // Log for debugging
    console.log('Skills Data saved:', skillsData)
    console.log('Complete Onboarding Data:', updatedData)
    
    navigate('/onboarding/career-goals')
  }

  const SkillChip = ({ skill, isSelected, onClick }) => (
    <Chip
      label={skill}
      onClick={onClick}
      variant={isSelected ? 'filled' : 'outlined'}
      sx={{
        margin: 0,
        padding: '8px 16px',
        height: '44px',
        borderRadius: '22px',
        fontSize: '0.9rem',
        fontWeight: 600,
        cursor: 'pointer',
        border: isSelected ? 'none' : '2px solid rgba(127, 140, 141, 0.3)',
        backgroundColor: isSelected 
          ? 'linear-gradient(135deg, #2980b9 0%, #3498db 100%)' 
          : 'rgba(255, 255, 255, 0.8)',
        color: isSelected ? '#ffffff' : '#2c3e50',
        backdropFilter: 'blur(10px)',
        boxShadow: isSelected 
          ? '0 6px 20px rgba(41, 128, 185, 0.3), 0 3px 10px rgba(0, 0, 0, 0.1)' 
          : '0 3px 10px rgba(0, 0, 0, 0.05)',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
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
          backgroundColor: isSelected 
            ? 'linear-gradient(135deg, #1f6396 0%, #2980b9 100%)' 
            : 'rgba(236, 240, 241, 0.9)',
          borderColor: isSelected ? 'transparent' : '#2980b9',
          transform: 'translateY(-2px) scale(1.03)',
          boxShadow: isSelected 
            ? '0 10px 28px rgba(41, 128, 185, 0.4), 0 5px 14px rgba(0, 0, 0, 0.15)' 
            : '0 6px 20px rgba(41, 128, 185, 0.2), 0 3px 10px rgba(0, 0, 0, 0.1)'
        },
        '&:active': {
          transform: 'translateY(0) scale(1.01)'
        },
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    />
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
              Step 2 of 4
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#2980b9',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}
            >
              50% Complete
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
                width: '50%',
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
            What are your current skills and interests?
          </Typography>

          {/* Hard Skills Section */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                color: '#2c3e50',
                fontWeight: 700,
                mb: 4,
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
              What technical or specific skills do you have?
            </Typography>
            
            <Box 
              sx={{ 
                mb: 4,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
              }}
            >
              {/* Pre-defined hard skills */}
              {hardSkills.map((skill) => (
                <SkillChip
                  key={skill}
                  skill={skill}
                  isSelected={selectedHardSkills.includes(skill)}
                  onClick={() => handleHardSkillToggle(skill)}
                />
              ))}
              
              {/* Custom hard skills */}
              {selectedHardSkills
                .filter(skill => !hardSkills.includes(skill))
                .map((skill) => (
                  <SkillChip
                    key={skill}
                    skill={skill}
                    isSelected={true}
                    onClick={() => handleHardSkillToggle(skill)}
                  />
                ))}
            </Box>

            {/* Custom Skill Input */}
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 2, 
                alignItems: 'stretch', 
                mt: 4,
                p: 3,
                backgroundColor: 'rgba(41, 128, 185, 0.08)',
                borderRadius: '16px',
                border: '1px solid rgba(41, 128, 185, 0.2)'
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add a custom skill..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSkill()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    height: '56px',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    '& fieldset': {
                      borderColor: 'rgba(41, 128, 185, 0.3)',
                      borderWidth: 2
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(41, 128, 185, 0.1)'
                    },
                    '&:hover fieldset': {
                      borderColor: '#2980b9'
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(41, 128, 185, 0.2)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2980b9'
                    }
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddCustomSkill}
                disabled={!customSkill.trim()}
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  py: 2,
                  minWidth: '100px',
                  height: '56px',
                  background: customSkill.trim() 
                    ? 'linear-gradient(135deg, #2980b9 0%, #3498db 100%)' 
                    : 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  boxShadow: customSkill.trim() 
                    ? '0 4px 16px rgba(41, 128, 185, 0.3)' 
                    : '0 2px 8px rgba(149, 165, 166, 0.3)',
                  '&:hover': customSkill.trim() ? {
                    background: 'linear-gradient(135deg, #1f6396 0%, #2980b9 100%)',
                    boxShadow: '0 6px 20px rgba(41, 128, 185, 0.4)',
                    transform: 'translateY(-2px)'
                  } : {},
                  '&.Mui-disabled': {
                    background: 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
                    color: 'rgba(255, 255, 255, 0.7)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Add
              </Button>
            </Box>
          </Box>

          {/* Soft Skills Section */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                color: '#2c3e50',
                fontWeight: 700,
                mb: 4,
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
              Which soft skills do you possess?
            </Typography>
            
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                justifyContent: 'flex-start',
                alignItems: 'flex-start'
              }}
            >
              {/* Pre-defined soft skills */}
              {softSkills.map((skill) => (
                <SkillChip
                  key={skill}
                  skill={skill}
                  isSelected={selectedSoftSkills.includes(skill)}
                  onClick={() => handleSoftSkillToggle(skill)}
                />
              ))}
              
              {/* Custom soft skills */}
              {selectedSoftSkills
                .filter(skill => !softSkills.includes(skill))
                .map((skill) => (
                  <SkillChip
                    key={skill}
                    skill={skill}
                    isSelected={true}
                    onClick={() => handleSoftSkillToggle(skill)}
                  />
                ))}
            </Box>

            {/* Custom Soft Skill Input */}
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 2, 
                alignItems: 'stretch', 
                mt: 4,
                p: 3,
                backgroundColor: 'rgba(39, 174, 96, 0.08)',
                borderRadius: '16px',
                border: '1px solid rgba(39, 174, 96, 0.2)'
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add a custom soft skill..."
                value={customSoftSkill}
                onChange={(e) => setCustomSoftSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSoftSkill()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    height: '56px',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    '& fieldset': {
                      borderColor: 'rgba(39, 174, 96, 0.3)',
                      borderWidth: 2
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(39, 174, 96, 0.1)'
                    },
                    '&:hover fieldset': {
                      borderColor: '#27ae60'
                    },
                    '&.Mui-focused': {
                      backgroundColor: '#ffffff',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(39, 174, 96, 0.2)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#27ae60'
                    }
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddCustomSoftSkill}
                disabled={!customSoftSkill.trim()}
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  py: 2,
                  minWidth: '100px',
                  height: '56px',
                  background: customSoftSkill.trim() 
                    ? 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)' 
                    : 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  boxShadow: customSoftSkill.trim() 
                    ? '0 4px 16px rgba(39, 174, 96, 0.3)' 
                    : '0 2px 8px rgba(149, 165, 166, 0.3)',
                  '&:hover': customSoftSkill.trim() ? {
                    background: 'linear-gradient(135deg, #1e8449 0%, #27ae60 100%)',
                    boxShadow: '0 6px 20px rgba(39, 174, 96, 0.4)',
                    transform: 'translateY(-2px)'
                  } : {},
                  '&.Mui-disabled': {
                    background: 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
                    color: 'rgba(255, 255, 255, 0.7)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Add
              </Button>
            </Box>
          </Box>

          {/* Career Interests Section */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                color: '#2c3e50',
                fontWeight: 700,
                mb: 4,
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
              What areas or industries pique your interest?
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="e.g., Technology, Marketing, Healthcare, Education..."
              value={careerInterests}
              onChange={(e) => setCareerInterests(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(236, 240, 241, 0.5)',
                  borderRadius: '16px',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
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
                },
                '& .MuiInputLabel-root': {
                  color: '#2c3e50',
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }
              }}
            />
          </Box>

          {/* Navigation Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleNext}
              sx={{
                background: 'linear-gradient(135deg, #2980b9 0%, #3498db 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1.2rem',
                px: 10,
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
                  background: 'linear-gradient(135deg, #1f6396 0%, #2980b9 100%)',
                  boxShadow: '0 12px 40px rgba(41, 128, 185, 0.5), 0 6px 20px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-3px) scale(1.02)',
                  '&::before': {
                    left: '100%'
                  }
                },
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Next
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default OnboardingSkills
