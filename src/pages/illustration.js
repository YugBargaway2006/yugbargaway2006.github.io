import React from 'react'
import Helmet from 'react-helmet'

import { Layout } from '../components/Layout'
import { SEO } from '../components/SEO'
import { Hero } from '../components/Hero'
import { PageLayout } from '../components/PageLayout'
import config from '../utils/config'

const images = [
  { url: '/yug-profile.jpg', title: 'Yug Bargaway' },
]

export default function Illustration() {
  const title = 'Gallery'
  const description = "I don't draw much, but here's a few illustrations and photos."

  return (
    <>
      <Helmet title={`${title} | ${config.siteTitle}`} />
      <SEO customTitle={title} customDescription={description} />

      <PageLayout>
        <Hero title={title} description={description} />

        <div className="cards">
          {images.map((image) => {
            return (
              <div className="card" key={image.url}>
                <a href={image.url} target="_blank" rel="noreferrer">
                  <div>{image.title}</div>

                  <div
                    className="image-thumbnail"
                    style={{ backgroundImage: `url('${image.url}')` }}
                    alt={image.title}
                  />
                </a>
              </div>
            )
          })}
        </div>
      </PageLayout>
    </>
  )
}

Illustration.Layout = Layout
