
-- Create a table to store push notification tokens
CREATE TABLE public.push_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_identifier TEXT NOT NULL, -- Device/browser identifier since we don't have auth
  token TEXT NOT NULL,
  platform TEXT NOT NULL, -- 'web', 'android', 'ios'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  active BOOLEAN NOT NULL DEFAULT true
);

-- Create index for faster lookups
CREATE INDEX idx_push_tokens_user_identifier ON public.push_tokens(user_identifier);
CREATE INDEX idx_push_tokens_active ON public.push_tokens(active);

-- Create a table to store notification history
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general', -- 'general', 'new_item', 'price_update', 'reservation'
  data JSONB, -- Additional notification data
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_count INTEGER NOT NULL DEFAULT 0,
  success_count INTEGER NOT NULL DEFAULT 0
);

-- Create a table to track notification delivery status
CREATE TABLE public.notification_deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  push_token_id UUID NOT NULL REFERENCES public.push_tokens(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'clicked'
  delivered_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for notification deliveries
CREATE INDEX idx_notification_deliveries_notification_id ON public.notification_deliveries(notification_id);
CREATE INDEX idx_notification_deliveries_status ON public.notification_deliveries(status);

-- Enable RLS (Row Level Security) - keeping it open for now since no auth system
ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_deliveries ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since no auth system)
CREATE POLICY "Allow all operations on push_tokens" ON public.push_tokens FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on notification_deliveries" ON public.notification_deliveries FOR ALL USING (true) WITH CHECK (true);
