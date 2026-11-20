import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export const supabase = createClient(
  environment.supabaseUrl,
  environment.supabasePublishableKey,
);

export const isSupabaseConfigured =
  !!environment.supabaseUrl &&
  !!environment.supabasePublishableKey &&
  !environment.supabasePublishableKey.includes('PASTE_');
