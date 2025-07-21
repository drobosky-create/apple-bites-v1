import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { 
  ArgonBox, 
  ArgonButton, 
  ArgonTypography 
} from "@/components/ui/argon-authentic";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUserSchema, loginUserSchema, type RegisterUser, type LoginUser } from "@shared/schema";
import appleBitesLogo from "@assets/Apple Bites_1752266454888.png";

import _3 from "@assets/3.png";

export default function ArgonLogin() {
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
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        title: "Welcome back!",
        description: `Logged in to your ${data.user.tier} account`,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      {/* Professional Argon Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header Section with Branding */}
        <div className="px-8 pt-8 pb-6 text-center bg-gradient-to-b from-white to-slate-50">
          <div className="mb-6">
            <img 
              src={_3} 
              alt="Apple Bites Business Assessment" 
              className="h-24 w-auto mx-auto mb-4"
            />
            
            
            <ArgonTypography variant="h5" className="text-[#0b2147] font-semibold">
              BUSINESS ASSESSMENT
            </ArgonTypography>
          </div>
          
          <ArgonTypography variant="body1" className="text-slate-600 mb-6">
            Create your account to access business valuation tools
          </ArgonTypography>
        </div>

        {/* Content Section */}
        <div className="px-8 pb-8">
          
          {/* OAuth Section - Default */}
          {activeTab === 'oauth' && (
            <div className="space-y-4">
              <ArgonButton
                fullWidth
                variant="contained"
                size="large"
                onClick={() => window.location.href = '/api/login'}
                className="bg-[#0b2147] hover:bg-[#1a365d] text-white py-3 rounded-lg font-semibold shadow-lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Continue with Replit
              </ArgonButton>
              
              <div className="text-center">
                <ArgonTypography variant="body2" className="text-slate-500 mb-4">
                  Secure OAuth authentication
                </ArgonTypography>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">Or</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <ArgonButton
                  variant="outlined"
                  onClick={() => setActiveTab('register')}
                  className="border-[#0b2147] text-[#0b2147] hover:bg-[#0b2147] hover:text-white py-2 rounded-lg font-medium"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Account
                </ArgonButton>
                
                <ArgonButton
                  variant="outlined"
                  onClick={() => setActiveTab('login')}
                  className="border-[#0b2147] text-[#0b2147] hover:bg-[#0b2147] hover:text-white py-2 rounded-lg font-medium"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </ArgonButton>
              </div>
            </div>
          )}

          {/* Registration Form */}
          {activeTab === 'register' && (
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <button
                  onClick={() => setActiveTab('oauth')}
                  className="flex items-center text-slate-600 hover:text-[#0b2147] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              </div>

              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-700 font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      {...registerForm.register("firstName")}
                      className="h-12 border-slate-300 focus:border-[#0b2147] focus:ring-[#0b2147]"
                    />
                    {registerForm.formState.errors.firstName && (
                      <p className="text-red-500 text-sm">
                        {registerForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-700 font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      {...registerForm.register("lastName")}
                      className="h-12 border-slate-300 focus:border-[#0b2147] focus:ring-[#0b2147]"
                    />
                    {registerForm.formState.errors.lastName && (
                      <p className="text-red-500 text-sm">
                        {registerForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...registerForm.register("email")}
                    className="h-12 border-slate-300 focus:border-[#0b2147] focus:ring-[#0b2147]"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-red-500 text-sm">
                      {registerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...registerForm.register("password")}
                      className="h-12 pr-12 border-slate-300 focus:border-[#0b2147] focus:ring-[#0b2147]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-red-500 text-sm">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <ArgonButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={registerMutation.isPending}
                  className="bg-[#0b2147] hover:bg-[#1a365d] text-white py-3 rounded-lg font-semibold shadow-lg"
                >
                  {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                </ArgonButton>
              </form>
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <button
                  onClick={() => setActiveTab('oauth')}
                  className="flex items-center text-slate-600 hover:text-[#0b2147] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              </div>

              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="loginEmail" className="text-slate-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="loginEmail"
                    type="email"
                    {...loginForm.register("email")}
                    className="h-12 border-slate-300 focus:border-[#0b2147] focus:ring-[#0b2147]"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-red-500 text-sm">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginPassword" className="text-slate-700 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="loginPassword"
                      type={showPassword ? "text" : "password"}
                      {...loginForm.register("password")}
                      className="h-12 pr-12 border-slate-300 focus:border-[#0b2147] focus:ring-[#0b2147]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500 text-sm">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <ArgonButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loginMutation.isPending}
                  className="bg-[#0b2147] hover:bg-[#1a365d] text-white py-3 rounded-lg font-semibold shadow-lg"
                >
                  {loginMutation.isPending ? "Signing In..." : "Sign In"}
                </ArgonButton>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}