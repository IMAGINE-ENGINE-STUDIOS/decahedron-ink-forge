import React from 'react';
import { motion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** origami fold-down instead of a simple rise */
  fold?: boolean;
}

/** Scroll-triggered entrance used across internal pages. */
const Reveal: React.FC<RevealProps> = ({ children, delay = 0, className, fold }) => (
  <motion.div
    className={className}
    initial={fold ? { opacity: 0, rotateX: -55, y: 12 } : { opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    style={fold ? { transformPerspective: 1200, transformOrigin: 'top center' } : undefined}
  >
    {children}
  </motion.div>
);

export default Reveal;
