import React from 'react';
import { Link } from 'wouter';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  Container,
  CardContent
} from '@mui/material';
import { CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#ffffff',
      position: 'relative'
    }}>
      {/* Header */}
      <Box sx={{ 
        py: 3, 
        px: 4, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img src="/apple-bites-logo.png" alt="Apple Bites" style={{ height: 50 }} />
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
            Apple Bites
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <Link href="#features">
            <Typography variant="body1" sx={{ 
              color: 'white', 
              cursor: 'pointer',
              opacity: 0.9,
              '&:hover': { opacity: 1, color: '#17a2b8' }
            }}>
              Features
            </Typography>
          </Link>
          <Link href="#pricing">
            <Typography variant="body1" sx={{ 
              color: 'white', 
              cursor: 'pointer',
              opacity: 0.9,
              '&:hover': { opacity: 1, color: '#17a2b8' }
            }}>
              Pricing
            </Typography>
          </Link>
          <Link href="#about">
            <Typography variant="body1" sx={{ 
              color: 'white', 
              cursor: 'pointer',
              opacity: 0.9,
              '&:hover': { opacity: 1, color: '#17a2b8' }
            }}>
              About
            </Typography>
          </Link>
          <Link href="/login">
            <Button variant="outlined" sx={{ 
              color: 'white', 
              borderColor: 'rgba(255,255,255,0.5)',
              '&:hover': { 
                borderColor: 'white',
                background: 'rgba(255,255,255,0.1)'
              }
            }} size="small">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="contained" sx={{ 
              background: 'linear-gradient(45deg, #17a2b8, #007bff)',
              '&:hover': {
                background: 'linear-gradient(45deg, #138496, #0056b3)'
              }
            }} size="small">
              Get Started
            </Button>
          </Link>
        </Box>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h1" sx={{ 
          color: '#333', 
          fontWeight: 'bold', 
          mb: 2, 
          fontSize: { xs: '2.5rem', md: '3.5rem' } 
        }}>
          Valuation & Exit Readiness, Simplified.
        </Typography>
        <Typography variant="h5" sx={{ 
          color: '#666', 
          mb: 4, 
          fontWeight: 400,
          maxWidth: 800,
          mx: 'auto'
        }}>
          Discover your business's value and unlock capital readiness with Apple Bites.
        </Typography>
        <Typography variant="body1" sx={{ 
          color: '#666', 
          mb: 6, 
          fontSize: '1.1rem',
          maxWidth: 600,
          mx: 'auto'
        }}>
          Choose the assessment that's right for your goals and take the first step today.
        </Typography>
      </Container>

      {/* Pricing Section */}
      <Box id="pricing" sx={{ py: 8, background: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ 
            color: '#333', 
            textAlign: 'center', 
            fontWeight: 'bold', 
            mb: 2,
            fontSize: '2rem'
          }}>
            PRICING
          </Typography>
          <Typography variant="h3" sx={{ 
            color: '#333', 
            textAlign: 'center', 
            fontWeight: 'bold', 
            mb: 6,
            fontSize: '2.5rem'
          }}>
            Choose Your Plan
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {/* Free Plan */}
            <Grid item xs={12} md={4}>
              <Card sx={{
                p: 4,
                height: '100%',
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                textAlign: 'center',
                position: 'relative'
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                    Free Plan
                  </Typography>
                  <Typography variant="h2" sx={{ color: '#333', fontWeight: 'bold', mb: 3 }}>
                    $0
                  </Typography>
                  
                  <Box sx={{ mb: 4, textAlign: 'left' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                        General EBITDA Multipliers
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                        Value Driver Assessment
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                        Basic PDF Report
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                        Email Delivery
                      </Typography>
                    </Box>
                  </Box>

                  <Link href="/signup">
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{ 
                        py: 2,
                        background: '#28a745',
                        color: '#fff',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        '&:hover': {
                          background: '#218838'
                        }
                      }}
                    >
                      Access Now
                    </Button>
                  </Link>

                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <img 
                      src="https://assets.cdn.filesafe.space/75x6oVRlEkU7gyLcePUE/media/05907988-b0bc-4b02-b3b0-19648154fd2d.png" 
                      alt="Badge" 
                      style={{ height: 40 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Growth & Exit */}
            <Grid item xs={12} md={4}>
              <Card sx={{
                p: 4,
                height: '100%',
                background: '#ffffff',
                border: '2px solid #007bff',
                borderRadius: 2,
                textAlign: 'center',
                position: 'relative',
                transform: 'scale(1.05)'
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                    Growth & Exit
                  </Typography>
                  <Typography variant="h2" sx={{ color: '#333', fontWeight: 'bold', mb: 3 }}>
                    $795
                  </Typography>
                  
                  <Box sx={{ mb: 4, textAlign: 'left' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                        Everything in Free
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                        60-Min Deep Dive Call
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                        Private Equity Scorecard
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                        Opinion of Valuation
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                        Enterprise Value Simulator
                      </Typography>
                    </Box>
                  </Box>

                  <Link href="/pricing">
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{ 
                        py: 2,
                        background: '#007bff',
                        color: '#fff',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        '&:hover': {
                          background: '#0056b3'
                        }
                      }}
                    >
                      Access Now
                    </Button>
                  </Link>

                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <img 
                      src="https://assets.cdn.filesafe.space/75x6oVRlEkU7gyLcePUE/media/05907988-b0bc-4b02-b3b0-19648154fd2d.png" 
                      alt="Badge" 
                      style={{ height: 40 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Capital Market Plan */}
            <Grid item xs={12} md={4}>
              <Card sx={{
                p: 4,
                height: '100%',
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                textAlign: 'center',
                position: 'relative'
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                    Capital Market Plan
                  </Typography>
                  <Typography variant="h2" sx={{ color: '#333', fontWeight: 'bold', mb: 3 }}>
                    $3495/yr
                  </Typography>
                  
                  <Box sx={{ mb: 4, textAlign: 'left' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                        Everything in Growth & Exit
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                        Custom Valuation Stock Ticker
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                        Access to Capital Providers
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                        Exclusive Virtual Workshops
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" sx={{ color: '#333', fontStyle: 'italic', fontWeight: 'bold' }}>
                        Members-Only Live Events
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled
                    sx={{ 
                      py: 2,
                      background: '#6c757d',
                      color: '#fff',
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Access Now
                  </Button>

                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <img 
                      src="https://assets.cdn.filesafe.space/75x6oVRlEkU7gyLcePUE/media/05907988-b0bc-4b02-b3b0-19648154fd2d.png" 
                      alt="Badge" 
                      style={{ height: 40 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* What is Apple Bites Section */}
      <Container id="about" maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" sx={{ 
          color: '#333', 
          textAlign: 'center', 
          fontWeight: 'bold', 
          mb: 2,
          fontSize: '3rem'
        }}>
          What is Apple Bites?
        </Typography>
        <Typography variant="h4" sx={{ 
          color: '#666', 
          textAlign: 'center', 
          mb: 6,
          fontStyle: 'italic',
          fontWeight: 400
        }}>
          Not every exit is all or nothing — take your bite, then come back for more.
        </Typography>

        <Grid container spacing={6} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                Built for Founders, by M&A Experts
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                Apple Bites gives business owners a quick, credible snapshot of their company's potential market value.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                Data-Driven & Easy to Use
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                Answer a few questions, get a valuation range, and see exactly where you stand — no spreadsheets, no guesswork.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                The First Bite Toward a Bigger Exit
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                Apple Bites helps you identify growth opportunities and get capital-ready with confidence.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <img 
            src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/QNFFrENaRuI2JhldFd0Z/media/679421f2c21e372cd0b390b0.svg" 
            alt="Meritage Partners" 
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <Typography variant="body1" sx={{ 
            color: '#666', 
            mt: 4, 
            fontSize: '1.1rem',
            maxWidth: 800,
            mx: 'auto'
          }}>
            Whether you're scaling, preparing to sell, or exploring strategic partnerships—Meritage Partners is here to guide your next move.
          </Typography>
        </Box>
      </Container>

      {/* Features Section */}
      <Box id="features" sx={{ py: 8, background: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ 
            color: '#333', 
            textAlign: 'center', 
            fontWeight: 'bold', 
            mb: 6,
            fontSize: '2.5rem'
          }}>
            Platform Features
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #17a2b8, #007bff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                    AI
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                  AI-Powered Analysis
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  Advanced artificial intelligence analyzes your business data and provides accurate valuation insights based on industry-specific factors.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #28a745, #20c997)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                    10
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                  Value Drivers
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  Comprehensive assessment of 10 key business value drivers that directly impact your company's market valuation.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #ffc107, #fd7e14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                    5min
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                  Quick Assessment
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                  Get professional business valuation results in just 5 minutes with our streamlined assessment process.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, background: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link href="/privacy-policy">
                  <Typography variant="body2" sx={{ 
                    color: '#007bff', 
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}>
                    Privacy Policy
                  </Typography>
                </Link>
                <Link href="/terms-of-use">
                  <Typography variant="body2" sx={{ 
                    color: '#007bff', 
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}>
                    Terms of Use
                  </Typography>
                </Link>
                <Typography variant="body2" sx={{ 
                  color: '#007bff', 
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}>
                  Cookie Policy
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold', mb: 2 }}>
                Address:
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                2901 West Coast Highway Suite 200, Newport Beach California 92663
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                (949) 522-9121
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                info@meritage-partners.com
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                © 2025. Meritage Partners. All rights reserved.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}