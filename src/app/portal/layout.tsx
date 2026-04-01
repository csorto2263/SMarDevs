import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Assessment Portal | SMarDevs',
  robots: { index: false, follow: false },
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
