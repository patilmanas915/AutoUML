import { GoogleGenerativeAI } from '@google/generative-ai'
import { encode } from 'plantuml-encoder'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI("AIzaSyCy4LxrikF6vBE_8ekmzFpsZt_js3edtnU")

const DIAGRAM_PROMPTS = {
  // Software Design Diagrams
  software_sequence: `Create a PlantUML sequence diagram for software design based on the following description. Include:
- Software components and modules
- API calls and method invocations
- User interactions with software
- Database queries and responses
- Service-to-service communications
- Error handling flows
- Authentication and authorization flows

Description: `,

  software_er: `Create a PlantUML Entity Relationship (ER) diagram for software database design based on the following description. Include:
- Database entities with appropriate attributes
- Primary keys and foreign keys
- Relationships between entities (one-to-one, one-to-many, many-to-many)
- Cardinality notation
- Data types for attributes
- Indexes and constraints where relevant
- Normalization considerations

Description: `,

  software_activity: `Create a PlantUML activity diagram for software processes based on the following description. Include:
- Software workflow processes
- User actions and system responses
- Decision points in software logic
- Parallel processing and threading
- Exception handling paths
- Data validation steps
- Business logic flow

Description: `,

  software_class: `Create a PlantUML class diagram for software architecture based on the following description. Include:
- Software classes with attributes and methods
- Inheritance hierarchies
- Interface implementations
- Design patterns (Factory, Observer, etc.)
- Dependencies and associations
- Access modifiers (+, -, #)
- Package organization

Description: `,

  software_flowchart: `Create a PlantUML flowchart for software algorithms based on the following description. Use the following syntax format:

@startuml
start
if (condition?) then (yes)
  :action for yes;
else (no)
  :action for no;
endif
stop
@enduml

Include:
- Algorithm steps and logic flow
- Conditional branches for software decisions
- Loop structures and iterations
- Input validation processes
- Error handling paths
- Function calls and returns

Description: `,

  // Hardware Design Diagrams
  hardware_sequence: `Create a comprehensive PlantUML sequence diagram for hardware project design based on the following description. Include:

SENSORS & INPUT DEVICES:
- Specify sensors (temperature, humidity, motion, light, pressure, etc.)
- Input devices (buttons, switches, keypads, touchscreens)
- Sensor data acquisition and processing

MICROCONTROLLER/PROCESSOR:
- Main processing unit (Arduino, Raspberry Pi, ESP32, STM32, etc.)
- GPIO pin assignments
- Processing logic and decision making
- Interrupt handling

DATABASE & STORAGE:
- Local storage (SD card, EEPROM, Flash memory)
- Cloud database connections (Firebase, MySQL, MongoDB)
- Data logging and retrieval
- Backup and synchronization

BACKEND SERVICES:
- Web servers and APIs
- Cloud platforms (AWS, Google Cloud, Azure)
- Real-time data processing
- Remote monitoring and control

COMMUNICATION PROTOCOLS:
- WiFi, Bluetooth, LoRa, GSM, Ethernet connections
- MQTT, HTTP, WebSocket protocols
- Device-to-device communication
- Gateway and bridge connections

ACTUATORS & OUTPUT:
- Motors, servos, relays, pumps
- LED displays, LCD screens, speakers
- Control signals and PWM
- Feedback mechanisms

POWER MANAGEMENT:
- Power sources (battery, solar, AC adapter)
- Power regulation and distribution
- Sleep modes and power optimization
- Charging circuits

SYSTEM FLOW:
- Data flow from sensors to cloud
- Command flow from backend to actuators
- Error handling and system recovery
- Real-time monitoring and alerts

Description: `
}

export async function POST(request) {
  try {
    console.log('🔍 API Request received')
    
    const { description, diagramType } = await request.json()
    console.log('📝 Request data:', { description: description?.substring(0, 100) + '...', diagramType })
    
    if (!description || !diagramType) {
      console.log('❌ Missing required fields')
      return NextResponse.json(
        { success: false, error: 'Description and diagram type are required' },
        { status: 400 }
      )
    }

    if (!process.env.GEMINI_API_KEY) {
      console.log('❌ No Gemini API key found')
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    console.log('🤖 Initializing Gemini AI...')
    // Generate PlantUML code using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })
    
    const prompt = `${DIAGRAM_PROMPTS[diagramType] || DIAGRAM_PROMPTS.class}${description}

Please return ONLY the PlantUML code without any additional explanation or markdown formatting. The code should start with @startuml and end with @enduml.`

    console.log('🔮 Generating content with Gemini...')
    const result = await model.generateContent(prompt)
    const response = await result.response
    let plantUmlCode = response.text().trim()

    console.log('✅ Content generated, processing...')
    
    // Clean up the response - remove any markdown formatting
    plantUmlCode = plantUmlCode.replace(/```plantuml\n?/g, '')
    plantUmlCode = plantUmlCode.replace(/```\n?/g, '')
    plantUmlCode = plantUmlCode.trim()

    // Ensure the code starts with @startuml and ends with @enduml
    if (!plantUmlCode.startsWith('@startuml')) {
      plantUmlCode = '@startuml\n' + plantUmlCode
    }
    if (!plantUmlCode.endsWith('@enduml')) {
      plantUmlCode = plantUmlCode + '\n@enduml'
    }

    console.log('🔗 Encoding PlantUML for image generation...')
    // Encode the PlantUML code for URL
    const encoded = encode(plantUmlCode)
    
    // Generate image URL using PlantUML server
    const imageUrl = `https://www.plantuml.com/plantuml/png/${encoded}`
    
    console.log('🎉 Success! Returning response')
    return NextResponse.json({
      success: true,
      plantUmlCode,
      imageUrl,
      diagramType
    })

  } catch (error) {
    console.error('💥 Error generating diagram:', error)
    console.error('Stack trace:', error.stack)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate diagram',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
