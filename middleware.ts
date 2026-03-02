import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from './utils/supabase/middleware'
// import { createClient } from '@/utils/supabase/middleware'



export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)
  const { data: { user } } = await supabase.auth.getUser()

  // If user is authenticated and trying to access login or signup, redirect to dashboard
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // If no user and trying to access protected routes, redirect to login
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}



// export async function middleware(request: NextRequest) {
//   let response = NextResponse.next({ request: { headers: request.headers } })
//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return request.cookies.get(name)?.value
//         },
//         set(name, value, options) {
//           response.cookies.set({ name, value, ...options })
//         },
//         remove(name, options) {
//           response.cookies.set({ name, value: '', ...options })
//         },
//       },
//     }
//   )

//   const { data: { user } } = await supabase.auth.getUser()

//   // If no user and trying to access protected routes, redirect to login
//   if (!user && !request.nextUrl.pathname.startsWith('/login')) {
//     const url = request.nextUrl.clone()
//     url.pathname = '/login'
//     return NextResponse.redirect(url)
//   }

//   // Optional: redirect logged-in users away from login
//   if (user && request.nextUrl.pathname === '/login') {
//     const url = request.nextUrl.clone()
//     url.pathname = '/dashboard'
//     return NextResponse.redirect(url)
//   }

//   return response
// }

// export const config = {
//   matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
// }