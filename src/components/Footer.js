import React from 'react'

import gatsby from '../assets/gatsby.png'
import github from '../assets/nav-github.png'
import { Rss } from '../assets/Rss'
import { Heart } from '../assets/Heart'

const links = [
  { url: '/rss.xml', label: 'RSS feed', Icon: Rss },
]
const madeWithLinks = [
  { url: 'https://www.gatsbyjs.org', label: 'Gatsby', icon: gatsby },
  { url: 'https://github.com/YugBargaway2006', label: 'GitHub', icon: github },
]

export const Footer = () => {
  return (
    <footer className="footer">
      <section className="footer-section">
        <nav className="footer-menu">
          {links.map((link) => (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              key={link.url}
              className="footer-link"
            >
              <link.Icon size={15} />
              {link.label}
            </a>
          ))}
        </nav>
        <nav className="footer-menu-buttons">
          {madeWithLinks.map((link) => (
            <a
              href={link.url}
              title={link.label}
              target="_blank"
              rel="noopener noreferrer"
              key={link.url}
              className="button small"
            >
              <img src={link.icon} alt="" />
              <span>{link.label}</span>
            </a>
          ))}
        </nav>
        <div className="footer-made-by">
          Made with <Heart size={14} /> by Yug Bargaway
        </div>
      </section>
    </footer>
  )
}
