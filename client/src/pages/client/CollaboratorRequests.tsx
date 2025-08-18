import  { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { getCollaboratorRequests, respondToCollaboratorRequest } from "@/api/requests/userService";

const CollaboratorRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [responding, setResponding] = useState<string | null>(null);

  // Fetch requests on mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await getCollaboratorRequests();
        console.log(res.data.data)
        setRequests(res.data.data || []);
      } catch (err: any) {
        toast.error(err.message || "Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Handle Accept/Reject
  const handleResponse = async (id: string, accept: boolean) => {
    try {
      setResponding(id);
      await respondToCollaboratorRequest(id, accept);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success(accept ? "Request accepted ✅" : "Request rejected ❌");
    } catch (err: any) {
      toast.error(err.message || "Failed to respond");
    } finally {
      setResponding(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Collaborator Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : requests.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No pending requests</p>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="flex justify-between items-center p-4 border rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <p className="font-medium">{req.fromUser.fullName || "Unknown User"}</p>
                    <p className="text-sm text-gray-500">{req.fromUser?.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={responding === req.id}
                      onClick={() => handleResponse(req.id, true)}
                    >
                      {responding === req.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={responding === req.id}
                      onClick={() => handleResponse(req.id, false)}
                    >
                      {responding === req.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CollaboratorRequests;
