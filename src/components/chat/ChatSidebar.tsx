import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2 } from "lucide-react";
import { logError } from "@/lib/errorLogger";
import type { Tables } from "@/integrations/supabase/types";

// Minimal contact info needed for chat sidebar
export interface ChatContact {
  id: string;
  full_name: string;
  profile_type: Tables<"profiles">["profile_type"];
  avatar_url: string | null;
}

interface ChatSidebarProps {
  currentUserId: string;
  selectedContactId: string | null;
  onSelectContact: (contact: ChatContact) => void;
}

type ContactWithUnread = ChatContact & { unreadCount: number };

export function ChatSidebar({
  currentUserId,
  selectedContactId,
  onSelectContact,
}: ChatSidebarProps) {
  const [contacts, setContacts] = useState<ContactWithUnread[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchContacts();
  }, [currentUserId]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      // Fetch only therapist profiles for patient chat contacts
      // RLS policies also enforce this, but explicit filtering is more efficient
      // and makes the intent clear for developers
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, profile_type, avatar_url")
        .eq("profile_type", "therapist")
        .neq("id", currentUserId)
        .order("full_name");

      if (profilesError) throw profilesError;

      // Fetch unread counts
      const { data: unreadMessages, error: unreadError } = await supabase
        .from("messages")
        .select("sender_id")
        .eq("recipient_id", currentUserId)
        .eq("is_read", false);

      if (unreadError) throw unreadError;

      // Count unread per sender
      const unreadCounts: Record<string, number> = {};
      unreadMessages?.forEach((msg) => {
        unreadCounts[msg.sender_id] = (unreadCounts[msg.sender_id] || 0) + 1;
      });

      // Combine profiles with unread counts
      const contactsWithUnread = (profiles || []).map((profile) => ({
        ...profile,
        unreadCount: unreadCounts[profile.id] || 0,
      }));

      // Sort by unread count (descending) then by name
      contactsWithUnread.sort((a, b) => {
        if (b.unreadCount !== a.unreadCount) {
          return b.unreadCount - a.unreadCount;
        }
        return a.full_name.localeCompare(b.full_name);
      });

      setContacts(contactsWithUnread);
    } catch (error) {
      logError("ChatSidebar.fetchContacts", error);
    } finally {
      setLoading(false);
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

  const getProfileTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      patient: "Paciente",
      parent: "Responsável",
      therapist: "Terapeuta",
    };
    return labels[type] || type;
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.full_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col border-r">
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar contato..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredContacts.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              Nenhum contato encontrado
            </p>
          ) : (
            filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted ${
                  selectedContactId === contact.id ? "bg-muted" : ""
                }`}
              >
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(contact.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium">
                      {contact.full_name}
                    </span>
                    {contact.unreadCount > 0 && (
                      <Badge variant="default" className="h-5 min-w-5 px-1.5">
                        {contact.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {getProfileTypeLabel(contact.profile_type)}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
