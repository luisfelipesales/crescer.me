import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { logError } from "@/lib/errorLogger";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Tables } from "@/integrations/supabase/types";

// Minimal contact info needed for chat
interface ChatContact {
  id: string;
  full_name: string;
  profile_type: Tables<"profiles">["profile_type"];
}

interface ChatMessagesProps {
  currentUserId: string;
  currentUserName: string;
  contact: ChatContact;
}

type Message = Tables<"messages">;

export function ChatMessages({
  currentUserId,
  currentUserName,
  contact,
}: ChatMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    markMessagesAsRead();

    // Subscribe to realtime messages
    const channel = supabase
      .channel(`messages-${currentUserId}-${contact.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${currentUserId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.sender_id === contact.id) {
            setMessages((prev) => [...prev, newMsg]);
            markMessagesAsRead();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contact.id, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},recipient_id.eq.${contact.id}),and(sender_id.eq.${contact.id},recipient_id.eq.${currentUserId})`
        )
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      logError("ChatMessages.fetchMessages", error);
      toast.error("Erro ao carregar mensagens");
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("sender_id", contact.id)
        .eq("recipient_id", currentUserId)
        .eq("is_read", false);
    } catch (error) {
      logError("ChatMessages.markMessagesAsRead", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: currentUserId,
          recipient_id: contact.id,
          content: newMessage.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      logError("ChatMessages.sendMessage", error);
      toast.error("Erro ao enviar mensagem");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatMessageDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return format(date, "HH:mm");
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem ${format(date, "HH:mm")}`;
    } else {
      return format(date, "dd/MM HH:mm", { locale: ptBR });
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b p-4">
        <Avatar>
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(contact.full_name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{contact.full_name}</h3>
          <p className="text-sm text-muted-foreground">
            {contact.profile_type === "therapist"
              ? "Terapeuta"
              : contact.profile_type === "parent"
              ? "Responsável"
              : "Paciente"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Nenhuma mensagem ainda. Comece a conversar!
            </p>
          ) : (
            messages.map((message) => {
              const isMine = message.sender_id === currentUserId;
              return (
                <div
                  key={message.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      isMine
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words text-sm">
                      {message.content}
                    </p>
                    <p
                      className={`mt-1 text-xs ${
                        isMine
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatMessageDate(message.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[44px] max-h-32 resize-none"
            rows={1}
          />
          <Button
            onClick={sendMessage}
            disabled={sending || !newMessage.trim()}
            size="icon"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
