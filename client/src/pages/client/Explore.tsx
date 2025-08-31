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
import { useEffect, useState, useMemo } from "react";
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

  // search, sort & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("popular"); // "popular" | "newest" | "rated"
  const [filters, setFilters] = useState({
    year: "all", // all | this | last
  });

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

  // Filter + Search + Sort function
  const applyFilters = <
    T extends {
      title?: string;
      description?: string;
      rating?: number;
      createdAt?: string | Date
    }
  >(
    items: T[]
  ): T[] => {
    let result = [...items];

    // search
    if (searchQuery.trim()) {
      result = result.filter((i) =>
        [i.title, i.description].join(" ").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // year filter
    if (filters.year !== "all") {
      const thisYear = new Date().getFullYear();
      result = result.filter((i) => {
        if (!i.createdAt) return false;
        const year = new Date(i.createdAt).getFullYear(); // works with string or Date
        return filters.year === "this" ? year === thisYear : year === thisYear - 1;
      });
    }

    // sort
    switch (sortOption) {
      case "newest":
        result.sort((a, b) =>
          a.createdAt && b.createdAt
            ? +new Date(b.createdAt) - +new Date(a.createdAt)
            : 0
        );
        break;
      case "rated":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default: // popular
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    return result;
  };


  const filteredTravelLists = useMemo(() => applyFilters(travelLists), [travelLists, searchQuery, sortOption, filters]);
  const filteredJournals = useMemo(() => applyFilters(journals), [journals, searchQuery, sortOption, filters]);

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
              <PaginationLink isActive={i + 1 === currentPage} onClick={() => onChange(i + 1)}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
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
          Discover amazing destinations and read inspiring travel stories from our community
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <Input
          placeholder="Search destinations, lists, or stories..."
          className="w-full bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortOption("popular")}>Most Popular</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("newest")}>Newest</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("rated")}>Top Rated</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Filters</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilters({ ...filters, year: "all" })}>All Years</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({ ...filters, year: "this" })}>This Year</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({ ...filters, year: "last" })}>Last Year</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          ) : filteredTravelLists.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">No destinations yet.</div>
          ) : (
            <>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTravelLists.map((list) => (
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
          ) : filteredJournals.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">No journal entries yet.</div>
          ) : (
            <>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredJournals.map((journal) => (
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