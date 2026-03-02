// import { createClient } from '@/utils/supabase/server'
// import { NextResponse } from 'next/server'

// export async function POST(request: Request) {
//   const supabase = createClient()
//   const { data: { user } } = await supabase.auth.getUser()
//   if (!user) return new NextResponse('Unauthorized', { status: 401 })

//   // Check if admin
//   const { data: profile } = await supabase
//     .from('profiles')
//     .select('role')
//     .eq('id', user.id)
//     .single()
//   if (!profile || profile.role !== 'admin') {
//     return new NextResponse('Forbidden', { status: 403 })
//   }

//   const { email, password, fullName } = await request.json()

//   // Use service role client to create user (requires SUPABASE_SERVICE_ROLE_KEY in env)
//   const supabaseAdmin = createClientWithServiceRole() // implement this using service role key

//   const { data: authUser, error } = await supabaseAdmin.auth.admin.createUser({
//     email,
//     password,
//     email_confirm: true,
//     user_metadata: { full_name: fullName, role: 'student' }
//   })

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 400 })
//   }

//   // Profile will be created automatically via a database trigger? Or we insert manually.
//   // Let's insert manually:
//   const { error: profileError } = await supabaseAdmin
//     .from('profiles')
//     .insert({
//       id: authUser.user.id,
//       email,
//       full_name: fullName,
//       role: 'student'
//     })

//   if (profileError) {
//     // Rollback auth user creation? Could delete auth user.
//     await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
//     return NextResponse.json({ error: profileError.message }, { status: 500 })
//   }

//   return NextResponse.json({ success: true })
// }

























import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // 1. Authenticate the current user (using the regular server client)
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // 2. Check if the current user is an admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'admin') {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // 3. Parse request body
    const { email, password, fullName } = await request.json()
    if (!email || !password || !fullName) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // 4. Create the new user using the admin client (service role)
    const supabaseAdmin = await createAdminClient()
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // auto-confirm email (optional)
      user_metadata: { full_name: fullName }
    })

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 })
    }

    // 5. Insert profile for the new user (admin client bypasses RLS)
    const { error: profileInsertError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: newUser.user.id,
        email,
        full_name: fullName,
        role: 'student'
      })

    if (profileInsertError) {
      // Rollback: delete the auth user if profile insert fails
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
      return NextResponse.json({ error: profileInsertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, userId: newUser.user.id })
  } catch (error) {
    console.error('Create student error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}