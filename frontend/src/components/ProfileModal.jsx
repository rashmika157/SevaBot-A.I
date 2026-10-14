import { useState, useEffect } from 'react'
import { useLanguage } from '../LanguageContext'
import './ProfileModal.css'

export default function ProfileModal({
  isOpen,
  onClose,
  initialTab = 'saved',
  userProfile,
  onSaveProfile,
  onResetProfile,
  savedSchemes,
  onRemoveScheme,
  onViewScheme,
  onOpenSchemeDetails,
  onExploreSchemes,
  isLoadingSaved,
  isLoadingSchemes,
  schemesError,
  onRefreshBackend,
  onRefreshSchemes,
}) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [isEditing, setIsEditing] = useState(false)

  // Profile form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    address: '',
    pin: '',
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState(null)
  const [profileError, setProfileError] = useState(null)

  // Sync tab with initialTab when opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab)
      setProfileMsg(null)
      setProfileError(null)
    }
  }, [isOpen, initialTab])

  // Populate form from userProfile
  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        age: userProfile.age || '',
        address: userProfile.address || '',
        pin: userProfile.pin || '',
      })
      if (!userProfile.phone) {
        setIsEditing(true)
      } else {
        setIsEditing(false)
      }
    } else {
      setIsEditing(true)
    }
  }, [userProfile, isOpen])

  if (!isOpen) return null

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    const phoneClean = formData.phone.trim()

    if (!phoneClean) {
      setProfileError('Phone number is required to save your profile in the database.')
      return
    }

    setProfileSaving(true)
    setProfileError(null)
    setProfileMsg(null)

    try {
      await onSaveProfile({
        name: formData.name.trim(),
        phone: phoneClean,
        age: formData.age.trim(),
        address: formData.address.trim(),
        pin: formData.pin.trim(),
      })

      setProfileMsg('Profile saved successfully to SQLite database!')
      setIsEditing(false)
      setTimeout(() => {
        setProfileMsg(null)
      }, 3500)
    } catch (err) {
      setProfileError(err.message || 'Failed to save profile to backend.')
    } finally {
      setProfileSaving(false)
    }
  }

  const userInitial = (userProfile?.name || formData.name || '').trim().charAt(0).toUpperCase()

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="profile-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="profile-modal-header">
          <div className="header-left">
            <div className="avatar-circle">
              {userInitial ? (
                userInitial
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="modal-title">
                {userProfile?.name ? userProfile.name : t('Citizen Profile')}
              </h2>
              <span className="modal-subtitle">
                {userProfile?.phone ? userProfile.phone : t('No phone linked yet')}
              </span>
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

        {/* Tab Navigation */}
        <div className="modal-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <span>{t('Saved Schemes')}</span>
            <span className="tab-badge">{savedSchemes.length}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span>{t('User Profile')}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="profile-modal-body">
          {/* TAB 1: SAVED SCHEMES */}
          {activeTab === 'saved' && (
            <div className="saved-schemes-tab">
              {/* Controls bar */}
              <div className="tab-meta-bar">
                <span className="tab-count-label">
                  {t('Showing')} {savedSchemes.length} {savedSchemes.length === 1 ? t('saved scheme') : t('saved schemes')}
                </span>
                {userProfile?.phone && (
                  <button
                    type="button"
                    className="sync-refresh-btn"
                    onClick={onRefreshSchemes}
                    disabled={isLoadingSchemes}
                    title={t('Sync Backend')}
                  >
                    {isLoadingSchemes ? t('Syncing...') : t('Sync Backend')}
                  </button>
                )}
              </div>

              {/* Loading State */}
              {isLoadingSchemes && (
                <div className="tab-status-card loading-state">
                  <div className="mini-spinner"></div>
                  <p>{t('Retrieving your saved schemes from SevaBot backend...')}</p>
                </div>
              )}

              {/* Error State */}
              {!isLoadingSchemes && schemesError && (
                <div className="tab-status-card error-state">
                  <div>
                    <p className="status-text">{schemesError}</p>
                    <button
                      type="button"
                      className="tab-action-link"
                      onClick={onRefreshSchemes}
                    >
                      {t('Try Again')}
                    </button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isLoadingSchemes && savedSchemes.length === 0 && (
                <div className="tab-empty-card">
                  <h3 className="empty-heading">{t('No saved schemes yet')}</h3>
                  <p className="empty-description">
                    {t("You haven't saved any government schemes yet. Explore our verified schemes catalog and click “Save Scheme” on any scheme you wish to track.")}
                  </p>
                  <button
                    type="button"
                    className="btn-modal-primary"
                    onClick={() => {
                      onClose()
                      onExploreSchemes?.()
                    }}
                  >
                    {t('Browse Schemes')}
                  </button>
                </div>
              )}

              {/* Saved Schemes List */}
              {!isLoadingSchemes && savedSchemes.length > 0 && (
                <div className="saved-schemes-list">
                  {savedSchemes.map((scheme) => (
                    <div key={scheme.id || scheme.name} className="saved-scheme-card">
                      <div className="saved-scheme-header">
                        <div className="scheme-header-tags">
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
                        <span className="status-badge status-applied">
                          {t(scheme.status || 'Applied')}
                        </span>
                      </div>

                      <h4 className="saved-scheme-name">{t(scheme.name)}</h4>

                      <p className="saved-scheme-benefits">
                        {t(scheme.benefits) || t(scheme.description) || scheme.benefits || scheme.description || t('No description provided.')}
                      </p>

                      {/* Required Documents Pills */}
                      {scheme.documents && scheme.documents.length > 0 && (
                        <div className="saved-scheme-docs">
                          <span className="docs-label">{t('Required Documents:')}</span>
                          <div className="docs-pills">
                            {scheme.documents.slice(0, 3).map((doc, i) => (
                              <span key={i} className="doc-pill">
                                {t(doc)}
                              </span>
                            ))}
                            {scheme.documents.length > 3 && (
                              <span className="doc-pill more-pill">
                                +{scheme.documents.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="saved-scheme-footer">
                        <span className="scheme-location">{t(scheme.state || 'All India')}</span>
                        <div className="saved-scheme-actions">
                          <button
                            type="button"
                            className="btn-scheme-delete"
                            onClick={() => onRemoveScheme(scheme.name)}
                            title={t('Remove from saved schemes')}
                          >
                            {t('Remove')}
                          </button>
                          <button
                            type="button"
                            className="btn-scheme-details"
                            onClick={() => onOpenSchemeDetails(scheme)}
                          >
                            {t('View Details ↗')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: USER PROFILE */}
          {activeTab === 'profile' && (
            <div className="user-profile-tab">
              {profileMsg && (
                <div className="profile-alert success-alert">
                  <span>✓</span>
                  <span>{profileMsg}</span>
                </div>
              )}

              {profileError && (
                <div className="profile-alert error-alert">
                  <span>{profileError}</span>
                </div>
              )}

              {!isEditing && userProfile?.phone ? (
                /* Profile Summary View */
                <div className="profile-view-box">
                  <div className="profile-hero-card">
                    <div className="profile-hero-avatar">
                      {userInitial ? (
                        userInitial
                      ) : (
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      )}
                    </div>
                    <div className="profile-hero-info">
                      <h3 className="profile-hero-name">{userProfile.name || t('Citizen')}</h3>
                      <p className="profile-hero-phone">{t('Phone:')} {userProfile.phone}</p>
                    </div>
                    <div className="profile-hero-actions">
                      <button
                        type="button"
                        className="btn-edit-profile"
                        onClick={() => setIsEditing(true)}
                      >
                        {t('Edit Profile')}
                      </button>
                      <button
                        type="button"
                        className="btn-signout-profile"
                        onClick={() => {
                          onResetProfile?.()
                          setIsEditing(true)
                          setFormData({
                            name: '',
                            phone: '',
                            age: '',
                            address: '',
                            pin: '',
                          })
                        }}
                        title={t('Sign Out')}
                      >
                        {t('Sign Out')}
                      </button>
                    </div>
                  </div>

                  <div className="profile-details-grid">
                    <div className="profile-info-item">
                      <span className="info-label">{t('Full Name')}</span>
                      <span className="info-value">{userProfile.name || t('Not provided')}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="info-label">{t('Phone Number')}</span>
                      <span className="info-value">{userProfile.phone}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="info-label">{t('Age')}</span>
                      <span className="info-value">
                        {userProfile.age ? `${userProfile.age} ${t('Years')}` : t('Not provided')}
                      </span>
                    </div>
                    <div className="profile-info-item">
                      <span className="info-label">{t('Address / State')}</span>
                      <span className="info-value">{userProfile.address || t('Not provided')}</span>
                    </div>
                    <div className="profile-info-item">
                      <span className="info-label">{t('PIN Code')}</span>
                      <span className="info-value">{userProfile.pin || t('Not provided')}</span>
                    </div>
                  </div>

                  <div className="profile-sync-note">
                    <p>
                      Your profile is linked to phone <strong>{userProfile.phone}</strong> and synced with the SevaBot SQLite database. Saved schemes automatically link to your phone number.
                    </p>
                  </div>
                </div>
              ) : (
                /* Profile Edit / Create Form */
                <form className="profile-edit-form" onSubmit={handleProfileSubmit}>
                  <p className="form-intro-text">
                    {t('Enter your details below to save your profile to the backend database and automatically synchronize your saved schemes.')}
                  </p>

                  <div className="form-group">
                    <label htmlFor="input-name" className="form-label">
                      {t('Full Name')}
                    </label>
                    <input
                      id="input-name"
                      type="text"
                      name="name"
                      className="form-input"
                      placeholder={t('Enter your full name')}
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="input-phone" className="form-label">
                      {t('Phone Number')} <span className="required-star">*</span>
                    </label>
                    <input
                      id="input-phone"
                      type="tel"
                      name="phone"
                      className="form-input"
                      placeholder={t('Enter 10-digit mobile number')}
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="input-hint">
                      {t('Used as your unique citizen ID to save schemes in the database.')}
                    </span>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="input-age" className="form-label">
                        {t('Age')}
                      </label>
                      <input
                        id="input-age"
                        type="number"
                        name="age"
                        className="form-input"
                        placeholder={t('Age in years')}
                        min="1"
                        max="120"
                        value={formData.age}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="input-pin" className="form-label">
                        {t('PIN Code')}
                      </label>
                      <input
                        id="input-pin"
                        type="text"
                        name="pin"
                        className="form-input"
                        placeholder={t('6-digit PIN code')}
                        maxLength="6"
                        value={formData.pin}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="input-address" className="form-label">
                      {t('Address / District / State')}
                    </label>
                    <input
                      id="input-address"
                      type="text"
                      name="address"
                      className="form-input"
                      placeholder={t('City, State / District')}
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-actions-row">
                    {userProfile?.phone && (
                      <button
                        type="button"
                        className="btn-form-cancel"
                        onClick={() => setIsEditing(false)}
                        disabled={profileSaving}
                      >
                        {t('Cancel')}
                      </button>
                    )}
                    <button
                      type="submit"
                      className="btn-modal-primary"
                      disabled={profileSaving || !formData.phone.trim()}
                    >
                      {profileSaving ? t('Saving to Database...') : t('Save Profile')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
