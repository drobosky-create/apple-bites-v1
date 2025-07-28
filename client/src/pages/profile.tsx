import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  Box, 
  Grid, 
  Alert,
  IconButton,
  Divider
} from '@mui/material';
import { User, Mail, Phone, Building, Briefcase, Save, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import MDBox from "@/components/MD/MDBox";
import MDTypography from "@/components/MD/MDTypography";
import MDButton from "@/components/MD/MDButton";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: (user as any)?.firstName || '',
    lastName: (user as any)?.lastName || '',
    email: (user as any)?.email || '',
    phone: (user as any)?.phone || '',
    company: (user as any)?.company || '',
    jobTitle: (user as any)?.jobTitle || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would typically save to your backend
      // For now, we'll simulate a save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      // Show success message
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      firstName: (user as any)?.firstName || '',
      lastName: (user as any)?.lastName || '',
      email: (user as any)?.email || '',
      phone: (user as any)?.phone || '',
      company: (user as any)?.company || '',
      jobTitle: (user as any)?.jobTitle || ''
    });
    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return (
      <MDBox p={4}>
        <Alert severity="warning">
          Please log in to view your profile.
        </Alert>
      </MDBox>
    );
  }

  return (
    <MDBox p={4}>
      {/* Header */}
      <MDBox display="flex" alignItems="center" mb={4}>
        <Link to="/dashboard">
          <IconButton sx={{ mr: 2 }}>
            <ArrowLeft />
          </IconButton>
        </Link>
        <MDBox>
          <MDTypography variant="h4" fontWeight="bold" color="dark">
            My Profile
          </MDTypography>
          <MDTypography variant="body2" color="text">
            Manage your account information and preferences
          </MDTypography>
        </MDBox>
      </MDBox>

      <Grid container spacing={3}>
        {/* Profile Information Card */}
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ 
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <MDBox display="flex" alignItems="center">
                  <User size={24} style={{ marginRight: '12px', color: '#00BFA6' }} />
                  <MDTypography variant="h5" fontWeight="medium" color="dark">
                    Contact Information
                  </MDTypography>
                </MDBox>
                {!isEditing ? (
                  <MDButton
                    variant="outlined"
                    color="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </MDButton>
                ) : (
                  <MDBox display="flex" gap={2}>
                    <MDButton
                      variant="outlined"
                      onClick={handleCancel}
                    >
                      Cancel
                    </MDButton>
                    <MDButton
                      variant="gradient"
                      color="primary"
                      onClick={handleSave}
                      disabled={isSaving}
                      startIcon={<Save size={16} />}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </MDButton>
                  </MDBox>
                )}
              </MDBox>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* First Name */}
                <Grid item xs={12} sm={6}>
                  <MDBox mb={2}>
                    <MDTypography variant="body2" fontWeight="medium" color="dark" mb={1}>
                      First Name
                    </MDTypography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Enter your first name"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            height: '48px'
                          }
                        }}
                      />
                    ) : (
                      <MDBox 
                        p={1.5} 
                        sx={{ 
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          minHeight: '48px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <MDTypography variant="body1" color="dark">
                          {formData.firstName || 'Not provided'}
                        </MDTypography>
                      </MDBox>
                    )}
                  </MDBox>
                </Grid>

                {/* Last Name */}
                <Grid item xs={12} sm={6}>
                  <MDBox mb={2}>
                    <MDTypography variant="body2" fontWeight="medium" color="dark" mb={1}>
                      Last Name
                    </MDTypography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Enter your last name"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            height: '48px'
                          }
                        }}
                      />
                    ) : (
                      <MDBox 
                        p={1.5} 
                        sx={{ 
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          minHeight: '48px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <MDTypography variant="body1" color="dark">
                          {formData.lastName || 'Not provided'}
                        </MDTypography>
                      </MDBox>
                    )}
                  </MDBox>
                </Grid>

                {/* Email */}
                <Grid item xs={12}>
                  <MDBox mb={2}>
                    <MDBox display="flex" alignItems="center" mb={1}>
                      <Mail size={16} style={{ marginRight: '8px', color: '#00BFA6' }} />
                      <MDTypography variant="body2" fontWeight="medium" color="dark">
                        Email Address
                      </MDTypography>
                    </MDBox>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email address"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            height: '48px'
                          }
                        }}
                      />
                    ) : (
                      <MDBox 
                        p={1.5} 
                        sx={{ 
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          minHeight: '48px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <MDTypography variant="body1" color="dark">
                          {formData.email || 'Not provided'}
                        </MDTypography>
                      </MDBox>
                    )}
                  </MDBox>
                </Grid>

                {/* Phone */}
                <Grid item xs={12} sm={6}>
                  <MDBox mb={2}>
                    <MDBox display="flex" alignItems="center" mb={1}>
                      <Phone size={16} style={{ marginRight: '8px', color: '#00BFA6' }} />
                      <MDTypography variant="body2" fontWeight="medium" color="dark">
                        Phone Number
                      </MDTypography>
                    </MDBox>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            height: '48px'
                          }
                        }}
                      />
                    ) : (
                      <MDBox 
                        p={1.5} 
                        sx={{ 
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          minHeight: '48px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <MDTypography variant="body1" color="dark">
                          {formData.phone || 'Not provided'}
                        </MDTypography>
                      </MDBox>
                    )}
                  </MDBox>
                </Grid>

                {/* Company */}
                <Grid item xs={12} sm={6}>
                  <MDBox mb={2}>
                    <MDBox display="flex" alignItems="center" mb={1}>
                      <Building size={16} style={{ marginRight: '8px', color: '#00BFA6' }} />
                      <MDTypography variant="body2" fontWeight="medium" color="dark">
                        Company
                      </MDTypography>
                    </MDBox>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Enter your company name"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            height: '48px'
                          }
                        }}
                      />
                    ) : (
                      <MDBox 
                        p={1.5} 
                        sx={{ 
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          minHeight: '48px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <MDTypography variant="body1" color="dark">
                          {formData.company || 'Not provided'}
                        </MDTypography>
                      </MDBox>
                    )}
                  </MDBox>
                </Grid>

                {/* Job Title */}
                <Grid item xs={12}>
                  <MDBox mb={2}>
                    <MDBox display="flex" alignItems="center" mb={1}>
                      <Briefcase size={16} style={{ marginRight: '8px', color: '#00BFA6' }} />
                      <MDTypography variant="body2" fontWeight="medium" color="dark">
                        Job Title
                      </MDTypography>
                    </MDBox>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        placeholder="Enter your job title"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            height: '48px'
                          }
                        }}
                      />
                    ) : (
                      <MDBox 
                        p={1.5} 
                        sx={{ 
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          minHeight: '48px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <MDTypography variant="body1" color="dark">
                          {formData.jobTitle || 'Not provided'}
                        </MDTypography>
                      </MDBox>
                    )}
                  </MDBox>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Account Info Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ 
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <MDTypography variant="h6" fontWeight="medium" color="dark" mb={3}>
                Account Information
              </MDTypography>
              
              <MDBox mb={3}>
                <MDTypography variant="body2" color="text" mb={1}>
                  Account Tier
                </MDTypography>
                <MDBox 
                  display="inline-block" 
                  px={2} 
                  py={1} 
                  sx={{ 
                    backgroundColor: '#e8f5e8',
                    borderRadius: '20px',
                    border: '1px solid #4caf50'
                  }}
                >
                  <MDTypography variant="body2" fontWeight="medium" color="success">
                    {(user as any)?.tier || 'Free'} Plan
                  </MDTypography>
                </MDBox>
              </MDBox>

              <MDBox mb={3}>
                <MDTypography variant="body2" color="text" mb={1}>
                  Member Since
                </MDTypography>
                <MDTypography variant="body1" color="dark">
                  {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </MDTypography>
              </MDBox>

              <Divider sx={{ my: 3 }} />

              <MDBox>
                <Link to="/dashboard">
                  <MDButton
                    variant="outlined"
                    fullWidth
                    startIcon={<ArrowLeft size={16} />}
                  >
                    Back to Dashboard
                  </MDButton>
                </Link>
              </MDBox>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MDBox>
  );
}