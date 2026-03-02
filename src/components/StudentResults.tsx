// 'use client'

// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import type { Result } from '@/app/dashboard/page' // Import the Result type from the dashboard page

// interface StudentResultsProps {
//   results: Result[]
//   currentPage: number
//   totalPages: number
// }

// export default function StudentResults({
//   results,
//   currentPage,
//   totalPages,
// }: StudentResultsProps) {
//   const pathname = usePathname()

//   if (results.length === 0) {
//     return <p className="text-gray-600">No results available.</p>
//   }

//   return (
//     <>
//       <ul className="space-y-4">
//         {results.map((result) => (
//           <li
//             key={result.id}
//             className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
//           >
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//               <div>
//                 <h3 className="text-lg font-semibold">
//                   {result.exam_name} – {result.subject}
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   Uploaded: {new Date(result.uploaded_at).toLocaleDateString()}
//                 </p>
//               </div>
//               <a
//                 href={`/api/results/download?path=${encodeURIComponent(result.pdf_path)}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="mt-2 sm:mt-0 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
//               >
//                 View / Download
//               </a>
//             </div>
//           </li>
//         ))}
//       </ul>

//       {/* Pagination controls */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-4 mt-8">
//           {currentPage > 1 && (
//             <Link
//               href={`${pathname}?page=${currentPage - 1}`}
//               className="px-4 py-2 border rounded hover:bg-gray-100"
//             >
//               Previous
//             </Link>
//           )}
//           <span className="text-gray-700">
//             Page {currentPage} of {totalPages}
//           </span>
//           {currentPage < totalPages && (
//             <Link
//               href={`${pathname}?page=${currentPage + 1}`}
//               className="px-4 py-2 border rounded hover:bg-gray-100"
//             >
//               Next
//             </Link>
//           )}
//         </div>
//       )}
//     </>
//   )
// }

















'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Define the Result type locally (no need to import from page)
interface Result {
  id: string
  exam_name: string
  subject: string
  pdf_path: string
  uploaded_at: string
}

interface StudentResultsProps {
  results: Result[]
  currentPage: number
  totalPages: number
}

export default function StudentResults({
  results,
  currentPage,
  totalPages,
}: StudentResultsProps) {
  const pathname = usePathname()

  if (results.length === 0) {
    return <p className="text-gray-600">No results available.</p>
  }

  return (
    <>
      <ul className="space-y-4">
        {results.map((result) => (
          <li
            key={result.id}
            className="border p-4 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {result.exam_name} – {result.subject}
                </h3>
                <p className="text-sm text-gray-500">
                  Uploaded: {new Date(result.uploaded_at).toLocaleDateString()}
                </p>
              </div>
              <a
                href={`/api/results/download?path=${encodeURIComponent(result.pdf_path)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 sm:mt-0 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
              >
                View / Download
              </a>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          {currentPage > 1 && (
            <Link
              href={`${pathname}?page=${currentPage - 1}`}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Previous
            </Link>
          )}
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`${pathname}?page=${currentPage + 1}`}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </>
  )
}