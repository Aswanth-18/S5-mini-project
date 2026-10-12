import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="loading-shell">
      <motion.div
        className="brand-loader"
        initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <span className="loader-mark">F</span>
        <div>
          <p>Fresh News</p>
          <span>Live newsroom</span>
        </div>
      </motion.div>

      <motion.div
        className="loading-bar"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
      />
    </div>
  );
}
