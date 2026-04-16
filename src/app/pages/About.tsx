import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

export function About() {
  const { messages } = useLanguage();
  const { about: a } = messages;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl"
    >
      <div className="space-y-6 leading-relaxed text-muted-foreground">
        <h1 className="text-sm font-normal uppercase tracking-[0.22em] text-muted-foreground">
          {a.title}
        </h1>

        <p>{a.lead}</p>
        <p>{a.p2}</p>
        <p>{a.p3}</p>
        <p>{a.p4}</p>

        <div className="mt-12 border-t border-border pt-8">
          <h2 className="mb-4 text-sm uppercase tracking-wider text-muted-foreground">
            {a.skillsHeading}
          </h2>
          <div className="flex flex-wrap gap-2">
            {a.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-muted px-4 py-2 text-sm text-foreground/90"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
