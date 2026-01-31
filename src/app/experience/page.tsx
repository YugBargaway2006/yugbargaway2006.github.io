import { SectionHeader } from "@/components/section-header";
import { ExperienceList } from "@/components/experience-list";

export default function ExperiencePage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <SectionHeader
                title="Magical Journey"
                subtitle="My professional adventures and quests"
            />
            <ExperienceList />
        </div>
    );
}
