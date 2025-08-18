import { GoogleGenerativeAI } from '@google/generative-ai'
import { encode } from 'plantuml-encoder'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const DIAGRAM_PROMPTS = {
  class: `Create a PlantUML class diagram based on the following description. Include:
- Classes with appropriate attributes and methods
- Proper relationships (inheritance, composition, association)
- Use proper PlantUML syntax
- Include access modifiers (+, -, #)
- Add meaningful comments where helpful

Description: `,
  
  sequence: `Create a PlantUML sequence diagram based on the following description. Include:
- Actors and participants
- Messages between participants
- Proper sequence of interactions
- Activation boxes where appropriate
- Notes for clarification

Description: `,
  
  usecase: `Create a PlantUML use case diagram based on the following description. Include:
- Actors (users/systems)
- Use cases with clear names
- Relationships between actors and use cases
- System boundaries
- Include/extend relationships where appropriate

Description: `,
  
  activity: `Create a PlantUML activity diagram based on the following description. Include:
- Start and end points
- Activities and decisions
- Proper flow control
- Swimlanes if multiple actors
- Parallel processing where applicable

Description: `,
  
  state: `Create a PlantUML state diagram based on the following description. Include:
- States and transitions
- Entry/exit actions
- Guard conditions
- Composite states if needed
- Initial and final states

Description: `,
  
  component: `Create a PlantUML component diagram based on the following description. Include:
- Components and interfaces
- Dependencies between components
- Proper packaging
- Interface realizations
- Component connections

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
