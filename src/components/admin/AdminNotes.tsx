'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageSquare, Send, Loader2, Trash2 } from 'lucide-react'

interface Note {
  id: string
  content: string
  is_private: boolean
  created_at: string
  profiles: { full_name: string | null; email: string } | null
}

interface Props {
  applicationId: string
  userId: string
  initialNotes: Note[]
}

export default function AdminNotes({ applicationId, userId, initialNotes }: Props) {
  const [notes, setNotes] = useState(initialNotes)
  const [newNote, setNewNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return
    setSaving(true)

    const supabase = createClient()
    const { data, error } = await supabase
      .from('admin_notes')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert({
        application_id: applicationId,
        author_id: userId,
        content: newNote.trim(),
      } as any)
      .select('*, profiles:author_id(full_name, email)')
      .single()

    if (!error && data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setNotes(prev => [data as any, ...prev])
      setNewNote('')
    }
    setSaving(false)
  }

  const handleDelete = async (noteId: string) => {
    if (!confirm('Delete this note?')) return
    setDeleting(noteId)
    const supabase = createClient()
    const { error } = await supabase.from('admin_notes').delete().eq('id', noteId)
    if (!error) {
      setNotes(prev => prev.filter(n => n.id !== noteId))
    }
    setDeleting(null)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-navy-950 mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-brand-600" />
        Internal Notes
      </h2>

      {/* Add note form */}
      <form onSubmit={handleAdd} className="mb-4">
        <div className="flex gap-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note about this candidate..."
            rows={2}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all resize-none"
          />
          <button
            type="submit"
            disabled={saving || !newNote.trim()}
            className="self-end p-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>

      {/* Notes list */}
      {notes.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No notes yet</p>
      ) : (
        <div className="space-y-3">
          {notes
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .map(note => (
            <div key={note.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-navy-950">
                    {note.profiles?.full_name || note.profiles?.email || 'Admin'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(note.id)}
                  disabled={deleting === note.id}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                >
                  {deleting === note.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
