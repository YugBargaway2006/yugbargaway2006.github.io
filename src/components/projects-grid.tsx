"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DetailsSidebar } from "@/components/details-sidebar";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import Link from "next/link";

interface Project {
    id: string;
    title: string;
    category: string;
    description: string;
    repoUrl?: string;
    liveUrl?: string;
    tags: string[];
    details: string;
}

const projects: Project[] = [
    {
        id: "proj1",
        title: "High Performance Trade Matching Engine",
        category: "Systems Programming",
        description: "Built a low-latency C++17 transaction processing engine delivering 641ns critical-path latency.",
        repoUrl: "https://github.com/YugBargaway2006/Software_Modules/tree/main/Order_Book",
        liveUrl: "/trading-engine/index.html",
        tags: ["C++17", "UDP/IP", "Zero-Allocation", "Low-Latency"],
        details: `
      <p>Designed and implemented a high-performance transaction processing system for critical financial operations.</p>
      <h3 class="text-xl font-bold mt-4 mb-2">Key Features</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li>Built a low-latency C++17 transaction processing engine delivering <strong>641ns critical-path latency</strong> and <strong>1.5M orders/sec</strong> on single-core hardware</li>
        <li>Achieved performance gains through cache-friendly O(1) data structures, zero-allocation object pools, and a raw UDP/IP networking stack</li>
        <li>Enabled development and testing via CMake and Bash-driven CI/CD, supporting automated process, builds, tests and cleanup integration</li>
      </ul>
      <h3 class="text-xl font-bold mt-4 mb-2">Technical Stack</h3>
      <p>C++17, UDP/IP Networking, Memory Management, Algorithmic Optimization, CMake, Bash</p>
    `,
    },
    {
        id: "proj2",
        title: "Visual Speech Recognition Using Deep Learning",
        category: "Deep Learning",
        description: "LipNet end-to-end visual speech recognition using STCNN + Bi-RNN + CTC architecture.",
        repoUrl: "https://github.com/yugbargaway",
        liveUrl: "https://github.com/yugbargaway",
        tags: ["Python", "TensorFlow", "STCNN", "Bi-RNN", "CTC"],
        details: `
      <p>Implemented the LipNet end-to-end model for sentence-level lip reading through visual signal recognition.</p>
      <h3 class="text-xl font-bold mt-4 mb-2">Architecture & Results</h3>
      <ul class="list-disc pl-5 space-y-2">
        <li>Implemented the LipNet end-to-end visual speech recognition model <strong>(STCNN + Bi-RNN + CTC)</strong> for sentence-level lip reading from video data</li>
        <li>Achieved <strong>88% sentence accuracy</strong> on 1,000 video samples (2 speakers), validating sequence prediction under limited data settings robustly</li>
        <li>Built a GPU-aware PyTorch training and inference pipeline with efficient video preprocessing and stable convergence over long sequences</li>
      </ul>
      <h3 class="text-xl font-bold mt-4 mb-2">Technologies</h3>
      <p>Python, TensorFlow/PyTorch, Computer Vision, Sequence Modeling</p>
    `,
    },
];

export function ProjectsGrid() {
    const [selectedProj, setSelectedProj] = useState<Project | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedProj(project)}
                        className="cursor-pointer group h-full"
                    >
                        <Card className="h-full flex flex-col hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 border-primary/20 hover:border-primary/50 bg-card/40 backdrop-blur-md">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded mb-2 block">{project.category}</span>
                                    <Sparkles className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <CardTitle className="group-hover:text-primary transition-colors">{project.title}</CardTitle>
                                <CardDescription>{project.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded-sm text-secondary-foreground">{tag}</span>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="pt-2 gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                                {project.repoUrl && (
                                    <Link href={project.repoUrl} target="_blank">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Github className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                )}
                                {project.liveUrl && (
                                    <Link href={project.liveUrl} target="_blank">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                )}
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <DetailsSidebar
                isOpen={!!selectedProj}
                onClose={() => setSelectedProj(null)}
                title={selectedProj?.title || ""}
            >
                {selectedProj && (
                    <div className="space-y-4">
                        <div className="flex gap-2 mb-4">
                            {selectedProj.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {(selectedProj.repoUrl || selectedProj.liveUrl) && (
                            <div className="flex gap-4 mb-6">
                                {selectedProj.repoUrl && (
                                    <Link href={selectedProj.repoUrl} target="_blank">
                                        <Button className="gap-2">
                                            <Github className="w-4 h-4" /> View Code
                                        </Button>
                                    </Link>
                                )}
                                {selectedProj.liveUrl && (
                                    <Link href={selectedProj.liveUrl} target="_blank">
                                        <Button variant="outline" className="gap-2">
                                            <ExternalLink className="w-4 h-4" /> Live Demo
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        )}

                        <div
                            className="prose dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: selectedProj.details }}
                        />
                    </div>
                )}
            </DetailsSidebar>
        </>
    );
}
