import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, Users, Globe, MapPin } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const Explore = () => {
  const [activeTab, setActiveTab] = useState("lists")

  const travelLists = [
    {
      id: 1,
      title: "Hidden Gems of Southeast Asia",
      description: "Off-the-beaten-path destinations that will take your breath away",
      destinations: 15,
      rating: 4.8,
      likes: 234,
      views: 1520,
      tags: ["adventure", "culture", "budget"],
    },
    {
      id: 2,
      title: "European Christmas Markets Tour",
      description: "The most magical Christmas markets across Germany, Austria, and Czech Republic",
      destinations: 8,
      rating: 4.9,
      likes: 189,
      views: 892,
      tags: ["winter", "culture", "food"],
    },
    {
      id: 3,
      title: "Solo Female Travel: Safe & Amazing Destinations",
      description: "Carefully curated destinations perfect for solo female travelers",
      destinations: 20,
      rating: 4.7,
      likes: 456,
      views: 2340,
      tags: ["solo", "safety", "adventure"],
    },
  ]

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Explore Travel Inspiration</h1>
        <p className="text-muted-foreground">
          Discover amazing destinations and read inspiring travel stories from our community
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <Input
          placeholder="Search destinations, lists, or stories..."
          className="w-full sm:w-1/2"
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
      <Tabs defaultValue="lists" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="lists">Travel Lists</TabsTrigger>
          <TabsTrigger value="journal">Journal Entries</TabsTrigger>
        </TabsList>

        {/* Travel Lists */}
        <TabsContent value="lists">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {travelLists.map((list) => (
              <Card key={list.id} className="hover:shadow-lg transition rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">{list.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{list.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4 mr-1" /> {list.destinations} destinations
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {list.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" /> {list.rating}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500" /> {list.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {list.views}
                  </div>
                  <Badge variant="outline" className="ml-auto flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Public
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Journal Entries (placeholder) */}
        <TabsContent value="journal">
          <div className="text-center text-muted-foreground py-12">
            No journal entries yet.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Explore
