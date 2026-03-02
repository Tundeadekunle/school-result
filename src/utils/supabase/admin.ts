import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// This utility is for admin-only server actions and routes.
// It uses the service role key to bypass RLS.
export const createAdminClient = async () => {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // ⚠️ must be set in .env.local
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set() {
          // Not needed in server components
        },
        remove() {
          // Not needed
        },
      },
    }
  )
}