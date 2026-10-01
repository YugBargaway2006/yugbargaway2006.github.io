"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DetailsSidebar } from "@/components/details-sidebar";
import { Briefcase, Calendar } from "lucide-react";

interface Experience {
    id: string;
    role: string;
    company: string;
    duration: string;
    description: string;
    details: string;
}

const experiences: Experience[] = [
    {
        id: "exp1",
        role: "Data Analytics & AI Intern",
        company: "ShipCube LLC (Remote)",
        duration: "Nov 2025 - Jan 2026",
        description: "Developed full-stack support chatbot and custom intelligence bot generating 1000+ verified leads daily.",
        details: `
      <h3 class="text-xl font-bold mb-2">Key Achievements</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li>Developed full-stack support chatbot using multi-stage RAG and ML pipelines, <strong>boosting accuracy by 30%</strong> and cutting resolution time by 70%</li>
        <li>Built a custom intelligence bot generating <strong>1000+ verified leads daily</strong>, automating market research and cutting manual prospecting time by 95%</li>
        <li>Orchestrated system architecture for WMS ingestion on GCP, defining high-level data flows, service boundaries, and cache-DB interactions</li>
      </ul>
      <h3 class="text-xl font-bold mt-4 mb-2">Technologies Used</h3>
      <p>Python, AI/ML Pipelines, RAG, GCP, Data Analysis</p>
    `,
    },
    {
        id: "exp2",
        role: "Undergraduate Research Assistant",
        company: "Under Assistant Prof. Priyam Chakraborty - IIT Kharagpur",
        duration: "Aug 2025 - Nov 2025",
        description: "Research on vision-driven robotics system architecture with DRL-based pipelines.",
        details: `
      <h3 class="text-xl font-bold mb-2">Research Contributions</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li>Orchestrated TRL-0 system architecture for vision-driven robotics, defining perception, friction estimation and <strong>DRL-based pipelines design</strong></li>
        <li>Designed feasibility targets via architecture: <strong>95%+ perception accuracy, ≤ 5% friction error, and ≤ 5 ms policy switching latency</strong> in simulation</li>
        <li>Authored architectural blueprint spanning perception, estimation, and control with an <strong>18-month roadmap</strong>, project paused due to funding limits</li>
      </ul>
      <h3 class="text-xl font-bold mt-4 mb-2">Skills Developed</h3>
      <p>Deep Reinforcement Learning, Computer Vision, Robotics Control Systems</p>
    `,
    },
];

export function ExperienceList() {
    const [selectedExp, setSelectedExp] = useState<Experience | null>(null);

    return (
        <>
            <div className="grid gap-6 max-w-3xl mx-auto">
                {experiences.map((exp, index) => (
                    <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedExp(exp)}
                        className="cursor-pointer group"
                    >
                        <Card className="hover:border-primary transition-all duration-300 relative overflow-hidden">
                            <div className="absolute left-0 top-0 h-full w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{exp.role}</CardTitle>
                                        <p className="text-lg font-medium text-foreground/80">{exp.company}</p>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground bg-secondary/30 px-3 py-1 rounded-full">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        {exp.duration}
                                    </div>
                                </div>
                                <CardDescription className="text-base">{exp.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <DetailsSidebar
                isOpen={!!selectedExp}
                onClose={() => setSelectedExp(null)}
                title={selectedExp?.role || ""}
            >
                {selectedExp && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold text-lg mb-4">
                            <Briefcase className="w-5 h-5" />
                            {selectedExp.company}
                        </div>
                        <div
                            className="prose dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: selectedExp.details }}
                        />
                    </div>
                )}
            </DetailsSidebar>
        </>
    );
}
