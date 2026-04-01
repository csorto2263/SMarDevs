'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Trash2 } from 'lucide-react'
import { logAuditClient } from '@/lib/audit-client'
import type { ClientNote } from '@/lib/types'

interface Props {
  clientId: string
  userId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialNotes: any[]
}

export default function ClientNotesClient({ clientId, userId, initialNotes }: Props) {
  const router  = useRouter()
  const [notes, setNotes] = useState<ClientNote[]>(initialNotes as ClientNote[])
  const [text,  setText]  = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleAdd = async () => {
    if (!text.trim()) return
    setSaving(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any
    const { data, error } = await supabase
      .from('client_notes')
      .insert({ client_id: clientId, author_id: userId, content: text.trim(), is_private: true })
      .select('*, profiles:author_id(full_name, email)')
      .single()
    if (!error && data) {
      setNotes(prev => [data as unknown as ClientNote, ...prev])
      setText('')
      logAuditClient({
        entity_type: 'client_note',
        entity_id: (data as any).id,
        action: 'create',
        metadata: { client_id: clientId },
      })
    }
    setSaving(false)
    router.refresh()
  }

  const handleDelete = async (noteId: string) => {
    setDeletingId(noteId)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createClient() as any
    await supabase.from('client_notes').delete().eq('id', noteId)
    setNotes(prev => prev.filter(n => n.id !== noteId))
    logAuditClient({
      entity_type: 'client_note',
      entity_id: noteId,
      action: 'delete',
      metadata: { client_id: clientId },
    })
    setDeletingId(null)
  }

  return (
    <div className="space-y-4">
      {/* Add note */}
      <div className="space-y-2">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={2}
          placeholder="Add an internal note…"
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-navy-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all resize-none"
        />
        <div className="flex justify-end">
          <button
            onClick={handleAdd}
            disabled={saving || !text.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            Add Note
          </button>
        </div>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <p className="text-sm text-gray-400">No notes yet.</p>
      ) : (
        <div className="space-y-3">
          {notes.map(note => (
            <div key={note.id} className="bg-gray-50 rounded-xl p-3 group">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-navy-950 whitespace-pre-wrap flex-1">{note.content}</p>
                <button
                  onClick={() => handleDelete(note.id)}
                  disabled={deletingId === note.id}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
                >
                  {deletingId === note.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(note as any).profiles?.full_name || (note as any).profiles?.email || 'Unknown'}
                {' · '}
                {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
