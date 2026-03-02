import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  // Check if admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (!profile || profile.role !== 'admin') {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const { email, password, fullName } = await request.json()

  // Use service role client to create user (requires SUPABASE_SERVICE_ROLE_KEY in env)
  const supabaseAdmin = createClientWithServiceRole() // implement this using service role key

  const { data: authUser, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: 'student' }
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Profile will be created automatically via a database trigger? Or we insert manually.
  // Let's insert manually:
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      id: authUser.user.id,
      email,
      full_name: fullName,
      role: 'student'
    })

  if (profileError) {
    // Rollback auth user creation? Could delete auth user.
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}