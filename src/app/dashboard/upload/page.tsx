'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const [students, setStudents] = useState<any[]>([])
  const [studentId, setStudentId] = useState('')
  const [subject, setSubject] = useState('')
  const [examName, setExamName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Fetch all students (profiles with role='student')
    const fetchStudents = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'student')
      if (data) setStudents(data)
    }
    fetchStudents()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId || !subject || !examName || !file) {
      alert('Please fill all fields')
      return
    }

    setLoading(true)

    // 1. Upload PDF to storage under student's folder
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${studentId}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('results')
      .upload(filePath, file)

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message)
      setLoading(false)
      return
    }

    // 2. Insert record in results table
    const { error: dbError } = await supabase
      .from('results')
      .insert({
        student_id: studentId,
        subject,
        exam_name: examName,
        pdf_path: filePath,
      })

    if (dbError) {
      // If DB insert fails, delete the uploaded file
      await supabase.storage.from('results').remove([filePath])
      alert('Database error: ' + dbError.message)
    } else {
      alert('Result uploaded successfully!')
      router.push('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Upload Result</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Student</label>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name || s.email}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Exam Name</label>
          <input
            type="text"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">PDF File</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  )
}