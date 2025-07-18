import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { 
  ArgonBox, 
  ArgonButton, 
  ArgonTypography 
} from "@/components/ui/argon-authentic";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import _3 from "@assets/3.png";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const createAccountSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const createPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type CreateAccountFormData = z.infer<typeof createAccountSchema>;
type CreatePasswordFormData = z.infer<typeof createPasswordSchema>;

export default function UserLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [needsPasswordCreation, setNeedsPasswordCreation] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [activeTab, setActiveTab] = useState<'create' | 'login'>('create');

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const createAccountForm = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const createPasswordForm = useForm<CreatePasswordFormData>({
    resolver: zodResolver(createPasswordSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const createAccountMutation = useMutation({
    mutationFn: async (data: CreateAccountFormData) => {
      const response = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Account creation failed");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Account created successfully!",
        description: "Welcome to Apple Bites! You now have access to the free assessment.",
      });
      setLocation(`/dashboard/free`);
    },
    onError: (error: Error) => {
      toast({
        title: "Account creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.needsPasswordCreation) {
        setNeedsPasswordCreation(true);
        setUserEmail(data.email);
        createPasswordForm.setValue("email", data.email);
        toast({
          title: "Welcome!",
          description: "Please create a password to access your account.",
        });
      } else {
        toast({
          title: "Login successful",
          description: `Welcome back to your ${data.user.tier} tier account!`,
        });
        setLocation(data.redirectTo || `/dashboard/${data.user.tier}`);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createPasswordMutation = useMutation({
    mutationFn: async (data: CreatePasswordFormData) => {
      const response = await apiRequest("/api/auth/create-password", {
        method: "POST",
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Password creation failed");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Account setup complete",
        description: `Welcome to your ${data.user.tier} tier account!`,
      });
      setLocation(data.redirectTo || `/dashboard/${data.user.tier}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Password creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onCreateAccountSubmit = (data: CreateAccountFormData) => {
    createAccountMutation.mutate(data);
  };

  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onCreatePasswordSubmit = (data: CreatePasswordFormData) => {
    createPasswordMutation.mutate(data);
  };

  if (needsPasswordCreation) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
        {/* Header */}
        <div
          className="relative py-3 bg-gradient-to-r from-blue-600 to-blue-700"
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
        </div>

        {/* Main Content */}
        <ArgonBox py={6} px={3} className="bg-transparent">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <ArgonBox p={4}>
                <div className="text-center mb-6">
                  <ArgonTypography variant="h4" color="dark" fontWeight="bold" className="mb-2">
                    Create Your Password
                  </ArgonTypography>
                  <ArgonTypography variant="body2" color="text">
                    Welcome to Apple Bites! Please create a secure password for your account.
                  </ArgonTypography>
                </div>

                <form onSubmit={createPasswordForm.handleSubmit(onCreatePasswordSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userEmail}
                      disabled
                      className="bg-gray-50 border border-gray-200 text-gray-600 rounded-lg opacity-75"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showCreatePassword ? "text" : "password"}
                        {...createPasswordForm.register("password")}
                        placeholder="Enter at least 8 characters"
                        className="bg-white border border-gray-200 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"
                      />
                      <ArgonButton
                        variant="text"
                        color="secondary"
                        size="small"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 min-w-0"
                        onClick={() => setShowCreatePassword(!showCreatePassword)}
                      >
                        {showCreatePassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </ArgonButton>
                    </div>
                    {createPasswordForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{createPasswordForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...createPasswordForm.register("confirmPassword")}
                      placeholder="Confirm your password"
                      className="bg-white border border-gray-200 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {createPasswordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">{createPasswordForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="pt-4">
                    <ArgonButton 
                      variant="gradient"
                      color="primary"
                      size="large"
                      className="w-full"
                      disabled={createPasswordMutation.isPending}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {createPasswordMutation.isPending ? "Creating Account..." : "Create Password & Login"}
                    </ArgonButton>
                  </div>
                </form>
              </ArgonBox>
            </div>
          </div>
        </ArgonBox>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Main Content */}
      <ArgonBox py={6} px={3} className="bg-transparent">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <ArgonBox p={4}>
              <div className="text-center mb-6 flex flex-col items-center">
                <img
                  src={_3}
                  alt="Apple Bites Business Assessment"
                  className="mx-auto w-full max-w-[220px] sm:max-w-[260px] md:max-w-[300px] mb-4"
                />
                <ArgonTypography variant="body2" color="text">
                  Create your account to access business valuation tools
                </ArgonTypography>
              </div>

                {/* Tab Buttons */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg mb-6">
                  <ArgonButton
                    variant={activeTab === 'create' ? 'gradient' : 'text'}
                    color={activeTab === 'create' ? 'primary' : 'secondary'}
                    size="medium"
                    className="w-full"
                    onClick={() => setActiveTab('create')}
                  >
                    Create Account
                  </ArgonButton>
                  <ArgonButton
                    variant={activeTab === 'login' ? 'gradient' : 'text'}
                    color={activeTab === 'login' ? 'primary' : 'secondary'}
                    size="medium"
                    className="w-full"
                    onClick={() => setActiveTab('login')}
                  >
                    Existing User?
                  </ArgonButton>
                </div>

                {/* Create Account Form */}
                {activeTab === 'create' && (
                  <form onSubmit={createAccountForm.handleSubmit(onCreateAccountSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        {...createAccountForm.register("fullName")}
                        placeholder="Enter your full name"
                        className="bg-white border border-gray-200 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      {createAccountForm.formState.errors.fullName && (
                        <p className="text-sm text-red-500">{createAccountForm.formState.errors.fullName.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...createAccountForm.register("email")}
                        placeholder="Enter your email address"
                        className="bg-white border border-gray-200 text-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      {createAccountForm.formState.errors.email && (
                        <p className="text-sm text-red-500">{createAccountForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 font-medium">Create Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          {...createAccountForm.register("password")}
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
                      {createAccountForm.formState.errors.password && (
                        <p className="text-sm text-red-500">{createAccountForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <div className="pt-4">
                      <ArgonButton 
                        variant="gradient"
                        color="primary"
                        size="large"
                        className="w-full"
                        disabled={createAccountMutation.isPending}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {createAccountMutation.isPending ? "Creating Account..." : "Create Account"}
                      </ArgonButton>
                    </div>
                  </form>
                )}

                {/* Login Form */}
                {activeTab === 'login' && (
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <div className="text-center mb-4">
                      <ArgonTypography variant="h6" color="dark" fontWeight="bold" className="mb-2">
                        Already have an account?
                      </ArgonTypography>
                      <ArgonTypography variant="body2" color="text">
                        Sign in with your existing credentials
                      </ArgonTypography>
                    </div>
                    
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
                )}
            </ArgonBox>
          </div>
        </div>
      </ArgonBox>
    </div>
  );
}