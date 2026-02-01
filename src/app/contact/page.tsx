"use client";

import { useState, useRef } from "react";
import { SectionHeader } from "@/components/section-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FlooNetworkPortal } from "@/components/effects/patronus-deer";


export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [showFloo, setShowFloo] = useState(false);
    const formCardRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus("sending");

        try {
            // Only send if Web3Forms key is configured
            const hasKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY &&
                process.env.NEXT_PUBLIC_WEB3FORMS_KEY !== "YOUR_KEY_HERE";

            if (hasKey) {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "",
                        name,
                        email,
                        message,
                        subject: `New message from ${name} via Portfolio`,
                    }),
                });

                const result = await response.json();

                if (!result.success) {
                    setSubmitStatus("error");
                    setIsSubmitting(false);
                    return;
                }
            } else {
                // Simulate sending for testing (no actual email sent)
                await new Promise(resolve => setTimeout(resolve, 1500));
                console.log("Demo mode: Form would send", { name, email, message });
            }

            setSubmitStatus("success");
            setShowFloo(true);
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-16">
            <SectionHeader
                title="Owl Post"
                subtitle="Send a message via the magical network"
            />



            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h3 className="text-2xl font-serif font-bold mb-6">Connect with me</h3>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Whether you have a project in mind, a question about my spells, or just want to say hi, I'm always open to new connections.
                    </p>

                    <div className="space-y-4">
                        <Link href="mailto:bargawayyug@gmail.com" className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors group">
                            <div className="p-3 bg-secondary rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-medium">
                                bargawayyug <span className="opacity-60">[at]</span> gmail <span className="opacity-60">[dot]</span> com
                            </span>
                        </Link>

                        <Link href="https://linkedin.com/in/yugbargaway" target="_blank" className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors group">
                            <div className="p-3 bg-secondary rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-medium">LinkedIn</span>
                        </Link>

                        <Link href="https://github.com/yugbargaway2006" target="_blank" className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors group">
                            <div className="p-3 bg-secondary rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Github className="w-5 h-5" />
                            </div>
                            <span className="text-lg font-medium">GitHub</span>
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <Card ref={formCardRef} className="p-6 backdrop-blur-md bg-card/60">
                        <AnimatePresence mode="wait">
                            {submitStatus === "success" ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="text-center py-12"
                                >
                                    <div className="text-6xl mb-4">📮✨</div>
                                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                    <p className="text-muted-foreground">
                                        Your message is on its way. I'll respond soon!
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium">
                                            Name
                                        </label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your Name"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium">
                                            Email
                                        </label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium">
                                            Message
                                        </label>
                                        <Textarea
                                            id="message"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="How can I help you?"
                                            required
                                            disabled={isSubmitting}
                                            className="min-h-[120px]"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full text-lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Sending Post..." : "Send Post 📪"}
                                    </Button>

                                    {submitStatus === "error" && (
                                        <p className="text-sm text-destructive text-center">
                                            Oops! The owl got lost. Please try again.
                                        </p>
                                    )}
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </Card>
                </motion.div>
            </div>

            {/* Floo Network Portal Animation */}
            <AnimatePresence>
                {showFloo && formCardRef.current && (
                    <FlooNetworkPortal
                        formRect={formCardRef.current.getBoundingClientRect()}
                        onComplete={() => {
                            setShowFloo(false);
                            setTimeout(() => {
                                setName("");
                                setEmail("");
                                setMessage("");
                                setSubmitStatus("idle");
                            }, 500);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
