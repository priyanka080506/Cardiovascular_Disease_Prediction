import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export default function AnimatedCounter({
  value,
  decimals = 0,
  suffix = "",
  prefix = "",
  className = "",
  style = {},
}) {
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString()
  );
  const [text, setText] = useState("0");

  useEffect(() => {
    spring.set(value);
    const unsub = display.on("change", (v) => setText(v));
    return unsub;
  }, [value, spring, display]);

  return (
    <motion.span className={className} style={style}>
      {prefix}
      {text}
      {suffix}
    </motion.span>
  );
}
