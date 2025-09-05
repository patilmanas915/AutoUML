'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Eye, RefreshCw, Edit3, Cpu, Code, Zap, Database, GitBranch, Workflow, Network } from 'lucide-react'

const DESIGN_TYPES = [
  { 
    id: 'software', 
    name: 'Software Design',
    description: 'Design software systems, databases, and applications',
    gradient: 'from-blue-600 via-indigo-600 to-purple-600',
    icon: Code,
    accent: 'blue'
  },
  { 
    id: 'hardware', 
    name: 'Hardware Project Design',
    description: 'Design IoT projects, embedded systems, and hardware flows',
    gradient: 'from-purple-600 via-pink-600 to-rose-600',
    icon: Cpu,
    accent: 'purple'
  }
]

const SOFTWARE_DIAGRAM_TYPES = [
  { 
    id: 'software_sequence', 
    name: 'Sequence Diagram', 
    description: 'Software interactions and API flows',
    icon: GitBranch,
    color: 'blue'
  },
  { 
    id: 'software_er', 
    name: 'ER Diagram', 
    description: 'Database design and relationships',
    icon: Database,
    color: 'green'
  },
  { 
    id: 'software_activity', 
    name: 'Activity Diagram', 
    description: 'Software workflows and processes',
    icon: Workflow,
    color: 'orange'
  },
  { 
    id: 'software_class', 
    name: 'Class Diagram', 
    description: 'Object-oriented design structure',
    icon: Network,
    color: 'purple'
  },
  { 
    id: 'software_flowchart', 
    name: 'Flow Chart', 
    description: 'Algorithm and logic flow',
    icon: Zap,
    color: 'pink'
  }
]

const HARDWARE_DIAGRAM_TYPES = [
  { 
    id: 'hardware_sequence', 
    name: 'Hardware System Flow', 
    description: 'Complete hardware project flow including sensors, microcontrollers, database, and backend',
    icon: Cpu,
    color: 'indigo'
  }
]

export default function ChatInterface({ onDiagramGenerated, isGenerating, setIsGenerating, diagramData }) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [step, setStep] = useState('design-type-selection')
  const [selectedDesignType, setSelectedDesignType] = useState(null)
  const [selectedDiagramType, setSelectedDiagramType] = useState(null)
  const [lastDescription, setLastDescription] = useState('')

  const handleDesignTypeSelect = (designType) => {
    setSelectedDesignType(designType.id)
    setStep('diagram-type-selection')
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: `Selected: ${designType.name}`,
      timestamp: new Date()
    }
    
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: `Perfect! You've chosen ${designType.name}. Now please select the specific type of diagram you'd like to create:`,
      timestamp: new Date()
    }
    
    setMessages([userMessage, botMessage])
  }

  const handleDiagramTypeSelect = (diagramType) => {
    setSelectedDiagramType(diagramType.id)
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: `Selected: ${diagramType.name}`,
      timestamp: new Date()
    }
    
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: selectedDesignType === 'hardware' ? 
        'Please describe your hardware project. Include details about:\n• **Sensors & Components**: What sensors, actuators, or devices you need\n• **Microcontroller**: Arduino, Raspberry Pi, ESP32, etc.\n• **Connectivity**: WiFi, Bluetooth, LoRa, etc.\n• **Database & Backend**: Data storage and cloud services\n• **Functionality**: What your project should do\n• **User Interface**: How users will interact with it' :
        'Please describe your software system, including the main features, components, and how they should interact.',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage, botMessage])
    setStep('description')
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setLastDescription(inputMessage)
    setInputMessage('')
    
    const loadingMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: 'Creating your diagram...',
      timestamp: new Date(),
      isLoading: true
    }
    
    setMessages(prev => [...prev, loadingMessage])
    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: inputMessage,
          diagramType: selectedDiagramType,
        }),
      })

      const data = await response.json()

      if (data.success) {
        onDiagramGenerated(data)
        
        const successMessage = {
          id: Date.now() + 2,
          type: 'bot',
          content: `✅ Your ${selectedDiagramType.replace('_', ' ')} diagram has been created successfully! Click "Show Diagram" to view it.`,
          timestamp: new Date(),
          showDiagramButton: true,
          showChangeOptions: true
        }
        
        setMessages(prev => prev.filter(msg => !msg.isLoading).concat([successMessage]))
        setStep('completed')
      } else {
        throw new Error(data.error || 'Unknown error occurred')
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 2,
        type: 'bot',
        content: `Sorry, there was an error generating your diagram: ${error.message}. Please try again.`,
        timestamp: new Date()
      }
      
      setMessages(prev => prev.filter(msg => !msg.isLoading).concat([errorMessage]))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShowDiagram = () => {
    onDiagramGenerated(diagramData)
  }

  const handleChangeRequest = () => {
    setStep('design-type-selection')
    setSelectedDesignType(null)
    setSelectedDiagramType(null)
    setMessages([])
  }

  const handleRegenerateRequest = () => {
    setStep('description')
    const botMessage = {
      id: Date.now(),
      type: 'bot',
      content: 'Please provide a new description for your diagram:',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, botMessage])
  }

  const handleUsePreviousDescription = () => {
    setInputMessage(lastDescription)
  }

  return (
    <motion.div 
      className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 h-[750px] flex flex-col overflow-hidden relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Gradient Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 rounded-3xl"></div>
      
      {/* Chat Header */}
      <div className="relative z-10 p-6 border-b border-gray-200/60 bg-white/60 backdrop-blur-xl rounded-t-3xl">
        <div className="flex items-center space-x-4">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="p-4 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl shadow-lg">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <motion.div 
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-sm"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            ></motion.div>
          </motion.div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">AI Diagram Assistant</h3>
            <motion.p 
              className="text-sm text-gray-600 font-medium mt-1"
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {step === 'design-type-selection' ? '🎯 Choose your design approach' : 
               step === 'diagram-type-selection' ? '📊 Select diagram type' :
               step === 'description' ? '💭 Describe your system in detail' : 
               step === 'generating' ? '🔮 Creating your diagram...' : 
               step === 'completed' ? '✅ Ready! Create another diagram?' : '🎯 Choose your design approach'}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-4 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <motion.div 
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600' 
                      : 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800'
                  }`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {message.type === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </motion.div>
                
                <motion.div 
                  className={`rounded-3xl px-6 py-4 shadow-lg backdrop-blur-xl border relative ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white border-white/20'
                      : 'bg-white/90 border-gray-200/60 text-gray-800'
                  }`}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {message.isLoading ? (
                    <div className="flex items-center space-x-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-5 h-5 text-blue-600" />
                      </motion.div>
                      <span className="font-medium">Creating your diagram...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="whitespace-pre-line leading-relaxed font-medium">{message.content}</p>
                      
                      {message.showDiagramButton && diagramData && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 20 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleShowDiagram}
                          className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                        >
                          <Eye className="w-5 h-5" />
                          <span>View Diagram</span>
                        </motion.button>
                      )}
                      
                      {message.showChangeOptions && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="flex flex-wrap gap-3"
                        >
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleChangeRequest}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Change Type</span>
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleRegenerateRequest}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>Regenerate</span>
                          </motion.button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Design Type Selection */}
      {step === 'design-type-selection' && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 p-6 space-y-4"
        >
          <div className="text-center mb-8">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Choose Your Design Approach</h4>
            <p className="text-sm text-gray-600 font-medium">Select the type of project you're working on</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DESIGN_TYPES.map((type, index) => {
              const IconComponent = type.icon
              return (
                <motion.button
                  key={type.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.1, 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25 
                  }}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -5,
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDesignTypeSelect(type)}
                  className="group relative p-6 text-left bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200/60 hover:border-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10 flex items-start space-x-4">
                    <motion.div 
                      className={`w-14 h-14 bg-gradient-to-br ${type.gradient} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <IconComponent className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 mb-2 text-lg tracking-tight">{type.name}</div>
                      <div className="text-sm text-gray-600 leading-relaxed font-medium">{type.description}</div>
                    </div>
                  </div>
                  
                  {/* Hover Arrow */}
                  <motion.div
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div className="w-6 h-6 text-gray-400">→</div>
                  </motion.div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Diagram Type Selection */}
      {step === 'diagram-type-selection' && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 p-6 space-y-4"
        >
          <div className="text-center mb-6">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Select Diagram Type</h4>
            <p className="text-sm text-gray-600 font-medium">Choose the specific diagram for your {selectedDesignType} project</p>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {(selectedDesignType === 'software' ? SOFTWARE_DIAGRAM_TYPES : HARDWARE_DIAGRAM_TYPES).map((type, index) => {
              const IconComponent = type.icon
              const colorClasses = {
                blue: 'from-blue-500 via-blue-600 to-indigo-600',
                green: 'from-green-500 via-emerald-600 to-teal-600',
                orange: 'from-orange-500 via-amber-600 to-yellow-600',
                purple: 'from-purple-500 via-violet-600 to-indigo-600',
                pink: 'from-pink-500 via-rose-600 to-red-600',
                indigo: 'from-indigo-500 via-purple-600 to-violet-600'
              }
              
              return (
                <motion.button
                  key={type.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.05, 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25 
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -3,
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDiagramTypeSelect(type)}
                  className="group relative p-5 text-left bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/60 hover:border-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Subtle Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[type.color]} opacity-0 group-hover:opacity-3 transition-opacity duration-300`}></div>
                  
                  <div className="relative z-10 flex items-center space-x-4">
                    <motion.div 
                      className={`w-12 h-12 bg-gradient-to-br ${colorClasses[type.color]} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 mb-1 text-base tracking-tight">{type.name}</div>
                      <div className="text-sm text-gray-600 leading-relaxed font-medium">{type.description}</div>
                    </div>
                    
                    {/* Subtle Arrow */}
                    <motion.div
                      className="opacity-0 group-hover:opacity-60 transition-opacity duration-200"
                      initial={{ x: -5 }}
                      whileHover={{ x: 0 }}
                    >
                      <div className="text-gray-400 text-lg">→</div>
                    </motion.div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      {step === 'description' && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 p-6 border-t border-gray-200/60 bg-white/60 backdrop-blur-xl"
        >
          {lastDescription && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUsePreviousDescription}
              className="mb-4 px-4 py-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-blue-700 rounded-2xl text-sm hover:shadow-md transition-all duration-300 border border-blue-200/60 font-medium backdrop-blur-sm"
            >
              💡 Use previous description: "{lastDescription.slice(0, 40)}..."
            </motion.button>
          )}
          
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <motion.textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder={selectedDesignType === 'hardware' 
                  ? "Describe your hardware project in detail - sensors, microcontroller, connectivity, database, functionality..." 
                  : "Describe your software system - features, components, architecture, interactions..."
                }
                className="w-full p-5 border border-gray-200/60 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 resize-none bg-white/90 backdrop-blur-xl text-gray-800 placeholder-gray-500 font-medium shadow-sm transition-all duration-300"
                rows="4"
                disabled={isGenerating}
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
              
              {/* Character Count */}
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-medium">
                {inputMessage.length}/500
              </div>
            </div>
            
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
                transition: { type: "spring", stiffness: 400, damping: 17 }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isGenerating}
              className="px-8 py-5 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white rounded-3xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center font-semibold min-w-[120px]"
            >
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
              ) : (
                <Send className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}