// import { createClient } from '@/utils/supabase/server'
// import { redirect } from 'next/navigation'
// import Link from 'next/link'

// export default async function DashboardPage() {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()

//   if (!user) {
//     redirect('/login')
//   }


// interface Result {
//   id: string
//   exam_name: string
//   subject: string
//   pdf_path: string
//   uploaded_at: string
// }


//   // Fetch user profile to get role
//   const { data: profile } = await supabase
//     .from('profiles')
//     .select('role')
//     .eq('id', user.id)
//     .single()





//   if (!profile) {
//     // Profile not found – maybe redirect to complete profile
//     return <div>Profile not found</div>
//   }

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
//       {profile.role === 'admin' ? (
//         <AdminDashboard />
//       ) : (
//         <StudentDashboard userId={user.id} />
//       )}
//     </div>
//   )
// }

// async function AdminDashboard() {
//   return (
//     <div>
//       <h2 className="text-2xl mb-4">Admin Panel</h2>
//       <Link href="/dashboard/upload" className="bg-green-500 text-white px-4 py-2 rounded">
//         Upload New Result
//       </Link>
//       {/* You can also list all results with student names here */}
//     </div>
//   )
// }

// async function StudentDashboard({ userId }: { userId: string }) {
//   const supabase = createClient()
//   const { data: results } = await supabase
//     .from('results')
//     .select('*')
//     .eq('student_id', userId)
//     .order('uploaded_at', { ascending: false })

//   if (!results || results.length === 0) {
//     return <p>No results available.</p>
//   }

//   return (
//     <div>
//       <h2 className="text-2xl mb-4">Your Results</h2>
//       <ul className="space-y-2">
//         {results.map((result) => (
//           <li key={result.id} className="border p-4 rounded flex justify-between">
//             <div>
//               <p className="font-semibold">{result.exam_name} - {result.subject}</p>
//               <p className="text-sm text-gray-600">
//                 Uploaded: {new Date(result.uploaded_at).toLocaleDateString()}
//               </p>
//             </div>
//             <a
//               href={`/api/results/download?path=${encodeURIComponent(result.pdf_path)}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//             >
//               View / Download
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }























// import { createClient } from '@/utils/supabase/server'
// import { redirect } from 'next/navigation'
// import Link from 'next/link'
// import StudentResults from '../components/StudentResults'

// // Define the Result type
// export interface Result {
//   id: string
//   exam_name: string
//   subject: string
//   pdf_path: string
//   uploaded_at: string
// }

// export default async function DashboardPage({
//   searchParams,
// }: {
//   searchParams: { page?: string }
// }) {
//   // Await the Supabase client (server-side)
//   const supabase = await createClient()

//   // Get the current user
//   const { data: { user } } = await supabase.auth.getUser()

//   if (!user) {
//     redirect('/login')
//   }

//   // Fetch user profile to determine role
//   const { data: profile } = await supabase
//     .from('profiles')
//     .select('role')
//     .eq('id', user.id)
//     .single()

//   if (!profile) {
//     return <div className="p-8">Profile not found</div>
//   }

//   // Pagination setup
//   const page = searchParams.page ? parseInt(searchParams.page) : 1
//   const pageSize = 10
//   const from = (page - 1) * pageSize
//   const to = from + pageSize - 1

//   if (profile.role === 'admin') {
//     // Admin dashboard – you can add more content here
//     return (
//       <div className="p-8">
//         <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
//         <Link
//           href="/dashboard/upload"
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//         >
//           Upload New Result
//         </Link>
//         {/* Optionally add a list of all results with pagination later */}
//       </div>
//     )
//   } else {
//     // Student: fetch paginated results
//     const { data: results, count } = await supabase
//       .from('results')
//       .select('*', { count: 'exact' })
//       .eq('student_id', user.id)
//       .order('uploaded_at', { ascending: false })
//       .range(from, to)

//     const totalPages = Math.ceil((count || 0) / pageSize)

//     // Ensure results conform to Result[] type
//     const typedResults = (results as Result[]) || []

//     return (
//       <div className="p-8">
//         <h1 className="text-3xl font-bold mb-6">Your Results</h1>
//         <StudentResults
//           results={typedResults}
//           currentPage={page}
//           totalPages={totalPages}
//         />
//       </div>
//     )
//   }
// }

























// import { createClient } from '@/utils/supabase/server'
// import { redirect } from 'next/navigation'
// import Link from 'next/link'
// import StudentResults from '@/components/StudentResults'

// // You can keep the interface here for clarity (optional)
// interface Result {
//   id: string
//   exam_name: string
//   subject: string
//   pdf_path: string
//   uploaded_at: string
// }

// export default async function DashboardPage({
//   searchParams,
// }: {
//   searchParams: { page?: string }
// }) {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()

//   if (!user) {
//     redirect('/login')
//   }

//   const { data: profile } = await supabase
//     .from('profiles')
//     .select('role')
//     .eq('id', user.id)
//     .single()

//   if (!profile) {
//     return <div className="p-8">Profile not found</div>
//   }

//   const page = searchParams.page ? parseInt(searchParams.page) : 1
//   const pageSize = 10
//   const from = (page - 1) * pageSize
//   const to = from + pageSize - 1

//   if (profile.role === 'admin') {
//     return (
//       <div className="p-8">
//         <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
//         <Link
//           href="/dashboard/upload"
//           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//         >
//           Upload New Result
//         </Link>
//       </div>
//     )
//   }

//   // Student view
//   const { data: results, count } = await supabase
//     .from('results')
//     .select('*', { count: 'exact' })
//     .eq('student_id', user.id)
//     .order('uploaded_at', { ascending: false })
//     .range(from, to)

//   const totalPages = Math.ceil((count || 0) / pageSize)
//   const typedResults = (results as Result[]) || []

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-6">Your Results</h1>
//       <StudentResults
//         results={typedResults}
//         currentPage={page}
//         totalPages={totalPages}
//       />
//     </div>
//   )
// }






























import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import StudentResults from '@/components/StudentResults'

interface Result {
  id: string
  exam_name: string
  subject: string
  pdf_path: string
  uploaded_at: string
}

// Define the type for searchParams as a Promise
type PageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  // Await the searchParams Promise to get the actual parameters
  const { page } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return <div className="p-8">Profile not found</div>
  }

  // Pagination: use the awaited page value (convert string to number)
  const currentPage = page ? parseInt(page) : 1
  const pageSize = 10
  const from = (currentPage - 1) * pageSize
  const to = from + pageSize - 1

  if (profile.role === 'admin') {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <Link
          href="/dashboard/upload"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Upload New Result
        </Link>
      </div>
    )
  }

  // Student view
  const { data: results, count } = await supabase
    .from('results')
    .select('*', { count: 'exact' })
    .eq('student_id', user.id)
    .order('uploaded_at', { ascending: false })
    .range(from, to)

  const totalPages = Math.ceil((count || 0) / pageSize)
  const typedResults = (results as Result[]) || []

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Your Results</h1>
      <StudentResults
        results={typedResults}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  )
}