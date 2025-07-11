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
import { Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-blue-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-gray-800">Create Your Password</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Welcome to Apple Bites! Please create a secure password for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={createPasswordForm.handleSubmit(onCreatePasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userEmail}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showCreatePassword ? "text" : "password"}
                    {...createPasswordForm.register("password")}
                    placeholder="Enter at least 8 characters"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                  <p className="text-sm text-red-500">{createPasswordForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...createPasswordForm.register("confirmPassword")}
                  placeholder="Confirm your password"
                />
                {createPasswordForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">{createPasswordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full text-white font-medium" 
                style={{ backgroundColor: '#4F83F7' }}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-blue-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gray-800">Welcome to Apple Bites</CardTitle>
          <CardDescription className="text-center text-gray-600">
            Access your business valuation dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2" style={{ backgroundColor: '#4F83F7' }}>
              <TabsTrigger value="login" className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">Login</TabsTrigger>
              <TabsTrigger value="info" className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">Need an Account?</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...loginForm.register("email")}
                    placeholder="Enter your email address"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...loginForm.register("password")}
                      placeholder="Enter your password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                    <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full text-white font-medium" 
                  style={{ backgroundColor: '#4F83F7' }}
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  <LogIn className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="info" className="space-y-4">
              <div className="text-center space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-blue-900">How to Get Access</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Purchase a Growth ($795) or Capital ($2,500) tier assessment to get your account automatically created.
                  </p>
                  <Button 
                    onClick={() => window.open('https://products.applebites.ai/', '_blank')}
                    className="w-full text-white font-medium"
                    style={{ backgroundColor: '#4F83F7' }}
                  >
                    Purchase Assessment
                  </Button>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-blue-900">Already Purchased?</h3>
                  <p className="text-sm text-blue-700">
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