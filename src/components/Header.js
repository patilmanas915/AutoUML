'use client'

import { motion } from 'framer-motion'
import { FileText, Github, Star } from 'lucide-react'

export default function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <div className="p-2.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                ArchGenie
              </h1>
              <p className="text-xs text-gray-500">AI-Powered Diagrams</p>
            </div>
          </motion.div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {/* <a 
              href="#examples" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Examples
            </a>
            <a 
              href="#docs" 
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Docs
            </a>
            <motion.a
              href="#github"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </motion.a> */}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg"
            >
              <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                <div className="w-full h-0.5 bg-current"></div>
                <div className="w-full h-0.5 bg-current"></div>
                <div className="w-full h-0.5 bg-current"></div>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
