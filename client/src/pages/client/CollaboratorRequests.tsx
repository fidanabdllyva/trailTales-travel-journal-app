import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, Eye, Lock } from "lucide-react";
import { toast } from "sonner";
import { getCollaboratorRequests, respondToCollaboratorRequest } from "@/api/requests/userService";
import moment from "moment";

const CollaboratorRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [responding, setResponding] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await getCollaboratorRequests();

        // Sort by createdAt descending (newest first)
        const sorted = (res.data.data || []).sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setRequests(sorted);
        console.log(requests)
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
      toast.success(accept ? "Request accepted" : "Request rejected");
    } catch (err: any) {
      toast.error(err.message || "Failed to respond");
    } finally {
      setResponding(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-10">
      <Card className="py-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Collaborator Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : requests.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No pending requests
            </p>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between gap-3 p-4 border rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <div>
                    {/* User Info */}
                    <div className="flex items-center gap-2">
                      <img
                        src={req.fromUser.profileImage}
                        alt={req.fromUser.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">
                          {req.fromUser.fullName || "Unknown User"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {req.fromUser?.email}
                        </p>
                      </div>
                    </div>

                    {/* Travel List Info */}
                    <div className="text-sm mt-4">
                      <p>
                        <span className="font-medium">
                          {req.fromUser.fullName}
                        </span>{" "}
                        {req.travelList?.isPublic
                          ? "requested to join the list"
                          : "invited you to their private list"}{" "}
                        <span className="font-semibold inline-flex items-center gap-1">
                          {!req.travelList?.isPublic && (
                            <Lock className="h-3 w-3 text-gray-500" />
                          )}
                          {req.travelList?.title || "Untitled"}
                        </span>
                      </p>
                      <p className="text-gray-500">
                        {moment(req.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {req.travelList?.isPublic && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          (window.location.href = `/travel-list/${req.travelList?.id}`)
                        }
                      >
                        <Eye className="h-4 w-4 mr-1" /> View List
                      </Button>
                    )}

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
