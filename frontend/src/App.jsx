import { useState, useEffect, useMemo } from 'react'
import Chatbot from './components/Chatbot'
import ProfileModal from './components/ProfileModal'
import SchemeModal from './components/SchemeModal'
import QuestionnaireModal from './components/QuestionnaireModal'
import { useLanguage } from './LanguageContext'
import './App.css'

function App() {
  const { lang, setLang, t, languages } = useLanguage()
  const [isChatOpen, setIsChatOpen] = useState(false)

  // User Profile state (persisted locally only if explicitly saved by user)
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('sevabot_user_profile')
      if (!saved) return null
      const parsed = JSON.parse(saved)
      if (parsed && typeof parsed === 'object' && (parsed.phone || parsed.name)) {
        return parsed
      }
      return null
    } catch {
      return null
    }
  })

  // Saved Schemes state (persisted locally and synced with SQLite)
  const [savedSchemes, setSavedSchemes] = useState(() => {
    try {
      const saved = localStorage.getItem('sevabot_saved_schemes')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Modals and feedback state
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [profileTab, setProfileTab] = useState('saved') // 'saved' | 'profile'
  const [isSchemeModalOpen, setIsSchemeModalOpen] = useState(false)
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false)
  const [isLoadingSavedSchemes, setIsLoadingSavedSchemes] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // Show transient toast notification
  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr))
    }, 3200)
  }

  const [_authToken, setAuthToken] = useState(() => {
    try {
      return localStorage.getItem('sevabot_auth_token') || ''
    } catch {
      return ''
    }
  })

  // Helper to ensure we have a valid access token for the given phone
  const getOrFetchToken = async (phone) => {
    if (!phone) return null
    let token = localStorage.getItem('sevabot_auth_token')
    if (token) return token
    try {
      const response = await fetch('http://127.0.0.1:5000/api/user/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      if (response.ok) {
        const data = await response.json()
        if (data.token) {
          localStorage.setItem('sevabot_auth_token', data.token)
          setAuthToken(data.token)
          return data.token
        }
      }
    } catch (err) {
      console.warn('Could not acquire device auth token:', err)
    }
    return null
  }

  // Fetch saved schemes from backend if user has a phone number
  const syncSavedSchemesFromBackend = async (phone) => {
    if (!phone) return
    setIsLoadingSavedSchemes(true)
    try {
      const token = await getOrFetchToken(phone)
      const headers = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const response = await fetch(
        `http://127.0.0.1:5000/api/user/schemes_get?phone=${encodeURIComponent(phone)}`,
        { headers }
      )
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        // Merge remote schemes with local schemes, keeping unique by name or id
        setSavedSchemes((prevLocal) => {
          const map = new Map()
          // First add remote schemes
          data.forEach((s) => {
            const key = s.name || s.id
            if (key) map.set(key, { ...s, status: s.status || 'Applied' })
          })
          // Then add local schemes
          prevLocal.forEach((s) => {
            const key = s.name || s.id
            if (key && !map.has(key)) {
              map.set(key, s)
            }
          })
          const merged = Array.from(map.values())
          localStorage.setItem('sevabot_saved_schemes', JSON.stringify(merged))
          return merged
        })
      }
    } catch (err) {
      console.warn('Could not sync saved schemes with backend:', err)
    } finally {
      setIsLoadingSavedSchemes(false)
    }
  }

  // Sync saved schemes on mount or when user profile phone changes
  useEffect(() => {
    if (userProfile?.phone) {
      syncSavedSchemesFromBackend(userProfile.phone)
    }
  }, [userProfile?.phone])

  // Save/Update Profile Handler
  const handleSaveProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('sevabot_auth_token')
      const headers = { 'Content-Type': 'application/json' }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const response = await fetch('http://127.0.0.1:5000/api/user/save', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          phone: profileData.phone,
          name: profileData.name || '',
          age: profileData.age || '',
          address: profileData.address || '',
          pin: profileData.pin || '',
        }),
      })

      if (!response.ok) {
        throw new Error(`Backend returned HTTP ${response.status}`)
      }

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to save profile on backend')
      }

      if (data.token) {
        localStorage.setItem('sevabot_auth_token', data.token)
        setAuthToken(data.token)
      }

      setUserProfile(profileData)
      localStorage.setItem('sevabot_user_profile', JSON.stringify(profileData))
      showToast(t('Profile saved successfully!'))

      // Sync schemes for this phone
      if (profileData.phone) {
        const activeToken = data.token || token
        savedSchemes.forEach(async (s) => {
          try {
            const addHeaders = { 'Content-Type': 'application/json' }
            if (activeToken) addHeaders['Authorization'] = `Bearer ${activeToken}`
            await fetch('http://127.0.0.1:5000/api/user/schemes_add', {
              method: 'POST',
              headers: addHeaders,
              body: JSON.stringify({
                phone: profileData.phone,
                scheme_name: s.name,
              }),
            })
          } catch {}
        })
        syncSavedSchemesFromBackend(profileData.phone)
      }
    } catch (err) {
      console.error('Save profile error:', err)
      throw err
    }
  }

  // Reset / Sign Out Profile Handler (clears local profile without modifying database)
  const handleResetProfile = () => {
    try {
      localStorage.removeItem('sevabot_user_profile')
      localStorage.removeItem('sevabot_auth_token')
    } catch {}
    setUserProfile(null)
    setAuthToken('')
    showToast(t('Signed out of profile'))
  }

  // Toggle Save / Unsave Scheme Handler
  const handleToggleSaveScheme = async (scheme) => {
    if (!scheme) return
    const isAlreadySaved = savedSchemes.some(
      (s) => s.name === scheme.name || (s.id && scheme.id && s.id === scheme.id)
    )

    if (isAlreadySaved) {
      const nextSaved = savedSchemes.filter(
        (s) => !(s.name === scheme.name || (s.id && scheme.id && s.id === scheme.id))
      )
      setSavedSchemes(nextSaved)
      localStorage.setItem('sevabot_saved_schemes', JSON.stringify(nextSaved))
      showToast(`${t('Removed')} "${t(scheme.name)}" ${t('from saved schemes')}`)
    } else {
      const newSavedItem = {
        ...scheme,
        status: 'Applied',
        saved_at: new Date().toISOString(),
      }
      const nextSaved = [newSavedItem, ...savedSchemes]
      setSavedSchemes(nextSaved)
      localStorage.setItem('sevabot_saved_schemes', JSON.stringify(nextSaved))
      showToast(`${t('Saved')} "${t(scheme.name)}" ${t('to your profile!')}`)

      // Also persist to SQLite if phone is present
      if (userProfile?.phone) {
        try {
          const token = await getOrFetchToken(userProfile.phone)
          const headers = { 'Content-Type': 'application/json' }
          if (token) headers['Authorization'] = `Bearer ${token}`
          await fetch('http://127.0.0.1:5000/api/user/schemes_add', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              phone: userProfile.phone,
              scheme_name: scheme.name,
            }),
          })
        } catch (err) {
          console.warn('Could not persist scheme to backend SQLite:', err)
        }
      }
    }
  }

  // Remove Scheme Handler from Profile Modal
  const handleRemoveSavedScheme = (schemeName) => {
    const nextSaved = savedSchemes.filter((s) => s.name !== schemeName)
    setSavedSchemes(nextSaved)
    localStorage.setItem('sevabot_saved_schemes', JSON.stringify(nextSaved))
    showToast(`${t('Removed')} "${t(schemeName)}" ${t('from saved schemes')}`)
  }


  // Schemes state
  const [schemes, setSchemes] = useState([])
  const [schemesLoading, setSchemesLoading] = useState(true)
  const [schemesError, setSchemesError] = useState(null)

  // Search filter state
  const [searchQuery, setSearchQuery] = useState('')

  // AI Search states
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isAiActive, setIsAiActive] = useState(false)
  const [aiResults, setAiResults] = useState(null)
  const [aiExplanation, setAiExplanation] = useState(null)
  const [aiError, setAiError] = useState(null)

  // Semantic Search states
  const [isSemanticLoading, setIsSemanticLoading] = useState(false)
  const [isSemanticActive, setIsSemanticActive] = useState(false)
  const [semanticResults, setSemanticResults] = useState(null)
  const [semanticError, setSemanticError] = useState(null)

  // Filter Dropdown States (State, Sector/Organization, Scheme Type)
  const [selectedState, setSelectedState] = useState('')
  const [selectedSector, setSelectedSector] = useState('')
  const [selectedType, setSelectedType] = useState('')

  // Fetch schemes from Flask backend GET /api/schemes
  const fetchSchemes = async () => {
    setSchemesLoading(true)
    setSchemesError(null)

    try {
      let response
      try {
        response = await fetch('http://localhost:5000/api/schemes')
      } catch {
        response = await fetch('http://127.0.0.1:5000/api/schemes')
      }

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const data = await response.json()
      if (Array.isArray(data)) {
        setSchemes(data)
      } else {
        throw new Error('Unexpected data format received from backend')
      }
    } catch (err) {
      setSchemesError(
        `Failed to fetch schemes: ${err.message}. Make sure the Flask backend is running on port 5000.`
      )
    } finally {
      setSchemesLoading(false)
    }
  }

  useEffect(() => {
    fetchSchemes()
  }, [])

  const handleScrollToSchemes = () => {
    const section = document.getElementById('schemes-section')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // AI Search trigger
  const handleAiSearch = async () => {
    const query = searchQuery.trim()
    if (!query) {
      setAiError('Please enter a query or situation in the search box before running AI Search.')
      return
    }

    setIsAiLoading(true)
    setAiError(null)
    setAiExplanation(null)

    try {
      const response = await fetch('http://127.0.0.1:5000/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      // Check response content type before attempting JSON parsing
      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        const textBody = await response.text()
        const isHtml = textBody.trim().startsWith('<')
        if (isHtml) {
          throw new Error(
            `Backend returned HTML instead of JSON (HTTP ${response.status}). The Flask server was running an older process that needs to be restarted so /api/ai-search is loaded.`
          )
        }
        throw new Error(
          `Unexpected response format from backend (${contentType || 'non-JSON'}). Expected application/json.`
        )
      }

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 503 || data.code === 'LLM_CONFIG_MISSING') {
          throw new Error(
            data.error ||
              'LLM API key is not configured. Please set the GEMINI_API_KEY (or OPENAI_API_KEY) environment variable on the Flask backend.'
          )
        }
        throw new Error(data.error || `AI search request failed with status ${response.status}`)
      }

      // Success
      setAiExplanation(data.explanation || '')
      if (data.matching_schemes && Array.isArray(data.matching_schemes)) {
        setAiResults(data.matching_schemes)
      } else if (data.scheme_ids && Array.isArray(data.scheme_ids)) {
        const matched = schemes.filter((s) => data.scheme_ids.includes(s.id))
        setAiResults(matched)
      } else {
        setAiResults([])
      }
      setIsAiActive(true)
    } catch (err) {
      setAiError(
        err.message ||
          'Failed to perform AI search. Please verify your Flask backend is running on http://127.0.0.1:5000.'
      )
    } finally {
      setIsAiLoading(false)
    }
  }

  // Semantic Search trigger
  const handleSemanticSearch = async () => {
    const query = searchQuery.trim()
    if (!query) {
      setSemanticError('Please enter a query or situation in the search box before running Semantic Search.')
      return
    }

    setIsSemanticLoading(true)
    setSemanticError(null)
    setIsAiActive(false)
    setAiResults(null)
    setAiExplanation(null)
    setAiError(null)

    try {
      const response = await fetch('http://127.0.0.1:5000/api/semantic-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query }),
      })

      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        const textBody = await response.text()
        const isHtml = textBody.trim().startsWith('<')
        if (isHtml) {
          throw new Error(
            `Backend returned HTML instead of JSON (HTTP ${response.status}). Ensure the Flask server is running on http://127.0.0.1:5000.`
          )
        }
        throw new Error(
          `Unexpected response format from backend (${contentType || 'non-JSON'}). Expected application/json.`
        )
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Semantic search request failed with status ${response.status}`)
      }

      // Success - map results into scheme objects with relevance scores
      if (data.results && Array.isArray(data.results)) {
        const matched = data.results.map((item) => ({
          ...item.scheme,
          relevance_score: item.relevance_score,
          score: item.score,
        }))
        setSemanticResults(matched)
      } else {
        setSemanticResults([])
      }
      setIsSemanticActive(true)
    } catch (err) {
      setSemanticError(
        err.message ||
          'Failed to perform semantic search. Please verify your Flask backend is running on http://127.0.0.1:5000.'
      )
    } finally {
      setIsSemanticLoading(false)
    }
  }

  // Clear / Reset search
  const handleClearSearch = () => {
    setSearchQuery('')
    setIsAiActive(false)
    setAiResults(null)
    setAiExplanation(null)
    setAiError(null)
    setIsSemanticActive(false)
    setSemanticResults(null)
    setSemanticError(null)
  }

  // Clear / Reset dropdown filters
  const handleClearFilters = () => {
    setSelectedState('')
    setSelectedSector('')
    setSelectedType('')
  }

  // Reset both search and filters
  const handleResetAll = () => {
    handleClearSearch()
    handleClearFilters()
  }

  // Default fallback filter options if schemes are loading
  const defaultStates = useMemo(
    () => ['All India', 'Delhi', 'Gujarat', 'Karnataka', 'Maharashtra', 'Odisha', 'Tamil Nadu', 'Telangana'],
    []
  )
  const defaultSectors = useMemo(
    () => ['Agriculture Sector', 'Education Sector', 'Medical Sector', 'Others'],
    []
  )
  const defaultTypes = useMemo(
    () => ['Central Scheme', 'State Scheme'],
    []
  )

  // Dynamically extract unique states, sectors, and types from schemes dataset
  const availableStates = useMemo(() => {
    if (!schemes || schemes.length === 0) return defaultStates
    const stateSet = new Set()
    schemes.forEach((s) => {
      if (s.state && s.state.trim()) {
        stateSet.add(s.state.trim())
      }
    })
    const list = Array.from(stateSet).filter((st) => st.toLowerCase() !== 'all india')
    list.sort((a, b) => a.localeCompare(b))
    return list.length > 0 ? ['All India', ...list] : defaultStates
  }, [schemes, defaultStates])

  const availableSectors = useMemo(() => {
    if (!schemes || schemes.length === 0) return defaultSectors
    const sectorSet = new Set()
    schemes.forEach((s) => {
      if (s.target && s.target.trim()) {
        sectorSet.add(s.target.trim())
      }
    })
    if (sectorSet.size === 0) {
      schemes.forEach((s) => {
        if (s.category && s.category.trim()) {
          sectorSet.add(s.category.trim())
        }
      })
    }
    const list = Array.from(sectorSet)
    list.sort((a, b) => a.localeCompare(b))
    return list.length > 0 ? list : defaultSectors
  }, [schemes, defaultSectors])

  const availableTypes = useMemo(() => {
    if (!schemes || schemes.length === 0) return defaultTypes
    const typeSet = new Set()
    schemes.forEach((s) => {
      if (s.type && s.type.trim()) {
        typeSet.add(s.type.trim())
      }
    })
    const list = Array.from(typeSet)
    list.sort((a, b) => a.localeCompare(b))
    return list.length > 0 ? list : defaultTypes
  }, [schemes, defaultTypes])

  const hasActiveFilters = Boolean(selectedState || selectedSector || selectedType)

  // Intermediate base schemes from active search mode (Semantic, AI, or Keyword)
  const baseSchemes = useMemo(() => {
    if (isSemanticActive && semanticResults !== null) {
      return semanticResults
    }
    if (isAiActive && aiResults !== null) {
      return aiResults
    }
    const query = searchQuery.toLowerCase().trim()
    if (!query) {
      return schemes
    }
    return schemes.filter((scheme) => {
      const name = (scheme.name || '').toLowerCase()
      const category = (scheme.category || '').toLowerCase()
      const target = (scheme.target || '').toLowerCase()
      const description = (scheme.benefits || scheme.description || '').toLowerCase()

      return (
        name.includes(query) ||
        category.includes(query) ||
        target.includes(query) ||
        description.includes(query)
      )
    })
  }, [isSemanticActive, semanticResults, isAiActive, aiResults, searchQuery, schemes])

  // Displayed schemes after applying State, Sector/Organization, and Scheme Type filters
  const displayedSchemes = useMemo(() => {
    return baseSchemes.filter((scheme) => {
      // 1. State filter: handles both exact state and 'All India' (which applies to all states)
      if (selectedState) {
        const stateNormalized = (scheme.state || '').toLowerCase().replace(/_/g, ' ').trim()
        const selectedNormalized = selectedState.toLowerCase().replace(/_/g, ' ').trim()
        const stateMatches =
          selectedNormalized === 'all india'
            ? stateNormalized === 'all india'
            : stateNormalized === selectedNormalized || stateNormalized === 'all india'
        if (!stateMatches) return false
      }

      // 2. Sector / Organization filter: matches target, category, or organization
      if (selectedSector) {
        const target = (scheme.target || '').toLowerCase().trim()
        const category = (scheme.category || '').toLowerCase().trim()
        const org = (scheme.organization || '').toLowerCase().trim()
        const selected = selectedSector.toLowerCase().trim()

        const sectorMatches =
          target === selected ||
          category === selected ||
          org === selected ||
          target === 'general' ||
          category === 'general'
        if (!sectorMatches) return false
      }

      // 3. Scheme Type filter: matches Central Scheme / State Scheme
      if (selectedType) {
        const schemeType = (scheme.type || '').toLowerCase().trim()
        const selected = selectedType.toLowerCase().trim()
        const typeMatches =
          schemeType === selected ||
          (selected.includes('central') && schemeType.includes('central')) ||
          (selected.includes('state') && schemeType.includes('state'))
        if (!typeMatches) return false
      }

      return true
    })
  }, [baseSchemes, selectedState, selectedSector, selectedType])

  return (
    <div className="app-container">
      {/* Soft background glow orbs */}
      <div className="bg-decorations" aria-hidden="true">
        <div className="decor-orb decor-orb-1"></div>
        <div className="decor-orb decor-orb-2"></div>
      </div>

      {/* Top Navigation */}
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <span className="brand-name">SevaBot AI</span>
        </div>

        <div className="navbar-actions">
          <div className="lang-selector-wrapper">
            <select
              id="app-language-select"
              className="lang-select-nav"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Select Language"
              title="Select Language"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="nav-btn nav-btn-profile"
            onClick={() => {
              setProfileTab('profile')
              setIsProfileOpen(true)
            }}
            title={userProfile?.name ? t('Manage your profile') : t('Profile')}
          >
            {userProfile?.name ? (
              <>
                <span className="nav-profile-avatar">
                  {userProfile.name.trim().charAt(0).toUpperCase()}
                </span>
                <span className="nav-profile-name">
                  {userProfile.name.trim().split(' ')[0]}
                </span>
              </>
            ) : (
              <>
                <span className="nav-profile-placeholder" aria-hidden="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <span className="nav-profile-name">{t('Profile')}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="hero-section">
        <div className="hero-card">
          <div className="hero-pill">
            <span>{t('AI-Powered Welfare Portal')}</span>
          </div>

          <h1 className="hero-title">
            <span className="gradient-text">SevaBot AI</span>
          </h1>

          <h2 className="hero-subtitle">
            {t('Your Multilingual Government Scheme Assistant')}
          </h2>

          <p className="hero-description">
            {t('Discover government schemes, check eligibility, and get personalized recommendations.')}
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn-eligibility-hero"
              onClick={() => setIsQuestionnaireOpen(true)}
              title={t('Find Personalized Schemes')}
            >
              <span>{t('Find Personalized Schemes')}</span>
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={handleScrollToSchemes}
            >
              <span>{t('Explore Schemes')}</span>
              <span className="btn-arrow">↓</span>
            </button>

            <button
              type="button"
              className="btn-chat-toggle"
              onClick={() => setIsChatOpen(true)}
              title={t('Chat with SevaBot')}
            >
              <span>{t('Chat with SevaBot')}</span>
            </button>
          </div>

          {/* Quick highlight cards */}
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <div className="feature-title">{t('Multilingual Support')}</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div className="feature-title">{t('Eligibility Check')}</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                </svg>
              </div>
              <div className="feature-title">{t('Smart Guidance')}</div>
            </div>
          </div>
        </div>
      </main>

      {/* View Schemes Section */}
      <section id="schemes-section" className="schemes-section">
        <div className="schemes-header">
          <div className="section-pill">
            <span>{t('Government Scheme Catalog')}</span>
          </div>
          <h2 className="section-title">
            {t('Available Government')} <span className="gradient-text">{t('Schemes')}</span>
          </h2>
          <p className="section-subtitle">
            {t('Browse verified welfare schemes directly retrieved from the SevaBot system.')}
          </p>
        </div>

        {/* Search Input Filter & AI / Semantic Search Controls */}
        {!schemesLoading && !schemesError && schemes.length > 0 && (
          <div className="search-container">
            <div className="search-controls">
              <div className="search-input-wrapper">
                <span className="search-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </span>
                <input
                  type="text"
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    if (isAiActive) {
                      setIsAiActive(false)
                      setAiResults(null)
                      setAiExplanation(null)
                    }
                    if (isSemanticActive) {
                      setIsSemanticActive(false)
                      setSemanticResults(null)
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSemanticSearch()
                    }
                  }}
                  placeholder={t('Search by keyword, concept, or describe your situation...')}
                  aria-label="Search government schemes"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={handleClearSearch}
                    title="Clear search"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Semantic Search Button */}
              <button
                type="button"
                className="btn-semantic-search"
                onClick={handleSemanticSearch}
                disabled={isSemanticLoading || isAiLoading}
                title="Search using semantic meaning and concept matching"
              >
                {isSemanticLoading ? (
                  <span>{t('Matching...')}</span>
                ) : (
                  <span>{t('Semantic Search')}</span>
                )}
              </button>

              {/* Separate AI Search Button */}
              <button
                type="button"
                className="btn-ai-search"
                onClick={handleAiSearch}
                disabled={isAiLoading || isSemanticLoading}
                title="Search using AI natural-language understanding"
              >
                {isAiLoading ? (
                  <span>{t('Thinking...')}</span>
                ) : (
                  <span>{t('AI Search')}</span>
                )}
              </button>
            </div>

            {/* Search Meta Info */}
            <div className="search-meta-row">
              {isSemanticActive ? (
                <div className="search-mode-indicator">
                  <span className="semantic-badge">{t('Semantic Search Active')}</span>
                  <span>{t('Found')} {displayedSchemes.length} {t('matching schemes with relevance ranking')}</span>
                  {hasActiveFilters && <span className="meta-filter-tag">{t('(filters applied)')}</span>}
                  <button
                    type="button"
                    className="search-reset-link"
                    onClick={handleClearSearch}
                  >
                    {t('Back to All Schemes')}
                  </button>
                </div>
              ) : isAiActive ? (
                <div className="search-mode-indicator">
                  <span className="ai-badge">{t('AI Search Active')}</span>
                  <span>{t('Found')} {displayedSchemes.length} {t('matching schemes')}</span>
                  {hasActiveFilters && <span className="meta-filter-tag">{t('(filters applied)')}</span>}
                  <button
                    type="button"
                    className="search-reset-link"
                    onClick={handleClearSearch}
                  >
                    {t('Back to All Schemes')}
                  </button>
                </div>
              ) : searchQuery.trim() ? (
                <div className="search-meta">
                  <span>
                    {t('Showing')} {displayedSchemes.length} {t('of')} {schemes.length} {t('schemes matching')} "{searchQuery}"
                    {hasActiveFilters && ` ${t('(with filters applied)')}`}
                  </span>
                  {(searchQuery || hasActiveFilters) && (
                    <button
                      type="button"
                      className="search-reset-link"
                      onClick={handleResetAll}
                    >
                      {t('Reset All')}
                    </button>
                  )}
                </div>
              ) : hasActiveFilters ? (
                <div className="search-meta">
                  <span>
                    {t('Showing')} {displayedSchemes.length} {t('of')} {schemes.length} {t('schemes matching selected filters')}
                  </span>
                  <button
                    type="button"
                    className="search-reset-link"
                    onClick={handleClearFilters}
                  >
                    {t('Clear Filters')}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Dropdown Filters (State, Organization/Sector, Scheme Type) */}
        {!schemesLoading && !schemesError && schemes.length > 0 && (
          <div className="filter-container">
            <div className="filter-dropdowns-row">
              {/* State Filter */}
              <div className="filter-dropdown-wrapper">
                <label htmlFor="state-filter" className="filter-label">{t('State')}</label>
                <div className="filter-select-box">
                  <select
                    id="state-filter"
                    className="filter-select"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    title={t('Select your state to filter schemes')}
                    aria-label={t('Filter schemes by state')}
                  >
                    <option value="">{t('All States')}</option>
                    {availableStates.map((st) => (
                      <option key={st} value={st}>
                        {t(st)}
                      </option>
                    ))}
                  </select>
                  <span className="filter-select-arrow" aria-hidden="true">▾</span>
                </div>
              </div>

              {/* Organization / Sector Filter */}
              <div className="filter-dropdown-wrapper">
                <label htmlFor="org-filter" className="filter-label">{t('Sector / Org')}</label>
                <div className="filter-select-box">
                  <select
                    id="org-filter"
                    className="filter-select"
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    title={t('Select organization')}
                    aria-label={t('Filter schemes by sector or organization')}
                  >
                    <option value="">{t('All Sectors')}</option>
                    {availableSectors.map((sec) => (
                      <option key={sec} value={sec}>
                        {t(sec)}
                      </option>
                    ))}
                  </select>
                  <span className="filter-select-arrow" aria-hidden="true">▾</span>
                </div>
              </div>

              {/* Scheme Type Filter */}
              <div className="filter-dropdown-wrapper">
                <label htmlFor="type-filter" className="filter-label">{t('Scheme Type')}</label>
                <div className="filter-select-box">
                  <select
                    id="type-filter"
                    className="filter-select"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    title={t('Select scheme type')}
                    aria-label={t('Filter schemes by scheme type')}
                  >
                    <option value="">{t('All Types')}</option>
                    {availableTypes.map((tp) => (
                      <option key={tp} value={tp}>
                        {t(tp)}
                      </option>
                    ))}
                  </select>
                  <span className="filter-select-arrow" aria-hidden="true">▾</span>
                </div>
              </div>

              {/* Reset Filters Button */}
              {hasActiveFilters && (
                <div className="filter-action-wrapper">
                  <button
                    type="button"
                    className="btn-reset-filters"
                    onClick={handleClearFilters}
                    title={t('Clear all dropdown filters')}
                    aria-label={t('Clear all dropdown filters')}
                  >
                    <span>✕</span>
                    <span>{t('Clear Filters')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Active Filters Chips Bar */}
            {hasActiveFilters && (
              <div className="active-filters-chips">
                <span className="active-filters-title">{t('Active Filters:')}</span>
                {selectedState && (
                  <span className="filter-chip">
                    <span>{t('State')}: {t(selectedState)}</span>
                    <button
                      type="button"
                      className="chip-close-btn"
                      onClick={() => setSelectedState('')}
                      title={`${t('Remove')} ${t(selectedState)} ${t('filter')}`}
                      aria-label={`${t('Remove')} ${t(selectedState)} ${t('filter')}`}
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedSector && (
                  <span className="filter-chip">
                    <span>{t('Sector')}: {t(selectedSector)}</span>
                    <button
                      type="button"
                      className="chip-close-btn"
                      onClick={() => setSelectedSector('')}
                      title={`${t('Remove')} ${t(selectedSector)} ${t('filter')}`}
                      aria-label={`${t('Remove')} ${t(selectedSector)} ${t('filter')}`}
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedType && (
                  <span className="filter-chip">
                    <span>{t('Type')}: {t(selectedType)}</span>
                    <button
                      type="button"
                      className="chip-close-btn"
                      onClick={() => setSelectedType('')}
                      title={`${t('Remove')} ${t(selectedType)} ${t('filter')}`}
                      aria-label={`${t('Remove')} ${t(selectedType)} ${t('filter')}`}
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  className="reset-all-link"
                  onClick={handleClearFilters}
                >
                  {t('Reset All Filters')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Semantic Error Notice */}
        {semanticError && (
          <div className="ai-alert-card ai-error-card">
            <div className="ai-alert-header">
              <strong>{t('Semantic Search Notice')}</strong>
            </div>
            <p className="ai-alert-desc">{semanticError}</p>
            <button
              type="button"
              className="retry-btn-sm"
              onClick={() => setSemanticError(null)}
            >
              {t('Dismiss')}
            </button>
          </div>
        )}

        {/* AI Error Notice */}
        {aiError && (
          <div className="ai-alert-card ai-error-card">
            <div className="ai-alert-header">
              <strong>{t('AI Search Notice')}</strong>
            </div>
            <p className="ai-alert-desc">{aiError}</p>
            <button
              type="button"
              className="retry-btn-sm"
              onClick={() => setAiError(null)}
            >
              {t('Dismiss')}
            </button>
          </div>
        )}

        {/* Semantic Loading State */}
        {isSemanticLoading && (
          <div className="schemes-status-box semantic-loading-box">
            <div className="spinner"></div>
            <p>{t('Matching schemes using semantic similarity and concept relevance...')}</p>
          </div>
        )}

        {/* AI Loading State */}
        {isAiLoading && (
          <div className="schemes-status-box ai-loading-box">
            <div className="spinner"></div>
            <p>{t('AI is analyzing your situation to recommend matching welfare schemes...')}</p>
          </div>
        )}

        {/* AI Explanation Banner */}
        {isAiActive && aiExplanation && !isAiLoading && (
          <div className="ai-explanation-card">
            <div className="ai-explanation-header">
              <div className="ai-explanation-badge">
                <span>{t('AI Scheme Advisor Recommendation')}</span>
              </div>
              <button
                type="button"
                className="ai-close-btn"
                onClick={handleClearSearch}
                title={t('Exit AI search')}
              >
                ✕
              </button>
            </div>
            <p className="ai-explanation-text">{aiExplanation}</p>
          </div>
        )}

        {/* Initial Schemes Loading state */}
        {schemesLoading && (
          <div className="schemes-status-box loading-box">
            <div className="spinner"></div>
            <p>{t('Loading government schemes from backend...')}</p>
          </div>
        )}

        {/* Initial Schemes Error state */}
        {!schemesLoading && schemesError && (
          <div className="schemes-status-box error-box">
            <div>
              <p className="error-title">{t('Unable to Load Schemes')}</p>
              <p className="error-desc">{schemesError}</p>
              <button type="button" className="retry-btn" onClick={fetchSchemes}>
                {t('Retry Fetching Schemes')}
              </button>
            </div>
          </div>
        )}

        {/* Empty state (when initial data is empty) */}
        {!schemesLoading && !schemesError && schemes.length === 0 && (
          <div className="schemes-status-box">
            <p>{t('No government schemes found.')}</p>
          </div>
        )}

        {/* No Matching Schemes Found State */}
        {!schemesLoading && !schemesError && schemes.length > 0 && !isAiLoading && !isSemanticLoading && displayedSchemes.length === 0 && (
          <div className="schemes-status-box no-results-box">
            <p className="no-results-title">{t('No matching schemes found')}</p>
            <p className="no-results-desc">
              {hasActiveFilters && (isSemanticActive || isAiActive || searchQuery.trim()) ? (
                `${t('No schemes match both your search criteria and active filters.')} ${t('Try broadening your filters or search keywords.')}`
              ) : hasActiveFilters ? (
                t('No schemes match your exact filter combination. Try selecting a broader category or resetting filters.')
              ) : isSemanticActive ? (
                `${t('No schemes met the semantic relevance criteria for')} "${searchQuery}". ${t('Try related words or describe your need differently.')}`
              ) : isAiActive ? (
                `${t('The AI advisor could not find direct scheme matches for')} "${searchQuery}". ${t('Try describing your requirement with other details.')}`
              ) : (
                `${t('No schemes matched your keyword search for')} "${searchQuery}". ${t('Try searching by another keyword, category, or sector.')}`
              )}
            </p>
            <div className="no-results-actions">
              {hasActiveFilters && (
                <button
                  type="button"
                  className="retry-btn retry-btn-secondary"
                  onClick={handleClearFilters}
                >
                  {t('Clear Filters')}
                </button>
              )}
              {(searchQuery.trim() || isAiActive || isSemanticActive) && (
                <button
                  type="button"
                  className="retry-btn"
                  onClick={handleClearSearch}
                >
                  {t('Clear Search')}
                </button>
              )}
              {hasActiveFilters && (searchQuery.trim() || isAiActive || isSemanticActive) && (
                <button
                  type="button"
                  className="retry-btn retry-btn-outline"
                  onClick={handleResetAll}
                >
                  {t('Reset All')}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scheme Cards Grid */}
        {!schemesLoading && !schemesError && !isAiLoading && !isSemanticLoading && displayedSchemes.length > 0 && (
          <div className="schemes-grid">
            {displayedSchemes.map((scheme, index) => (
              <div
                key={scheme.id || scheme.name || index}
                className="scheme-card"
              >
                <div className="scheme-card-header">
                  {scheme.relevance_score !== undefined && (
                    <span
                      className="scheme-tag scheme-tag-relevance"
                      title={`${t('Match Score')}: ${scheme.score !== undefined ? scheme.score : scheme.relevance_score}`}
                    >
                      {Math.round(scheme.relevance_score * 100)}% {t('Match')}
                    </span>
                  )}
                  {scheme.category && (
                    <span className="scheme-tag scheme-tag-category">
                      {t(scheme.category)}
                    </span>
                  )}
                  {scheme.target && (
                    <span className="scheme-tag scheme-tag-target">
                      {t(scheme.target)}
                    </span>
                  )}
                </div>

                <h3 className="scheme-name">{t(scheme.name)}</h3>

                <p className="scheme-description">
                  {t(scheme.benefits) || t(scheme.description) || scheme.benefits || scheme.description || t('No description provided.')}
                </p>

                <div className="scheme-card-footer">
                  <span className="scheme-state">
                    {t(scheme.state || 'All India')}
                  </span>
                  {scheme.link && (
                    <a
                      href={scheme.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="scheme-link"
                    >
                      {t('Official Link')} <span>↗</span>
                    </a>
                  )}
                </div>

                {/* Scheme Card Actions: Save & Details */}
                <div className="scheme-card-actions">
                  <div className="card-action-group">
                    <button
                      type="button"
                      className={`btn-card-save ${
                        savedSchemes.some(
                          (s) =>
                            s.name === scheme.name ||
                            (s.id && scheme.id && s.id === scheme.id)
                        )
                          ? 'is-saved'
                          : ''
                      }`}
                      onClick={() => handleToggleSaveScheme(scheme)}
                      title={
                        savedSchemes.some(
                          (s) =>
                            s.name === scheme.name ||
                            (s.id && scheme.id && s.id === scheme.id)
                        )
                          ? t('Remove from saved schemes')
                          : t('Save scheme to profile')
                      }
                    >
                      {savedSchemes.some(
                        (s) =>
                          s.name === scheme.name ||
                          (s.id && scheme.id && s.id === scheme.id)
                      ) ? (
                        <>
                          <span>✓</span>
                          <span>{t('Saved')}</span>
                        </>
                      ) : (
                        <span>{t('Save')}</span>
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn-card-details"
                      onClick={() => {
                        setSelectedScheme(scheme)
                        setIsSchemeModalOpen(true)
                      }}
                      title={t('View application steps and mandatory documents')}
                    >
                      <span>{t('Steps & Docs')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>{t('© 2026 SevaBot AI • Empowering citizens with accessible welfare guidance')}</p>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-banner" role="status">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* User Profile & Saved Schemes Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        initialTab={profileTab}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
        onResetProfile={handleResetProfile}
        savedSchemes={savedSchemes}
        onRemoveScheme={handleRemoveSavedScheme}
        onViewScheme={(scheme) => {
          setSelectedScheme(scheme)
          setIsSchemeModalOpen(true)
        }}
        onRefreshBackend={
          userProfile?.phone
            ? () => syncSavedSchemesFromBackend(userProfile.phone)
            : null
        }
        isLoadingSaved={isLoadingSavedSchemes}
      />

      {/* Scheme Detail Steps Modal */}
      <SchemeModal
        isOpen={isSchemeModalOpen}
        onClose={() => setIsSchemeModalOpen(false)}
        scheme={selectedScheme}
        isSaved={
          selectedScheme
            ? savedSchemes.some(
                (s) =>
                  s.name === selectedScheme.name ||
                  (s.id && selectedScheme.id && s.id === selectedScheme.id)
              )
            : false
        }
        onToggleSave={handleToggleSaveScheme}
      />

      {/* Personalized Scheme Eligibility Questionnaire Modal */}
      <QuestionnaireModal
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        onToggleSaveScheme={handleToggleSaveScheme}
        savedSchemes={savedSchemes}
        onViewSchemeDetails={(scheme) => {
          setSelectedScheme(scheme)
          setIsSchemeModalOpen(true)
        }}
      />

      {/* SevaBot AI Chatbot Integration */}
      <Chatbot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  )
}

export default App
