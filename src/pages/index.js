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
import { shelvesList } from '../data/shelvesList'
import { getSimplifiedPosts, slugify } from '../utils/helpers'
import config from '../utils/config'
import github from '../assets/nav-github.png'
import { StarIcon } from '../assets/StarIcon'

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
                CS student at IIT Kharagpur. Systems builder, ML engineer, competitive programmer, all-around nerd.
              </p>
              <Heading title="A brief timeline" small />
              <ul className="hero-eras">
                <li>
                  <span className="era-dates">2006&ndash;2024</span>
                  <span>
                    Curious kid, video games, movies and tinkering with computers. Recommendation: Steppenwolf Project
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
                    , grinding competitive programming, and exploring ML and Software &amp; systems.{' '}
                    <Link to="/blog">{postCount} post{postCount !== 1 ? 's' : ''}</Link> so far.
                  </span>
                </li>
              </ul>
              <p className="hero-description">
                <Link to="/me">Also</Link>: algorithmic problem solver, robotics explorer, C++ programmer
                systems enthusiast.
              </p>
            </div>
            <div className="hero-image-container">
              <img src="/ram.png" className="hero-image" alt="RAM Ram" />
              <aside className="hero-bubble">
                Can't remember how to spell my name? Practice hard!
              </aside>
            </div>
          </div>
        </Hero>

        <section className="section-index">
          <Heading title="Latest" slug="/blog" buttonText="All Posts" />
          <Posts data={recent} detailed />
        </section>

        <section className="section-index">
          <Heading
            title="Shelves"
            slug="/shelves"
            buttonText="All Shelves"
            description="Hand-picked paths through everything I've written."
          />
          <div className="cards cards-half">
            {shelvesList.map((shelf) => (
              <Link
                className="card card-highlight card-shelf"
                to={`/shelves#${slugify(shelf.title)}`}
                key={shelf.title}
              >
                <div className="flex-space-between">
                  <div className="card-title">{shelf.title}</div>
                  <div className="chip">
                    <span className="chip-highlight">{shelf.links.length}</span>
                  </div>
                </div>
                <p>{shelf.description}</p>
              </Link>
            ))}
          </div>
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
              .slice(0, 6)
              .map((project) => {
                const sourceLink =
                  project.sourceUrl ||
                  (project.repo
                    ? `https://github.com/${project.repo}`
                    : `https://github.com/YugBargaway2006/${project.slug}`)

                const stargazersLink =
                  project.stargazersUrl ||
                  (project.repo
                    ? `https://github.com/${project.repo}/stargazers`
                    : `https://github.com/YugBargaway2006/${project.slug}/stargazers`)

                return (
                  <div className="card" key={`highlight-${project.name}`}>
                    <div className="stars">
                      <div className="star">
                        <a
                          href={stargazersLink}
                          target="_blank"
                          rel="noreferrer"
                          title={`${project.stars ?? 0} stars on GitHub`}
                        >
                          {Number(project.stars ?? 0).toLocaleString()}
                        </a>
                        <StarIcon />
                      </div>
                    </div>
                    <time>{project.date}</time>
                    <a
                      href={project.url || sourceLink}
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
                      {project.url && project.url !== sourceLink && (
                        <a href={project.url} target="_blank" rel="noreferrer">
                          Demo
                        </a>
                      )}
                      <a href={sourceLink} target="_blank" rel="noreferrer">
                        Source
                      </a>
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
