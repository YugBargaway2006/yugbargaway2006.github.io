import React, { useMemo } from 'react'
import { Link, graphql } from 'gatsby'

import Helmet from 'react-helmet'

import { Layout } from '../components/Layout'
import { Posts } from '../components/Posts'
import { SEO } from '../components/SEO'
import { Heading } from '../components/Heading'
import { Hero } from '../components/Hero'
import { PageLayout } from '../components/PageLayout'
import { projectsList } from '../data/projectsList'
import { getSimplifiedPosts } from '../utils/helpers'
import config from '../utils/config'
import github from '../assets/nav-github.png'

export default function Index({ data }) {
  const latestPosts = data.latestPosts.edges
  const postCount = data.postCount.totalCount
  const recent = useMemo(
    () => getSimplifiedPosts(latestPosts, { thumbnails: true }),
    [latestPosts]
  )

  return (
    <>
      <Helmet title={config.siteTitle} />
      <SEO />

      <PageLayout>
        <Hero type="index">
          <div className="hero-wrapper">
            <div>
              <h1 className="flex-align-center gap">Hey, I'm Yug!</h1>
              <p className="hero-description hero-tagline">
                CS student at IIT Kharagpur. Systems builder, ML engineer, competitive programmer.
              </p>
              <Heading title="A brief timeline" small />
              <ul className="hero-eras">
                <li>
                  <span className="era-dates">2006&ndash;2018</span>
                  <span>
                    Curious kid: video games, math olympiads, and tinkering with computers.
                  </span>
                </li>
                <li>
                  <span className="era-dates">2018&ndash;2024</span>
                  <span>
                    Fell in love with competitive programming. Started building projects in C++ and Python.
                  </span>
                </li>
                <li>
                  <span className="era-dates">2024&ndash;now</span>
                  <span>
                    B.Tech CS at IIT Kharagpur. Building{' '}
                    <a
                      href="https://github.com/YugBargaway2006"
                      rel="noreferrer"
                      target="_blank"
                    >
                      projects on GitHub
                    </a>
                    , grinding competitive programming (Codeforces Expert, 1742), and exploring ML &amp; systems.{' '}
                    <Link to="/blog">{postCount} post{postCount !== 1 ? 's' : ''}</Link> so far.
                  </span>
                </li>
              </ul>
              <p className="hero-description">
                <Link to="/me">Also</Link>: algorithmic problem solver, robotics explorer,
                low-latency systems enthusiast.
              </p>
            </div>
            <div className="hero-image-container">
              <img src="/yug-profile.jpg" className="hero-image" alt="Yug Bargaway" />
            </div>
          </div>
        </Hero>

        <section className="section-index">
          <Heading title="Latest" slug="/blog" buttonText="All Posts" />
          <Posts data={recent} detailed />
        </section>

        <section>
          <Heading
            title="Projects"
            slug="/projects"
            buttonText="All Projects"
            description="Things I've built — from low-latency trading systems to AI models."
            icon={github}
          />

          <div className="cards">
            {projectsList
              .filter((project) => project.highlight)
              .map((project) => {
                return (
                  <div className="card" key={`highlight-${project.slug}`}>
                    <time>{project.date}</time>
                    <a
                      href={project.url || `https://github.com/YugBargaway2006/${project.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {project.name}
                    </a>
                    <p>{project.tagline}</p>
                    <div className="card-links">
                      {project.writeup && (
                        <Link to={project.writeup}>Article</Link>
                      )}
                      {project.url && (
                        <a href={project.url} target="_blank" rel="noreferrer">
                          Source
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        </section>
      </PageLayout>
    </>
  )
}

Index.Layout = Layout

export const pageQuery = graphql`
  query IndexQuery {
    latestPosts: allMarkdownRemark(
      limit: 4
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { template: { eq: "post" } } }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            tags
            categories
            thumbnail {
              publicURL
            }
          }
        }
      }
    }
    postCount: allMarkdownRemark(
      filter: { frontmatter: { template: { eq: "post" } } }
    ) {
      totalCount
    }
  }
`
