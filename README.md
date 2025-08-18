# UML Diagram Generator

A modern web application that generates UML diagrams from natural language descriptions using AI. Built with Next.js, Tailwind CSS, and Google's Gemini AI.

## Features

- 🤖 **AI-Powered Generation**: Uses Google Gemini 1.5 Flash AI to convert natural language to PlantUML code
- 🎨 **Modern UI**: Beautiful, responsive interface with smooth animations
- 📊 **Multiple Diagram Types**: Supports Class, Sequence, Use Case, Activity, State, and Component diagrams
- 💬 **Interactive Chat**: Conversational interface to guide users through diagram creation
- 📥 **Download Support**: Download generated diagrams as PNG images
- 🌐 **Vercel Ready**: Optimized for easy deployment on Vercel

## Supported UML Diagram Types

1. **Class Diagram** - Show classes, attributes, and relationships
2. **Sequence Diagram** - Show interactions over time
3. **Use Case Diagram** - Show user interactions with system
4. **Activity Diagram** - Show workflow and processes
5. **State Diagram** - Show state transitions
6. **Component Diagram** - Show system components and dependencies

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd uml-diagram-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Add it to your `.env.local` file

## Usage

1. **Select Diagram Type**: Choose from the available UML diagram types
2. **Describe Your System**: Provide a detailed description of what you want to diagram
3. **Generate**: The AI will create PlantUML code and generate a visual diagram
4. **View & Download**: View the diagram and download it as a PNG image

### Example Descriptions

**Class Diagram:**
"Create a library management system with Book, Author, Library, and Member classes. Books have titles, ISBNs, and are written by authors. Members can borrow books from the library."

**Sequence Diagram:**
"Show the process of a user logging into a web application, including authentication with a database and session creation."

## Technology Stack

- **Framework**: Next.js 15.4
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI**: Google Generative AI (Gemini)
- **UML Rendering**: PlantUML
- **Deployment**: Vercel-ready

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate-diagram/
│   │       └── route.js          # API endpoint for diagram generation
│   ├── globals.css               # Global styles
│   ├── layout.js                 # Root layout
│   └── page.js                   # Home page
├── components/
│   ├── ChatInterface.js          # Chat interface component
│   ├── DiagramViewer.js          # Diagram display component
│   └── Header.js                 # Header component
```

## API Endpoints

### POST `/api/generate-diagram`

Generates a UML diagram from a text description.

**Request Body:**
```json
{
  "description": "Your system description",
  "diagramType": "class|sequence|usecase|activity|state|component"
}
```

**Response:**
```json
{
  "success": true,
  "plantUmlCode": "Generated PlantUML code",
  "imageUrl": "URL to generated diagram image",
  "diagramType": "class"
}
```

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add your `GEMINI_API_KEY` in the Environment Variables section
   - Deploy!

### Environment Variables for Production

Make sure to set these environment variables in your deployment platform:

- `GEMINI_API_KEY`: Your Google Gemini API key

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy Diagramming! 🎉**
