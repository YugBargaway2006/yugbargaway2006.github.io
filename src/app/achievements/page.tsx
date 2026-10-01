import { SectionHeader } from "@/components/section-header";
import { AchievementsList } from "@/components/achievements-list";
import { HouseBanners } from "@/components/house-banners";

export default function AchievementsPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <SectionHeader
                title="Hall of Fame"
                subtitle="Accolades and trophies collected along the way"
            />
            <HouseBanners />
            <AchievementsList />
        </div>
    );
}
