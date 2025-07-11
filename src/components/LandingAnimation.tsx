import { motion } from "framer-motion";
import { Shield, Lock, Zap } from "lucide-react";

export default function LandingAnimation() {
  return (
    <div className="relative w-full h-96 flex items-center justify-center overflow-hidden">
      {/* Background subtle grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />
      </div>

      {/* Central pulsing elements */}
      <div className="relative flex items-center justify-center">
        {/* Main central circle with pulsing effect */}
        <motion.div
          className="absolute w-40 h-40 rounded-full border-2 border-blue-400/30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute w-28 h-28 rounded-full border border-cyan-400/40"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Central icon container */}
        <motion.div
          className="relative z-10 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-blue-400/30"
          animate={{
            y: [-2, 2, -2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Static Shield (no rotation) */}
          <Shield className="w-8 h-8 text-blue-400/80" />
        </motion.div>

        {/* Orbiting security icons */}
        <motion.div
          className="absolute w-32 h-32"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <motion.div
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.2 }}
          >
            <Lock className="w-3 h-3 text-blue-400" />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute w-40 h-40"
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <motion.div
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.2 }}
          >
            <Zap className="w-3 h-3 text-cyan-400" />
          </motion.div>
        </motion.div>
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-500 rounded-full"
          animate={{
            y: [-20, -40, -20],
            x: [-10, 10, -10],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 12 + i * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
          style={{
            top: `${30 + i * 8}%`,
            left: `${20 + i * 10}%`,
          }}
        />
      ))}

      {/* Subtle connecting lines */}
      <motion.div
        className="absolute w-px h-16 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent"
        animate={{
          opacity: [0, 0.5, 0],
          scaleY: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{ top: "25%", left: "35%" }}
      />

      <motion.div
        className="absolute w-16 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
        animate={{
          opacity: [0, 0.5, 0],
          scaleX: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        style={{ top: "65%", left: "45%" }}
      />
    </div>
  );
}
