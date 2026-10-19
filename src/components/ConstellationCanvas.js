import React, { useEffect, useRef } from 'react'

export const ConstellationCanvas = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = canvas.parentElement.offsetWidth)
    let height = (canvas.height = canvas.parentElement.offsetHeight)

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return
      width = canvas.width = canvas.parentElement.offsetWidth
      height = canvas.height = canvas.parentElement.offsetHeight
    }

    window.addEventListener('resize', handleResize)

    // Mouse coordinates
    let mouse = { x: -1000, y: -1000 }
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    // Particle nodes
    const particleCount = Math.min(50, Math.floor((width * height) / 14000) || 35)
    const particles = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1.2,
      })
    }

    const maxDistance = 140

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      const isDark = document.documentElement.classList.contains('is-dark') ||
        (!document.documentElement.classList.contains('is-light') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)

      const particleColor = isDark ? 'rgba(254, 222, 145, 0.7)' : 'rgba(178, 106, 52, 0.6)'
      const lineColor = isDark ? 'rgba(255, 255, 255, ' : 'rgba(78, 78, 85, '

      // Check envelope position for repulsion
      const envelopeEl = document.getElementById('hogwarts-envelope')
      let envelopeCenter = null
      if (envelopeEl) {
        const rect = envelopeEl.getBoundingClientRect()
        const canvasRect = canvas.getBoundingClientRect()
        envelopeCenter = {
          x: rect.left + rect.width / 2 - canvasRect.left,
          y: rect.top + rect.height / 2 - canvasRect.top,
        }
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        p.x += p.vx
        p.y += p.vy

        // Bounce
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        // Mouse Repulsion
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100 && dist > 0) {
          const force = (100 - dist) / 100
          p.x += (dx / dist) * force * 2.5
          p.y += (dy / dist) * force * 2.5
        }

        // Envelope Repulsion
        if (envelopeCenter) {
          const edx = p.x - envelopeCenter.x
          const edy = p.y - envelopeCenter.y
          const edist = Math.sqrt(edx * edx + edy * edy)
          if (edist < 120 && edist > 0) {
            const eforce = (120 - edist) / 120
            p.x += (edx / edist) * eforce * 3
            p.y += (edy / edist) * eforce * 3
          }
        }

        // Draw dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.fill()

        // Connect lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const ldx = p.x - p2.x
          const ldy = p.y - p2.y
          const ldist = Math.sqrt(ldx * ldx + ldy * ldy)

          if (ldist < maxDistance) {
            const alpha = (1 - ldist / maxDistance) * 0.22
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = lineColor + alpha + ')'
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="contact-particles-canvas"
      aria-hidden="true"
    />
  )
}
