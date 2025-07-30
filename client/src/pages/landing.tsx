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
import { TrendingUp, DollarSign, BarChart3, Users, CheckCircle, Star } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <TrendingUp size={32} />,
      title: "AI-Powered Valuation",
      description: "Get accurate business valuations using advanced AI analysis and industry-specific multipliers."
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Value Driver Analysis",
      description: "Comprehensive assessment of 10 key value drivers that impact your business worth."
    },
    {
      icon: <DollarSign size={32} />,
      title: "Growth Opportunities",
      description: "Identify specific areas to improve your valuation and increase business value."
    },
    {
      icon: <Users size={32} />,
      title: "Expert Insights",
      description: "Professional recommendations from M&A specialists and business valuation experts."
    }
  ];

  const testimonials = [
    {
      text: "Apple Bites gave us the clarity we needed to prepare for our exit strategy. The insights were invaluable.",
      author: "Sarah Johnson",
      company: "Tech Solutions Inc."
    },
    {
      text: "The AI-powered analysis helped us identify $2M in additional value we hadn't considered.",
      author: "Michael Chen",
      company: "Manufacturing Co."
    },
    {
      text: "Professional, comprehensive, and actionable. Exactly what we needed for our growth planning.",
      author: "Lisa Rodriguez",
      company: "Service Partners LLC"
    }
  ];

  const plans = [
    {
      name: "Free Assessment",
      price: "Free",
      description: "Perfect for getting started",
      features: [
        "Basic business valuation",
        "General industry multipliers",
        "PDF report delivery",
        "Value improvement tips"
      ],
      cta: "Start Free Assessment",
      link: "/signup",
      popular: false
    },
    {
      name: "Growth & Exit Assessment",
      price: "$795",
      description: "For serious business owners",
      features: [
        "Industry-specific NAICS analysis",
        "AI-powered business insights",
        "Strategic growth recommendations",
        "Capital readiness assessment",
        "1-on-1 consultation call"
      ],
      cta: "Get Growth Assessment",
      link: "/pricing",
      popular: true
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Background Pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 25%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 25%)',
        backgroundSize: '60px 60px'
      }} />

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <Box sx={{ py: 2, px: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src="/apple-bites-logo.png" alt="Apple Bites" style={{ height: 50 }} />
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
              Apple Bites
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/login">
              <Button variant="outlined" sx={{ color: 'white', borderColor: 'white' }} size="small">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="contained" sx={{ background: 'linear-gradient(45deg, #17a2b8, #007bff)' }} size="small">
                Get Started
              </Button>
            </Link>
          </Box>
        </Box>

        {/* Hero Section */}
        <Container maxWidth="lg" sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h1" sx={{ 
            color: 'white', 
            fontWeight: 'bold', 
            mb: 2, 
            fontSize: { xs: '2.5rem', md: '4rem' } 
          }}>
            Know Your Business Worth
          </Typography>
          <Typography variant="h4" sx={{ 
            color: 'white', 
            mb: 4, 
            opacity: 0.9, 
            fontWeight: 300 
          }}>
            Professional business valuation powered by AI
          </Typography>
          <Typography variant="body1" sx={{ 
            color: 'white', 
            mb: 6, 
            opacity: 0.8, 
            maxWidth: 600, 
            mx: 'auto', 
            fontSize: '1.1rem' 
          }}>
            Get accurate business valuations, identify growth opportunities, and prepare for your next strategic move with our comprehensive assessment platform.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup">
              <Button 
                variant="contained"
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  fontSize: '1.1rem',
                  background: 'linear-gradient(45deg, #17a2b8, #007bff)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #138496, #0056b3)'
                  }
                }}
              >
                Start Free Assessment
              </Button>
            </Link>
            <Link href="/pricing">
              <Button 
                variant="outlined"
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  fontSize: '1.1rem',
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: '#17a2b8',
                    color: '#17a2b8'
                  }
                }}
              >
                View Premium Plans
              </Button>
            </Link>
          </Box>
        </Container>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h2" sx={{ 
            color: 'white', 
            textAlign: 'center', 
            fontWeight: 'bold', 
            mb: 6 
          }}>
            Why Choose Apple Bites?
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ 
                  p: 4, 
                  height: '100%',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        p: 1.5, 
                        borderRadius: '50%', 
                        background: 'linear-gradient(45deg, #17a2b8, #007bff)',
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: 'white', opacity: 0.9 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Pricing Section */}
        <Box sx={{ py: 8, background: 'rgba(0,0,0,0.2)' }}>
          <Container maxWidth="lg">
            <Typography variant="h2" sx={{ 
              color: 'white', 
              textAlign: 'center', 
              fontWeight: 'bold', 
              mb: 2 
            }}>
              Choose Your Plan
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'white', 
              textAlign: 'center', 
              mb: 6, 
              opacity: 0.8 
            }}>
              Start with our free assessment or get comprehensive insights with our premium plan
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              {plans.map((plan, index) => (
                <Grid item xs={12} md={6} key={index} sx={{ maxWidth: 400 }}>
                  <Card sx={{
                    p: 4,
                    height: '100%',
                    background: plan.popular 
                      ? 'linear-gradient(135deg, #17a2b8 0%, #007bff 100%)' 
                      : 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: plan.popular ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    position: 'relative',
                    transform: plan.popular ? 'scale(1.05)' : 'none'
                  }}>
                    {plan.popular && (
                      <Box sx={{
                        position: 'absolute',
                        top: -10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#ffc107',
                        color: '#000',
                        px: 3,
                        py: 0.5,
                        borderRadius: 20,
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        MOST POPULAR
                      </Box>
                    )}
                    
                    <CardContent>
                      <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                          {plan.name}
                        </Typography>
                        <Typography variant="h2" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                          {plan.price}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
                          {plan.description}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 4 }}>
                        {plan.features.map((feature, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CheckCircle size={16} style={{ marginRight: 8, color: '#28a745' }} />
                            <Typography variant="body2" sx={{ color: 'white' }}>
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      <Link href={plan.link}>
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          sx={{ 
                            py: 1.5,
                            background: plan.popular 
                              ? 'rgba(255,255,255,0.9)' 
                              : 'linear-gradient(45deg, #17a2b8, #007bff)',
                            color: plan.popular ? '#000' : '#fff',
                            '&:hover': {
                              background: plan.popular 
                                ? 'rgba(255,255,255,1)' 
                                : 'linear-gradient(45deg, #138496, #0056b3)'
                            }
                          }}
                        >
                          {plan.cta}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Testimonials */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h2" sx={{ 
            color: 'white', 
            textAlign: 'center', 
            fontWeight: 'bold', 
            mb: 6 
          }}>
            What Our Clients Say
          </Typography>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{
                  p: 4,
                  height: '100%',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white'
                }}>
                  <CardContent>
                    <Box sx={{ mb: 2, display: 'flex', color: '#ffc107' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ 
                      color: 'white', 
                      mb: 3, 
                      fontStyle: 'italic' 
                    }}>
                      "{testimonial.text}"
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {testimonial.author}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'white', opacity: 0.8 }}>
                      {testimonial.company}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* CTA Section */}
        <Box sx={{ py: 8, textAlign: 'center', background: 'rgba(0,0,0,0.3)' }}>
          <Container maxWidth="md">
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
              Ready to Discover Your Business Worth?
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'white', 
              mb: 4, 
              opacity: 0.9, 
              maxWidth: 600, 
              mx: 'auto' 
            }}>
              Join thousands of business owners who have unlocked their growth potential with Apple Bites
            </Typography>
            <Link href="/signup">
              <Button 
                variant="contained"
                size="large"
                sx={{ 
                  px: 6, 
                  py: 2, 
                  fontSize: '1.2rem',
                  background: 'linear-gradient(45deg, #17a2b8, #007bff)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #138496, #0056b3)'
                  }
                }}
              >
                Start Your Free Assessment Now
              </Button>
            </Link>
          </Container>
        </Box>

        {/* Footer */}
        <Box sx={{ py: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Container maxWidth="lg">
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: 2 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <img src="/apple-bites-logo.png" alt="Apple Bites" style={{ height: 40 }} />
                <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
                  © 2025 Apple Bites. All rights reserved.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Link href="/privacy-policy">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'white', 
                      opacity: 0.8, 
                      cursor: 'pointer', 
                      '&:hover': { opacity: 1 } 
                    }}
                  >
                    Privacy Policy
                  </Typography>
                </Link>
                <Link href="/terms-of-use">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'white', 
                      opacity: 0.8, 
                      cursor: 'pointer', 
                      '&:hover': { opacity: 1 } 
                    }}
                  >
                    Terms of Use
                  </Typography>
                </Link>
                <Link href="/login">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'white', 
                      opacity: 0.8, 
                      cursor: 'pointer', 
                      '&:hover': { opacity: 1 } 
                    }}
                  >
                    Sign In
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}