import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Miarisa - Точная агрономия | Интеллект садов на базе ИИ',
  description: 'Превращаем хаос в точность. Miarisa заменяет статичные календари фермерства динамической аналитикой с ИИ-рекомендациями.',
  keywords: 'точное земледелие, агрономия, ИИ в сельском хозяйстве, управление садами, сельскохозяйственные технологии',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  )
}

