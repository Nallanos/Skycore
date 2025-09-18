import { useState } from 'react'
import SkyScoreForm from './components/SkyScoreForm'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-skylume-background to-blue-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-skylume-secondary mb-6 leading-tight">
            Discover Your
            <span className="text-skylume-primary"> SkyScore™</span>
          </h1>
          <p className="text-xl text-skylume-accent mb-12 leading-relaxed">
            Uncover your Bluesky influence and get a personalized score card 
            that showcases your unique social media archetype.
          </p>
          <SkyScoreForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App