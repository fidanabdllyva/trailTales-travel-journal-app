"use client";

import { useState, useRef, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";

interface Message {
    id: number;
    sender: string;
    text: string;
    time: string;
}

const mockMessages: Message[] = [
    { id: 1, sender: "Mike Chen", text: "April 10-15! Perfect timing for the weather 🌸", time: "02:35 PM" },
    { id: 2, sender: "Sarah Johnson", text: "I found this amazing tapas tour we should book!", time: "02:36 PM" },
    { id: 3, sender: "You", text: "Looks incredible! Count me in ✋", time: "02:38 PM" },
];

export default function TravelListChat() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(mockMessages);
    const [input, setInput] = useState("");
    const listRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = (instant = false) => {
        const el = listRef.current;
        if (!el) return;
        el.scrollTo({
            top: el.scrollHeight,
            behavior: instant ? "auto" : "smooth",
        });
    };

    // Scroll when drawer is opened
    useEffect(() => {
        if (open) {
            // delay to let DOM render before scrolling
            setTimeout(() => scrollToBottom(true), 50);
        }
    }, [open]);

    // Scroll whenever a new message is added
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                sender: "You",
                text: input,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
        ]);
        setInput("");
    };

    return (
        <>
            <Button
                variant="secondary"
                className="bg-white/90 text-gray-900"
                onClick={() => setOpen(true)}
            >
                <MessageSquare className="mr-2 h-4 w-4" /> Chat
            </Button>

            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerContent className="fixed right-0 top-0 h-full w-[380px] rounded-none border-l bg-white flex flex-col min-h-0">
                    <DrawerHeader className="border-b">
                        <DrawerTitle>Group Chat</DrawerTitle>
                    </DrawerHeader>

                    {/* Messages list (scrollable) */}
                    <div ref={listRef} className="flex-1 overflow-y-auto p-4 min-h-0">
                        <div className="flex flex-col gap-3">
                            {messages.map((msg) => {
                                const isYou = msg.sender === "You";
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col max-w-[75%] ${isYou ? "ml-auto items-end" : "items-start"}`}
                                    >
                                        {!isYou && (
                                            <span className="text-xs font-medium text-gray-600">{msg.sender}</span>
                                        )}
                                        <span
                                            className={`rounded-lg px-3 py-2 text-sm break-all ${isYou ? "bg-black text-white" : "bg-gray-100 text-gray-900"
                                                }`}
                                        >
                                            {msg.text}
                                        </span>

                                        <span className="text-[10px] text-gray-400">{msg.time}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Input (pinned) */}
                    <div className="p-4 border-t flex gap-2">
                        <Input
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                        />
                        <Button onClick={sendMessage}>Send</Button>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}
