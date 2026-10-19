import React from 'react'
import { Link } from 'gatsby'

export const AuthorCard = () => {
  return (
    <aside className="author-card">
      <img src="/ram.png" alt="Yug Bargaway" width="80" height="80" />
      <p>
        Hey! I'm Yug, a CS student at IIT Kharagpur building stuff with code. You can{' '}
        <Link to="/me">read more about me</Link>, or check out my work on{' '}
        <a
          href="https://github.com/YugBargaway2006"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        .
      </p>
    </aside>
  )
}
