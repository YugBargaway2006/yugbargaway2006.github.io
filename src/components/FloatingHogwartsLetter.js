import React, { useEffect, useRef, useState } from 'react'

export const FloatingHogwartsLetter = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [hasBeenClicked, setHasBeenClicked] = useState(false)
  const [isRolling, setIsRolling] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [breathingScale, setBreathingScale] = useState(1)

  const letterRef = useRef(null)
  const prevHoveredElement = useRef(null)
  const mousePos = useRef({ x: 0, y: 0 })

  const state = useRef({
    pos: {
      x: typeof window !== 'undefined' ? Math.max(50, window.innerWidth / 2 - 75) : 250,
      y: 120,
    },
    vel: { x: 0, y: 0 },
    acc: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    mode: 'EXPLORE',
    timer: 0,
    rotation: 0,
    breathingTime: 0,
  })

  // Track Mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Physics animation loop
  useEffect(() => {
    let animationId
    const letterWidth = 150
    const letterHeight = 100
    const padding = 10

    const updatePhysics = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const s = state.current

      // 1. STATE MANAGEMENT & TARGET SELECTION
      s.timer--
      if (s.timer <= 0) {
        const rand = Math.random()

        if (rand < 0.35) {
          // TARGET NAVBAR (35% Chance)
          s.mode = 'EXPLORE'
          s.target = {
            x: Math.random() * (width - letterWidth),
            y: -25 + Math.random() * 90,
          }
          s.timer = 150 + Math.random() * 100
        } else if (rand < 0.75) {
          // RANDOM LOWER SCREEN (40% Chance)
          s.mode = 'EXPLORE'
          s.target = {
            x: Math.random() * (width - letterWidth),
            y: height * 0.5 + Math.random() * (height * 0.45 - letterHeight),
          }
          s.timer = 180 + Math.random() * 120
        } else {
          // FULL RANDOM (25%)
          s.mode = 'EXPLORE'
          s.target = {
            x: Math.random() * (width - letterWidth),
            y: Math.random() * (height - letterHeight),
          }
          s.timer = 200 + Math.random() * 200
        }
      }

      // 2. FORCE CALCULATION
      s.acc = { x: 0, y: 0 }

      if (s.mode === 'EXPLORE') {
        const dx = s.target.x - s.pos.x
        const dy = s.target.y - s.pos.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > 30) {
          const speed = 0.25
          s.acc.x += (dx / dist) * speed
          s.acc.y += (dy / dist) * speed
        }
      } else if (s.mode === 'IDLE') {
        s.acc.x -= s.vel.x * 0.1
        s.acc.y -= s.vel.y * 0.1
      }

      // Mouse Repulsion
      const mDx = mousePos.current.x - (s.pos.x + letterWidth / 2)
      const mDy = mousePos.current.y - (s.pos.y + letterHeight / 2)
      const mDist = Math.sqrt(mDx * mDx + mDy * mDy)

      if (!isHovered && mDist < 200 && mDist > 0) {
        const repelStrength = 0.6
        s.acc.x -= (mDx / mDist) * repelStrength
        s.acc.y -= (mDy / mDist) * repelStrength
      }

      // Wind wander
      s.acc.x += (Math.random() - 0.5) * 0.08
      s.acc.y += (Math.random() - 0.5) * 0.08

      // 3. INTEGRATION (Euler)
      s.vel.x += s.acc.x
      s.vel.y += s.acc.y

      s.vel.x *= 0.96
      s.vel.y *= 0.96

      const maxSpeed = 10
      const speedMag = Math.sqrt(s.vel.x ** 2 + s.vel.y ** 2)
      if (speedMag > maxSpeed) {
        s.vel.x = (s.vel.x / speedMag) * maxSpeed
        s.vel.y = (s.vel.y / speedMag) * maxSpeed
      }

      s.pos.x += s.vel.x
      s.pos.y += s.vel.y

      // 4. BOUNDARY CHECKS
      if (s.pos.x < padding) {
        s.pos.x = padding
        s.vel.x *= -0.5
      }
      if (s.pos.x > width - letterWidth - padding) {
        s.pos.x = width - letterWidth - padding
        s.vel.x *= -0.5
      }
      if (s.pos.y < -30) {
        s.pos.y = -30
        s.vel.y *= -0.5
      }
      if (s.pos.y > height - letterHeight - padding) {
        s.pos.y = height - letterHeight - padding
        s.vel.y *= -0.5
      }

      // 5. SECONDARY ANIMATIONS
      const targetRot = s.vel.x * 2.5
      s.rotation += (targetRot - s.rotation) * 0.1

      s.breathingTime += 0.03
      const breathe = 1 + Math.sin(s.breathingTime) * 0.03
      setBreathingScale(breathe)

      // 6. GHOST INTERACTION (Trigger underlying elements)
      if (letterRef.current) {
        letterRef.current.style.transform = `translate3d(${s.pos.x}px, ${s.pos.y}px, 0) rotate(${s.rotation}deg)`

        const cx = s.pos.x + letterWidth / 2
        const cy = s.pos.y + letterHeight / 2

        letterRef.current.style.pointerEvents = 'none'
        const elBelow = document.elementFromPoint(cx, cy)
        letterRef.current.style.pointerEvents = 'auto'

        if (elBelow && elBelow !== prevHoveredElement.current) {
          if (prevHoveredElement.current) {
            try {
              const eventOpts = { bubbles: true, cancelable: true, view: window }
              prevHoveredElement.current.dispatchEvent(new MouseEvent('mouseleave', eventOpts))
              prevHoveredElement.current.dispatchEvent(new MouseEvent('mouseout', eventOpts))
              prevHoveredElement.current.removeAttribute('data-simulated-hover')
            } catch (e) {}
          }

          const interactive = elBelow.closest('a, button, [role="button"], .interactive-card, .contact-link-card, .contact-form-card')
          if (interactive) {
            const eventOpts = { bubbles: true, cancelable: true, view: window }
            interactive.dispatchEvent(new MouseEvent('mouseenter', eventOpts))
            interactive.dispatchEvent(new MouseEvent('mouseover', eventOpts))
            interactive.setAttribute('data-simulated-hover', 'true')
            prevHoveredElement.current = interactive
          } else {
            prevHoveredElement.current = null
          }
        }
      }

      animationId = requestAnimationFrame(updatePhysics)
    }

    animationId = requestAnimationFrame(updatePhysics)
    return () => {
      cancelAnimationFrame(animationId)
      if (prevHoveredElement.current) {
        prevHoveredElement.current.removeAttribute('data-simulated-hover')
      }
    }
  }, [isHovered])

  const handleClick = () => {
    if (!hasBeenClicked) {
      setHasBeenClicked(true)
      setIsRolling(true)
      setTimeout(() => {
        setIsRolling(false)
      }, 850)
    } else {
      setShowMessage(true)
      setTimeout(() => setShowMessage(false), 3000)
    }
  }

  return (
    <>
      <div
        id="hogwarts-envelope"
        ref={letterRef}
        style={{ width: '150px', height: '100px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        title="Catch me if you can!"
      >
        <div
          className={`hogwarts-letter-wrapper ${isHovered ? 'is-hovered' : ''} ${
            isRolling ? 'hogwarts-barrel-roll' : ''
          }`}
          style={{ transform: `scale(${breathingScale})` }}
        >
          <img
            src="/hogwarts-letter.png"
            alt="Hogwarts Letter"
            className="hogwarts-letter-img"
          />

          {isHovered &&
            [0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="hogwarts-sparkle"
                style={{
                  left: `${45 + (i * 18) % 35}%`,
                  top: `${40 + (i * 23) % 35}%`,
                  animationDelay: `${i * 0.15}s`,
                  '--tx': `${(i % 2 === 0 ? 1 : -1) * (10 + i * 4)}px`,
                  '--ty': `${-25 - i * 5}px`,
                }}
              />
            ))}
        </div>
      </div>

      {showMessage && (
        <div className="wizard-flash-pill">
          ✨ You&apos;re a wizard! ✨
        </div>
      )}
    </>
  )
}
