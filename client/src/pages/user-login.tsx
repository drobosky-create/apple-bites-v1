import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { 
  ArgonBox, 
  ArgonButton, 
  ArgonTypography 
} from "@/components/ui/argon-authentic";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUserSchema, loginUserSchema, type RegisterUser, type LoginUser } from "@shared/schema";

export default function UserLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'oauth' | 'register' | 'login'>('oauth');

  const registerForm = useForm<RegisterUser>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const loginForm = useForm<LoginUser>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterUser) => {
      const response = await apiRequest("/api/users/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Registration failed");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Account created successfully",
        description: `Welcome to your ${data.user.tier} account!`,
      });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginUser) => {
      const response = await apiRequest("/api/users/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Login failed");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Login successful",
        description: `Welcome back to your ${data.user.tier} account!`,
      });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onRegisterSubmit = (data: RegisterUser) => {
    registerMutation.mutate(data);
  };

  const onLoginSubmit = (data: LoginUser) => {
    loginMutation.mutate(data);
  };
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Main Content */}
      <div className="py-6 px-3">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
            <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <img 
                    src="/apple-bites-logo-new.png" 
                    alt="Apple Bites Business Assessment" 
                    className="h-50 w-auto"
                  />
                </div>
                <ArgonTypography variant="body2" color="text">
                  Create your account to access business valuation tools
                </ArgonTypography>
            </div>

            {/* OAuth Option (Default) */}
            {activeTab === 'oauth' && (
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
                      Secure OAuth authentication
                    </ArgonTypography>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <ArgonButton
                      variant="text"
                      color="secondary"
                      size="medium"
                      className="w-full"
                      onClick={() => setActiveTab('register')}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Account
                    </ArgonButton>
                    <ArgonButton
                      variant="text"
                      color="secondary"
                      size="medium"
                      className="w-full"
                      onClick={() => setActiveTab('login')}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </ArgonButton>
                  </div>
                </div>
              )}

            {/* Custom Registration Form */}
            {activeTab === 'register' && (
              <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <ArgonButton
                      variant="text"
                      color="secondary"
                      size="small"
                      onClick={() => setActiveTab('oauth')}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back
                    </ArgonButton>
                    <ArgonTypography variant="h6" color="dark" fontWeight="bold">
                      Create Account
                    </ArgonTypography>
                    <div></div>
                  </div>

                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          {...registerForm.register("firstName")}
                          placeholder="First name"
                          className="bg-white border border-gray-200 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {registerForm.formState.errors.firstName && (
                          <p className="text-sm text-red-500">{registerForm.formState.errors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          {...registerForm.register("lastName")}
                          placeholder="Last name"
                          className="bg-white border border-gray-200 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        {registerForm.formState.errors.lastName && (
                          <p className="text-sm text-red-500">{registerForm.formState.errors.lastName.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...registerForm.register("email")}
                        placeholder="Enter your email address"
                        className="bg-white border border-gray-200 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          {...registerForm.register("password")}
                          placeholder="Create a secure password"
                          className="bg-white border border-gray-200 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"
                        />
                        <ArgonButton
                          variant="text"
                          color="secondary"
                          size="small"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 min-w-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </ArgonButton>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>Password must contain:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-xs">
                          <li>At least 8 characters</li>
                          <li>One uppercase letter (A-Z)</li>
                          <li>One lowercase letter (a-z)</li>
                          <li>One number (0-9)</li>
                          <li>One special character (!@#$%^&*)</li>
                        </ul>
                      </div>
                      {registerForm.formState.errors.password && (
                        <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <div className="pt-4">
                      <ArgonButton 
                        variant="gradient"
                        color="primary"
                        size="large"
                        className="w-full"
                        disabled={registerMutation.isPending}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                      </ArgonButton>
                    </div>
                  </form>
              </div>
            )}

            {/* Custom Login Form */}
            {activeTab === 'login' && (
              <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <ArgonButton
                      variant="text"
                      color="secondary"
                      size="small"
                      onClick={() => setActiveTab('oauth')}
                    >
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back
                    </ArgonButton>
                    <ArgonTypography variant="h6" color="dark" fontWeight="bold">
                      Sign In
                    </ArgonTypography>
                    <div></div>
                  </div>

                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="loginEmail" className="text-gray-700 font-medium">Email</Label>
                      <Input
                        id="loginEmail"
                        type="email"
                        {...loginForm.register("email")}
                        placeholder="Enter your email address"
                        className="bg-white border border-gray-200 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="loginPassword" className="text-gray-700 font-medium">Password</Label>
                      <Input
                        id="loginPassword"
                        type="password"
                        {...loginForm.register("password")}
                        placeholder="Enter your password"
                        className="bg-white border border-gray-200 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <div className="pt-4">
                      <ArgonButton 
                        variant="gradient"
                        color="info"
                        size="large"
                        className="w-full"
                        disabled={loginMutation.isPending}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        {loginMutation.isPending ? "Signing In..." : "Sign In"}
                      </ArgonButton>
                    </div>
                  </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}