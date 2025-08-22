import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TravelListType } from "@/types/TravelListType";
import ExploreListCard from "@/components/client/ExploreListCard";
import { useEffect, useState } from "react";
import { getPublicTravelLists } from "@/api/requests/travelListService";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import JournalEntriesMock from "@/components/client/ExploreJournalCard";
import { motion } from "framer-motion";

const Explore = () => {
  const [travelLists, setTravelLists] = useState<TravelListType[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUserId = useSelector((s: RootState) => s.user.data?.id);

  useEffect(() => {
    const fetchTravelLists = async () => {
      setLoading(true);
      try {
        const response = await getPublicTravelLists();
        const allLists = response?.data?.lists || [];


        const filteredLists = allLists.filter(
          (list: TravelListType) => list.owner?.id !== currentUserId
        );

        setTravelLists(filteredLists);
      } catch (error) {
        console.error("Failed to fetch travel lists:", error);
        setTravelLists([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchTravelLists();
  }, [currentUserId]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-bold">Explore Travel Inspiration</h1>
        <p className="text-muted-foreground mt-3">
          Discover amazing destinations and read inspiring travel stories from
          our community
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <Input
          placeholder="Search destinations, lists, or stories..."
          className="w-full bg-white"
        />
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Most Popular</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Most Popular</DropdownMenuItem>
              <DropdownMenuItem>Newest</DropdownMenuItem>
              <DropdownMenuItem>Top Rated</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline">Filters</Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="lists">
        <TabsList className="mb-6 mx-auto w-md">
          <TabsTrigger value="lists" className="py-4">
            Travel Lists
          </TabsTrigger>
          <TabsTrigger value="journal" className="py-4">
            Journal Entries
          </TabsTrigger>
        </TabsList>

        {/* Travel Lists */}
        <TabsContent value="lists">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : travelLists.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              No destinations yet.
            </div>
          ) : (
                <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="h-full"
    >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {travelLists.map((list) => (
                <ExploreListCard key={list.id} list={list} />
              ))}
            </div>
    </motion.div>
          )}
        </TabsContent>

        {/* Journal Entries */}
        <TabsContent value="journal">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <>
              {/* Replace JournalEntriesMock with real data fetch later */}
              <JournalEntriesMock />
              {/* If no data, show fallback */}
              {/* Example: conditionally render */}
              {/* {journals.length === 0 && ( */}
              <div className="text-center text-muted-foreground py-12">
                No journal entries yet.
              </div>
              {/* )} */}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Explore;
