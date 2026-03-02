// import { createClient } from '@/utils/supabase/server'
// import { NextResponse } from 'next/server'

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url)
//   const filePath = searchParams.get('path')

//   if (!filePath) {
//     return new NextResponse('Missing path', { status: 400 })
//   }

//   const supabase = createClient()

//   // Verify user is authenticated
//   const { data: { user } } = await supabase.auth.getUser()
//   if (!user) {
//     return new NextResponse('Unauthorized', { status: 401 })
//   }

//   // Check if user owns this result (or is admin)
//   // We can extract student_id from filePath (folder name)
//   const studentId = filePath.split('/')[0]
//   const { data: profile } = await supabase
//     .from('profiles')
//     .select('role')
//     .eq('id', user.id)
//     .single()

//   if (!profile) {
//     return new NextResponse('Profile not found', { status: 404 })
//   }

//   const isAdmin = profile.role === 'admin'
//   const isOwner = user.id === studentId

//   if (!isAdmin && !isOwner) {
//     return new NextResponse('Forbidden', { status: 403 })
//   }

//   // Generate signed URL (valid for 60 seconds)
//   const { data, error } = await supabase.storage
//     .from('results')
//     .createSignedUrl(filePath, 60)

//   if (error || !data) {
//     return new NextResponse('Failed to generate URL', { status: 500 })
//   }

//   // Redirect to the signed URL
//   return NextResponse.redirect(data.signedUrl)
// }
















import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('path')

    if (!filePath) {
      return new NextResponse('Missing path parameter', { status: 400 })
    }

    // Await the Supabase client (it's async in Next.js 15)
    const supabase = await createClient()

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Extract student ID from the file path (folder name is the first segment)
    const studentId = filePath.split('/')[0]

    // Fetch user's role from profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return new NextResponse('Profile not found', { status: 404 })
    }

    const isAdmin = profile.role === 'admin'
    const isOwner = user.id === studentId

    // Check permission: must be admin or the student who owns the result
    if (!isAdmin && !isOwner) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Generate a signed URL (valid for 60 seconds)
    const { data, error: signedUrlError } = await supabase.storage
      .from('results')
      .createSignedUrl(filePath, 60)

    if (signedUrlError || !data?.signedUrl) {
      console.error('Signed URL error:', signedUrlError)
      return new NextResponse('Failed to generate download URL', { status: 500 })
    }

    // Redirect to the signed URL
    return NextResponse.redirect(data.signedUrl)

  } catch (error) {
    console.error('Download API error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}