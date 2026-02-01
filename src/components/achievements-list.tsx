"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DetailsSidebar } from "@/components/details-sidebar";
import { Trophy, Award } from "lucide-react";

interface Achievement {
    id: string;
    title: string;
    organization: string;
    date: string;
    icon: "trophy" | "award";
    description: string;
    details: string;
}

const achievements: Achievement[] = [
    {
        id: "ach1",
        title: "Codeforces Expert (1612)",
        organization: "Codeforces",
        date: "2024",
        icon: "award",
        description: "Expert rating demonstrating strong algorithmic problem-solving and competitive programming skills.",
        details: `
      <p>Achieved Codeforces Expert rating (1612), demonstrating strong expertise in:</p>
      <ul class="list-disc pl-5 space-y-2 mt-4">
        <li>Algorithmic problem-solving under time constraints</li>
        <li>Advanced data structures and algorithms</li>
        <li>Competitive programming strategies and optimization techniques</li>
        <li>Efficient code implementation and debugging</li>
        <li>Consistent performance across multiple programming contests</li>
      </ul>
    `,
    },
    {
        id: "ach2",
        title: "7th Globally — CDC-TF 2025 Sim Racing League",
        organization: "Automotive Roboracer Competition",
        date: "Nov 2025 - Dec 2025",
        icon: "trophy",
        description: "Achieved 7th globally and 1st in India with an average lap time of 11.7 seconds.",
        details: `
      <p>Achieved outstanding performance in autonomous racing competition:</p>
      <ul class="list-disc pl-5 space-y-2 mt-4">
        <li><strong>Global Ranking:</strong> 7th place worldwide, 1st in India</li>
        <li><strong>Performance:</strong> Average lap time of 11.7 seconds</li>
        <li><strong>Technical Implementation:</strong> Complete autonomous racing system involving perception, localization, controls, and system tuning</li>
        <li>Designed and optimized racing algorithms for real-time decision making</li>
        <li>Implemented advanced sensor fusion and path planning techniques</li>
      </ul>
    `,
    },
    {
        id: "ach3",
        title: "JEE Advanced & Mains 2024",
        organization: "Joint Entrance Examination",
        date: "2024",
        icon: "trophy",
        description: "Qualified for admissions to IITs with strong performance in both examinations",
        details: `
      <p>Achieved exceptional results in both JEE Advanced and JEE Mains examinations, demonstrating strong conceptual understanding and problem-solving abilities.</p>
      <ul class="list-disc pl-5 space-y-2 mt-4">
        <li><strong>JEE Advanced:</strong> Secured AIR 1235, showcasing deep conceptual mastery</li>
        <li><strong>JEE Mains:</strong> Achieved top percentile performance among over 1 million candidates</li>
      </ul>
      <p class="mt-4">These results reflect consistent dedication to mastering complex mathematical and scientific concepts, strong analytical thinking, and the ability to perform under pressure.</p>
    `,
    },
];

export function AchievementsList() {
    const [selectedAch, setSelectedAch] = useState<Achievement | null>(null);

    return (
        <>
            <div className="grid gap-6 max-w-3xl mx-auto">
                {achievements.map((ach, index) => (
                    <motion.div
                        key={ach.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedAch(ach)}
                        className="cursor-pointer group"
                    >
                        <Card className="hover:border-primary transition-all duration-300 flex items-center p-4 gap-4">
                            <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                {ach.icon === "trophy" ? <Trophy className="w-6 h-6" /> : <Award className="w-6 h-6" />}
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{ach.title}</h3>
                                <p className="text-sm font-medium text-muted-foreground">{ach.organization} • {ach.date}</p>
                                <p className="mt-1 text-foreground/80">{ach.description}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <DetailsSidebar
                isOpen={!!selectedAch}
                onClose={() => setSelectedAch(null)}
                title={selectedAch?.title || ""}
            >
                {selectedAch && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold text-lg mb-4">
                            {selectedAch.icon === "trophy" ? <Trophy className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                            {selectedAch.organization}
                        </div>
                        <div
                            className="prose dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: selectedAch.details }}
                        />
                    </div>
                )}
            </DetailsSidebar>
        </>
    );
}
