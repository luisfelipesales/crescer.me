-- Create messages table for internal chat
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies for messages
CREATE POLICY "Users can view their own messages"
ON public.messages
FOR SELECT
USING (
  is_own_profile(sender_id) OR 
  is_own_profile(recipient_id) OR 
  is_admin()
);

CREATE POLICY "Users can send messages"
ON public.messages
FOR INSERT
WITH CHECK (
  is_own_profile(sender_id)
);

CREATE POLICY "Recipients can mark messages as read"
ON public.messages
FOR UPDATE
USING (is_own_profile(recipient_id))
WITH CHECK (is_own_profile(recipient_id));

CREATE POLICY "Senders can delete their own messages"
ON public.messages
FOR DELETE
USING (is_own_profile(sender_id) OR is_admin());

-- Create index for faster queries
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;