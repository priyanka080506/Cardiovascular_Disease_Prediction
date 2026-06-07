import { motion } from "framer-motion";
import HealthRoadmap from "../components/HealthRoadmap";
import RiskSummary from "../components/RiskSummary";
import ShapChart from "../components/ShapChart";
import SimulationSandbox from "../components/SimulationSandbox";
import PageHeader from "../components/ui/PageHeader";
import { fadeUp, staggerContainer } from "../utils/motionVariants";

export default function Dashboard({ result, input }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-10"
    >
      <motion.div variants={fadeUp}>
        <PageHeader
          eyebrow="Assessment complete"
          title="Your cardiovascular risk report"
          description="AI-generated risk score with explainable factor attribution and personalized prevention guidance."
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        <RiskSummary
          percent={result.risk_percent}
          label={result.risk_label}
          bmi={result.bmi}
          modelName={result.model_name}
        />
      </motion.div>

      <motion.div variants={fadeUp} className="section-divider">
        <ShapChart
          contributions={result.shap_contributions}
          topDrivers={result.top_risk_drivers}
        />
      </motion.div>

      <motion.div variants={fadeUp} className="section-divider">
        <HealthRoadmap recommendations={result.recommendations} />
      </motion.div>

      <motion.div variants={fadeUp} className="section-divider">
        <SimulationSandbox baselineInput={input} baselineResult={result} />
      </motion.div>
    </motion.div>
  );
}
