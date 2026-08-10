import React from 'react';
import { motion } from 'framer-motion';

// 🔥 1. MAC MINIMIZE ANIMATION (Ultra Smooth)
const macMinimizeVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    // Apple-like cubic-bezier for snappy entrance
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.85, 
    y: 40, 
    // Smooth acceleration into the drop
    transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] } 
  }
};

// 🔥 2. 3D BOOK PAGE FLIP ANIMATION (Ultra Smooth)
const bookFlipVariants = {
  initial: { 
    opacity: 0, 
    rotateY: 90, 
    scale: 0.95, // Starts slightly smaller for depth
    transformOrigin: "left center" 
  },
  animate: { 
    opacity: 1, 
    rotateY: 0, 
    scale: 1, // Lifts up as it flips open
    transformOrigin: "left center",
    // Smooth deceleration as the page settles
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } 
  },
  exit: { 
    opacity: 0, 
    rotateY: -90, 
    scale: 0.95, // Drops back down slightly as it turns away
    transformOrigin: "left center",
    // Accelerates smoothly out of view
    transition: { duration: 0.6, ease: [0.32, 0, 0.67, 0] } 
  }
};

const PageTransition = ({ children, type = "book" }) => {
  const isMac = type === "mac";
  const variants = isMac ? macMinimizeVariants : bookFlipVariants;

  return (
    // Added overflowX: hidden to prevent scrollbars appearing during the 3D rotation
    <div style={{ perspective: isMac ? 'none' : '2000px', width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ 
          width: '100%', 
          minHeight: '100vh', 
          backfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d' // Keeps the 3D perspective accurate
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PageTransition;