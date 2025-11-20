import { motion } from 'framer-motion'

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <motion.div
        className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

export default LoadingSpinner