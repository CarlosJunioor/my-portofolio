import { Hero } from "@/components/home/Hero";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { FeaturedMissions } from "@/components/home/FeaturedMissions";
import { LatestPosts } from "@/components/home/LatestPosts";
import { ContactCTA } from "@/components/home/ContactCTA";
import { profile } from "@/content/profile";
import { getProjects } from "@/lib/projects";
import { getAllPosts } from "@/lib/posts";

export default async function HomePage() {
  const [{ featured }, posts] = await Promise.all([getProjects(), getAllPosts()]);
  return (
    <>
      <Hero name={profile.name} roles={profile.roles} location={profile.location} />
      <AboutTeaser bio={profile.bio} skills={profile.skills} />
      <FeaturedMissions projects={featured} />
      <LatestPosts posts={posts.slice(0, 3)} />
      <ContactCTA email={profile.email} />
    </>
  );
}
