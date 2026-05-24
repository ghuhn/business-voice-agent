import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "../store/appStore";
import { ServicesSlide } from "./slides/ServicesSlide";
import { ServiceDetailSlide } from "./slides/ServiceDetailSlide";
import { ProcessSlide } from "./slides/ProcessSlide";
import { TeamSlide } from "./slides/TeamSlide";
import { PricingSlide } from "./slides/PricingSlide";
import { CaseStudySlide } from "./slides/CaseStudySlide";

export function SlideRenderer() {
  const { slide, service, client } = useAppStore((s) => s.currentSlide);

  return (
    <AnimatePresence mode="wait">
      {slide === "services" && (
        <motion.div key="services" {...slideAnim}><ServicesSlide /></motion.div>
      )}
      {slide === "service_detail" && service && (
        <motion.div key={`service-${service}`} {...slideAnim}><ServiceDetailSlide service={service} /></motion.div>
      )}
      {slide === "process" && (
        <motion.div key="process" {...slideAnim}><ProcessSlide /></motion.div>
      )}
      {slide === "team" && (
        <motion.div key="team" {...slideAnim}><TeamSlide /></motion.div>
      )}
      {slide === "pricing" && (
        <motion.div key="pricing" {...slideAnim}><PricingSlide /></motion.div>
      )}
      {slide === "case_study" && client && (
        <motion.div key={`case-${client}`} {...slideAnim}><CaseStudySlide client={client} /></motion.div>
      )}
    </AnimatePresence>
  );
}

const slideAnim = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.97 },
  transition: { duration: 0.35, ease: "easeOut" },
};
