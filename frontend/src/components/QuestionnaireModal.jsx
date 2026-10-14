import { useState, useEffect } from 'react'
import { useLanguage } from '../LanguageContext'
import './QuestionnaireModal.css'

// Definition of occupation questionnaire flows from the original SevaBots
const SCHEME_FLOWS = {
  'Agriculture Sector': {
    isGraph: true,
    start: 'q1',
    totalEstimated: 8,
    nodes: {
      q1: {
        q: 'Are you a farmer?',
        opts: ['Yes', 'No'],
        next: { Yes: 'q2', No: 'q_not_farmer' },
      },
      q2: {
        q: 'Do you own agricultural land?',
        opts: ['Yes', 'No'],
        next: { Yes: 'q3_yes', No: 'q3_no' },
      },
      q3_yes: {
        q: 'What is the size of your land?',
        opts: [
          'Small (less than 2 acres)',
          'Medium (2–5 acres)',
          'Large (more than 5 acres)',
        ],
        next: 'q4',
      },
      q3_no: {
        q: 'Are you a tenant farmer or agricultural laborer?',
        opts: ['Tenant Farmer', 'Laborer', 'Other'],
        next: 'q4',
      },
      q_not_farmer: {
        q: 'Are you involved in allied agricultural activities (Dairy, Poultry etc)?',
        opts: ['Dairy', 'Poultry', 'Fishery', 'None'],
        next: 'q4',
      },
      q4: {
        q: 'What kind of support do you need?',
        opts: [
          'Loan for farming',
          'Equipment subsidy',
          'Crop insurance',
          'Financial support',
          'Not sure',
        ],
        next: 'q5',
      },
      q5: {
        q: 'What is your annual family income?',
        opts: ['Below ₹2 Lakhs', '₹2–5 Lakhs', 'Above ₹5 Lakhs'],
        next: 'q6',
      },
      q6: {
        q: 'Where do you live?',
        opts: ['Rural', 'Semi-urban'],
        next: 'q7',
      },
      q7: {
        q: 'Do you belong to any category?',
        opts: ['General', 'OBC', 'SC/ST'],
        next: 'q8',
      },
      q8: {
        q: 'Select your age group',
        opts: ['Below 30', '30–50', 'Above 50'],
        next: null,
      },
    },
  },
  'Medical Sector': {
    isGraph: false,
    questions: [
      {
        q: 'Are you seeking healthcare support for yourself or family?',
        opts: ['Myself', 'Family Member'],
      },
      {
        q: 'What is your primary healthcare requirement?',
        opts: [
          'Hospitalization / Surgery',
          'Chronic disease treatment',
          'Maternity care',
          'General checkups',
        ],
      },
      {
        q: 'Do you suffer from any critical illness?',
        opts: ['Cancer', 'Heart Disease', 'Kidney issues', 'None', 'Other'],
      },
      {
        q: 'Are you a person with disabilities (PwD)?',
        opts: ['Yes', 'No'],
      },
      {
        q: 'Are you a pregnant or lactating mother?',
        opts: ['Yes', 'No', 'Not Applicable'],
      },
      {
        q: 'Do you have an Ayushman Bharat Card (PMJAY)?',
        opts: ['Yes', 'No', "Don't know"],
      },
      {
        q: 'Do you have any private health insurance?',
        opts: ['Yes', 'No'],
      },
      {
        q: 'What kind of hospital do you prefer?',
        opts: ['Government', 'Empanelled Private', 'Any'],
      },
      {
        q: 'Do you possess a BPL (Below Poverty Line) card?',
        opts: ['Yes', 'No'],
      },
      {
        q: 'What is your annual family income?',
        opts: ['Below ₹1 Lakh', '₹1–3 Lakhs', 'Above ₹3 Lakhs'],
      },
      {
        q: 'Where do you live?',
        opts: ['Rural', 'Urban'],
      },
      {
        q: 'Do you belong to any category?',
        opts: ['General', 'OBC', 'SC/ST', 'Minority'],
      },
      {
        q: 'Select your age group',
        opts: ['Below 18', '18–40', '40–60', 'Senior Citizen 60+'],
      },
    ],
  },
  'Education Sector': {
    isGraph: false,
    questions: [
      {
        q: 'Are you currently enrolled in a school/college?',
        opts: ['Yes', 'No'],
      },
      {
        q: 'What is your current level of education?',
        opts: [
          'School (up to 12th)',
          'Undergrad / Degree',
          'Postgrad / PhD',
          'Professional Training',
        ],
      },
      {
        q: 'Which type of institution are you studying in?',
        opts: ['Government', 'Private Aided', 'Private Unaided'],
      },
      {
        q: 'Are you planning to study abroad?',
        opts: ['Yes', 'No'],
      },
      {
        q: 'Did you score above 75% in your previous exam?',
        opts: ['Yes', 'No'],
      },
      {
        q: 'Are you a single girl child?',
        opts: ['Yes', 'No', 'Not Applicable'],
      },
      {
        q: 'Are you seeking support for tuition or hostel fees?',
        opts: ['Tuition Fee', 'Hostel Fee', 'Both', 'Other'],
      },
      {
        q: 'Are you applying for competitive exam coaching subsidy?',
        opts: ['Yes', 'No'],
      },
      {
        q: 'Do you possess a resident/domicile certificate for your state?',
        opts: ['Yes', 'No'],
      },
      {
        q: 'What is your annual family income?',
        opts: ['Below ₹2.5 Lakhs', '₹2.5–5 Lakhs', 'Above ₹5 Lakhs'],
      },
      {
        q: 'Do you belong to any category?',
        opts: ['General', 'OBC', 'SC/ST', 'Minority'],
      },
      {
        q: 'Select your age group',
        opts: ['Below 16', '16–22', '23–30', 'Above 30'],
      },
    ],
  },
  Others: {
    isGraph: false,
    questions: [
      {
        q: 'What is your primary objective?',
        opts: [
          'Start a business',
          'House / Housing Loan',
          'Pension / Retirement',
          'Unemployed / Skill Training',
        ],
      },
      {
        q: 'If looking for a business loan, what is your sector?',
        opts: ['Manufacturing', 'Services', 'Trading', 'Not Applicable'],
      },
      {
        q: 'Do you currently own a pucca (permanent) house?',
        opts: ['Yes', 'No'],
      },
      {
        q: 'Are you registered as an unorganized sector worker (e-Shram)?',
        opts: ['Yes', 'No', "Don't know"],
      },
      {
        q: 'Are you actively looking for employment or skill development?',
        opts: ['Yes', 'No'],
      },
      {
        q: 'What is your annual family income?',
        opts: ['Below ₹2 Lakhs', '₹2–5 Lakhs', 'Above ₹5 Lakhs'],
      },
      {
        q: 'Where do you live?',
        opts: ['Rural', 'Urban', 'Slum area'],
      },
      {
        q: 'Do you belong to any category?',
        opts: [
          'General',
          'OBC',
          'SC/ST',
          'Minority',
          'Women Entrepreneur',
        ],
      },
      {
        q: 'Select your age group',
        opts: ['Below 30', '30–50', 'Senior Citizen 60+'],
      },
    ],
  },
}

const OCCUPATION_OPTIONS = [
  {
    id: 'Agriculture Sector',
    label: 'Agriculture Sector',
    desc: 'Farmers, cultivators, allied agricultural activities, and rural livelihood.',
  },
  {
    id: 'Medical Sector',
    label: 'Medical Sector',
    desc: 'Healthcare coverage, hospitalization support, surgery, and maternal care.',
  },
  {
    id: 'Education Sector',
    label: 'Education Sector',
    desc: 'Students, scholarships, tuition assistance, and skill training programs.',
  },
  {
    id: 'Others',
    label: 'Others',
    desc: 'Business loans (MUDRA), housing schemes, pensions, and unorganized workers.',
  },
]

export default function QuestionnaireModal({
  isOpen,
  onClose,
  onToggleSaveScheme,
  savedSchemes = [],
  onViewSchemeDetails,
}) {
  const { t } = useLanguage()
  const [stage, setStage] = useState('select_occupation') // 'select_occupation' | 'questions' | 'loading' | 'results'
  const [selectedOccupation, setSelectedOccupation] = useState('')
  const [userAnswers, setUserAnswers] = useState({})
  const [questionKey, setQuestionKey] = useState(null) // For graph flow
  const [questionIndex, setQuestionIndex] = useState(0) // For array flow
  const [questionHistory, setQuestionHistory] = useState([]) // For back navigation
  const [matchedSchemes, setMatchedSchemes] = useState([])
  const [errorMsg, setErrorMsg] = useState(null)

  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      const savedOcc = localStorage.getItem('userOccupation')
      if (savedOcc && SCHEME_FLOWS[savedOcc]) {
        setSelectedOccupation(savedOcc)
      } else {
        setSelectedOccupation('')
      }
      setStage('select_occupation')
      setUserAnswers({})
      setQuestionHistory([])
      setMatchedSchemes([])
      setErrorMsg(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  // Handle Occupation selection and start flow
  const handleStartQuestionnaire = () => {
    if (!selectedOccupation) return

    localStorage.setItem('userOccupation', selectedOccupation)
    setUserAnswers({})
    setQuestionHistory([])
    setErrorMsg(null)

    const flow = SCHEME_FLOWS[selectedOccupation]
    if (flow.isGraph) {
      setQuestionKey(flow.start)
    } else {
      setQuestionIndex(0)
    }
    setStage('questions')
  }

  // Get current active question object
  const getCurrentQuestion = () => {
    if (!selectedOccupation) return null
    const flow = SCHEME_FLOWS[selectedOccupation]
    if (!flow) return null

    if (flow.isGraph) {
      return flow.nodes[questionKey] || null
    } else {
      return flow.questions[questionIndex] || null
    }
  }

  // Submit answers to Flask /api/match endpoint
  const submitAnswersToBackend = async (answersToSubmit) => {
    setStage('loading')
    setErrorMsg(null)

    const payload = {
      occupation: selectedOccupation,
      userAnswers: answersToSubmit,
    }

    try {
      let response
      try {
        response = await fetch('http://127.0.0.1:5000/api/match', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        })
      } catch {
        response = await fetch('http://localhost:5000/api/match', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        })
      }

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`)
      }

      const schemes = await response.json()
      if (Array.isArray(schemes)) {
        setMatchedSchemes(schemes)
      } else {
        setMatchedSchemes([])
      }
      setStage('results')
    } catch (err) {
      console.error('Match schemes API error:', err)
      setErrorMsg(
        err.message || 'Unable to connect to SevaBot matching engine. Ensure Flask is running on port 5000.'
      )
      setStage('results')
    }
  }

  // Handle choice selection for current question
  const handleAnswerChoice = (answer) => {
    const currentQ = getCurrentQuestion()
    if (!currentQ) return

    const updatedAnswers = {
      ...userAnswers,
      [currentQ.q]: answer,
    }
    setUserAnswers(updatedAnswers)
    localStorage.setItem('userAnswers', JSON.stringify(updatedAnswers))

    const flow = SCHEME_FLOWS[selectedOccupation]

    if (flow.isGraph) {
      const nextKey =
        typeof currentQ.next === 'object' && currentQ.next !== null
          ? currentQ.next[answer] || null
          : currentQ.next

      if (nextKey && flow.nodes[nextKey]) {
        setQuestionHistory((prev) => [...prev, questionKey])
        setQuestionKey(nextKey)
      } else {
        // Reached end of graph flow -> Submit to backend
        submitAnswersToBackend(updatedAnswers)
      }
    } else {
      const nextIndex = questionIndex + 1
      if (nextIndex < flow.questions.length) {
        setQuestionHistory((prev) => [...prev, questionIndex])
        setQuestionIndex(nextIndex)
      } else {
        // Reached end of array flow -> Submit to backend
        submitAnswersToBackend(updatedAnswers)
      }
    }
  }

  // Handle Step Back in questionnaire
  const handleStepBack = () => {
    if (questionHistory.length === 0) {
      setStage('select_occupation')
      return
    }

    const prevHistory = [...questionHistory]
    const lastStep = prevHistory.pop()
    setQuestionHistory(prevHistory)

    const flow = SCHEME_FLOWS[selectedOccupation]
    if (flow.isGraph) {
      setQuestionKey(lastStep)
    } else {
      setQuestionIndex(lastStep)
    }
  }

  // Reset to restart the questionnaire
  const handleRetake = () => {
    setStage('select_occupation')
    setUserAnswers({})
    setQuestionHistory([])
    setMatchedSchemes([])
    setErrorMsg(null)
  }

  const currentQ = getCurrentQuestion()

  // Compute progress indicator
  const getProgressStats = () => {
    if (!selectedOccupation) return { current: 1, total: 1 }
    const flow = SCHEME_FLOWS[selectedOccupation]
    if (flow.isGraph) {
      return {
        current: questionHistory.length + 1,
        total: flow.totalEstimated || 8,
      }
    } else {
      return {
        current: questionIndex + 1,
        total: flow.questions.length,
      }
    }
  }

  const { current: currentStepNum, total: totalStepsCount } = getProgressStats()

  return (
    <div
      className="modal-backdrop questionnaire-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="questionnaire-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="questionnaire-modal-header">
          <div className="header-left">
            <div className="questionnaire-icon-box">E</div>
            <div>
              <h2 className="questionnaire-title">{t('Personalized Scheme Eligibility')}</h2>
              <p className="questionnaire-subtitle">
                {t('Answer simple questions to match schemes tailored to your occupation and income')}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="questionnaire-modal-body">
          {/* STAGE 1: OCCUPATION SELECTOR */}
          {stage === 'select_occupation' && (
            <div className="occupation-selector-view">
              <div className="stage-intro-box">
                <span className="step-badge">{t('Step')} 1 {t('of')} 2</span>
                <h3 className="stage-heading">{t('Select Your Occupation or Sector')}</h3>
                <p className="stage-subtext">
                  {t("Choose the sector that best describes your primary background. We'll ask targeted eligibility questions based on government welfare categories.")}
                </p>
              </div>

              <div className="occupation-grid">
                {OCCUPATION_OPTIONS.map((occ) => (
                  <div
                    key={occ.id}
                    className={`occupation-card ${selectedOccupation === occ.id ? 'is-selected' : ''}`}
                    onClick={() => setSelectedOccupation(occ.id)}
                  >
                    <div className="occ-info">
                      <h4 className="occ-name">{t(occ.label)}</h4>
                      <p className="occ-desc">{t(occ.desc)}</p>
                    </div>
                    <div className="occ-check-indicator">
                      {selectedOccupation === occ.id ? '✓' : ''}
                    </div>
                  </div>
                ))}
              </div>

              <div className="occupation-actions-footer">
                <button
                  type="button"
                  className="btn-start-questions"
                  disabled={!selectedOccupation}
                  onClick={handleStartQuestionnaire}
                >
                  <span>{t('Begin Eligibility Check')}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: STEP-BY-STEP QUESTIONNAIRE */}
          {stage === 'questions' && currentQ && (
            <div className="question-step-view">
              {/* Progress bar */}
              <div className="question-progress-bar-container">
                <div className="progress-info-row">
                  <span className="progress-step-text">
                    {t('Question')} {currentStepNum} {t('of')} {totalStepsCount}
                  </span>
                  <span className="progress-occ-tag">{t(selectedOccupation)}</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(100, (currentStepNum / totalStepsCount) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Question Box */}
              <div className="active-question-card">
                <h3 className="active-question-text">{t(currentQ.q)}</h3>
                <p className="active-question-hint">{t('Select the option that applies to you:')}</p>

                <div className="choice-options-list">
                  {currentQ.opts.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="btn-choice-option"
                      onClick={() => handleAnswerChoice(opt)}
                    >
                      <span className="choice-bullet">{(idx + 1).toString()}</span>
                      <span className="choice-text">{t(opt)}</span>
                      <span className="choice-arrow">→</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Bar */}
              <div className="question-nav-bar">
                <button
                  type="button"
                  className="btn-question-back"
                  onClick={handleStepBack}
                  title="Return to previous question"
                >
                  <span>←</span>
                  <span>{t('Back')}</span>
                </button>
                <button
                  type="button"
                  className="btn-question-cancel"
                  onClick={handleRetake}
                  title="Reset and change sector"
                >
                  {t('Change Sector')}
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: LOADING STATE */}
          {stage === 'loading' && (
            <div className="questionnaire-status-box loading-match-box">
              <div className="matching-spinner"></div>
              <h3 className="loading-match-title">{t('Analyzing Your Profile...')}</h3>
              <p className="loading-match-desc">
                {t('Matching your answers against official government criteria via SevaBot backend...')}
              </p>
            </div>
          )}

          {/* STAGE 4: RESULTS DISPLAY */}
          {stage === 'results' && (
            <div className="questionnaire-results-view">
              {/* Results Top Header */}
              <div className="results-meta-banner">
                <div className="results-meta-left">
                  <span className="results-badge">{t('Matching Complete')}</span>
                  <h3 className="results-heading">{t('Recommended Welfare Schemes')}</h3>
                  <p className="results-subheading">
                    Matched for <strong>{t(selectedOccupation)}</strong> based on your answers
                  </p>
                </div>
                <button type="button" className="btn-retake" onClick={handleRetake}>
                  <span>{t('Retake Questionnaire')}</span>
                </button>
              </div>

              {/* Error Notice if any */}
              {errorMsg && (
                <div className="match-alert-box error-alert">
                  <div>
                    <strong>Connection Notice:</strong>
                    <p>{errorMsg}</p>
                  </div>
                  <button
                    type="button"
                    className="retry-btn-match"
                    onClick={() => submitAnswersToBackend(userAnswers)}
                  >
                    {t('Try Again')}
                  </button>
                </div>
              )}

              {/* Empty Results State */}
              {!errorMsg && matchedSchemes.length === 0 && (
                <div className="match-empty-box">
                  <h4 className="empty-match-title">{t('No Exact Schemes Match Your Specific Criteria')}</h4>
                  <p className="empty-match-desc">
                    {t('No exact schemes matched your answers.')}
                  </p>
                  <div className="empty-actions-row">
                    <button type="button" className="btn-adjust-criteria" onClick={handleRetake}>
                      <span>{t('Adjust Criteria')}</span>
                    </button>
                    <button
                      type="button"
                      className="btn-explore-all"
                      onClick={() => {
                        onClose()
                        const section = document.getElementById('schemes-section')
                        if (section) section.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      <span>{t('Explore General Catalog')}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Matched Schemes List */}
              {matchedSchemes.length > 0 && (
                <div className="matched-schemes-grid">
                  {matchedSchemes.map((scheme, idx) => {
                    const isSaved = savedSchemes.some(
                      (s) => s.name === scheme.name || (s.id && scheme.id && s.id === scheme.id)
                    )

                    return (
                      <div key={scheme.id || scheme.name || idx} className="matched-scheme-card">
                        <div className="matched-card-header">
                          <div className="matched-tags-row">
                            <span className="matched-server-badge">
                              ✓ {t('Matched via Backend Server')}
                            </span>
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
                          <span className="scheme-location-pill">
                            {t(scheme.state || 'All India')}
                          </span>
                        </div>

                        <h4 className="matched-scheme-name">{t(scheme.name)}</h4>

                        <p className="matched-scheme-benefits">
                          {t(scheme.benefits) || t(scheme.description) || scheme.benefits || scheme.description || t('No description provided.')}
                        </p>

                        <div className="matched-card-footer">
                          <div className="matched-actions-group">
                            <button
                              type="button"
                              className={`btn-match-save ${isSaved ? 'is-saved' : ''}`}
                              onClick={() => onToggleSaveScheme(scheme)}
                              title={isSaved ? t('Remove from saved schemes') : t('Save scheme to profile')}
                            >
                              <span>{isSaved ? `✓ ${t('Saved')}` : t('Save')}</span>
                            </button>

                            <button
                              type="button"
                              className="btn-match-details"
                              onClick={() => onViewSchemeDetails(scheme)}
                              title={t('Steps & Docs')}
                            >
                              <span>{t('Steps & Docs')}</span>
                            </button>
                          </div>

                          {scheme.link && (
                            <a
                              href={scheme.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="match-portal-link"
                            >
                              <span>{t('Official Portal')}</span>
                              <span>↗</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="questionnaire-modal-footer">
          <span className="footer-tip">
            {t('All recommendations are calculated directly from verified database criteria.')}
          </span>
          <button type="button" className="btn-modal-close" onClick={onClose}>
            {t('Close')}
          </button>
        </div>
      </div>
    </div>
  )
}
