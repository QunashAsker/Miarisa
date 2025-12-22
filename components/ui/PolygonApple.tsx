'use client'

import { motion } from 'framer-motion'

interface PolygonAppleProps {
  className?: string
  size?: number
  animated?: boolean
}

export default function PolygonApple({ 
  className = '', 
  size = 400,
  animated = true 
}: PolygonAppleProps) {
  const viewBox = "0 0 200 200"
  
  // Polygon mesh points for the apple shape
  const applePoints = [
    // Outer contour
    { x: 100, y: 30 },
    { x: 85, y: 35 },
    { x: 70, y: 45 },
    { x: 60, y: 60 },
    { x: 55, y: 75 },
    { x: 55, y: 90 },
    { x: 60, y: 105 },
    { x: 70, y: 120 },
    { x: 85, y: 135 },
    { x: 100, y: 145 },
    { x: 115, y: 135 },
    { x: 130, y: 120 },
    { x: 140, y: 105 },
    { x: 145, y: 90 },
    { x: 145, y: 75 },
    { x: 140, y: 60 },
    { x: 130, y: 45 },
    { x: 115, y: 35 },
  ]

  // Internal mesh points
  const meshPoints = [
    // Horizontal lines
    [{ x: 75, y: 50 }, { x: 125, y: 50 }],
    [{ x: 70, y: 70 }, { x: 130, y: 70 }],
    [{ x: 65, y: 90 }, { x: 135, y: 90 }],
    [{ x: 70, y: 110 }, { x: 130, y: 110 }],
    [{ x: 80, y: 130 }, { x: 120, y: 130 }],
    // Vertical lines
    [{ x: 100, y: 35 }, { x: 100, y: 145 }],
    [{ x: 85, y: 40 }, { x: 85, y: 140 }],
    [{ x: 115, y: 40 }, { x: 115, y: 140 }],
    // Diagonal lines
    [{ x: 80, y: 55 }, { x: 120, y: 85 }],
    [{ x: 120, y: 55 }, { x: 80, y: 85 }],
    [{ x: 85, y: 100 }, { x: 115, y: 125 }],
    [{ x: 115, y: 100 }, { x: 85, y: 125 }],
  ]

  const applePath = applePoints.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z'

  const stemPath = 'M 100 30 L 100 20 L 105 20 L 105 25 L 100 30'
  const leafPath = 'M 105 20 Q 110 15, 115 20 Q 110 25, 105 20'

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={viewBox}
      className={className}
      initial={animated ? { opacity: 0, scale: 0.8 } : {}}
      animate={animated ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Apple shape with polygon mesh */}
      <motion.path
        d={applePath}
        fill="none"
        stroke="#1a365d"
        strokeWidth="2"
        initial={animated ? { pathLength: 0 } : {}}
        animate={animated ? { pathLength: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* Internal mesh lines */}
      {meshPoints.map((line, i) => (
        <motion.line
          key={i}
          x1={line[0].x}
          y1={line[0].y}
          x2={line[1].x}
          y2={line[1].y}
          stroke="#1a365d"
          strokeWidth="1"
          opacity="0.3"
          initial={animated ? { pathLength: 0, opacity: 0 } : {}}
          animate={animated ? { pathLength: 1, opacity: 0.3 } : {}}
          transition={{ 
            duration: 0.8, 
            delay: 0.5 + i * 0.1,
            ease: "easeInOut" 
          }}
        />
      ))}

      {/* Polygon mesh dots */}
      {applePoints.map((point, i) => (
        <motion.circle
          key={i}
          cx={point.x}
          cy={point.y}
          r="2"
          fill="#1a365d"
          initial={animated ? { scale: 0, opacity: 0 } : {}}
          animate={animated ? { scale: 1, opacity: 1 } : {}}
          transition={{ 
            duration: 0.3, 
            delay: 0.8 + i * 0.05,
            ease: "easeOut" 
          }}
        />
      ))}

      {/* Internal mesh intersection points */}
      {[
        { x: 100, y: 70 },
        { x: 100, y: 90 },
        { x: 100, y: 110 },
        { x: 85, y: 90 },
        { x: 115, y: 90 },
        { x: 90, y: 70 },
        { x: 110, y: 70 },
        { x: 90, y: 110 },
        { x: 110, y: 110 },
      ].map((point, i) => (
        <motion.circle
          key={`mesh-${i}`}
          cx={point.x}
          cy={point.y}
          r="1.5"
          fill="#00897b"
          initial={animated ? { scale: 0, opacity: 0 } : {}}
          animate={animated ? { scale: 1, opacity: 0.6 } : {}}
          transition={{ 
            duration: 0.3, 
            delay: 1.2 + i * 0.05,
            ease: "easeOut" 
          }}
        />
      ))}

      {/* Stem */}
      <motion.path
        d={stemPath}
        fill="none"
        stroke="#1a365d"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={animated ? { pathLength: 0 } : {}}
        animate={animated ? { pathLength: 1 } : {}}
        transition={{ duration: 0.5, delay: 1.8, ease: "easeInOut" }}
      />

      {/* Leaf */}
      <motion.path
        d={leafPath}
        fill="none"
        stroke="#1a365d"
        strokeWidth="1.5"
        initial={animated ? { pathLength: 0 } : {}}
        animate={animated ? { pathLength: 1 } : {}}
        transition={{ duration: 0.5, delay: 2, ease: "easeInOut" }}
      />
    </motion.svg>
  )
}


