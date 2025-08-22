import { useState, useRef, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";
import {
    connectSocket,
    enableChatForList,
    fetchMessages,
    joinGroup,
    onNewMessage,
    sendSocketMessage,
    disconnectSocket,
} from "@/api/requests/socket/socket";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import type { Message } from "@/types/MessageType";
import type { User } from "@/types/UserType";


interface TravelListProps {
    listId: string;
}

export default function TravelListChat({ listId }: TravelListProps) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [chatId, setChatId] = useState<string | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);
    const userId = useSelector((s: RootState) => s.user.data?.id);

    if (!userId) return <p>No user</p>;

    const scrollToBottom = (instant = false) => {
        const el = listRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: instant ? "auto" : "smooth" });
    };

    // Initialize chat
    useEffect(() => {
        if (!open) return;

        let socket: any;

        const initChat = async () => {
            try {
                const res = await enableChatForList(listId);
                const groupId = res.chat;
                setChatId(groupId);

                socket = connectSocket(userId);
                joinGroup(groupId);

                // Listen for new messages
                onNewMessage((msg: Message) => {
                    setMessages((prev) => {
                        // Prevent duplicates
                        const exists = prev.find(
                            (m) => m.id === msg.id || (msg.clientId && m.id === msg.clientId)
                        );
                        if (exists) return prev;

                        return [
                            ...prev,
                            {
                                ...msg,
                                sender: msg.author.id === userId ? "You" : msg.author.username,
                                body: msg.body || {},
                                createdAt: msg.createdAt,
                                updatedAt: msg.updatedAt,
                            },
                        ];
                    });
                });

                // Fetch previous messages
                const msgs = await fetchMessages(groupId);
                if (msgs.items) {
                    setMessages(
                        msgs.items.map((msg: Message) => ({
                            ...msg,
                            sender: msg.author.id === userId ? "You" : msg.author.username,
                            body: msg.body || {},
                            createdAt: msg.createdAt,
                            updatedAt: msg.updatedAt,
                        }))
                    );
                }
            } catch (err) {
                console.error("Failed to initialize chat:", err);
            }
        };

        initChat();

        return () => {
            disconnectSocket();
            setMessages([]);
            setChatId(null);
        };
    }, [open, listId, userId]);

    // Scroll to bottom when drawer opens
    useEffect(() => {
        if (open) setTimeout(() => scrollToBottom(true), 50);
    }, [open]);

    // Scroll to bottom on new messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim() || !chatId) return;

        const clientId = Date.now().toString();

        // Emit via socket
        sendSocketMessage({
            chatId,
            authorId: userId,
            text: input,
            clientId,
        });

        // Optimistic update
        setMessages((prev) => [
            ...prev,
            {
                id: clientId,
                chat: chatId,
                author: { id: userId, username: "You" } as User,
                body: { text: input },
                deliveredTo: [] as User[], 
                readBy: [] as User[],      
                clientId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
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

                    <div ref={listRef} className="flex-1 overflow-y-auto p-4 min-h-0">
                        <div className="flex flex-col gap-3">
                            {messages.map((msg) => {
                                const isYou = msg.author.id === userId;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col max-w-[75%] ${isYou ? "ml-auto items-end" : "items-start"
                                            }`}
                                    >
                                        {!isYou && (
                                            <span className="text-xs font-medium text-gray-600">
                                                {msg.author.username}
                                            </span>
                                        )}
                                        <span
                                            className={`rounded-lg px-3 py-2 text-sm overflow-hidden text-ellipsis break-all ${isYou
                                                    ? "bg-black text-white"
                                                    : "bg-gray-100 text-gray-900"
                                                }`}
                                        >
                                            {msg.body.text || ""}
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                            {new Date(msg.createdAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

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
