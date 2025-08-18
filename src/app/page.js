'use client'

import { useState, useEffect } from 'react'
import ChatInterface from '@/components/ChatInterface'
import DiagramModal from '@/components/DiagramModal'
import Header from '@/components/Header'
import ApiKeyWarning from '@/components/ApiKeyWarning'
import { motion } from 'framer-motion'
import { Sparkles, Zap, Shield, Globe } from 'lucide-react'

export default function Home() {
  const [diagramData, setDiagramData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showApiWarning, setShowApiWarning] = useState(false)
  const [showDiagramModal, setShowDiagramModal] = useState(false)

  useEffect(() => {
    // Check if API key is configured
    const checkApiKey = async () => {
      try {
        const response = await fetch('/api/health')
        const data = await response.json()
        setShowApiWarning(!data.hasApiKey)
      } catch (error) {
        console.log('Could not check API key status')
      }
    }
    checkApiKey()
  }, [])

  const handleDiagramGenerated = (data) => {
    setDiagramData(data)
    setShowDiagramModal(true)
  }

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered",
      description: "Advanced AI understands natural language and generates professional diagrams"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Generate complex UML diagrams in seconds, not hours"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Production Ready",
      description: "Export high-quality diagrams ready for documentation and presentations"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Universal Format",
      description: "Uses PlantUML standard - compatible with all major tools and platforms"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      
      <main className="container mx-auto px-4 py-12 lg:py-20">
        {showApiWarning && <ApiKeyWarning />}
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by AI
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Create UML Diagrams
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              with Natural Language
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Transform your ideas into professional UML diagrams instantly. 
            Just describe your system in plain English, and watch AI create 
            perfect diagrams for you.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:shadow-xl hover:bg-white/80 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <ChatInterface 
            onDiagramGenerated={handleDiagramGenerated}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            diagramData={diagramData}
          />
        </motion.div>
      </main>

      {/* Diagram Modal */}
      <DiagramModal
        isOpen={showDiagramModal}
        onClose={() => setShowDiagramModal(false)}
        diagramData={diagramData}
      />
    </div>
  )
}
