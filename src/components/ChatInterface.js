'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Eye, Download, Check } from 'lucide-react'

const UML_TYPES = [
  { id: 'class', name: 'Class Diagram', description: 'Show classes, attributes, and relationships' },
  { id: 'sequence', name: 'Sequence Diagram', description: 'Show interactions over time' },
  { id: 'usecase', name: 'Use Case Diagram', description: 'Show user interactions with system' },
  { id: 'activity', name: 'Activity Diagram', description: 'Show workflow and processes' },
  { id: 'state', name: 'State Diagram', description: 'Show state transitions' },
  { id: 'component', name: 'Component Diagram', description: 'Show system components and dependencies' }
]

export default function ChatInterface({ onDiagramGenerated, isGenerating, setIsGenerating, diagramData }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m here to help you create UML diagrams. What type of diagram would you like to create?',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [selectedDiagramType, setSelectedDiagramType] = useState(null)
  const [step, setStep] = useState('type-selection') // 'type-selection', 'description', 'generating'

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')

    if (step === 'description' && selectedDiagramType) {
      await generateDiagram(inputMessage, selectedDiagramType)
    }
  }

  const handleDiagramTypeSelect = (diagramType) => {
    setSelectedDiagramType(diagramType)
    
    const botMessage = {
      id: Date.now(),
      type: 'bot',
      content: `Great! You've selected a ${diagramType.name}. Now, please describe your system or the components you want to include in your diagram. Be as detailed as possible.`,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, botMessage])
    setStep('description')
  }

  const generateDiagram = async (description, diagramType) => {
    setIsGenerating(true)
    
    const loadingMessage = {
      id: Date.now(),
      type: 'bot',
      content: 'Generating your UML diagram... This may take a few moments.',
      timestamp: new Date(),
      isLoading: true
    }
    
    setMessages(prev => [...prev, loadingMessage])

    try {
      const response = await fetch('/api/generate-diagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          diagramType: diagramType.id
        })
      })

      const data = await response.json()
      
      if (data.success) {
        onDiagramGenerated({
          plantUmlCode: data.plantUmlCode,
          imageUrl: data.imageUrl,
          diagramType: diagramType.name
        })
        
        const successMessage = {
          id: Date.now(),
          type: 'bot',
          content: '🎉 Perfect! Your UML diagram has been generated successfully!',
          timestamp: new Date(),
          showDiagramButton: true
        }
        
        setMessages(prev => prev.filter(msg => !msg.isLoading).concat([successMessage]))
      } else {
        throw new Error(data.error || 'Failed to generate diagram')
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now(),
        type: 'bot',
        content: `Sorry, there was an error generating your diagram: ${error.message}. Please try again.`,
        timestamp: new Date()
      }
      
      setMessages(prev => prev.filter(msg => !msg.isLoading).concat([errorMessage]))
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 h-[700px] flex flex-col overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-100/50 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-t-3xl">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">AI UML Assistant</h3>
            <p className="text-sm text-gray-600">
              {step === 'type-selection' ? '🎯 Select your diagram type' : 
               step === 'description' ? '💭 Describe your system' : '🔮 Generating your diagram...'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`p-2.5 rounded-full flex-shrink-0 ${message.type === 'user' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-gray-100 to-gray-200'}`}>
                  {message.type === 'user' ? 
                    <User className="w-4 h-4 text-white" /> : 
                    <Bot className="w-4 h-4 text-gray-600" />
                  }
                </div>
                <div className="flex flex-col space-y-2 max-w-full">
                  <div className={`p-4 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-800'
                  }`}>
                    {message.isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>{message.content}</span>
                      </div>
                    ) : (
                      <p className="leading-relaxed">{message.content}</p>
                    )}
                  </div>
                  
                  {/* Show Diagram Button */}
                  {message.showDiagramButton && diagramData && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        // Use the passed onDiagramGenerated callback to trigger the modal
                        onDiagramGenerated(diagramData)
                      }}
                      className="self-start flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Show Diagram</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Diagram Type Selection */}
        {step === 'type-selection' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6"
          >
            {UML_TYPES.map((type, index) => (
              <motion.button
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDiagramTypeSelect(type)}
                className="group p-4 text-left bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 mb-1">{type.name}</div>
                    <div className="text-sm text-gray-600 leading-relaxed">{type.description}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      {step === 'description' && (
        <div className="p-6 border-t border-gray-100/50 bg-white/50 backdrop-blur-sm">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Describe your system in detail... (e.g., hospital management with patients, doctors, appointments)"
                className="w-full p-4 pr-12 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-gray-500 text-gray-900 transition-all"
                disabled={isGenerating}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">Enter</kbd>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={isGenerating || !inputMessage.trim()}
              className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
