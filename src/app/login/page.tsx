"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn } from "lucide-react";
import { Logo } from "@/components/icons/Logo";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading || (!isLoading && user)) {
    // Show loading or redirecting state
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
         <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="items-center text-center">
            <Logo className="mb-2 h-16 w-16" />
            <CardTitle className="text-3xl font-bold">AIAssist</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="items-center text-center">
          <Logo className="mb-4 h-20 w-20" />
          <CardTitle className="text-3xl font-bold">Welcome to AIAssist</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to enhance your chat experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            onClick={login} 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
            disabled={isLoading}
          >
            <LogIn className="mr-2 h-5 w-5" /> Sign in with Google
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our terms of service (simulated).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
