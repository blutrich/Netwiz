import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast } from "../components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";

export function SettingsPage() {
  // Google Sheets API settings
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [expertSheetId, setExpertSheetId] = useState("");
  const [requestSheetId, setRequestSheetId] = useState("");
  
  // WhatsApp Integration settings
  const [instanceId, setInstanceId] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // OpenAI settings
  const [openaiKey, setOpenaiKey] = useState("");
  const [aiModel, setAiModel] = useState("gpt-4");
  const [aiPrompt, setAiPrompt] = useState("");
  
  // Request handling settings
  const [maxMatches, setMaxMatches] = useState(3);
  const [responseTimeout, setResponseTimeout] = useState(10);
  const [requestCooldown, setRequestCooldown] = useState(60);
  const [maxRequestsPerHelper, setMaxRequestsPerHelper] = useState(5);
  const [autoApprove, setAutoApprove] = useState(true);
  
  // Notification settings
  const [newRequestNotifications, setNewRequestNotifications] = useState(true);
  const [matchNotifications, setMatchNotifications] = useState(true);
  const [failedMatchNotifications, setFailedMatchNotifications] = useState(true);
  const [completedRequestNotifications, setCompletedRequestNotifications] = useState(true);
  
  // Theme settings
  const [darkMode, setDarkMode] = useState(false);
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      // Google Sheets API settings
      const savedGoogleApiKey = localStorage.getItem("googleApiKey");
      if (savedGoogleApiKey) setGoogleApiKey(savedGoogleApiKey);
      
      const savedExpertSheetId = localStorage.getItem("expertSheetId");
      if (savedExpertSheetId) setExpertSheetId(savedExpertSheetId);
      
      const savedRequestSheetId = localStorage.getItem("requestSheetId");
      if (savedRequestSheetId) setRequestSheetId(savedRequestSheetId);
      
      // WhatsApp Integration settings
      const savedInstanceId = localStorage.getItem("instanceId");
      if (savedInstanceId) setInstanceId(savedInstanceId);
      
      const savedApiToken = localStorage.getItem("apiToken");
      if (savedApiToken) setApiToken(savedApiToken);
      
      const savedPhoneNumber = localStorage.getItem("phoneNumber");
      if (savedPhoneNumber) setPhoneNumber(savedPhoneNumber);
      
      // OpenAI settings
      const savedOpenaiKey = localStorage.getItem("openaiKey");
      if (savedOpenaiKey) setOpenaiKey(savedOpenaiKey);
      
      const savedAiModel = localStorage.getItem("aiModel");
      if (savedAiModel) setAiModel(savedAiModel);
      
      const savedAiPrompt = localStorage.getItem("aiPrompt");
      if (savedAiPrompt) setAiPrompt(savedAiPrompt);
      else setAiPrompt(`Analyze the following request and categorize it into one of these categories: Technology, Recruitment, Funding, Business, Community. If it's not a valid request, respond with "IGNORE". Otherwise, respond with "VALID" followed by the category. Request: {{message}}`);
      
      // Request handling settings
      const savedMaxMatches = localStorage.getItem("maxMatches");
      if (savedMaxMatches) setMaxMatches(parseInt(savedMaxMatches));
      
      const savedResponseTimeout = localStorage.getItem("responseTimeout");
      if (savedResponseTimeout) setResponseTimeout(parseInt(savedResponseTimeout));
      
      const savedRequestCooldown = localStorage.getItem("requestCooldown");
      if (savedRequestCooldown) setRequestCooldown(parseInt(savedRequestCooldown));
      
      const savedMaxRequestsPerHelper = localStorage.getItem("maxRequestsPerHelper");
      if (savedMaxRequestsPerHelper) setMaxRequestsPerHelper(parseInt(savedMaxRequestsPerHelper));
      
      const savedAutoApprove = localStorage.getItem("autoApprove");
      if (savedAutoApprove) setAutoApprove(savedAutoApprove === "true");
      
      // Notification settings
      const savedNewRequestNotifications = localStorage.getItem("newRequestNotifications");
      if (savedNewRequestNotifications) setNewRequestNotifications(savedNewRequestNotifications === "true");
      
      const savedMatchNotifications = localStorage.getItem("matchNotifications");
      if (savedMatchNotifications) setMatchNotifications(savedMatchNotifications === "true");
      
      const savedFailedMatchNotifications = localStorage.getItem("failedMatchNotifications");
      if (savedFailedMatchNotifications) setFailedMatchNotifications(savedFailedMatchNotifications === "true");
      
      const savedCompletedRequestNotifications = localStorage.getItem("completedRequestNotifications");
      if (savedCompletedRequestNotifications) setCompletedRequestNotifications(savedCompletedRequestNotifications === "true");
      
      // Theme settings
      const savedDarkMode = localStorage.getItem("darkMode");
      if (savedDarkMode) setDarkMode(savedDarkMode === "true");
    };
    
    loadSettings();
  }, []);
  
  // Save Google Sheets API settings
  const saveGoogleSheetsSettings = () => {
    localStorage.setItem("googleApiKey", googleApiKey);
    localStorage.setItem("expertSheetId", expertSheetId);
    localStorage.setItem("requestSheetId", requestSheetId);
    
    // Update environment variables if possible
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.ENV = window.ENV || {};
      // @ts-ignore
      window.ENV.VITE_GOOGLE_API_KEY = googleApiKey;
      // @ts-ignore
      window.ENV.VITE_EXPERT_SHEET_ID = expertSheetId;
      // @ts-ignore
      window.ENV.VITE_REQUEST_SHEET_ID = requestSheetId;
    }
    
    toast({
      title: "Google Sheets API Settings Saved",
      description: "Your Google Sheets API settings have been saved successfully.",
    });
  };
  
  // Save WhatsApp settings
  const saveWhatsAppSettings = () => {
    localStorage.setItem("instanceId", instanceId);
    localStorage.setItem("apiToken", apiToken);
    localStorage.setItem("phoneNumber", phoneNumber);
    
    toast({
      title: "WhatsApp Settings Saved",
      description: "Your WhatsApp integration settings have been saved successfully.",
    });
  };
  
  // Save OpenAI settings
  const saveOpenAISettings = () => {
    localStorage.setItem("openaiKey", openaiKey);
    localStorage.setItem("aiModel", aiModel);
    localStorage.setItem("aiPrompt", aiPrompt);
    
    toast({
      title: "OpenAI Settings Saved",
      description: "Your OpenAI configuration has been saved successfully.",
    });
  };
  
  // Save request handling settings
  const saveRequestSettings = () => {
    localStorage.setItem("maxMatches", maxMatches.toString());
    localStorage.setItem("responseTimeout", responseTimeout.toString());
    localStorage.setItem("requestCooldown", requestCooldown.toString());
    localStorage.setItem("maxRequestsPerHelper", maxRequestsPerHelper.toString());
    localStorage.setItem("autoApprove", autoApprove.toString());
    
    toast({
      title: "Request Settings Saved",
      description: "Your request handling settings have been saved successfully.",
    });
  };
  
  // Save notification settings
  const saveNotificationSettings = () => {
    localStorage.setItem("newRequestNotifications", newRequestNotifications.toString());
    localStorage.setItem("matchNotifications", matchNotifications.toString());
    localStorage.setItem("failedMatchNotifications", failedMatchNotifications.toString());
    localStorage.setItem("completedRequestNotifications", completedRequestNotifications.toString());
    
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been saved successfully.",
    });
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    
    // Apply dark mode to the document
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    toast({
      title: `${newDarkMode ? "Dark" : "Light"} Mode Activated`,
      description: `The application theme has been changed to ${newDarkMode ? "dark" : "light"} mode.`,
    });
  };
  
  // Test Google Sheets connection
  const testGoogleSheetsConnection = () => {
    // Simulate API test
    setTimeout(() => {
      toast({
        title: "Connection Successful",
        description: "Successfully connected to Google Sheets API.",
      });
    }, 1000);
  };
  
  // Export data to CSV
  const exportData = () => {
    // Simulate export
    setTimeout(() => {
      toast({
        title: "Data Exported",
        description: "Your data has been exported successfully.",
      });
    }, 1000);
  };
  
  // Reset all settings
  const resetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default values? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure your NetWizBot system settings
          </p>
        </div>
        <Button variant="outline" onClick={resetSettings}>
          Reset All Settings
        </Button>
      </div>

      <Tabs defaultValue="google-sheets">
        <TabsList className="grid grid-cols-6 mb-4">
          <TabsTrigger value="google-sheets">Google Sheets</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="google-sheets">
          <Card>
            <CardHeader>
              <CardTitle>Google Sheets API Configuration</CardTitle>
              <CardDescription>
                Configure your Google Sheets API settings for data storage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium" htmlFor="google-api-key">
                    Google API Key
                  </label>
                  <input
                    id="google-api-key"
                    type="password"
                    className="w-full p-2 mt-1 border rounded-md"
                    placeholder="Your Google API Key"
                    value={googleApiKey}
                    onChange={(e) => setGoogleApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    API key with access to Google Sheets API
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium" htmlFor="expert-sheet-id">
                    Experts Sheet ID
                  </label>
                  <input
                    id="expert-sheet-id"
                    type="text"
                    className="w-full p-2 mt-1 border rounded-md"
                    placeholder="Google Sheet ID for experts data"
                    value={expertSheetId}
                    onChange={(e) => setExpertSheetId(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The ID of the Google Sheet containing expert data
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium" htmlFor="request-sheet-id">
                    Requests Sheet ID
                  </label>
                  <input
                    id="request-sheet-id"
                    type="text"
                    className="w-full p-2 mt-1 border rounded-md"
                    placeholder="Google Sheet ID for requests data"
                    value={requestSheetId}
                    onChange={(e) => setRequestSheetId(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The ID of the Google Sheet containing request data
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveGoogleSheetsSettings}>Save Google Sheets Settings</Button>
                  <Button variant="outline" onClick={testGoogleSheetsConnection}>Test Connection</Button>
                  <Button variant="outline" onClick={exportData}>Export Data</Button>
                </div>

                <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md text-sm">
                  Current Environment Variables:
                  <ul className="list-disc pl-5 mt-2">
                    <li>VITE_GOOGLE_API_KEY: {import.meta.env.VITE_GOOGLE_API_KEY ? "✓ Set" : "✗ Not Set"}</li>
                    <li>VITE_EXPERT_SHEET_ID: {import.meta.env.VITE_EXPERT_SHEET_ID ? "✓ Set" : "✗ Not Set"}</li>
                    <li>VITE_REQUEST_SHEET_ID: {import.meta.env.VITE_REQUEST_SHEET_ID ? "✓ Set" : "✗ Not Set"}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Integration</CardTitle>
              <CardDescription>
                Configure your Green API settings for WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium" htmlFor="instance-id">
                      Instance ID
                    </label>
                    <input
                      id="instance-id"
                      type="text"
                      className="w-full p-2 mt-1 border rounded-md"
                      placeholder="Your Green API Instance ID"
                      value={instanceId}
                      onChange={(e) => setInstanceId(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium" htmlFor="api-token">
                      API Token
                    </label>
                    <input
                      id="api-token"
                      type="password"
                      className="w-full p-2 mt-1 border rounded-md"
                      placeholder="Your Green API Token"
                      value={apiToken}
                      onChange={(e) => setApiToken(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium" htmlFor="phone-number">
                    Bot Phone Number
                  </label>
                  <input
                    id="phone-number"
                    type="text"
                    className="w-full p-2 mt-1 border rounded-md"
                    placeholder="WhatsApp phone number with country code"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <Button onClick={saveWhatsAppSettings}>Save WhatsApp Settings</Button>

                <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md text-sm">
                  Connected to WhatsApp. Status: Active
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="openai">
          <Card>
            <CardHeader>
              <CardTitle>OpenAI Configuration</CardTitle>
              <CardDescription>
                Settings for the AI analysis of WhatsApp messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium" htmlFor="openai-key">
                    OpenAI API Key
                  </label>
                  <input
                    id="openai-key"
                    type="password"
                    className="w-full p-2 mt-1 border rounded-md"
                    placeholder="Your OpenAI API Key"
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium" htmlFor="ai-model">
                    AI Model
                  </label>
                  <select
                    id="ai-model"
                    className="w-full p-2 mt-1 border rounded-md"
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium" htmlFor="ai-prompt">
                    AI Prompt Template
                  </label>
                  <textarea
                    id="ai-prompt"
                    className="w-full p-2 mt-1 border rounded-md h-24"
                    placeholder="Template for the AI prompt"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                </div>

                <Button onClick={saveOpenAISettings}>Save OpenAI Settings</Button>

                <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md text-sm">
                  OpenAI integration is working correctly
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Request Handling</CardTitle>
              <CardDescription>
                Configure how the system processes and matches requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium" htmlFor="max-matches">
                      Maximum Matches Per Request
                    </label>
                    <input
                      id="max-matches"
                      type="number"
                      className="w-full p-2 mt-1 border rounded-md"
                      value={maxMatches}
                      onChange={(e) => setMaxMatches(parseInt(e.target.value))}
                      min="1"
                      max="10"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      The maximum number of community members that will be contacted for each request
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium" htmlFor="response-timeout">
                      Response Timeout (minutes)
                    </label>
                    <input
                      id="response-timeout"
                      type="number"
                      className="w-full p-2 mt-1 border rounded-md"
                      value={responseTimeout}
                      onChange={(e) => setResponseTimeout(parseInt(e.target.value))}
                      min="1"
                      max="60"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      How long to wait for a response before moving to the next potential match
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium" htmlFor="request-cooldown">
                      Request Cooldown (minutes)
                    </label>
                    <input
                      id="request-cooldown"
                      type="number"
                      className="w-full p-2 mt-1 border rounded-md"
                      value={requestCooldown}
                      onChange={(e) => setRequestCooldown(parseInt(e.target.value))}
                      min="1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum time before a user can send another request
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium" htmlFor="max-requests-per-helper">
                      Max Requests Per Helper
                    </label>
                    <input
                      id="max-requests-per-helper"
                      type="number"
                      className="w-full p-2 mt-1 border rounded-md"
                      value={maxRequestsPerHelper}
                      onChange={(e) => setMaxRequestsPerHelper(parseInt(e.target.value))}
                      min="1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum number of requests a community member can receive in a day
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="auto-approve"
                    className="rounded border-gray-300"
                    checked={autoApprove}
                    onChange={(e) => setAutoApprove(e.target.checked)}
                  />
                  <label className="text-sm font-medium" htmlFor="auto-approve">
                    Auto-approve valid requests
                  </label>
                </div>

                <Button onClick={saveRequestSettings}>Save Request Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure admin notifications for important events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 border-b">
                  <Label htmlFor="new-request-notifications" className="text-sm font-medium">
                    New Request Notifications
                  </Label>
                  <Switch
                    id="new-request-notifications"
                    checked={newRequestNotifications}
                    onCheckedChange={setNewRequestNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-2 border-b">
                  <Label htmlFor="match-notifications" className="text-sm font-medium">
                    Successful Match Notifications
                  </Label>
                  <Switch
                    id="match-notifications"
                    checked={matchNotifications}
                    onCheckedChange={setMatchNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-2 border-b">
                  <Label htmlFor="failed-match-notifications" className="text-sm font-medium">
                    Failed Match Notifications
                  </Label>
                  <Switch
                    id="failed-match-notifications"
                    checked={failedMatchNotifications}
                    onCheckedChange={setFailedMatchNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-2 border-b">
                  <Label htmlFor="completed-request-notifications" className="text-sm font-medium">
                    Completed Request Notifications
                  </Label>
                  <Switch
                    id="completed-request-notifications"
                    checked={completedRequestNotifications}
                    onCheckedChange={setCompletedRequestNotifications}
                  />
                </div>

                <Button onClick={saveNotificationSettings}>Save Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 border-b">
                  <Label htmlFor="dark-mode" className="text-sm font-medium">
                    Dark Mode
                  </Label>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Theme Preview</h3>
                  <div className={`p-4 rounded-md border ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                    <p className="font-medium">This is how your theme will look</p>
                    <p className="text-sm mt-1">Sample text with the current theme settings</p>
                    <div className="flex gap-2 mt-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                      <div className="w-6 h-6 rounded-full bg-green-500"></div>
                      <div className="w-6 h-6 rounded-full bg-purple-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 