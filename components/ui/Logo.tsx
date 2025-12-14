'use client'

import Image from 'next/image'

export default function Logo({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  const textColor = dark ? 'text-white' : 'text-primary'

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Image */}
      <div className="relative" style={{ width: '90px', height: '90px' }}>
        <Image
          src="/logo2.png"
          alt="Miarisa Logo"
          width={90}
          height={90}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      <span className={`text-2xl font-bold ${textColor}`}>Miarisa</span>
    </div>
  )
}
