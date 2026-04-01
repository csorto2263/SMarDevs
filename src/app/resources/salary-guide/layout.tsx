import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '2026 LATAM Tech Salary Guide',
  description:
    'Free PDF: All-in monthly rates for hiring pre-vetted LATAM engineers via SMarDevs. Compare 12 tech roles against US salaries and see how much your company can save.',
}

export default function SalaryGuideLayout({ children }: { children: React.ReactNode }) {
  return children
}
