import { SectionHeader } from "@/components/section-header";
import { ProjectsGrid } from "@/components/projects-grid";

export default function ProjectsPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <SectionHeader
                title="Magical Artifacts"
                subtitle="Projects I've conjured into existence"
            />
            <ProjectsGrid />
        </div>
    );
}
