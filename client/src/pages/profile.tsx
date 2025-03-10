import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductCard from "@/components/products/ProductCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const Profile = () => {
  const { useCurrentUser, useLogin, useRegister, useLogout, useUpdatePreferences } = useAuth();
  const { useRecentScans } = useProducts();
  const [activeTab, setActiveTab] = useState("profile");
  
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const { data: recentScans, isLoading: isLoadingScans } = useRecentScans();
  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const { mutate: register, isPending: isRegistering } = useRegister();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: updatePreferences, isPending: isUpdatingPreferences } = useUpdatePreferences();

  // Login form schema
  const loginSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  // Register form schema
  const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  // Preferences schema
  const preferencesSchema = z.object({
    preferredCategories: z.array(z.string()).optional(),
    dietaryPreferences: z.array(z.string()).optional(),
    materialPreferences: z.array(z.string()).optional(),
  });

  // Forms
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const preferencesForm = useForm<z.infer<typeof preferencesSchema>>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      preferredCategories: currentUser?.preferences?.preferredCategories || [],
      dietaryPreferences: currentUser?.preferences?.dietaryPreferences || [],
      materialPreferences: currentUser?.preferences?.materialPreferences || [],
    },
  });

  const onLoginSubmit = (data: z.infer<typeof loginSchema>) => {
    login(data);
  };

  const onRegisterSubmit = (data: z.infer<typeof registerSchema>) => {
    const { confirmPassword, ...registerData } = data;
    register(registerData);
  };

  const onPreferencesSubmit = (data: z.infer<typeof preferencesSchema>) => {
    updatePreferences(data);
  };

  const handleLogout = () => {
    logout();
  };

  // Mock preferences options for demo
  const categoryOptions = ["Eco-friendly", "Organic", "Vegan", "Local", "Fair Trade"];
  const dietaryOptions = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Nut-Free"];
  const materialOptions = ["Plastic-Free", "Recycled", "Biodegradable", "Compostable", "Renewable"];

  if (isLoadingUser) {
    return (
      <div className="py-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-neutral-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h1 className="text-2xl font-heading font-bold mb-6">
        {currentUser ? `Welcome, ${currentUser.username}` : "My Profile"}
      </h1>

      {currentUser ? (
        // Logged in state
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="history">Scan History</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-20 h-20 bg-neutral-lightest rounded-full flex items-center justify-center">
                      <span className="material-icons text-4xl text-neutral-medium">person</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{currentUser.username}</h2>
                      <p className="text-neutral-medium">{currentUser.email}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-light">
                    <h3 className="text-lg font-semibold mb-2">Account Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Username</Label>
                        <Input value={currentUser.username} readOnly />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input value={currentUser.email} readOnly />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button 
                      variant="outline" 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? "Logging out..." : "Log Out"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Scan History</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingScans ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-neutral-medium">Loading scan history...</p>
                  </div>
                ) : recentScans && recentScans.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentScans.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="material-icons text-4xl text-neutral-medium">history</span>
                    <p className="mt-2 text-neutral-medium">No scan history yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...preferencesForm}>
                  <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Product Categories</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {categoryOptions.map((category) => (
                          <FormField
                            key={category}
                            control={preferencesForm.control}
                            name="preferredCategories"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category)}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];
                                      return checked
                                        ? field.onChange([...currentValues, category])
                                        : field.onChange(currentValues.filter(value => value !== category));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="cursor-pointer">{category}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Dietary Preferences</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {dietaryOptions.map((option) => (
                          <FormField
                            key={option}
                            control={preferencesForm.control}
                            name="dietaryPreferences"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option)}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];
                                      return checked
                                        ? field.onChange([...currentValues, option])
                                        : field.onChange(currentValues.filter(value => value !== option));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="cursor-pointer">{option}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Material Preferences</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {materialOptions.map((material) => (
                          <FormField
                            key={material}
                            control={preferencesForm.control}
                            name="materialPreferences"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(material)}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];
                                      return checked
                                        ? field.onChange([...currentValues, material])
                                        : field.onChange(currentValues.filter(value => value !== material));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="cursor-pointer">{material}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button type="submit" disabled={isUpdatingPreferences}>
                        {isUpdatingPreferences ? "Saving..." : "Save Preferences"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        // Logged out state
        <Tabs defaultValue="login" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Login to Your Account</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Your username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoggingIn}>
                      {isLoggingIn ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Your email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isRegistering}>
                      {isRegistering ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Profile;
