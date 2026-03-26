export const COUNTRIES = [
  { code: 'HN', dial: '+504', name: 'Honduras' },
  { code: 'US', dial: '+1',   name: 'United States' },
  { code: 'CA', dial: '+1',   name: 'Canada' },
  { code: 'MX', dial: '+52',  name: 'Mexico' },
  { code: 'GT', dial: '+502', name: 'Guatemala' },
  { code: 'SV', dial: '+503', name: 'El Salvador' },
  { code: 'NI', dial: '+505', name: 'Nicaragua' },
  { code: 'CR', dial: '+506', name: 'Costa Rica' },
  { code: 'PA', dial: '+507', name: 'Panama' },
  { code: 'DO', dial: '+1',   name: 'Dominican Republic' },
  { code: 'CO', dial: '+57',  name: 'Colombia' },
  { code: 'VE', dial: '+58',  name: 'Venezuela' },
  { code: 'PE', dial: '+51',  name: 'Peru' },
  { code: 'EC', dial: '+593', name: 'Ecuador' },
  { code: 'BO', dial: '+591', name: 'Bolivia' },
  { code: 'CL', dial: '+56',  name: 'Chile' },
  { code: 'AR', dial: '+54',  name: 'Argentina' },
  { code: 'BR', dial: '+55',  name: 'Brazil' },
  { code: 'UY', dial: '+598', name: 'Uruguay' },
  { code: 'PY', dial: '+595', name: 'Paraguay' },
  { code: 'GB', dial: '+44',  name: 'United Kingdom' },
  { code: 'ES', dial: '+34',  name: 'Spain' },
  { code: 'DE', dial: '+49',  name: 'Germany' },
  { code: 'FR', dial: '+33',  name: 'France' },
  { code: 'IT', dial: '+39',  name: 'Italy' },
  { code: 'PT', dial: '+351', name: 'Portugal' },
  { code: 'IN', dial: '+91',  name: 'India' },
  { code: 'AU', dial: '+61',  name: 'Australia' },
  { code: 'PR', dial: '+1',   name: 'Puerto Rico' },
]

export function countryFlag(code: string): string {
  return Array.from(code.toUpperCase()).map(c => String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0))).join('')
}

export function countryFlagUrl(code: string): string {
  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`
}

export function countryCodeFromName(name: string): string | null {
  const c = COUNTRIES.find(c => c.name.toLowerCase() === name.toLowerCase())
  return c?.code || null
}

export function inferCountryFromPhone(phone: string): string | null {
  if (!phone) return null
  const sorted = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length)
  const match = sorted.find(c => phone.startsWith(c.dial + ' ') || phone.startsWith(c.dial))
  return match?.code || null
}
