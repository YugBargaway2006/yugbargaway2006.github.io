import React, { useState, useEffect } from "react"
import Helmet from "react-helmet"
import { Link } from "gatsby"

import { StarIcon } from "../assets/StarIcon"
import { Layout } from "../components/Layout"
import { SEO } from "../components/SEO"
import { Hero } from "../components/Hero"
import { PageLayout } from "../components/PageLayout"
import config from "../utils/config"
import { projectsList } from "../data/projectsList"
import projects from "../assets/nav-projects.png"

export default function Projects() {
  const [repoStars, setRepoStars] = useState({})
  const title = "Projects"
  const description =
    "Open-source projects I have built, ranging from low-latency financial systems and hardware architectures to machine learning models and developer tools."

  useEffect(() => {
    async function fetchStars() {
      const starsMap = {}

      try {
        const res = await fetch(
          "https://api.github.com/users/YugBargaway2006/repos?per_page=100"
        )
        const data = await res.json()
        if (Array.isArray(data)) {
          data.forEach((repo) => {
            starsMap[repo.name] = repo.stargazers_count
            starsMap[repo.full_name] = repo.stargazers_count
          })
        }
      } catch (err) {
        console.error("Error fetching YugBargaway2006 repos:", err)
      }

      try {
        const resExtra = await fetch(
          "https://api.github.com/repos/rkhall-iitkgp/SyntheticBullApp"
        )
        const dataExtra = await resExtra.json()
        if (dataExtra && typeof dataExtra.stargazers_count === "number") {
          starsMap["SyntheticBullApp"] = dataExtra.stargazers_count
          starsMap["rkhall-iitkgp/SyntheticBullApp"] =
            dataExtra.stargazers_count
        }
      } catch (err) {
        console.error("Error fetching SyntheticBullApp repo:", err)
      }

      setRepoStars(starsMap)
    }

    fetchStars()
  }, [])

  return (
    <>
      <Helmet title={`${title} | ${config.siteTitle}`} />
      <SEO customTitle={title} customDescription={description} />

      <PageLayout>
        <Hero title={title} description={description} icon={projects} />

        <div className="cards">
          {projectsList.map((project) => {
            const stars =
              repoStars[project.repo] ??
              repoStars[project.slug] ??
              project.stars ??
              0

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
              <div className="card" key={project.name}>
                <div className="stars">
                  <div className="star">
                    <a
                      href={stargazersLink}
                      target="_blank"
                      rel="noreferrer"
                      title={`${stars} star${stars === 1 ? "" : "s"} on GitHub`}
                    >
                      {Number(stars).toLocaleString()}
                    </a>
                    <StarIcon />
                  </div>
                </div>
                <time>{project.date}</time>
                <a
                  className="card-header"
                  href={project.url || sourceLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.name}
                </a>
                <p>{project.tagline}</p>
                <div className="card-links">
                  {project.writeup && <Link to={project.writeup}>Article</Link>}
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
      </PageLayout>
    </>
  )
}

Projects.Layout = Layout
