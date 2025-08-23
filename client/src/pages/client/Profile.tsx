import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import moment from "moment";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import LoadingSpinner from "@/components/common/LoadingSpinner";

import ProfileAvatar from "@/components/client/ProfileImage";
import ProfileLocation from "@/components/client/ProfileLocation";
import ProfileSocials from "@/components/client/ProfileSocials";
import EditProfile from "@/components/client/EditProfile";
import ChangePassword from "@/components/client/ChangePassword";

import { buildAchievements, buildRecentActivity } from "@/utils/profileUtil";
import { getUserOwnJournal } from "@/api/requests/journalEntryService";
import { getUserTravelLists } from "@/api/requests/travelListService";
import { getDestinationsByList } from "@/api/requests/destinationService";
import type { JournalEntryType } from "@/types/JournalEntryType";
import type { TravelListType } from "@/types/TravelListType";
import type { DestinationType } from "@/types/DestinationType";

// API services


const ProfilePage = () => {
  const { data: user, status: userStatus } = useSelector(
    (state: RootState) => state.user
  );

const [journals, setJournals] = useState<JournalEntryType[]>([]);
const [lists, setLists] = useState<TravelListType[]>([]);
const [destinations, setDestinations] = useState<DestinationType[]>([]);
const [loading, setLoading] = useState(true);


  // Fetch user-related data
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Journals
        const journalRes = await getUserOwnJournal();
        setJournals(journalRes.data || []);

        // Lists
        const listsRes = await getUserTravelLists();
        const userLists = listsRes.data || [];
        setLists(userLists);

        // Destinations for all lists
        const allDestinations = await Promise.all(
          userLists.map((list) => getDestinationsByList(list.id))
        );
        setDestinations(allDestinations.flat());

      } catch (err) {
        console.error("Failed to fetch profile data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (userStatus === "loading" || loading) return <LoadingSpinner />;
  if (!user) return <div>No user data found.</div>;

  // Build activities & achievements
  const activities = buildRecentActivity(user, journals, destinations, lists);
  const achievements = buildAchievements(user, destinations, lists);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Profile Card */}
      <Card className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-10 p-6">
        <ProfileAvatar />

        <div className="flex-1 w-full">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{user.fullName}</h1>
            <div className="flex items-center gap-4">
              <EditProfile />
              {user.authProvider !== "google" && <ChangePassword />}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-3 text-muted-foreground">
            <ProfileLocation />
            <div className="mt-3 w-full">
              {user.bio ? (
                <p className="break-all overflow-hidden text-ellipsis">{user.bio}</p>
              ) : (
                <p className="text-muted-foreground">No bio available</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4 text-muted-foreground">
            <span className="text-sm">Social Links:</span>
            <ProfileSocials />
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="recent" className="mt-10">
        <TabsList className="border">
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <h2 className="text-xl font-bold mb-2">Recent Activity</h2>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-muted-foreground">No recent activity yet.</p>
            ) : (
              activities.map((activity) => (
                <Card key={activity.id} className="flex flex-row items-center justify-between p-4 space-x-4">
                  {/* Left: Image */}
                  <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground overflow-hidden flex-shrink-0">
                    {activity.image ? (
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      "IMG"
                    )}
                  </div>

                  {/* Middle: Info */}
                  <div className="flex-1">
                    <div className="font-semibold">{activity.title}</div>
                    <div className="text-muted-foreground text-sm">{activity.description}</div>
                    <div className="text-muted-foreground text-xs mt-1">
                      {moment(activity.date).format("LL")}
                    </div>
                  </div>

                  {/* Right: Type Badge */}
                  <div>
                    <span className="border border-gray-400 text-xs rounded-full px-3 py-1 capitalize">
                      {activity.type}
                    </span>
                  </div>
                </Card>

              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <h2 className="text-xl font-bold mb-2">Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            {achievements.map((ach) => (
              <Card key={ach.id} className="p-4 text-center">
                <CardContent>
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${ach.unlocked ? "bg-yellow-200" : "bg-gray-200"
                      }`}
                  >
                    ⭐
                  </div>
                  <h3 className="font-semibold">{ach.title}</h3>
                  <p className="text-sm text-muted-foreground">{ach.description}</p>
                  <span
                    className={`mt-2 inline-block text-xs px-2 py-1 rounded-full ${ach.unlocked
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    {ach.unlocked ? "Unlocked" : "Locked"}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
