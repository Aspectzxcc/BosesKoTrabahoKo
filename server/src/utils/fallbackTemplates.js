// Fallback template generator for when AI service fails
function generateFallbackPositions(userProfile) {
    const welcome = userProfile.welcome || {};
    const skills = userProfile.skills || {};
    const careerGoals = userProfile.careerGoals || {};
    
    // Extract user preferences for personalization
    const userMajor = welcome.majorCourse || '';
    const userSkills = skills.selectedHardSkills || [];
    const userSoftSkills = skills.selectedSoftSkills || [];
    const dreamJob = careerGoals.dreamJob || userProfile.dreamJob || '';
    const workEnvironment = careerGoals.workEnvironment || userProfile.workEnvironment || 'Flexible';
    const careerInterests = userProfile.careerInterests || '';
    
    // Define fallback position templates based on common entry-level roles
    const positionTemplates = [
        {
            id: 'admin_assistant',
            title: 'Administrative Assistant',
            industry: 'Business Administration',
            baseSkills: ['Microsoft Office', 'Communication', 'Organization'],
            description: 'Support daily office operations and administrative tasks',
            responsibilities: [
                'Manage office correspondence and communications',
                'Organize and maintain filing systems',
                'Assist with scheduling and calendar management',
                'Support team with administrative tasks'
            ]
        },
        {
            id: 'customer_service',
            title: 'Customer Service Representative',
            industry: 'Customer Support',
            baseSkills: ['Communication', 'Problem Solving', 'Empathy'],
            description: 'Provide excellent customer support and resolve inquiries',
            responsibilities: [
                'Handle customer inquiries via phone, email, or chat',
                'Resolve customer complaints and issues',
                'Process orders and maintain customer records',
                'Collaborate with team to improve service quality'
            ]
        },
        {
            id: 'marketing_assistant',
            title: 'Marketing Assistant',
            industry: 'Marketing & Advertising',
            baseSkills: ['Social Media', 'Content Writing', 'Creativity'],
            description: 'Support marketing campaigns and brand promotion activities',
            responsibilities: [
                'Assist in creating marketing materials and content',
                'Manage social media accounts and engagement',
                'Support event planning and coordination',
                'Conduct market research and data analysis'
            ]
        },
        {
            id: 'data_entry',
            title: 'Data Entry Specialist',
            industry: 'Information Management',
            baseSkills: ['Attention to Detail', 'Computer Skills', 'Accuracy'],
            description: 'Manage and maintain accurate data records and databases',
            responsibilities: [
                'Input and update data in various systems',
                'Verify data accuracy and completeness',
                'Generate reports and summaries',
                'Maintain confidentiality of sensitive information'
            ]
        },
        {
            id: 'sales_associate',
            title: 'Sales Associate',
            industry: 'Sales & Retail',
            baseSkills: ['Communication', 'Persuasion', 'Customer Service'],
            description: 'Assist customers and drive sales in retail or business environment',
            responsibilities: [
                'Engage with customers to understand their needs',
                'Present products and services effectively',
                'Process sales transactions and maintain records',
                'Follow up with customers for satisfaction and retention'
            ]
        },
        {
            id: 'content_creator',
            title: 'Content Creator Assistant',
            industry: 'Digital Media',
            baseSkills: ['Writing', 'Creativity', 'Social Media'],
            description: 'Create and manage digital content across various platforms',
            responsibilities: [
                'Develop engaging content for social media platforms',
                'Assist with content planning and scheduling',
                'Monitor engagement and analyze performance',
                'Collaborate with team on creative campaigns'
            ]
        }
    ];

    // Smart position selection based on user profile
    let selectedTemplates = [];
    
    // If user has specific major/course, try to match relevant positions
    if (userMajor.toLowerCase().includes('business') || userMajor.toLowerCase().includes('management')) {
        selectedTemplates.push(positionTemplates.find(t => t.id === 'admin_assistant'));
        selectedTemplates.push(positionTemplates.find(t => t.id === 'marketing_assistant'));
        selectedTemplates.push(positionTemplates.find(t => t.id === 'sales_associate'));
    } else if (userMajor.toLowerCase().includes('marketing') || userMajor.toLowerCase().includes('communication')) {
        selectedTemplates.push(positionTemplates.find(t => t.id === 'marketing_assistant'));
        selectedTemplates.push(positionTemplates.find(t => t.id === 'content_creator'));
        selectedTemplates.push(positionTemplates.find(t => t.id === 'customer_service'));
    } else if (userMajor.toLowerCase().includes('computer') || userMajor.toLowerCase().includes('it')) {
        selectedTemplates.push(positionTemplates.find(t => t.id === 'data_entry'));
        selectedTemplates.push(positionTemplates.find(t => t.id === 'admin_assistant'));
        selectedTemplates.push(positionTemplates.find(t => t.id === 'content_creator'));
    } else if (userMajor.toLowerCase().includes('media') || userMajor.toLowerCase().includes('journalism')) {
        selectedTemplates.push(positionTemplates.find(t => t.id === 'content_creator'));
        selectedTemplates.push(positionTemplates.find(t => t.id === 'marketing_assistant'));
        selectedTemplates.push(positionTemplates.find(t => t.id === 'customer_service'));
    }
    
    // If no major-specific matches or need more positions, add based on interests/skills
    if (selectedTemplates.length < 2) {
        if (careerInterests.toLowerCase().includes('marketing') || dreamJob.toLowerCase().includes('marketing')) {
            selectedTemplates.push(positionTemplates.find(t => t.id === 'marketing_assistant'));
        }
        if (careerInterests.toLowerCase().includes('sales') || dreamJob.toLowerCase().includes('sales')) {
            selectedTemplates.push(positionTemplates.find(t => t.id === 'sales_associate'));
        }
        if (careerInterests.toLowerCase().includes('content') || dreamJob.toLowerCase().includes('content')) {
            selectedTemplates.push(positionTemplates.find(t => t.id === 'content_creator'));
        }
        if (userSkills.some(skill => skill.toLowerCase().includes('customer') || skill.toLowerCase().includes('service'))) {
            selectedTemplates.push(positionTemplates.find(t => t.id === 'customer_service'));
        }
    }
    
    // Ensure we have at least 2-3 positions, fill with most general ones
    while (selectedTemplates.length < 3) {
        const remaining = positionTemplates.filter(t => !selectedTemplates.includes(t));
        if (remaining.length > 0) {
            selectedTemplates.push(remaining[0]);
        } else {
            break;
        }
    }
    
    // Remove any null/undefined entries and limit to 4 positions max
    selectedTemplates = selectedTemplates.filter(t => t).slice(0, 4);
    
    // Generate final positions from templates
    return selectedTemplates.map((template, index) => {
        // Calculate match score based on user alignment
        let matchScore = 75; // Base score
        
        // Boost score if skills align
        const skillAlignment = template.baseSkills.filter(skill => 
            userSkills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase())) ||
            userSoftSkills.some(userSkill => userSkill.toLowerCase().includes(skill.toLowerCase()))
        ).length;
        matchScore += skillAlignment * 5;
        
        // Boost score if major aligns with industry
        if (userMajor && template.industry.toLowerCase().includes(userMajor.toLowerCase().split(' ')[0])) {
            matchScore += 10;
        }
        
        // Boost score if career interests align
        if (careerInterests && template.industry.toLowerCase().includes(careerInterests.toLowerCase().split(',')[0])) {
            matchScore += 8;
        }
        
        // Cap at 95
        matchScore = Math.min(matchScore, 95);
        
        return {
            position_id: `fallback_${template.id}_${Date.now()}_${index}`,
            position_title: template.title,
            experience_level: 'Entry-Level',
            match_score: matchScore,
            position_summary: `${template.description} - Great starting position for ${userMajor || 'fresh graduates'}`,
            role_description: `An excellent opportunity to begin your career in ${template.industry.toLowerCase()}. This position offers a supportive team environment and structured learning opportunities that align with your background and interests.`,
            key_responsibilities: template.responsibilities,
            required_qualifications: [
                welcome.highestEducation || 'Bachelor\'s degree or equivalent',
                'Strong communication skills',
                'Basic computer literacy',
                'Willingness to learn and grow'
            ],
            required_skills: [
                ...template.baseSkills,
                ...(userSkills.length > 0 ? userSkills.slice(0, 2) : ['Teamwork', 'Time Management'])
            ],
            skill_development_opportunities: [
                'Professional communication',
                'Industry-specific knowledge',
                'Project management',
                'Leadership skills',
                'Technical skills advancement'
            ],
            career_growth_path: `Opportunity to advance to specialist or supervisory roles within 2-3 years. Potential career progression includes Senior ${template.title}, Team Lead, or Department Supervisor positions.`,
            work_environment_fit: `Suitable for ${workEnvironment.toLowerCase()} work arrangements. This position offers flexibility and professional growth opportunities.`,
            career_priorities_alignment: 'Provides excellent learning opportunities, career growth potential, and work-life balance. Aligns with professional development goals.',
            industry_sector: template.industry,
            typical_salary_range: 'PHP 18,000 - 25,000 / month'
        };
    });
}

module.exports = {
    generateFallbackPositions
};
