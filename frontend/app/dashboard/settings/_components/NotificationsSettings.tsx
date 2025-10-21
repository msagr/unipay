"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface NotificationSettingsProps {
  initialSettings?: {
    email: boolean;
    push: boolean;
    weeklyDigest: boolean;
    marketing: boolean;
  };
  onSave?: (settings: {
    email: boolean;
    push: boolean;
    weeklyDigest: boolean;
    marketing: boolean;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function NotificationsSettings({ 
  initialSettings = {
    email: true,
    push: true,
    weeklyDigest: true,
    marketing: false,
  },
  onSave,
  isLoading = false,
}: NotificationSettingsProps) {
  const [settings, setSettings] = useState(initialSettings);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = async () => {
    if (onSave) {
      await onSave(settings);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Configure how you receive notifications.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
          </div>
          <Switch
            id="email-notifications"
            checked={settings.email}
            onCheckedChange={() => handleToggle('email')}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <p className="text-sm text-muted-foreground">Receive push notifications</p>
          </div>
          <Switch
            id="push-notifications"
            checked={settings.push}
            onCheckedChange={() => handleToggle('push')}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="weekly-digest">Weekly Digest</Label>
            <p className="text-sm text-muted-foreground">Get a weekly summary of your activity</p>
          </div>
          <Switch
            id="weekly-digest"
            checked={settings.weeklyDigest}
            onCheckedChange={() => handleToggle('weeklyDigest')}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="marketing-emails">Marketing Emails</Label>
            <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
          </div>
          <Switch
            id="marketing-emails"
            checked={settings.marketing}
            onCheckedChange={() => handleToggle('marketing')}
            disabled={isLoading}
          />
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Preferences"}
        </Button>
      </CardFooter>
    </Card>
  );
}
