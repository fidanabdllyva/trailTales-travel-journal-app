import { useState } from "react";
import {
  AtSign,
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
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ProfileLocation from "@/components/client/ProfileLocation";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { FaTimes } from "react-icons/fa";
import ProfileSocials from "@/components/client/ProfileSocials";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import EditProfile from "@/components/client/EditProfile";
import ProfileAvatar from "@/components/client/ProfileImage";


const ProfilePage = () => {
  const { data: user, status: userStatus } = useSelector(
    (state: RootState) => state.user
  );

  if (userStatus === "loading") return <LoadingSpinner />;
  if (!user) return <div>No user data found.</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 ">
      {/* Profile card */}
      <Card className="flex flex-col md:flex-row items-center  space-y-6 md:space-y-0 md:space-x-10 p-6">
        {/* Avatar */}
        <div className="relative">
          {/* <Avatar className="w-28 h-28">
            <AvatarImage src={user.profileImage} alt={user.fullName} />
            <AvatarFallback>{user.fullName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 rounded-full p-2 bg-black  hover:bg-opacity-90"
            aria-label="Upload photo"
          >
            <Camera className="w-5 h-5 text-white" />
          </Button> */}

          <ProfileAvatar user={user} />
        </div>


        {/* User info */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{user.fullName}</h1>

            <EditProfile />

          </div>
          <div className="flex flex-col gap-2 mt-3 text-muted-foreground">

            <div className="flex items-center gap-1">
              <AtSign className="w-4 h-4" />
              <p className="mb-1 text-lg">{user.username}</p>
            </div>

            <ProfileLocation />

            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Member since {moment(user.createdAt).format('LL')}</span>
            </div>

            <div className="mt-3">
              {user.bio ? (
                <span> {user.bio}</span>
              )
                : (
                  <span className="text-muted-foreground">No bio available</span>
                )}

            </div>
          </div>


          <div className="flex flex-col gap-2 mt-4 text-muted-foreground">
            <span className="text-sm">Social Links:</span>

            <ProfileSocials />
          </div>

          {/* Stats */}

          {/* <div className="mt-6 flex flex-wrap gap-10 text-center text-foreground">
            {Object.entries(user.stats).map(([key, value]) => (
              <div key={key}>
                <div className="text-2xl font-bold">{value}</div>
                <div className="capitalize">{key}</div>
              </div>
            ))}
          </div> */}

        </div>
      </Card>

      {/* Tabs */}

      <Tabs defaultValue="recent" className="mt-10">
        <TabsList className="border">
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
            {/* {user.recentActivity.map((activity) => (
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
            ))} */}
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
