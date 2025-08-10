import { useState } from "react";
import {
  MapPin,
  Calendar,
  Camera,
  Pencil,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("recent");

  const user = {
    name: "John Doe",
    location: "San Francisco, CA",
    memberSince: "January 2024",
    bio: "Travel enthusiast exploring the world one destination at a time. Love discovering hidden gems and sharing travel tips!",
    website: "johndoe.travel",
    instagram: "@johndoe_travels",
    twitter: "@johndoe",
    stats: {
      destinations: 26,
      completed: 11,
      lists: 3,
      entries: 8,
      followers: 124,
      following: 89,
    },
    recentActivity: [
      {
        id: 1,
        title: "Added new journal entry",
        description: "A Perfect Day in Paris",
        date: "1/20/2024",
        tag: "journal",
      },
      {
        id: 2,
        title: "Completed destination",
        description: "Rome, Italy",
        date: "1/18/2024",
        tag: "destination",
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Profile card */}
      <Card className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10 p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">

            <p>@username</p>

        <div className="relative">
          <Avatar className="w-28 h-28">
            {/* Replace with AvatarImage if you have user photo */}
            <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 rounded-full p-2 bg-black bg-opacity-70 hover:bg-opacity-90"
            aria-label="Upload photo"
          >
            <Camera className="w-5 h-5 text-white" />
          </Button>
        </div>
        </div>

        {/* User info */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <Button variant="default" size="sm" className="flex items-center gap-2">
              <Pencil className="w-5 h-5" />
              Edit Profile
            </Button>
          </div>
          <div className="flex items-center gap-6 mt-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-5 h-5" />
              <span>{user.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-5 h-5" />
              <span>Member since {user.memberSince}</span>
            </div>
          </div>
          <p className="mt-4 text-muted-foreground max-w-xl">{user.bio}</p>
          <div className="flex items-center gap-6 mt-4 text-muted-foreground">
            <a
              href={`https://${user.website}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              🌐 {user.website}
            </a>
            <a
              href={`https://instagram.com/${user.instagram.replace("@", "")}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              📸 {user.instagram}
            </a>
            <a
              href={`https://twitter.com/${user.twitter.replace("@", "")}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              🐦 {user.twitter}
            </a>
          </div>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap gap-10 text-center text-foreground">
            {Object.entries(user.stats).map(([key, value]) => (
              <div key={key}>
                <div className="text-2xl font-bold">{value}</div>
                <div className="capitalize">{key}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-10">
        <TabsList>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <h2 className="text-xl font-bold mb-2">Recent Activity</h2>
          <p className="text-muted-foreground mb-4">
            Your latest travel updates and milestones
          </p>
          <div className="space-y-4">
            {user.recentActivity.map((activity) => (
              <Card
                key={activity.id}
                className="flex items-center space-x-4 p-4"
                
              >
                <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                  IMG
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{activity.title}</div>
                  <div className="text-muted-foreground text-sm">
                    {activity.description}
                  </div>
                  <div className="text-muted-foreground text-xs mt-1">
                    {activity.date}
                  </div>
                </div>
                <div>
                  <span className="border border-gray-400 text-xs rounded-full px-3 py-1">
                    {activity.tag}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <h2 className="text-xl font-bold mb-2">Achievements</h2>
          <p className="text-muted-foreground">You have no achievements yet.</p>
        </TabsContent>

        <TabsContent value="settings">
          <h2 className="text-xl font-bold mb-2">Settings</h2>
          <p className="text-muted-foreground">Settings content goes here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
