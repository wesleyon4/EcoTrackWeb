import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export const useAuth = () => {
  const { toast } = useToast();

  // Get current user
  const useCurrentUser = () => {
    return useQuery<User | null>({
      queryKey: ["/api/users/me"],
      queryFn: async ({ queryKey }) => {
        try {
          const response = await fetch(queryKey[0] as string, {
            credentials: "include",
          });
          
          if (response.status === 401) {
            return null;
          }
          
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
          
          return await response.json();
        } catch (error) {
          console.error("Failed to fetch current user:", error);
          return null;
        }
      },
    });
  };

  // Login
  const useLogin = () => {
    return useMutation({
      mutationFn: async ({ username, password }: { username: string; password: string }) => {
        const response = await apiRequest("POST", "/api/auth/login", { username, password });
        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
        toast({
          title: "Login Successful",
          description: "You have been logged in successfully.",
        });
      },
      onError: (error) => {
        toast({
          title: "Login Failed",
          description: error instanceof Error ? error.message : "Invalid username or password",
          variant: "destructive",
        });
      },
    });
  };

  // Register
  const useRegister = () => {
    return useMutation({
      mutationFn: async ({ username, password, email }: { username: string; password: string; email: string }) => {
        const response = await apiRequest("POST", "/api/auth/register", { username, password, email });
        return response.json();
      },
      onSuccess: () => {
        toast({
          title: "Registration Successful",
          description: "Your account has been created. Please log in.",
        });
      },
      onError: (error) => {
        toast({
          title: "Registration Failed",
          description: error instanceof Error ? error.message : "Could not create account",
          variant: "destructive",
        });
      },
    });
  };

  // Logout
  const useLogout = () => {
    return useMutation({
      mutationFn: async () => {
        const response = await apiRequest("POST", "/api/auth/logout", {});
        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
        toast({
          title: "Logout Successful",
          description: "You have been logged out successfully.",
        });
      },
    });
  };

  // Update user preferences
  const useUpdatePreferences = () => {
    return useMutation({
      mutationFn: async (preferences: any) => {
        const response = await apiRequest("PATCH", "/api/users/preferences", { preferences });
        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
        toast({
          title: "Preferences Updated",
          description: "Your preferences have been updated successfully.",
        });
      },
    });
  };

  return {
    useCurrentUser,
    useLogin,
    useRegister,
    useLogout,
    useUpdatePreferences,
  };
};
