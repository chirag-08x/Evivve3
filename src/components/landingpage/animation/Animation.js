import React, { useEffect } from 'react';

// third party
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';

function AnimateFadeIn({ children, duration, delay, fadeOut = false, translateV = {}, translateH = {} }) {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start(fadeOut ? 'hidden' : "visible");
    }
  }, [controls, inView, fadeOut]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="visible"
      transition={{ duration: duration, delay: delay, ease: "easeOut" }}
      variants={{
        visible: { opacity: 1, translateY: 60, ...translateV },
        hidden: { opacity: 0, translateY: 20, ...translateH },
      }}
      onAnimationEnd={() => {
        
      }}
    >
      {children}
    </motion.div>
  );
}

export default AnimateFadeIn;
