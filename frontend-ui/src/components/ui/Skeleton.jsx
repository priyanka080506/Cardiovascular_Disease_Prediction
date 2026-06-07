import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "../../utils/motionVariants";

function Bone({ className }) {
  return <div className={`skeleton ${className}`} />;
}

export function Skeleton({ className = "h-4 w-full" }) {
  return <Bone className={className} />;
}

export function FormSkeleton() {
  return (
    <motion.div
      className="mx-auto max-w-2xl space-y-5"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp} className="space-y-3">
        <Bone className="h-3 w-32" />
        <Bone className="h-8 w-64" />
        <Bone className="h-4 w-80 max-w-full" />
      </motion.div>
      <motion.div variants={fadeUp} className="panel-muted h-20" />
      <motion.div variants={fadeUp} className="panel space-y-4">
        <Bone className="h-5 w-40" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Bone className="h-16" />
          <Bone className="h-16" />
        </div>
        <Bone className="h-11 w-36 ml-auto" />
      </motion.div>
    </motion.div>
  );
}

export function DashboardSkeleton() {
  return (
    <motion.div
      className="space-y-10"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp} className="space-y-3">
        <Bone className="h-3 w-32" />
        <Bone className="h-8 w-72 max-w-full" />
        <Bone className="h-4 w-96 max-w-full" />
      </motion.div>
      <motion.div variants={fadeUp} className="card-glass h-56" />
      <motion.div variants={fadeUp} className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <Bone className="panel h-80" />
        <Bone className="panel h-80" />
      </motion.div>
      <motion.div variants={fadeUp} className="grid gap-4 md:grid-cols-3">
        <Bone className="card h-64" />
        <Bone className="card h-64" />
        <Bone className="card h-64" />
      </motion.div>
      <motion.div variants={fadeUp} className="panel h-72" />
    </motion.div>
  );
}
