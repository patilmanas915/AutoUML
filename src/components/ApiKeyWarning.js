'use client'

import { AlertCircle, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ApiKeyWarning() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
    >
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Gemini API Key Required
          </h3>
          <p className="text-sm text-yellow-700 mt-1">
            To generate UML diagrams, you need to configure your Gemini API key. 
            Follow these steps:
          </p>
          <ol className="text-sm text-yellow-700 mt-2 list-decimal list-inside space-y-1">
            <li>Get your API key from Google AI Studio</li>
            <li>Add it to your .env.local file as GEMINI_API_KEY</li>
            <li>Restart the development server</li>
          </ol>
          <a
            href="https://makersuite.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-sm text-yellow-800 hover:text-yellow-900 mt-2 font-medium"
          >
            <span>Get API Key</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  )
}
