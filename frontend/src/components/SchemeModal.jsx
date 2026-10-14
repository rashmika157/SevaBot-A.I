import { useLanguage } from '../LanguageContext'
import './SchemeModal.css'

export default function SchemeModal({
  isOpen,
  onClose,
  scheme,
  isSaved,
  onToggleSave,
}) {
  const { t } = useLanguage()

  if (!isOpen || !scheme) return null

  const stepsList = Array.isArray(scheme.steps)
    ? scheme.steps
    : typeof scheme.steps === 'string' && scheme.steps.startsWith('[')
    ? JSON.parse(scheme.steps)
    : scheme.steps
    ? [scheme.steps]
    : []

  const docsList = Array.isArray(scheme.documents)
    ? scheme.documents
    : typeof scheme.documents === 'string' && scheme.documents.startsWith('[')
    ? JSON.parse(scheme.documents)
    : scheme.documents
    ? [scheme.documents]
    : []

  return (
    <div className="modal-backdrop scheme-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="scheme-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="scheme-modal-header">
          <div>
            <div className="modal-tag-row">
              {scheme.category && (
                <span className="scheme-tag scheme-tag-category">{t(scheme.category)}</span>
              )}
              {scheme.target && (
                <span className="scheme-tag scheme-tag-target">{t(scheme.target)}</span>
              )}
              {scheme.state && (
                <span className="scheme-tag scheme-tag-state">{t(scheme.state)}</span>
              )}
            </div>
            <h2 className="scheme-modal-title">{t(scheme.name)}</h2>
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
        <div className="scheme-modal-body">
          {/* Key Overview Cards */}
          <div className="scheme-overview-grid">
            <div className="overview-item">
              <span className="overview-label">{t('Target Sector')}</span>
              <span className="overview-value">{t(scheme.target) || t('General')}</span>
            </div>
            <div className="overview-item">
              <span className="overview-label">{t('Income Eligibility')}</span>
              <span className="overview-value">{t(scheme.income) || t('Any')}</span>
            </div>
            <div className="overview-item">
              <span className="overview-label">{t('Authority')}</span>
              <span className="overview-value">{t(scheme.organization) || t('Government')}</span>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="modal-section">
            <h3 className="section-heading">{t('Key Benefits')}</h3>
            <div className="benefits-box">
              <p>{t(scheme.benefits) || t(scheme.description) || scheme.benefits || scheme.description || t('No specific benefits details provided.')}</p>
            </div>
          </div>

          {/* Application Steps */}
          {stepsList.length > 0 && (
            <div className="modal-section">
              <h3 className="section-heading">{t('Step-by-Step Application Process')}</h3>
              <div className="steps-timeline">
                {stepsList.map((step, idx) => (
                  <div key={idx} className="timeline-step">
                    <div className="step-number">{idx + 1}</div>
                    <div className="step-content">
                      <p>{t(step)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Required Documents */}
          {docsList.length > 0 && (
            <div className="modal-section">
              <h3 className="section-heading">{t('Mandatory Documents')}</h3>
              <div className="modal-docs-grid">
                {docsList.map((doc, idx) => (
                  <div key={idx} className="doc-item-card">
                    <span className="doc-icon">✓</span>
                    <span className="doc-title">{t(doc)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="scheme-modal-footer">
          <div className="footer-left">
            <button
              type="button"
              className={`btn-modal-save ${isSaved ? 'is-saved' : ''}`}
              onClick={() => onToggleSave(scheme)}
            >
              <span>{isSaved ? `✓ ${t('Scheme Saved')}` : t('Save to My Profile')}</span>
            </button>
          </div>

          <div className="footer-right">
            {scheme.link && (
              <a
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-modal-link"
              >
                <span>{t('Official Portal')}</span>
                <span>↗</span>
              </a>
            )}
            <button type="button" className="btn-modal-close-action" onClick={onClose}>
              {t('Close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
