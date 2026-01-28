import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Layout } from "@/components/layout/Layout";
import { ChatSidebar, type ChatContact } from "@/components/chat/ChatSidebar";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { Loader2, MessageSquare } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export default function Chat() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <Layout>
      <div className="h-[calc(100vh-200px)] min-h-[500px] bg-muted/30 py-4 md:py-8">
        <div className="container-custom h-full">
          <div className="mb-4">
            <h1 className="font-display text-2xl font-bold text-foreground">
              Chat Interno
            </h1>
            <p className="text-sm text-muted-foreground">
              Comunique-se com outros usuários da clínica
            </p>
          </div>

          <div className="h-[calc(100%-80px)] overflow-hidden rounded-lg border bg-background shadow-sm">
            <div className="grid h-full md:grid-cols-[300px_1fr]">
              {/* Sidebar */}
              <ChatSidebar
                currentUserId={profile.id}
                selectedContactId={selectedContact?.id || null}
                onSelectContact={setSelectedContact}
              />

              {/* Chat Area */}
              <div className="hidden md:block">
                {selectedContact ? (
                  <ChatMessages
                    currentUserId={profile.id}
                    currentUserName={profile.full_name}
                    contact={selectedContact}
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                    <MessageSquare className="mb-4 h-12 w-12 opacity-50" />
                    <p>Selecione um contato para iniciar uma conversa</p>
                  </div>
                )}
              </div>

              {/* Mobile Chat Area */}
              <div className="md:hidden">
                {selectedContact && (
                  <div className="fixed inset-0 z-50 bg-background">
                    <div className="flex h-full flex-col">
                      <button
                        onClick={() => setSelectedContact(null)}
                        className="border-b p-3 text-left text-sm text-primary"
                      >
                        ← Voltar aos contatos
                      </button>
                      <div className="flex-1">
                        <ChatMessages
                          currentUserId={profile.id}
                          currentUserName={profile.full_name}
                          contact={selectedContact}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
