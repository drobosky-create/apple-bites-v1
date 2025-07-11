import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn, UserPlus, Apple } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
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
type CreatePasswordFormData = z.infer<typeof createPasswordSchema>;

export default function UserLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [needsPasswordCreation, setNeedsPasswordCreation] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
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

  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onCreatePasswordSubmit = (data: CreatePasswordFormData) => {
    createPasswordMutation.mutate(data);
  };

  if (needsPasswordCreation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <Card className="w-full max-w-md shadow-2xl border-[#415A77] bg-[#1B263B]/90 backdrop-blur-sm rounded-xl relative z-10">
          <CardHeader className="space-y-1 relative">
            <div className="flex items-center justify-center mb-4">
              <Apple className="h-8 w-8 text-white mr-2" />
              <span className="text-2xl font-bold text-white">Apple Bites</span>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-white" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>Create Your Password</CardTitle>
            <CardDescription className="text-center text-[#E0E1DD]">
              Welcome to Apple Bites! Please create a secure password for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={createPasswordForm.handleSubmit(onCreatePasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userEmail}
                  disabled
                  className="bg-[#1B263B] border border-[#415A77] text-white placeholder-[#E0E1DD] rounded-lg opacity-75"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showCreatePassword ? "text" : "password"}
                    {...createPasswordForm.register("password")}
                    placeholder="Enter at least 8 characters"
                    className="bg-[#1B263B] border border-[#415A77] text-white placeholder-[#E0E1DD] rounded-lg focus:ring-2 focus:ring-[#778DA9]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                  >
                    {showCreatePassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {createPasswordForm.formState.errors.password && (
                  <p className="text-sm text-red-200">{createPasswordForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white font-medium">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...createPasswordForm.register("confirmPassword")}
                  placeholder="Confirm your password"
                  className="bg-[#1B263B] border border-[#415A77] text-white placeholder-[#E0E1DD] rounded-lg focus:ring-2 focus:ring-[#778DA9]"
                />
                {createPasswordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-200">{createPasswordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full text-white font-semibold bg-[#415A77] hover:bg-[#778DA9] transition duration-200 rounded-lg border-0" 
                disabled={createPasswordMutation.isPending}
              >
                {createPasswordMutation.isPending ? "Creating Account..." : "Create Password & Login"}
                <UserPlus className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      <Card className="border text-card-foreground w-full max-w-md shadow-2xl border-[#415A77] bg-[#1B263B]/90 backdrop-blur-sm rounded-xl relative z-10 pt-[15px] pb-[15px]">
        <CardHeader className="space-y-1 relative">
          <div className="flex items-center justify-center mb-4">
            <Apple className="h-8 w-8 text-white mr-2" />
            <span className="text-2xl font-bold text-white">Apple Bites</span>
          </div>
          <CardTitle className="text-3xl font-bold text-center text-white" style={{ fontFamily: 'Inter, Poppins, sans-serif' }}>Welcome Back to Apple Bites</CardTitle>
          <CardDescription className="text-center text-[#E0E1DD] text-base">
            Access your valuation dashboard below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#1B263B] border-[#415A77] rounded-lg">
              <TabsTrigger value="login" className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-[#0D1B2A] hover:bg-[#E0E1DD]/80 data-[state=active]:bg-[#415A77] data-[state=active]:text-white data-[state=active]:shadow-sm border-0 rounded-lg font-medium transition-colors text-[#0d0b0b]">Login</TabsTrigger>
              <TabsTrigger value="info" className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-[#0D1B2A] hover:bg-[#E0E1DD]/80 data-[state=active]:bg-[#415A77] data-[state=active]:text-white data-[state=active]:shadow-sm border-0 rounded-lg font-medium transition-colors text-[#0d0b0b]">Need an Account?</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4 bg-transparent p-6 rounded-lg mt-4 border border-[#415A77]">
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...loginForm.register("email")}
                    placeholder="Enter your email address"
                    className="bg-[#1B263B] border border-[#415A77] text-white placeholder-[#E0E1DD] rounded-lg focus:ring-2 focus:ring-[#778DA9]"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-red-200">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-medium">Password</Label>
                  <div className="relative rounded-lg overflow-hidden">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...loginForm.register("password")}
                      placeholder="Enter your password"
                      className="bg-[#1B263B] border border-[#415A77] text-white placeholder-[#E0E1DD] rounded-lg focus:ring-2 focus:ring-[#778DA9] pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-[#415A77]/20 text-[#E0E1DD] hover:text-white rounded-md transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-200">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full text-white font-semibold bg-gradient-to-r from-[#415A77] to-[#778DA9] hover:from-[#778DA9] hover:to-[#415A77] transition-all duration-300 rounded-lg border-0 shadow-lg hover:shadow-xl" 
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  <LogIn className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="info" className="space-y-4 bg-transparent p-6 rounded-lg mt-4 border border-[#415A77]">
              <div className="text-center space-y-4">
                <div className="bg-transparent border border-[#415A77] rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-white">How to Get Access</h3>
                  <p className="text-sm text-[#E0E1DD] mb-3">
                    Purchase a Growth ($795) or Capital ($2,500) tier assessment to get your account automatically created.
                  </p>
                  <Button 
                    onClick={() => window.open('https://products.applebites.ai/', '_blank')}
                    className="w-full text-white font-semibold bg-gradient-to-r from-[#0D1B2A] to-[#1B263B] hover:from-[#1B263B] hover:to-[#0D1B2A] transition-all duration-300 rounded-lg border border-[#415A77] shadow-md hover:shadow-lg"
                  >
                    Purchase Assessment
                  </Button>
                </div>
                
                <div className="bg-transparent border border-[#415A77] rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-white">Already Purchased?</h3>
                  <p className="text-sm text-[#E0E1DD]">
                    If you've already purchased an assessment, try logging in with your email. You'll be guided through password creation if needed.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}