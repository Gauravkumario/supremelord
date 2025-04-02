import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Layout from "../components/Layout";
import ProjectCard from "../components/ProjectCard";
import { fetchProjects } from "../lib/api";
import { getUserProfile } from "../lib/auth";
import styles from "../styles/Home.module.css";

export default function Home({ initialProjects, profile }) {
  const [projects, setProjects] = useState(initialProjects || []);

  // Fetch latest projects on client-side
  useEffect(() => {
    const getProjects = async () => {
      try {
        const latestProjects = await fetchProjects();
        setProjects(latestProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    getProjects();
  }, []);

  return (
    <Layout title={`${profile.name} | Developer Portfolio`}>
      <Head>
        <meta
          property="og:title"
          content={`${profile.name} | Developer Portfolio`}
        />
        <meta property="og:description" content={profile.bio} />
      </Head>

      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <Image
            src={profile.profileImage || "/default-avatar.svg"}
            alt={profile.name}
            className={styles.profileImage}
            width={150}
            height={150}
          />

          <h1 className={styles.heroName}>{profile.name}</h1>
          <h2 className={styles.heroTitle}>{profile.title}</h2>
          <p className={styles.heroBio}>{profile.bio}</p>
        </div>
      </section>

      <section className={styles.projectsSection}>
        <h2 className={styles.sectionTitle}>My Projects</h2>

        {projects.length > 0 ? (
          <div className={styles.projectsGrid}>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyProjects}>
            <div className={styles.emptyIcon}>
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <h3>No projects yet</h3>
            <p className={styles.emptyText}>
              Projects you create will appear here.
            </p>
          </div>
        )}
      </section>
    </Layout>
  );
}

// Server-side rendering to get initial data
export async function getServerSideProps() {
  try {
    // Get user profile
    const profile = getUserProfile();

    if (!profile) {
      return {
        notFound: true,
      };
    }

    // Get projects from database
    const projects = require("../data/projects.json");

    return {
      props: {
        initialProjects: projects,
        profile,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      notFound: true,
    };
  }
}
