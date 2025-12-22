'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ScrollVideoProps {
  videoSrc: string
  posterSrc?: string
  children?: React.ReactNode
}

export default function ScrollVideo({ videoSrc, posterSrc, children }: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const rafRef = useRef<number | null>(null)
  const lastScrollY = useRef(0)

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Обработка загрузки видео
  useEffect(() => {
    const video = videoRef.current
    if (!video || isMobile) return

    const handleLoadStart = () => {
      setIsLoading(true)
      setLoadProgress(0)
    }

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const duration = video.duration
        if (duration > 0) {
          setLoadProgress((bufferedEnd / duration) * 100)
        }
      }
    }

    const handleCanPlayThrough = () => {
      setIsLoading(false)
      setIsVideoReady(true)
      setLoadProgress(100)
    }

    const handleLoadedMetadata = () => {
      video.currentTime = 0
    }

    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('progress', handleProgress)
    video.addEventListener('canplaythrough', handleCanPlayThrough)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    // Принудительная загрузка
    video.load()

    return () => {
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('canplaythrough', handleCanPlayThrough)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [isMobile])

  // Управление видео скроллом
  const handleScroll = useCallback(() => {
    const video = videoRef.current
    const container = containerRef.current
    
    if (!video || !container || !isVideoReady || isMobile) return

    const containerRect = container.getBoundingClientRect()
    const containerHeight = container.offsetHeight
    const windowHeight = window.innerHeight

    // Вычисляем прогресс скролла
    const scrollStart = containerRect.top + window.scrollY
    const scrollEnd = scrollStart + containerHeight - windowHeight
    const currentScroll = window.scrollY

    // Прогресс от 0 до 1
    let progress = (currentScroll - scrollStart) / (scrollEnd - scrollStart)
    progress = Math.max(0, Math.min(1, progress))

    // Плавная интерполяция для избежания рывков
    const targetTime = progress * video.duration

    // Используем requestAnimationFrame для плавного обновления
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      if (video && isFinite(targetTime) && !isNaN(targetTime)) {
        // Плавная интерполяция текущего времени
        const currentTime = video.currentTime
        const diff = targetTime - currentTime
        const smoothFactor = 0.15 // Чем меньше, тем плавнее
        
        video.currentTime = currentTime + diff * smoothFactor
      }
    })

    lastScrollY.current = currentScroll
  }, [isVideoReady, isMobile])

  useEffect(() => {
    if (isMobile) return

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll, isMobile])

  return (
    <div ref={containerRef} className="relative">
      {/* Фиксированный видео фон */}
      <div className="fixed inset-0 w-full h-screen overflow-hidden -z-10">
        {/* Индикатор загрузки */}
        <AnimatePresence>
          {isLoading && !isMobile && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#1a365d]"
            >
              <div className="mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-white/20 border-t-[#00897b] rounded-full"
                />
              </div>
              <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#00897b] to-[#00897b]/70 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="mt-4 text-white/70 text-sm font-medium">
                Загрузка видео... {Math.round(loadProgress)}%
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Видео для десктопа */}
        {!isMobile && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src={videoSrc}
            poster={posterSrc}
            muted
            playsInline
            preload="auto"
          />
        )}

        {/* Статичное изображение для мобильных */}
        {isMobile && posterSrc && (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${posterSrc})` }}
          />
        )}

        {/* Затемняющий оверлей для читаемости текста */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a365d]/60 via-[#1a365d]/40 to-[#1a365d]/70" />
      </div>

      {/* Контент поверх видео */}
      {children}
    </div>
  )
}
