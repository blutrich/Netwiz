import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { FullLogo } from "../components/ui/full-logo";
import { toast } from "../components/ui/use-toast";
import { authenticateUser } from "../lib/services/user-management";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      console.log(`Attempting to login with email: ${email}`);
      
      // For blutrich@gmail.com, show a special message
      if (email.toLowerCase().trim() === "blutrich@gmail.com") {
        toast({
          title: "Special User",
          description: "Attempting to log in with blutrich@gmail.com...",
        });
      }
      
      const user = await authenticateUser(email, password);
      
      if (user) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
          variant: "success"
        });
        navigate("/dashboard");
      } else {
        console.error("Authentication failed - no user returned");
        
        // Special message for blutrich@gmail.com
        if (email.toLowerCase().trim() === "blutrich@gmail.com") {
          toast({
            title: "Login Failed",
            description: "Could not find blutrich@gmail.com in the Google Sheet. Please check that this email exists in your admin tab.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: "An error occurred during login. Please check the console for details.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-[#0A2647] text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <FullLogo size={30} darkMode={darkMode} />
        <Button 
          variant="outline" 
          onClick={() => setDarkMode(!darkMode)}
          className={darkMode ? 'border-white text-white hover:bg-blue-900' : ''}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </header>
      
      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription>
              Access your NetWizBot dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium block">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                    darkMode ? 'bg-[#173D6E] border-blue-700 focus:ring-blue-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-medium block">
                    Password
                  </label>
                  <a href="#" className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                    darkMode ? 'bg-[#173D6E] border-blue-700 focus:ring-blue-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : 'Sign In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm flex flex-col space-y-2">
            <p className="text-muted-foreground">
              By continuing, you agree to the NetWizBot Terms of Service and Privacy Policy.
            </p>
            <p className="text-muted-foreground text-xs">
              NetWizBot © {new Date().getFullYear()} | All rights reserved.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 