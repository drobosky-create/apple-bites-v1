import { 
  ArgonBox, 
  ArgonButton, 
  ArgonTypography 
} from "@/components/ui/argon-authentic";

export default function UserLogin() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Argon Header */}
      <ArgonBox
        variant="gradient"
        bgGradient="primary"
        py={3}
        className="relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <img 
                src="/apple-bites-logo.png" 
                alt="Apple Bites Business Assessment" 
                className="h-12 w-auto"
              />
            </div>
          </div>
        </div>
      </ArgonBox>

      {/* Main Content */}
      <ArgonBox py={6} px={3} className="bg-transparent">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <ArgonBox p={4}>
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <img 
                    src="/apple-bites-logo-new.png" 
                    alt="Apple Bites Business Assessment" 
                    className="h-20 w-auto"
                  />
                </div>
                <ArgonTypography variant="body2" color="text">
                  Create your account to access business valuation tools
                </ArgonTypography>
              </div>

              {/* Login with Replit */}
              <div className="space-y-4">
                <ArgonButton 
                  variant="gradient"
                  color="primary"
                  size="large"
                  className="w-full"
                  onClick={() => window.location.href = '/api/login'}
                >
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Continue with Replit
                </ArgonButton>
                
                <div className="text-center">
                  <ArgonTypography variant="body2" color="text" className="text-sm">
                    Secure authentication powered by Replit
                  </ArgonTypography>
                </div>
              </div>
            </ArgonBox>
          </div>
        </div>
      </ArgonBox>
    </div>
  );
}