import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-muted-foreground">
        Configure your NetWizBot system settings
      </p>

      <div className="grid grid-cols-1 gap-6">
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
                    defaultValue="instanceId123"
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
                    defaultValue="••••••••••••••••"
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
                  defaultValue="+972 50 123 4567"
                />
              </div>

              <Button>Save WhatsApp Settings</Button>

              <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md text-sm">
                Connected to WhatsApp. Status: Active
              </div>
            </div>
          </CardContent>
        </Card>

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
                  placeholder="Your teOpenAI API Key"
                  defaultValue="••••••••••••••••"
                />
              </div>

              <div>
                <label className="text-sm font-medium" htmlFor="ai-model">
                  AI Model
                </label>
                <select
                  id="ai-model"
                  className="w-full p-2 mt-1 border rounded-md"
                  defaultValue="gpt-4"
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
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
                  defaultValue={`Analyze the following request and categorize it into one of these categories: Technology, Recruitment, Funding, Business, Community. If it's not a valid request, respond with "IGNORE". Otherwise, respond with "VALID" followed by the category. Request: {{message}}`}
                />
              </div>

              <Button>Save OpenAI Settings</Button>

              <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md text-sm">
                OpenAI integration is working correctly
              </div>
            </div>
          </CardContent>
        </Card>

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
                    defaultValue="3"
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
                    defaultValue="10"
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
                    defaultValue="60"
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
                    defaultValue="5"
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
                  defaultChecked
                />
                <label className="text-sm font-medium" htmlFor="auto-approve">
                  Auto-approve valid requests
                </label>
              </div>

              <Button>Save Request Settings</Button>
            </div>
          </CardContent>
        </Card>

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
                <label className="text-sm font-medium">
                  New Request Notifications
                </label>
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  defaultChecked
                />
              </div>

              <div className="flex items-center justify-between p-2 border-b">
                <label className="text-sm font-medium">
                  Successful Match Notifications
                </label>
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  defaultChecked
                />
              </div>

              <div className="flex items-center justify-between p-2 border-b">
                <label className="text-sm font-medium">
                  Failed Match Notifications
                </label>
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  defaultChecked
                />
              </div>

              <div className="flex items-center justify-between p-2">
                <label className="text-sm font-medium">
                  Daily Summary Report
                </label>
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  defaultChecked
                />
              </div>

              <div>
                <label className="text-sm font-medium" htmlFor="admin-phone">
                  Admin Phone Number
                </label>
                <input
                  id="admin-phone"
                  type="text"
                  className="w-full p-2 mt-1 border rounded-md"
                  placeholder="Admin's WhatsApp number"
                  defaultValue="+972 50 987 6543"
                />
              </div>

              <Button>Save Notification Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 