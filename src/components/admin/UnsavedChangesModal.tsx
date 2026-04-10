'use client'

import { Loader2, Save, X } from 'lucide-react'

interface UnsavedChangesModalProps {
  open: boolean
  saving?: boolean
  onCancel: () => void    // stays on the page
  onContinue: () => void  // navigates without saving
  onUpdate: () => void    // saves then navigates
}

export default function UnsavedChangesModal({
  open,
  saving = false,
  onCancel,
  onContinue,
  onUpdate,
}: UnsavedChangesModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-md mx-4">
        {/* Icon */}
        <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Save className="w-6 h-6 text-amber-500" />
        </div>

        <h3 className="text-lg font-semibold text-navy-950 text-center mb-2">
          Unsaved Changes
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          You have unsaved changes. What would you like to do?
        </p>

        <div className="flex flex-col gap-2">
          {/* Update — primary */}
          <button
            onClick={onUpdate}
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving…' : 'Update'}
          </button>

          {/* Continue without saving */}
          <button
            onClick={onContinue}
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-2.5 rounded-xl transition-all text-sm disabled:opacity-60"
          >
            Continue without saving
          </button>

          {/* Cancel — stay on page */}
          <button
            onClick={onCancel}
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 font-medium px-5 py-2 rounded-xl transition-all text-sm disabled:opacity-60"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
