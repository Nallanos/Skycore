import { useState } from 'react'

const SkyScoreForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    blueskyHandle: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/skyscore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        if (result.message.includes('simulated')) {
          setMessage('🎉 Your SkyScore has been calculated! In production, this would be sent to your email.')
        } else {
          setMessage('🎉 Your SkyScore has been sent to your email! Check your inbox in a few moments.')
        }
        setFormData({ email: '', blueskyHandle: '' })
      } else {
        setMessage(result.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="card max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-skylume-secondary mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="blueskyHandle" className="block text-sm font-medium text-skylume-secondary mb-2">
            Bluesky Handle
          </label>
          <input
            type="text"
            id="blueskyHandle"
            name="blueskyHandle"
            value={formData.blueskyHandle}
            onChange={handleChange}
            placeholder="@yourhandle.bsky.social"
            className="input-field"
            required
          />
          <p className="text-xs text-skylume-accent mt-1">
            Enter your full Bluesky handle (e.g., @username.bsky.social)
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Calculating SkyScore...
            </span>
          ) : (
            'Get my SkyScore™'
          )}
        </button>

        {message && (
          <div className={`p-4 rounded-lg ${
            message.includes('🎉') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-skylume-secondary mb-3">What you'll get:</h3>
        <ul className="space-y-2 text-sm text-skylume-accent">
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Your personalized SkyScore (0-100)
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            Your social archetype (Influencer, Connector, Explorer, or Rookie)
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            A shareable image card for social media
          </li>
        </ul>
      </div>
    </div>
  )
}

export default SkyScoreForm