import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import SectionHeader from "./ui/SectionHeader";
import { ChevronRightIcon, DumbbellIcon, LeafIcon, ActivityIcon } from "./ui/Icons";

const PRIORITY_MAP = {
  DASH: "high",
  Mediterranean: "high",
  "DASH + Mediterranean": "high",
  "General Lifestyle": "medium",
};

function buildLifestyleItems(recommendations) {
  const items = [];
  const { primary_drivers, summary } = recommendations;

  if (primary_drivers?.length) {
    primary_drivers.forEach((driver) => {
      items.push(`Target ${driver.toLowerCase()} with evidence-based interventions`);
    });
  }

  const lifestyleTips = [
    "Maintain 7–8 hours of consistent sleep",
    "Practice stress management daily",
    "Reduce processed foods and added sugars",
    "Stay hydrated throughout the day",
  ];

  if (summary?.toLowerCase().includes("smok")) {
    items.unshift("Prioritize smoking cessation — highest single impact");
  }

  lifestyleTips.slice(0, Math.max(0, 4 - items.length)).forEach((tip) => items.push(tip));
  return items.slice(0, 5);
}

const CARD_META = {
  nutrition: { icon: LeafIcon, accent: "border-l-emerald-500" },
  exercise: { icon: DumbbellIcon, accent: "border-l-brand-600" },
  lifestyle: { icon: ActivityIcon, accent: "border-l-amber-500" },
};

const PREVIEW_COUNT = 2;

export default function HealthRoadmap({ recommendations }) {
  if (!recommendations) return null;

  const { protocol, title, summary, nutrition, fitness, primary_drivers } = recommendations;
  const priority = PRIORITY_MAP[protocol] || "medium";
  const lifestyle = buildLifestyleItems(recommendations);
  const [expanded, setExpanded] = useState(null);

  const cards = [
    { id: "nutrition", title: "Nutrition Plan", tag: protocol, items: nutrition, priority },
    { id: "exercise", title: "Exercise Plan", tag: "Cardio & strength", items: fitness, priority: "high" },
    {
      id: "lifestyle",
      title: "Lifestyle Modifications",
      tag: "Behavioral",
      items: lifestyle,
      priority: primary_drivers?.length > 1 ? "high" : "medium",
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SectionHeader
        eyebrow="Personalized protocol"
        title="Your health roadmap"
        description={summary}
        action={<span className="badge-brand">{title}</span>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card, i) => (
          <RoadmapCard
            key={card.id}
            card={card}
            index={i}
            isExpanded={expanded === card.id}
            onToggle={() => setExpanded(expanded === card.id ? null : card.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}

function RoadmapCard({ card, index, isExpanded, onToggle }) {
  const meta = CARD_META[card.id];
  const Icon = meta.icon;
  const priorityClass =
    card.priority === "high"
      ? "text-red-600"
      : card.priority === "medium"
        ? "text-amber-600"
        : "text-emerald-600";

  const visibleItems = isExpanded ? card.items : card.items.slice(0, PREVIEW_COUNT);
  const hasMore = card.items.length > PREVIEW_COUNT;

  return (
    <motion.article
      className={`card-hover flex cursor-pointer flex-col border-l-4 ${meta.accent}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: "0 8px 28px -4px rgba(15,23,42,0.1)" }}
      onClick={onToggle}
      layout
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <motion.div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(37,99,235,0.08)" }}
          >
            <Icon className="h-4 w-4" />
          </motion.div>
          <div>
            <h3 className="text-subheading">{card.title}</h3>
            <p className="text-caption">{card.tag}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-caption font-semibold ${priorityClass}`}>
            {card.priority === "high" ? "High" : card.priority === "medium" ? "Med" : "Low"}
          </span>
          <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRightIcon className="h-4 w-4 text-slate-400" />
          </motion.div>
        </div>
      </div>

      <ul className="mt-5 flex-1 space-y-2.5">
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item, i) => (
            <motion.li
              key={`${card.id}-${i}-${item.slice(0, 20)}`}
              className="flex gap-2.5 text-body"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              layout
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
              {item}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {hasMore && (
        <motion.p
          className="mt-3 text-caption font-medium text-brand-600"
          animate={{ opacity: isExpanded ? 0.6 : 1 }}
        >
          {isExpanded ? "Click to collapse" : `+${card.items.length - PREVIEW_COUNT} more actions`}
        </motion.p>
      )}
    </motion.article>
  );
}
