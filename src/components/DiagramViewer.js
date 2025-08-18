'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Eye, Code, Maximize2, Loader2 } from 'lucide-react'

export default function DiagramViewer({ diagramData, isGenerating }) {
  const [activeTab, setActiveTab] = useState('preview')
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!diagramData?.imageUrl) return
    
    setIsDownloading(true)
    try {
      const response = await fetch(diagramData.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `uml-diagram-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleFullscreen = () => {
    if (diagramData?.imageUrl) {
      window.open(diagramData.imageUrl, '_blank')
    }
  }

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-xl border border-gray-100 h-[600px] flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">Diagram Viewer</h3>
            <p className="text-sm text-gray-600">
              {diagramData ? `${diagramData.diagramType} - Ready` : 'Waiting for diagram...'}
            </p>
          </div>
          
          {diagramData && (
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFullscreen}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="Open in new tab"
              >
                <Maximize2 className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span className="text-sm">Download</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      {diagramData && (
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 p-3 text-sm font-medium transition-colors ${
              activeTab === 'preview'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 p-3 text-sm font-medium transition-colors ${
              activeTab === 'code'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Code className="w-4 h-4 inline mr-2" />
            PlantUML Code
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
                />
                <p className="text-gray-600">Generating your UML diagram...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
              </div>
            </motion.div>
          ) : diagramData ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full"
            >
              {activeTab === 'preview' ? (
                <div className="h-full p-4 overflow-auto">
                  <div className="h-full bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                    <img
                      src={diagramData.imageUrl}
                      alt="Generated UML Diagram"
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full p-4 overflow-auto">
                  <pre className="bg-gray-50 rounded-lg p-4 text-sm font-mono overflow-auto h-full">
                    <code>{diagramData.plantUmlCode}</code>
                  </pre>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center"
            >
              <div className="text-center text-gray-500">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium mb-2">No diagram yet</p>
                <p className="text-sm">Start a conversation to generate your first UML diagram</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
