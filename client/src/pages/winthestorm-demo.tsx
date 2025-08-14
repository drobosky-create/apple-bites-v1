import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';

interface DemoSignupData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
}

export default function WinTheStormDemo() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<DemoSignupData>({
    firstName: '',
    lastName: '',
    email: '',
    company: ''
  });

  const demoSignupMutation = useMutation({
    mutationFn: async (data: DemoSignupData) => {
      const response = await apiRequest('POST', '/api/demo/winthestorm-signup', data);
      return response.json();
    },
    onSuccess: async () => {
      // Redirect to dashboard - session will be established by server
      setLocation('/dashboard');
    },
    onError: (error) => {
      console.error('Demo signup failed:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    demoSignupMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        padding: '48px',
        width: '100%',
        maxWidth: '500px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#0A1F44',
            marginBottom: '8px',
            lineHeight: '1.2'
          }}>
            Win The Storm
          </h1>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1B2C4F',
            marginBottom: '16px'
          }}>
            Apple Bites Demo
          </h2>
          <p style={{
            color: '#64748B',
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            Experience our complete M&A Assessment Platform. Get instant access to Free and Growth & Exit assessments.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Company Name
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          <button
            type="submit"
            disabled={demoSignupMutation.isPending}
            style={{
              width: '100%',
              padding: '14px 32px',
              backgroundColor: demoSignupMutation.isPending ? '#9CA3AF' : '#3B82F6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: demoSignupMutation.isPending ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              marginTop: '8px'
            }}
            onMouseEnter={(e) => {
              if (!demoSignupMutation.isPending) {
                e.currentTarget.style.backgroundColor = '#2563EB';
              }
            }}
            onMouseLeave={(e) => {
              if (!demoSignupMutation.isPending) {
                e.currentTarget.style.backgroundColor = '#3B82F6';
              }
            }}
          >
            {demoSignupMutation.isPending ? 'Setting up your demo...' : 'Enter Apple Bites Demo'}
          </button>

          {demoSignupMutation.error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              color: '#DC2626',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              Demo signup failed. Please try again.
            </div>
          )}
        </form>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #E5E7EB'
        }}>
          <p style={{
            color: '#6B7280',
            fontSize: '14px',
            marginBottom: '8px'
          }}>
            This demo includes:
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              color: '#059669',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ✓ Free Assessment
            </span>
            <span style={{
              color: '#059669',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ✓ Growth & Exit Assessment
            </span>
            <span style={{
              color: '#059669',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ✓ Full Dashboard Access
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}