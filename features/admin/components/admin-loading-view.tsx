"use client"

import { motion } from "framer-motion"
import { RefreshCw } from "lucide-react"

export function AdminLoadingView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <RefreshCw className="w-8 h-8 text-armath-blue" />
      </motion.div>
    </div>
  )
}
