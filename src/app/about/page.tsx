"use client";

import { SectionHeader } from "@/components/section-header";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "lucide-react"; // Using this as placeholder for actual skill icons or badges if needed

const skills = [
    { category: "Languages", items: ["C++", "OCaml", "Python", "C", "ShellScript", "Awk", "SQL", "HTML", "CSS", "JavaScript", "CMake", "ROS", "LaTeX"] },
    { category: "Frameworks & Libraries", items: ["PyTorch", "TensorFlow", "Keras", "Scikit-Learn", "LangChain", "Docker", "Jupyter", "Linux", "Git", "GitHub", "Gazebo", "RViz"] },
];

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <SectionHeader
                title="About Me"
                subtitle="Engineering student, problem solver, and tech enthusiast"
            />

            <div className="grid md:grid-cols-[1.5fr_1fr_1.5fr] gap-8 items-start">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6 text-lg text-muted-foreground leading-relaxed"
                >
                    <p>
                        Hello! I'm <strong className="text-foreground">Yug Bargaway</strong>, a B.Tech student in Computer Science & Engineering at <strong className="text-foreground">IIT Kharagpur</strong>.
                    </p>
                    <p>
                        I specialize in data analytics, machine learning, and building high-performance software systems. My passion lies in developing intelligent solutions that bridge theory and real-world applications—from autonomous systems to AI-driven analytics.
                    </p>
                    <p>
                        I'm an avid competitive programmer and problem solver, holding a Codeforces Expert (1612) rating. I thrive on tackling complex challenges through innovative algorithms and elegant system design.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative aspect-square max-w-[220px] mx-auto rounded-2xl overflow-hidden border-2 border-primary/20 bg-muted/50"
                >
                    <img src="/yug-profile.jpg" alt="Yug Bargaway" className="object-cover w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid gap-6"
                >
                    <h3 className="text-2xl font-serif font-bold text-center md:text-left mb-4">My Tech Stack</h3>
                    {skills.map((skillGroup, idx) => (
                        <Card key={idx} className="p-4 bg-secondary/20 hover:bg-secondary/40 transition-colors border-primary/20">
                            <h4 className="font-bold text-primary mb-2">{skillGroup.category}</h4>
                            <div className="flex flex-wrap gap-2">
                                {skillGroup.items.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-background/50 rounded-full text-sm border border-border/50 shadow-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </Card>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
