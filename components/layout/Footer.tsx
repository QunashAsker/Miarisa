'use client'

import Link from 'next/link'
import Logo from '../ui/Logo'

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo dark />
            </div>
            <p className="text-white/70 mb-4 max-w-md">
              Точная агрономия. Интеллект садов на базе ИИ. Превращаем хаос в точность.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Продукт</h3>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link href="/product" className="hover:text-white transition-colors">
                  Панель управления
                </Link>
              </li>
              <li>
                <Link href="/technology" className="hover:text-white transition-colors">
                  Технологии
                </Link>
              </li>
              <li>
                <Link href="/technology#roi" className="hover:text-white transition-colors">
                  Калькулятор ROI
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2 text-white/70">
              <li>
                <a href="mailto:info@miarisa.com" className="hover:text-white transition-colors">
                  info@miarisa.com
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-white/70 text-sm">
          <p>© 2024 Miarisa. Все права защищены.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

