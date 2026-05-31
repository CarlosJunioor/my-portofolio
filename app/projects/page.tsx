import type { Metadata } from "next";
import { MissionControlBoard } from "@/components/projects/MissionControlBoard";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Mission Control — live, building, and archived projects by Carlos Junior.",
};

export default async function ProjectsPage() {
  const { featured, live, archived } = await getProjects();
  return (
    <div className="pt-28 pb-12">
      <MissionControlBoard featured={featured} live={live} archived={archived} />
    </div>
  );
}
