import React, { useState } from 'react'
import {
  Box,
  Typography,
  Container,
  Paper,
  Chip,
  TextField,
  Button,
  Grid
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

const OnboardingSkills = () => {
  const navigate = useNavigate()
  const [selectedHardSkills, setSelectedHardSkills] = useState([])
  const [selectedSoftSkills, setSelectedSoftSkills] = useState([])
  const [careerInterests, setCareerInterests] = useState('')
  const [customSkill, setCustomSkill] = useState('')

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

  const handleNext = () => {
    // Get existing onboarding data from localStorage
    const existingData = JSON.parse(localStorage.getItem('onboardingData') || '{}')
    
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
    
    localStorage.setItem('onboardingData', JSON.stringify(updatedData))
    
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
        margin: 0.5,
        padding: '8px 16px',
        height: '40px',
        borderRadius: '20px',
        fontSize: '0.875rem',
        fontWeight: 500,
        cursor: 'pointer',
        border: isSelected ? 'none' : '2px solid #bdc3c7',
        backgroundColor: isSelected ? '#2980b9' : 'white',
        color: isSelected ? 'white' : '#2c3e50',
        '&:hover': {
          backgroundColor: isSelected ? '#1e6091' : '#ecf0f1',
          borderColor: isSelected ? '#1e6091' : '#2980b9'
        },
        transition: 'all 0.2s ease-in-out'
      }}
    />
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
            What are your current skills and interests?
          </Typography>

          {/* Hard Skills Section */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                color: '#2c3e50',
                fontWeight: 600,
                mb: 3,
                fontSize: '1.125rem'
              }}
            >
              What technical or specific skills do you have?
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              {hardSkills.map((skill) => (
                <SkillChip
                  key={skill}
                  skill={skill}
                  isSelected={selectedHardSkills.includes(skill)}
                  onClick={() => handleHardSkillToggle(skill)}
                />
              ))}
            </Box>

            {/* Custom Skill Input */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add a custom skill..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomSkill()}
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
              <Button
                variant="outlined"
                onClick={handleAddCustomSkill}
                disabled={!customSkill.trim()}
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                  minWidth: 'auto',
                  borderColor: '#2980b9',
                  color: '#2980b9',
                  '&:hover': {
                    borderColor: '#1e6091',
                    backgroundColor: 'rgba(41, 128, 185, 0.1)'
                  }
                }}
              >
                Add
              </Button>
            </Box>
          </Box>

          {/* Soft Skills Section */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                color: '#2c3e50',
                fontWeight: 600,
                mb: 3,
                fontSize: '1.125rem'
              }}
            >
              Which soft skills do you possess?
            </Typography>
            
            <Box>
              {softSkills.map((skill) => (
                <SkillChip
                  key={skill}
                  skill={skill}
                  isSelected={selectedSoftSkills.includes(skill)}
                  onClick={() => handleSoftSkillToggle(skill)}
                />
              ))}
            </Box>
          </Box>

          {/* Career Interests Section */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                color: '#2c3e50',
                fontWeight: 600,
                mb: 3,
                fontSize: '1.125rem'
              }}
            >
              What areas or industries pique your interest?
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="e.g., Technology, Marketing, Healthcare, Education..."
              value={careerInterests}
              onChange={(e) => setCareerInterests(e.target.value)}
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

          {/* Navigation Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleNext}
              sx={{
                backgroundColor: '#2980b9',
                color: 'white',
                px: 6,
                py: 1.5,
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(41, 128, 185, 0.3)',
                '&:hover': {
                  backgroundColor: '#1e6091',
                  boxShadow: '0 6px 16px rgba(41, 128, 185, 0.4)'
                }
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
