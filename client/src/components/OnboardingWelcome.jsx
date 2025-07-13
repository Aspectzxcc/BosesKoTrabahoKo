import { useState, useEffect } from 'react';
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
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { validateCourse } from '../services/api';

const OnboardingWelcome = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    majorCourse: '',
    highestEducation: '',
    graduationYear: ''
  });

  const [errors, setErrors] = useState({});
  const [courseValidation, setCourseValidation] = useState(null);
  const [isValidatingCourse, setIsValidatingCourse] = useState(false);
  const [courseValidationTimeout, setCourseValidationTimeout] = useState(null);

  // Clear any existing onboarding data when component mounts
  useEffect(() => {
    localStorage.removeItem('bktk_onboarding_data');
    localStorage.removeItem('bktk_job_data');
    localStorage.removeItem('bktk_converted_jobs');
    console.log('Cleared existing onboarding and job data for fresh start');
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (courseValidationTimeout) {
        clearTimeout(courseValidationTimeout);
      }
    };
  }, [courseValidationTimeout]);

  // Course validation function
  const validateCourseAsync = async (courseMajor) => {
    if (!courseMajor.trim() || courseMajor.length < 3) {
      setCourseValidation(null);
      return;
    }

    setIsValidatingCourse(true);
    try {
      const result = await validateCourse(courseMajor);
      setCourseValidation(result);
      console.log('Course validation result:', result);
    } catch (error) {
      console.error('Course validation failed:', error);
      setCourseValidation({
        error: 'Failed to validate course. Please check your input.'
      });
    } finally {
      setIsValidatingCourse(false);
    }
  };

  // Debounced course validation
  const debouncedCourseValidation = (courseMajor) => {
    // Clear existing timeout
    if (courseValidationTimeout) {
      clearTimeout(courseValidationTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      validateCourseAsync(courseMajor);
    }, 1000); // 1 second delay

    setCourseValidationTimeout(timeout);
  };

  const educationLevels = [
    'High School',
    'Vocational/Technical Certificate',
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

    // Clear major/course field if education level doesn't require it
    if (field === 'highestEducation') {
      const requiresMajor = ['Bachelor\'s Degree', 'Master\'s Degree', 'Doctoral Degree'].includes(value);
      if (!requiresMajor) {
        setFormData(prev => ({
          ...prev,
          majorCourse: ''
        }));
        // Clear any major/course errors and validation
        setErrors(prev => ({
          ...prev,
          majorCourse: ''
        }));
        setCourseValidation(null);
      }
    }

    // Trigger course validation for major/course field
    if (field === 'majorCourse') {
      setCourseValidation(null); // Clear previous validation
      if (value.trim()) {
        debouncedCourseValidation(value);
      }
    }
  };

  // Helper function to determine if major field should be shown
  const shouldShowMajorField = () => {
    return ['Bachelor\'s Degree', 'Master\'s Degree', 'Doctoral Degree'].includes(formData.highestEducation);
  };

  // Helper function to determine if form can be submitted
  const canSubmitForm = () => {
    const requiresMajor = shouldShowMajorField();
    
    // Basic required fields check
    if (!formData.fullName.trim() || !formData.highestEducation || !formData.graduationYear) {
      return false;
    }
    
    // If major is required, check course validation
    if (requiresMajor) {
      if (!formData.majorCourse.trim()) {
        return false;
      }
      
      // If course validation is in progress
      if (isValidatingCourse) {
        return false;
      }
      
      // If course validation failed or course is invalid
      if (courseValidation && !courseValidation.error && !courseValidation.isValid) {
        return false;
      }
      
      // If there was an error during validation
      if (courseValidation?.error) {
        return false;
      }
      
      // If no validation has been performed yet for a non-empty course
      if (!courseValidation && formData.majorCourse.trim().length >= 3) {
        return false;
      }
    }
    
    return true;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    // Only require major/course for Bachelor's degree and higher
    const requiresMajor = ['Bachelor\'s Degree', 'Master\'s Degree', 'Doctoral Degree'].includes(formData.highestEducation);
    if (requiresMajor && !formData.majorCourse.trim()) {
      newErrors.majorCourse = 'Major/Course is required';
    }
    
    // Check if course validation is required and if it's valid
    if (requiresMajor && formData.majorCourse.trim()) {
      // If course validation is still loading, prevent submission
      if (isValidatingCourse) {
        newErrors.majorCourse = 'Please wait while we validate your course';
      }
      // If course validation failed or course is invalid
      else if (courseValidation && !courseValidation.error && !courseValidation.isValid) {
        newErrors.majorCourse = 'Please enter a valid, recognized academic program';
      }
      // If there was an error during validation, require re-validation
      else if (courseValidation?.error) {
        newErrors.majorCourse = 'Course validation failed. Please try again or check your internet connection';
      }
      // If no validation has been performed yet for a non-empty course
      else if (!courseValidation && formData.majorCourse.trim().length >= 3) {
        newErrors.majorCourse = 'Please wait for course validation to complete';
      }
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
      localStorage.setItem('bktk_onboarding_data', JSON.stringify({
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
        background: 'linear-gradient(135deg, #e6f2fa 0%, #f8fcff 50%, #ffffff 100%)',
        display: 'flex',
        alignItems: 'center',
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
      <Container maxWidth={false} sx={{ maxWidth: '1400px', mx: 'auto', position: 'relative', zIndex: 1 }}>
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
              Step 1 of 4
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#2980b9',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}
            >
              25% Complete
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
                width: '25%',
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

        {/* Main Form Container */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 8 },
            borderRadius: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(41, 128, 185, 0.15), 0 8px 32px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(236, 240, 241, 0.8)',
            maxWidth: '680px',
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
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2980b9 0%, #3498db 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3,
                fontSize: { xs: '2.2rem', md: '3rem' },
                lineHeight: 1.2,
                textShadow: '0 2px 4px rgba(41, 128, 185, 0.1)'
              }}
            >
              Welcome to Boses Ko Trabaho Ko!
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#2c3e50',
                fontWeight: 400,
                lineHeight: 1.6,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                maxWidth: '480px',
                mx: 'auto',
                opacity: 0.9
              }}
            >
              Let's start by getting to know you. Tell us about your academic journey.
            </Typography>
          </Box>

          {/* Form Fields - Single Column Layout */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
                  backgroundColor: 'rgba(236, 240, 241, 0.5)',
                  borderRadius: '16px',
                  height: '64px',
                  fontSize: '1.1rem',
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
                  fontSize: '1.1rem',
                  '&.Mui-focused': {
                    color: '#2980b9'
                  }
                }
              }}
            />

            <FormControl 
              fullWidth 
              error={!!errors.highestEducation}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(236, 240, 241, 0.5)',
                  borderRadius: '16px',
                  height: '64px',
                  fontSize: '1.1rem',
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
                  fontSize: '1.1rem',
                  '&.Mui-focused': {
                    color: '#2980b9'
                  }
                }
              }}
            >
              <InputLabel 
                sx={{ 
                  color: '#2c3e50',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  '&.Mui-focused': {
                    color: '#2980b9'
                  }
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

            {/* Conditionally render Major/Course field */}
            {shouldShowMajorField() && (
              <Box>
                <TextField
                  fullWidth
                  label="Major/Course"
                  placeholder="e.g., Computer Science, Business Administration"
                  value={formData.majorCourse}
                  onChange={(e) => handleInputChange('majorCourse', e.target.value)}
                  error={!!errors.majorCourse}
                  helperText={errors.majorCourse}
                  InputProps={{
                    endAdornment: isValidatingCourse && (
                      <CircularProgress size={20} sx={{ color: '#2980b9' }} />
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(236, 240, 241, 0.5)',
                      borderRadius: '16px',
                      height: '64px',
                      fontSize: '1.1rem',
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
                      fontSize: '1.1rem',
                      '&.Mui-focused': {
                        color: '#2980b9'
                      }
                    }
                  }}
                />

                {/* Course Validation Results */}
                {courseValidation && !courseValidation.error && (
                  <Box sx={{ mt: 3 }}>
                    {courseValidation.isValid ? (
                      <Alert 
                        severity="success" 
                        sx={{ 
                          borderRadius: '16px',
                          backgroundColor: 'rgba(39, 174, 96, 0.1)',
                          border: '2px solid rgba(39, 174, 96, 0.3)',
                          '& .MuiAlert-icon': {
                            fontSize: '1.5rem'
                          },
                          '& .MuiAlert-message': {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            fontSize: '1rem'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ✅ Valid Course
                          </Typography>
                          <Chip 
                            label={`${courseValidation.confidence} confidence`}
                            size="small"
                            sx={{
                              backgroundColor: courseValidation.confidence === 'high' ? '#e8f5e8' : 
                                               courseValidation.confidence === 'medium' ? '#fff3e0' : '#f3e5f5',
                              color: courseValidation.confidence === 'high' ? '#2e7d32' : 
                                     courseValidation.confidence === 'medium' ? '#ef6c00' : '#7b1fa2',
                              border: `1px solid ${courseValidation.confidence === 'high' ? '#4caf50' : 
                                                  courseValidation.confidence === 'medium' ? '#ff9800' : '#9c27b0'}`,
                              fontWeight: 600
                            }}
                          />
                        </Box>
                        {courseValidation.normalizedName && courseValidation.normalizedName !== formData.majorCourse && (
                          <Typography variant="caption" sx={{ color: '#2c3e50' }}>
                            Recognized as: {courseValidation.normalizedName}
                          </Typography>
                        )}
                      </Alert>
                    ) : (
                      <Alert 
                        severity="warning"
                        sx={{ 
                          borderRadius: '16px',
                          backgroundColor: 'rgba(243, 156, 18, 0.1)',
                          border: '2px solid rgba(243, 156, 18, 0.3)',
                          '& .MuiAlert-icon': {
                            fontSize: '1.5rem'
                          },
                          '& .MuiAlert-message': {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            fontSize: '1rem'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ⚠️ Course Not Recognized
                          </Typography>
                          <Chip 
                            label={`${courseValidation.confidence} confidence`}
                            size="small"
                            sx={{
                              backgroundColor: courseValidation.confidence === 'high' ? '#ffebee' : 
                                               courseValidation.confidence === 'medium' ? '#fff3e0' : '#f3e5f5',
                              color: courseValidation.confidence === 'high' ? '#c62828' : 
                                     courseValidation.confidence === 'medium' ? '#ef6c00' : '#7b1fa2',
                              border: `1px solid ${courseValidation.confidence === 'high' ? '#f44336' : 
                                                  courseValidation.confidence === 'medium' ? '#ff9800' : '#9c27b0'}`,
                              fontWeight: 600
                            }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#2c3e50' }}>
                          {courseValidation.reasoning || 'This may not be a standard academic program. Please double-check the spelling or consider selecting a similar recognized course.'}
                        </Typography>
                      </Alert>
                    )}
                  </Box>
                )}

                {/* Course Validation Error */}
                {courseValidation?.error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mt: 3, 
                      borderRadius: '16px',
                      backgroundColor: 'rgba(231, 76, 60, 0.1)',
                      border: '2px solid rgba(231, 76, 60, 0.3)',
                      '& .MuiAlert-icon': {
                        fontSize: '1.5rem'
                      },
                      fontSize: '1rem'
                    }}
                  >
                    {courseValidation.error}
                  </Alert>
                )}
              </Box>
            )}

            <FormControl 
              fullWidth 
              error={!!errors.graduationYear}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(236, 240, 241, 0.5)',
                  borderRadius: '16px',
                  height: '64px',
                  fontSize: '1.1rem',
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
                  fontSize: '1.1rem',
                  '&.Mui-focused': {
                    color: '#2980b9'
                  }
                }
              }}
            >
              <InputLabel 
                sx={{ 
                  color: '#2c3e50',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  '&.Mui-focused': {
                    color: '#2980b9'
                  }
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
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleNext}
                disabled={!canSubmitForm()}
                sx={{
                  background: canSubmitForm() 
                    ? 'linear-gradient(135deg, #2980b9 0%, #3498db 100%)' 
                    : 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                  px: 10,
                  py: 3.5,
                  borderRadius: '16px',
                  textTransform: 'none',
                  boxShadow: canSubmitForm() 
                    ? '0 8px 32px rgba(41, 128, 185, 0.4), 0 4px 16px rgba(0, 0, 0, 0.1)' 
                    : '0 4px 16px rgba(149, 165, 166, 0.3)',
                  border: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': canSubmitForm() ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    transition: 'left 0.5s ease'
                  } : {},
                  '&:hover': canSubmitForm() ? {
                    background: 'linear-gradient(135deg, #1f6396 0%, #2980b9 100%)',
                    boxShadow: '0 12px 40px rgba(41, 128, 185, 0.5), 0 6px 20px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-3px) scale(1.02)',
                    '&::before': {
                      left: '100%'
                    }
                  } : {},
                  '&.Mui-disabled': {
                    background: 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    opacity: 0.8
                  },
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {isValidatingCourse ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: '#ffffff' }} />
                    Validating Course...
                  </Box>
                ) : (
                  'Next'
                )}
              </Button>
              
              {/* Helper text for disabled state */}
              {!canSubmitForm() && !isValidatingCourse && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    display: 'block', 
                    mt: 3, 
                    color: '#7f8c8d',
                    fontStyle: 'italic',
                    fontSize: '0.95rem',
                    backgroundColor: 'rgba(127, 140, 141, 0.1)',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    border: '1px solid rgba(127, 140, 141, 0.2)',
                    maxWidth: '400px',
                    mx: 'auto'
                  }}
                >
                  {(() => {
                    const requiresMajor = shouldShowMajorField();
                    if (!formData.fullName.trim()) return 'Please enter your full name';
                    if (!formData.highestEducation) return 'Please select your education level';
                    if (requiresMajor && !formData.majorCourse.trim()) return 'Please enter your major/course';
                    if (requiresMajor && courseValidation && !courseValidation.isValid) return 'Please enter a valid academic program';
                    if (requiresMajor && courseValidation?.error) return 'Course validation failed - please try again';
                    if (requiresMajor && !courseValidation && formData.majorCourse.trim().length >= 3) return 'Waiting for course validation...';
                    if (!formData.graduationYear) return 'Please select your graduation year';
                    return 'Please complete all required fields';
                  })()}
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default OnboardingWelcome;
