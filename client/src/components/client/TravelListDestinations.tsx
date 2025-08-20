"use client";

import { useState, type JSX } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Trash, CalendarDays, CalendarCheck2, CalendarClock, CircleCheckBig, AlarmClock, Heart, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../ui/dialog";
import { toast } from "sonner";
import type { DestinationType } from "@/types/DestinationType";
import moment from "moment";
import { deleteDestination } from "@/api/requests/destinationService";
import DestinationEdit from "./DestinationEdit";

interface TravelListDestinationProp {
    destination: DestinationType;
    onDeleted?: (id: string) => void;
    onUpdated?: (updated: DestinationType) => void;
}

const TravelListDestinations = ({ destination: d, onDeleted, onUpdated }: TravelListDestinationProp) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await deleteDestination(d.id);
            if (res.success) {
                toast.success(res.message || "Destination deleted successfully");
                setOpenDelete(false);
                onDeleted?.(d.id);
            } else {
                toast.error(res.message || "Failed to delete destination");
            }
        } catch (err) {
            toast.error("Error deleting destination");
        } finally {
            setIsDeleting(false);
        }
    };

    const statusMap: Record<string, { label: string; textColor: string; bgColor: string; icon?: JSX.Element }> = {
        completed: { label: "Completed", textColor: "text-green-700", bgColor: "bg-green-100", icon: <CircleCheckBig size={13} /> },
        planned: { label: "Planned", textColor: "text-blue-700", bgColor: "bg-blue-100", icon: <AlarmClock size={13} /> },
        wishlist: { label: "Wishlist", textColor: "text-purple-700", bgColor: "bg-purple-100", icon: <Heart size={13} /> },
        cancelled: { label: "Cancelled", textColor: "text-red-700", bgColor: "bg-red-100", icon: <X size={13} /> },
    };

    const status = statusMap[d.status] || { label: d.status, textColor: "text-gray-700", bgColor: "bg-gray-100" };

    return (
        <Card key={d.id} className="flex flex-row justify-between mb-6 rounded-lg overflow-hidden">
            {/* Left: Image + Info */}
            <div className="flex">
                <div className="w-100 h-70 bg-gray-100 flex items-center justify-center shrink-0">
                    {d.image ? (
                        <img
                            src={d.image}
                            alt={`${d.location.city}, ${d.location.country}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <CalendarDays className="w-6 h-6 text-gray-400" />
                    )}
                </div>

                <div className="ml-4 flex flex-col gap-3 py-4">
                    <h3 className="text-xl font-semibold">{d.location.city}, {d.location.country}</h3>
                    <p className="text-gray-500">{d.location.country}</p>
                    <div>

                        <span className={`inline-flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full ${status.textColor} ${status.bgColor}`}>
                            {status.icon} {status.label}
                        </span>
                    </div>

                    {d.status === "completed" && (
                        <div className="flex items-center mt-2 text-yellow-500">
                            {"★".repeat(d.rating || 5)}
                            {"☆".repeat(5 - (d.rating || 5))}
                            <span className="ml-2 text-gray-600 text-sm">({d.rating || 5}/5)</span>
                        </div>
                    )}

                    {d.notes && <p className="text-gray-700 mt-2">{d.notes}</p>}

                    <div className="mt-2 text-sm text-gray-500 flex gap-4">
                        {d.datePlanned && (
                            <span className="flex items-center gap-1">
                                <CalendarClock className="w-4 h-4" /> Planned: {moment(d.datePlanned).format("DD MMM YYYY")}
                            </span>
                        )}
                        {d.dateVisited && (
                            <span className="flex items-center gap-1">
                                <CalendarCheck2 className="w-4 h-4" /> Visited: {moment(d.dateVisited).format("DD MMM YYYY")}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col  gap-2 p-4">
                <div className="flex gap-2">
                    <DestinationEdit destination={d} onUpdated={onUpdated} />

                    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                        <DialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[400px]">
                            <DialogHeader>
                                <DialogTitle>Delete Destination</DialogTitle>
                            </DialogHeader>
                            <p>Are you sure you want to delete {d.location.city}, {d.location.country}?</p>
                            <DialogFooter className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setOpenDelete(false)} disabled={isDeleting}>Cancel</Button>
                                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </Card>
    );
};

export default TravelListDestinations;
