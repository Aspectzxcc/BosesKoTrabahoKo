import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  LinearProgress
} from '@mui/material';

const OnboardingWelcome = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    majorCourse: '',
    highestEducation: '',
    graduationYear: ''
  });

  const [errors, setErrors] = useState({});

  const educationLevels = [
    'High School',
    'Vocational/Technical Certificate',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Doctoral Degree'
  ];

  const graduationYears = [
    '2020', '2021', '2022', '2023', '2024', '2025', 
    '2026', '2027', '2028', '2029', '2030'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.majorCourse.trim()) {
      newErrors.majorCourse = 'Major/Course is required';
    }
    
    if (!formData.highestEducation) {
      newErrors.highestEducation = 'Please select your education level';
    }
    
    if (!formData.graduationYear) {
      newErrors.graduationYear = 'Please select your graduation year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      // Store form data in localStorage or state management solution
      localStorage.setItem('onboardingData', JSON.stringify({
        welcome: formData
      }));
      
      // Navigate to skills assessment
      navigate('/onboarding/skills');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        minWidth: '100vw',
        background: 'linear-gradient(135deg, #e6f2fa 0%, #ffffff 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '1400px', mx: 'auto' }}>
        {/* Progress Indicator */}
        <Box sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="#7f8c8d">
              Step 1 of 4
            </Typography>
            <Typography variant="body2" color="#7f8c8d">
              25% Complete
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={25} 
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: '#ecf0f1',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#2980b9',
                borderRadius: 3
              }
            }}
          />
        </Box>

        {/* Main Form Container */}
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            boxShadow: '0 8px 32px rgba(41, 128, 185, 0.1)',
            border: '1px solid #ecf0f1',
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                color: '#2980b9',
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Welcome to Boses Ko Trabaho Ko!
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#7f8c8d',
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              Let's start by getting to know you. Tell us about your academic journey.
            </Typography>
          </Box>

          {/* Form Fields - Single Column Layout */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              error={!!errors.fullName}
              helperText={errors.fullName}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ecf0f1',
                  borderRadius: '12px',
                  height: '60px',
                  '& fieldset': {
                    borderColor: '#7f8c8d',
                    borderWidth: 1
                  },
                  '&:hover fieldset': {
                    borderColor: '#2980b9'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2980b9',
                    borderWidth: 2
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#2c3e50',
                  fontWeight: 500
                }
              }}
            />

            <TextField
              fullWidth
              label="Major/Course"
              placeholder="e.g., Computer Science, Business Administration"
              value={formData.majorCourse}
              onChange={(e) => handleInputChange('majorCourse', e.target.value)}
              error={!!errors.majorCourse}
              helperText={errors.majorCourse}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ecf0f1',
                  borderRadius: '12px',
                  height: '60px',
                  '& fieldset': {
                    borderColor: '#7f8c8d',
                    borderWidth: 1
                  },
                  '&:hover fieldset': {
                    borderColor: '#2980b9'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2980b9',
                    borderWidth: 2
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#2c3e50',
                  fontWeight: 500
                }
              }}
            />

            <FormControl 
              fullWidth 
              error={!!errors.highestEducation}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ecf0f1',
                  borderRadius: '12px',
                  height: '60px',
                  '& fieldset': {
                    borderColor: '#7f8c8d',
                    borderWidth: 1
                  },
                  '&:hover fieldset': {
                    borderColor: '#2980b9'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2980b9',
                    borderWidth: 2
                  }
                }
              }}
            >
              <InputLabel 
                sx={{ 
                  color: '#2c3e50',
                  fontWeight: 500
                }}
              >
                Highest Education
              </InputLabel>
              <Select
                value={formData.highestEducation}
                label="Highest Education"
                onChange={(e) => handleInputChange('highestEducation', e.target.value)}
              >
                {educationLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
              {errors.highestEducation && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                  {errors.highestEducation}
                </Typography>
              )}
            </FormControl>

            <FormControl 
              fullWidth 
              error={!!errors.graduationYear}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ecf0f1',
                  borderRadius: '12px',
                  height: '60px',
                  '& fieldset': {
                    borderColor: '#7f8c8d',
                    borderWidth: 1
                  },
                  '&:hover fieldset': {
                    borderColor: '#2980b9'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2980b9',
                    borderWidth: 2
                  }
                }
              }}
            >
              <InputLabel 
                sx={{ 
                  color: '#2c3e50',
                  fontWeight: 500
                }}
              >
                Graduation Year / Expected
              </InputLabel>
              <Select
                value={formData.graduationYear}
                label="Graduation Year / Expected"
                onChange={(e) => handleInputChange('graduationYear', e.target.value)}
              >
                {graduationYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
              {errors.graduationYear && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                  {errors.graduationYear}
                </Typography>
              )}
            </FormControl>

            {/* Next Button */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleNext}
                sx={{
                  backgroundColor: '#2980b9',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '1.2rem',
                  px: 8,
                  py: 3,
                  borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: '0 4px 16px rgba(41, 128, 185, 0.3)',
                  '&:hover': {
                    backgroundColor: '#1f6396',
                    boxShadow: '0 6px 20px rgba(41, 128, 185, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default OnboardingWelcome;
