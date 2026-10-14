import { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from '../LanguageContext'
import './Chatbot.css'

// Supported languages for speech recognition and TTS
const LANGUAGES = [
  { code: 'en', label: 'English', voiceLang: 'en-IN' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)', voiceLang: 'kn-IN' },
  { code: 'hi', label: 'हिन्दी (Hindi)', voiceLang: 'hi-IN' },
]

export default function Chatbot({ isOpen, setIsOpen }) {
  const { lang: globalLang, setLang: setGlobalLang, t } = useLanguage()

  // Session ID for multi-turn context
  const [sessionId, setSessionId] = useState(() => {
    return 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now()
  })

  // Selected language for speech recognition and TTS (English, Kannada, Hindi)
  const [selectedLang, setSelectedLang] = useState(() => {
    try {
      const saved = localStorage.getItem('lang') || localStorage.getItem('sevabot_chat_lang')
      return saved === 'kn' || saved === 'hi' ? saved : 'en'
    } catch {
      return 'en'
    }
  })

  // Sync selectedLang when global language changes
  useEffect(() => {
    if (globalLang && (globalLang === 'kn' || globalLang === 'hi' || globalLang === 'en')) {
      setSelectedLang(globalLang)
    }
  }, [globalLang])

  // Auto-speak replies toggle (persisted locally)
  const [isAutoSpeak, setIsAutoSpeak] = useState(() => {
    try {
      const saved = localStorage.getItem('sevabot_chat_autospeak')
      return saved !== null ? JSON.parse(saved) : true
    } catch {
      return true
    }
  })

  // Initial welcome message based on language
  const getWelcomeText = (lang) => {
    if (lang === 'kn') {
      return "ನಮಸ್ಕಾರ! ನಾನು ಸೇವಾಬಾಟ್, ನಿಮ್ಮ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳ AI ಸಹಾಯಕ. ರೈತರು, ವಿದ್ಯಾರ್ಥಿಗಳು, ಆರೋಗ್ಯ ಅಥವಾ ವ್ಯವಹಾರ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ ತಿಳಿಸಿ!"
    } else if (lang === 'hi') {
      return "नमस्ते! मैं सेवाबॉट हूँ, आपका कल्याणकारी योजनाओं का AI सहायक। किसानों, छात्रों, स्वास्थ्य या व्यवसाय से जुड़ी योजनाओं के बारे में पूछें!"
    }
    return "Hello! I'm SevaBot, your AI welfare scheme advisor. Tell me your situation (e.g. farmer needing financial aid, student looking for education support, healthcare coverage, or starting a business) and I'll find suitable government schemes for you! You can also speak to me!"
  }

  // Messages list
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: getWelcomeText(selectedLang),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])

  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatError, setChatError] = useState(null)

  // Voice Speech-to-Text states
  const [isListening, setIsListening] = useState(false)
  const [voiceNotice, setVoiceNotice] = useState(null)
  const [voiceError, setVoiceError] = useState(null)

  // Audio Text-to-Speech states
  const [activeAudioMsgId, setActiveAudioMsgId] = useState(null)
  const [isAudioLoading, setIsAudioLoading] = useState(false)
  const [audioError, setAudioError] = useState(null)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const activeAudioRef = useRef(null)
  const recognitionRef = useRef(null)

  // Update welcome message if only the initial welcome message is shown
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome-msg') {
        return [
          {
            ...prev[0],
            text: getWelcomeText(selectedLang),
          },
        ]
      }
      return prev
    })
  }, [selectedLang])

  // Update localStorage when language changes
  const handleLanguageChange = (langCode) => {
    setSelectedLang(langCode)
    if (setGlobalLang) {
      setGlobalLang(langCode)
    }
    try {
      localStorage.setItem('sevabot_chat_lang', langCode)
    } catch {}
  }

  // Toggle auto-speak
  const handleToggleAutoSpeak = () => {
    setIsAutoSpeak((prev) => {
      const next = !prev
      try {
        localStorage.setItem('sevabot_chat_autospeak', JSON.stringify(next))
      } catch {}
      if (!next) {
        stopAudio()
      }
      return next
    })
  }

  // Stop any active audio playback
  const stopAudio = useCallback(() => {
    if (activeAudioRef.current) {
      try {
        activeAudioRef.current.pause()
        activeAudioRef.current.currentTime = 0
      } catch {}
      activeAudioRef.current = null
    }
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel()
      } catch {}
    }
    setActiveAudioMsgId(null)
    setIsAudioLoading(false)
  }, [])

  // Browser speech synthesis fallback
  const fallbackBrowserSpeak = useCallback(
    (text, lang) => {
      if (!('speechSynthesis' in window)) {
        setIsAudioLoading(false)
        setActiveAudioMsgId(null)
        return
      }

      try {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        const langConfig = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0]
        utterance.lang = langConfig.voiceLang
        utterance.rate = 0.95
        utterance.pitch = 1.0

        utterance.onstart = () => {
          setIsAudioLoading(false)
        }
        utterance.onend = () => {
          setActiveAudioMsgId(null)
        }
        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis error:', e)
          setActiveAudioMsgId(null)
          setIsAudioLoading(false)
        }

        window.speechSynthesis.speak(utterance)
      } catch (err) {
        console.warn('Fallback TTS failed:', err)
        setActiveAudioMsgId(null)
        setIsAudioLoading(false)
      }
    },
    []
  )

  // Play spoken response via Flask /api/tts endpoint (with browser TTS fallback)
  const speakMessage = useCallback(
    async (text, msgId, langCode) => {
      if (!text) return

      stopAudio()
      setActiveAudioMsgId(msgId)
      setIsAudioLoading(true)
      setAudioError(null)

      const langToUse = langCode || selectedLang

      try {
        let response
        try {
          response = await fetch('http://127.0.0.1:5000/api/tts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              text: text,
              lang: langToUse,
            }),
          })
        } catch {
          response = await fetch('http://localhost:5000/api/tts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              text: text,
              lang: langToUse,
            }),
          })
        }

        if (!response.ok) {
          throw new Error(`TTS server error ${response.status}`)
        }

        const data = await response.json()
        if (!data.audio_url) {
          throw new Error('No audio URL returned from backend')
        }

        const audioUrl = `http://127.0.0.1:5000${data.audio_url}`
        const audio = new Audio(audioUrl)
        activeAudioRef.current = audio

        audio.oncanplaythrough = () => {
          setIsAudioLoading(false)
        }

        audio.onended = () => {
          setActiveAudioMsgId(null)
          activeAudioRef.current = null
        }

        audio.onerror = (e) => {
          console.warn('Audio playback error, falling back to browser speech synthesis:', e)
          fallbackBrowserSpeak(text, langToUse)
        }

        // Attempt playback
        try {
          await audio.play()
        } catch (playErr) {
          if (playErr.name === 'NotAllowedError') {
            setAudioError('Audio playback was blocked by browser autoplay policy. Click "Listen" to play audio.')
            setActiveAudioMsgId(null)
            setIsAudioLoading(false)
          } else {
            fallbackBrowserSpeak(text, langToUse)
          }
        }
      } catch (err) {
        console.warn('Backend TTS failed, using browser speech synthesis fallback:', err)
        fallbackBrowserSpeak(text, langToUse)
      }
    },
    [selectedLang, stopAudio, fallbackBrowserSpeak]
  )

  // Clean up audio on unmount or chat close
  useEffect(() => {
    return () => {
      stopAudio()
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {}
      }
    }
  }, [stopAudio])

  // Scroll to bottom when messages or loading state change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading, isOpen])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 250)
    } else {
      stopAudio()
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {}
      }
    }
  }, [isOpen, stopAudio])

  // Reset / Start fresh conversation
  const handleResetChat = () => {
    stopAudio()
    const newSession = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now()
    setSessionId(newSession)
    setMessages([
      {
        id: 'welcome-msg-' + Date.now(),
        sender: 'bot',
        text: getWelcomeText(selectedLang),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
    setChatError(null)
    setVoiceError(null)
    setVoiceNotice(null)
    setAudioError(null)
    setInputText('')
  }

  // Send message to Flask /chat endpoint
  const handleSendMessage = async (textToSend) => {
    const message = (textToSend || inputText).trim()
    if (!message || isLoading) return

    stopAudio()
    const userMessageId = 'user_' + Date.now()
    const userMsg = {
      id: userMessageId,
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputText('')
    setChatError(null)
    setVoiceError(null)
    setVoiceNotice(null)
    setIsLoading(true)

    try {
      let response
      try {
        response = await fetch('http://127.0.0.1:5000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            message: message,
            session_id: sessionId,
          }),
        })
      } catch {
        response = await fetch('http://localhost:5000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            message: message,
            session_id: sessionId,
          }),
        })
      }

      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        const textBody = await response.text()
        if (textBody.trim().startsWith('<')) {
          throw new Error('Server returned HTML instead of JSON. Ensure the Flask backend is running on http://127.0.0.1:5000.')
        }
        throw new Error('Unexpected response format from backend. Expected application/json.')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Server responded with status ${response.status}`)
      }

      const replyText = data.reply || "I didn't receive a clear answer. Could you please rephrase?"
      const botMsgId = 'bot_' + Date.now()
      const botMsg = {
        id: botMsgId,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, botMsg])

      // If auto-speak is enabled, speak out the bot's response
      if (isAutoSpeak) {
        speakMessage(replyText, botMsgId, selectedLang)
      }
    } catch (err) {
      setChatError(
        err.message || 'Unable to communicate with SevaBot backend. Make sure Flask is running on port 5000.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Voice speech-to-text integration supporting English, Kannada, and Hindi
  const handleToggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setVoiceError('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.')
      return
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch {}
      }
      setIsListening(false)
      return
    }

    // Stop any playing audio before speaking
    stopAudio()
    setVoiceError(null)
    setVoiceNotice(null)

    try {
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      recognition.continuous = false
      recognition.interimResults = false

      // Set recognition language based on selection
      const langConfig = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0]
      recognition.lang = langConfig.voiceLang

      recognition.onstart = () => {
        setIsListening(true)
        setVoiceNotice(`Listening in ${langConfig.label}... Speak now.`)
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        if (transcript && transcript.trim()) {
          setInputText(transcript)
          setVoiceNotice(`Recognized: "${transcript}"`)
          setIsListening(false)
          // Automatically send the voice message like the original SevaBot assistant
          handleSendMessage(transcript)
        }
      }

      recognition.onerror = (event) => {
        setIsListening(false)
        console.warn('Speech recognition error event:', event.error)

        if (event.error === 'not-allowed') {
          setVoiceError('Microphone permission was denied. Please allow microphone access in your browser settings to speak.')
        } else if (event.error === 'no-speech') {
          setVoiceError('No speech was detected. Please try clicking the mic and speaking again.')
        } else if (event.error === 'audio-capture') {
          setVoiceError('No microphone was detected on your device. Please connect a microphone and try again.')
        } else if (event.error === 'network') {
          setVoiceError('Network error during speech recognition. Please verify your connection.')
        } else {
          setVoiceError(`Speech recognition notice: ${event.error}`)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
        setTimeout(() => setVoiceNotice(null), 3000)
      }

      recognition.start()
    } catch (err) {
      console.error('Speech recognition exception:', err)
      setIsListening(false)
      setVoiceError('Unable to start speech recognition. Please check your browser microphone permissions.')
    }
  }

  // Multilingual quick suggestion prompts
  const getQuickPrompts = () => {
    if (selectedLang === 'kn') {
      return [
        'ರೈತರಿಗೆ ಯಾವ ಯೋಜನೆಗಳಿವೆ?',
        'ಆಯುಷ್ಮಾನ್ ಭಾರತ್ ಆರೋಗ್ಯ ಯೋಜನೆ',
        'ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು',
        'ಸಣ್ಣ ಉದ್ಯಮಕ್ಕೆ ಮುದ್ರಾ ಸಾಲ',
      ]
    } else if (selectedLang === 'hi') {
      return [
        'किसानों के लिए कौन सी योजनाएं हैं?',
        'आयुष्मान भारत स्वास्थ्य योजना',
        'छात्रों के लिए छात्रवृत्ति',
        'छोटे व्यवसाय के लिए मुद्रा ऋण',
      ]
    }
    return [
      'What schemes are available for farmers?',
      'Medical coverage for hospitalization',
      'Financial assistance for students',
      'Loan to start a small business',
    ]
  }

  const quickPrompts = getQuickPrompts()

  return (
    <>
      {/* Floating Chatbot Modal / Panel */}
      {isOpen && (
        <div className="chatbot-window" role="dialog" aria-label="SevaBot AI Chatbot">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">AI</div>
              <div>
                <h3 className="chat-title">{t('SevaBot AI Assistant')}</h3>
                <span className="chat-status">
                  <span className="status-dot"></span> {t('Online • Multilingual Voice AI')}
                </span>
              </div>
            </div>

            <div className="chat-header-actions">
              {/* Spoken Responses Toggle */}
              <button
                type="button"
                className={`chat-action-btn btn-audio-toggle ${isAutoSpeak ? 'active' : 'muted'}`}
                onClick={handleToggleAutoSpeak}
                title={isAutoSpeak ? 'Voice Replies are ON (Click to mute)' : 'Voice Replies are OFF (Click to turn on)'}
                aria-label="Toggle spoken responses"
              >
                <span className="toggle-label">{isAutoSpeak ? t('Voice: On') : t('Voice: Off')}</span>
              </button>

              {/* Reset Session */}
              <button
                type="button"
                className="chat-action-btn"
                onClick={handleResetChat}
                title="Start a new conversation"
                aria-label="New chat session"
              >
                {t('New')}
              </button>

              {/* Close Button */}
              <button
                type="button"
                className="chat-action-btn chat-close-btn"
                onClick={() => setIsOpen(false)}
                title="Close chatbot"
                aria-label="Close chatbot"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Language Selector Bar */}
          <div className="chat-lang-bar">
            <span className="lang-bar-label">{t('Language:')}</span>
            <div className="lang-pill-group">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  className={`lang-pill-btn ${selectedLang === lang.code ? 'selected' : ''}`}
                  onClick={() => handleLanguageChange(lang.code)}
                  title={`Switch language to ${lang.label}`}
                >
                  <span>{lang.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages Container */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}
              >
                {msg.sender === 'bot' && <div className="bubble-avatar">AI</div>}
                <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                  <p className="bubble-text">{msg.text}</p>
                  <div className="bubble-meta-row">
                    <span className="bubble-time">{msg.timestamp}</span>

                    {/* Listen / Stop audio button on bot messages */}
                    {msg.sender === 'bot' && (
                      <button
                        type="button"
                        className={`bubble-listen-btn ${activeAudioMsgId === msg.id ? 'is-speaking' : ''}`}
                        onClick={() => {
                          if (activeAudioMsgId === msg.id) {
                            stopAudio()
                          } else {
                            speakMessage(msg.text, msg.id, selectedLang)
                          }
                        }}
                        title={activeAudioMsgId === msg.id ? 'Stop audio' : 'Listen to response'}
                      >
                        {activeAudioMsgId === msg.id ? (
                          <>
                            <span className="audio-wave-anim">
                              <span></span><span></span><span></span>
                            </span>
                            <span>{t('Stop')}</span>
                          </>
                        ) : (
                          <span>{t('Listen')}</span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Prompt Chips */}
            {messages.length === 1 && !isLoading && (
              <div className="quick-prompts-container">
                <span className="quick-prompts-label">
                  {selectedLang === 'kn' ? 'ಸೂಚಿಸಲಾದ ಪ್ರಶ್ನೆಗಳು:' : selectedLang === 'hi' ? 'सुझाए गए प्रश्न:' : t('Suggested questions:')}
                </span>
                <div className="quick-prompts-list">
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="quick-prompt-chip"
                      onClick={() => handleSendMessage(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chatbot Thinking Indicator */}
            {isLoading && (
              <div className="chat-bubble-row bot-row">
                <div className="bubble-avatar">AI</div>
                <div className="chat-bubble bot-bubble typing-bubble">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="typing-label">{t('SevaBot is thinking...')}</span>
                </div>
              </div>
            )}

            {/* Audio Generating Indicator */}
            {isAudioLoading && (
              <div className="audio-status-banner loading-audio">
                <div className="mini-audio-spinner"></div>
                <span>{t('Generating spoken response with SevaBot voice engine...')}</span>
              </div>
            )}

            {/* Active Audio Playing Banner */}
            {activeAudioMsgId && !isAudioLoading && (
              <div className="audio-status-banner playing-audio">
                <span className="audio-wave-anim">
                  <span></span><span></span><span></span><span></span>
                </span>
                <span>{t('SevaBot is speaking...')}</span>
                <button type="button" className="stop-speech-link" onClick={stopAudio}>
                  {t('Stop')}
                </button>
              </div>
            )}

            {/* Microphone Listening State Banner */}
            {isListening && (
              <div className="voice-listening-banner">
                <div className="mic-ripple-box">
                  <span className="mic-listening-icon">{t('Listening')}</span>
                </div>
                <div className="voice-banner-text">
                  <strong>{t('Listening now...')}</strong>
                  <span>{voiceNotice || t('Speak your scheme question clearly into the microphone')}</span>
                </div>
                <button
                  type="button"
                  className="cancel-mic-btn"
                  onClick={handleToggleVoice}
                  title="Cancel voice input"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Voice / Mic Error Notice */}
            {voiceError && (
              <div className="chat-alert-banner voice-error-banner" role="alert">
                <div className="alert-body">
                  <strong>Microphone Notice:</strong>
                  <p>{voiceError}</p>
                </div>
                <button
                  type="button"
                  className="dismiss-alert-btn"
                  onClick={() => setVoiceError(null)}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Audio Playback Error Notice */}
            {audioError && (
              <div className="chat-alert-banner audio-error-banner" role="alert">
                <div className="alert-body">
                  <strong>Audio Playback:</strong>
                  <p>{audioError}</p>
                </div>
                <button
                  type="button"
                  className="dismiss-alert-btn"
                  onClick={() => setAudioError(null)}
                >
                  ✕
                </button>
              </div>
            )}

            {/* General Chat Error Banner */}
            {chatError && (
              <div className="chat-error-banner" role="alert">
                <div className="error-content">
                  <p>{chatError}</p>
                  <button
                    type="button"
                    className="retry-chat-btn"
                    onClick={() => {
                      const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user')
                      if (lastUserMsg) {
                        handleSendMessage(lastUserMsg.text)
                      }
                    }}
                  >
                    {t('Try Again')}
                  </button>
                </div>
                <button
                  type="button"
                  className="dismiss-error-btn"
                  onClick={() => setChatError(null)}
                >
                  ✕
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <form
            className="chat-input-area"
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
          >
            {/* Microphone Button */}
            <button
              type="button"
              className={`voice-mic-btn ${isListening ? 'listening' : ''}`}
              onClick={handleToggleVoice}
              title={isListening ? 'Listening... click to stop' : `Click to speak in ${LANGUAGES.find((l) => l.code === selectedLang)?.label || 'selected language'}`}
              aria-label="Microphone Voice Input"
              disabled={isLoading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </button>

            <input
              ref={inputRef}
              type="text"
              className="chat-text-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? t('Listening now...')
                  : selectedLang === 'kn'
                  ? 'ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ ಅಥವಾ ಮೈಕ್ ಒತ್ತಿ...'
                  : selectedLang === 'hi'
                  ? 'योजनाओं के बारे में पूछें या माइक दबाएं...'
                  : t('Type your query or click mic to speak...')
              }
              disabled={isLoading || isListening}
              aria-label="Type your message"
            />

            <button
              type="submit"
              className="chat-send-btn"
              disabled={isLoading || isListening || !inputText.trim()}
              title="Send message"
              aria-label="Send message"
            >
              <span>{t('Send')}</span>
              <span className="send-icon">→</span>
            </button>
          </form>
        </div>
      )}
    </>
  )
}
