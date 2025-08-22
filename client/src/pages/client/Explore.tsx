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
import { motion } from "framer-motion";
import type { JournalEntryType } from "@/types/JournalEntryType";
import { getPublicJournalEntries } from "@/api/requests/journalEntryService";
import ExploreJournalCard from "@/components/client/ExploreJournalCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Explore = () => {
  const [travelLists, setTravelLists] = useState<TravelListType[]>([]);
  const [journals, setJournals] = useState<JournalEntryType[]>([]);
  const [loading, setLoading] = useState(false);

  // pagination states
  const [listPage, setListPage] = useState(1);
  const [journalPage, setJournalPage] = useState(1);
  const [listTotalPages, setListTotalPages] = useState(1);
  const [journalTotalPages, setJournalTotalPages] = useState(1);

  const limit = 3;
  const currentUserId = useSelector((s: RootState) => s.user.data?.id);

  // Fetch Travel Lists
  useEffect(() => {
    if (!currentUserId) return;
    const fetchTravelLists = async () => {
      setLoading(true);
      try {
        const response = await getPublicTravelLists({
          page: listPage,
          limit,
          excludeUserId: currentUserId,
        });
        setTravelLists(response?.lists || []);
        setListTotalPages(response?.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch travel lists:", error);
        setTravelLists([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTravelLists();
  }, [currentUserId, listPage]);

  // Fetch Journals
  useEffect(() => {
    if (!currentUserId) return;
    const fetchJournals = async () => {
      setLoading(true);
      try {
        const response = await getPublicJournalEntries({
          page: journalPage,
          limit,
          excludeUserId: currentUserId,
        });

        console.log('Travel Lists Response:', response);

        setJournals(response?.entries || []);
        setJournalTotalPages(response?.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch journals:", error);
        setJournals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJournals();
  }, [currentUserId, journalPage]);

  // Helper to render pagination
  const renderPagination = (
    currentPage: number,
    totalPages: number,
    onChange: (page: number) => void
  ) => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={i + 1 === currentPage}
                onClick={() => onChange(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
              className={
                currentPage === totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

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
            <>
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
              {renderPagination(listPage, listTotalPages, setListPage)}
            </>
          )}
        </TabsContent>

        {/* Journal Entries */}
        <TabsContent value="journal">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : journals.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              No journal entries yet.
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {journals.map((journal) => (
                    <ExploreJournalCard key={journal.id} journal={journal} />
                  ))}
                </div>
              </motion.div>
              {renderPagination(journalPage, journalTotalPages, setJournalPage)}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Explore;
