'use client'

import { useState, useRef, useEffect } from 'react'
import { Share2, ChevronDown, Phone, X } from 'lucide-react'

interface TeamMember {
  id: string
  full_name: string | null
  phone: string
}

interface Props {
  applicantName: string
  position: string
  email: string
  phone: string | null
  linkedin: string | null
  profileUrl: string
  teamMembers: TeamMember[]
}

function cleanPhone(raw: string) {
  return raw.replace(/[^\d]/g, '')
}

export default function ShareApplicantButton({
  applicantName,
  position,
  email,
  phone,
  linkedin,
  profileUrl,
  teamMembers,
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleShare = (member: TeamMember) => {
    setOpen(false)
    const lines = [
      `👤 *${applicantName}*`,
      `💼 Position: ${position}`,
      `📧 Email: ${email}`,
      phone ? `📞 Phone: ${phone}` : null,
      linkedin ? `🔗 LinkedIn: ${linkedin}` : null,
      `\n🔎 Full profile: ${profileUrl}`,
    ].filter(Boolean).join('\n')

    const waPhone = cleanPhone(member.phone)
    const url = `https://wa.me/${waPhone}?text=${encodeURIComponent(lines)}`
    window.open(url, '_blank')
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
      >
        <Share2 className="w-4 h-4 text-green-600" />
        Share
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border border-gray-100 shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Send via WhatsApp</p>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {teamMembers.length === 0 ? (
            <div className="px-4 py-5 text-center">
              <Phone className="w-6 h-6 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500">No team members with a phone number yet.</p>
            </div>
          ) : (
            <div className="py-1 max-h-64 overflow-y-auto">
              {teamMembers.map(member => (
                <button
                  key={member.id}
                  onClick={() => handleShare(member)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-green-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-green-700 text-sm font-bold shrink-0">
                    {(member.full_name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy-950 group-hover:text-green-700 transition-colors truncate">
                      {member.full_name || 'Unnamed'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{member.phone}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
