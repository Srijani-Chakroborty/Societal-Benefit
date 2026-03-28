'use client';

import { useState } from 'react';
import { Activity, MapPin, CheckSquare, PackagePlus, HeartPulse, Siren, Clock, X, Plus, Trash2, Check } from 'lucide-react';
import styles from '../app/components.module.css';

/**
 * Represents the structured verification and actionable UI extracted from Gemini.
 * @param {Object} props
 * @param {Object|null} props.data - The parsed structured data payload, containing crisis info and actions.
 * @returns {JSX.Element} The rendered ActionDashboard component.
 */
export default function ActionDashboard({ data }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableSteps, setEditableSteps] = useState([]);
  const [editableLocation, setEditableLocation] = useState('');
  const [newStep, setNewStep] = useState('');
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  /** Enter edit mode and copy current steps into editable state. */
  const startEditing = () => {
    setEditableSteps([...(data?.actionableSteps || [])]);
    setEditableLocation(data?.extractedLocation || '');
    setIsEditing(true);
  };

  /** Save edited steps back (in a real app this would call an API). */
  const saveEdits = () => {
    if (data) {
      data.actionableSteps = [...editableSteps];
      data.extractedLocation = editableLocation;
    }
    setIsEditing(false);
  };

  /** Add a new step to the editable list. */
  const addStep = () => {
    const trimmed = newStep.trim();
    if (trimmed && editableSteps.length < 10) {
      setEditableSteps([...editableSteps, trimmed]);
      setNewStep('');
    }
  };

  /** Remove a step by index. */
  const removeStep = (idx) => {
    setEditableSteps(editableSteps.filter((_, i) => i !== idx));
  };

  /** Handle confirm dispatch. */
  const handleDispatch = () => {
    setDispatched(true);
    setTimeout(() => {
      setShowDispatchModal(false);
      setDispatched(false);
    }, 3000);
  };

  if (!data) {
    return (
      <div className={`glass-panel ${styles.card}`} style={{
        height: '100%',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'var(--text-muted)',
      }}>
        <div className="animate-float" style={{ maxWidth: '280px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(79, 140, 255, 0.08)',
            border: '1px solid rgba(79, 140, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <Activity size={28} style={{ opacity: 0.6, color: '#4f8cff' }} />
          </div>
          <p style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Awaiting Input
          </p>
          <p style={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
            Submit chaotic data through the Input Bridge.<br />
            The structured response will appear here.
          </p>
        </div>
      </div>
    );
  }

  // Determine badge styling based on crisis level
  let badgeClass = styles.badgeMedical;
  let crisisLabel = 'Low';
  if (data.crisisLevel === 5) { badgeClass = `${styles.badgeCritical} ${styles.badgePulse}`; crisisLabel = 'Critical'; }
  else if (data.crisisLevel === 4) { badgeClass = styles.badgeFire; crisisLabel = 'High'; }
  else if (data.crisisLevel === 3) { badgeClass = styles.badgeMedical; crisisLabel = 'Medium'; }
  else if (data.crisisLevel <= 2) { badgeClass = styles.badgePolice; crisisLabel = 'Low'; }

  const isCritical = data.crisisLevel >= 4;
  const displaySteps = isEditing ? editableSteps : (data.actionableSteps || []);

  return (
    <>
      <div
        className={`glass-panel animate-fade-in ${styles.card}`}
        role="region"
        aria-label="Emergency action plan"
        aria-live="polite"
        style={{
          ...(isCritical ? {
            borderColor: 'rgba(255, 77, 106, 0.2)',
            boxShadow: '0 0 30px rgba(255, 77, 106, 0.08)',
          } : {}),
        }}
      >

        {/* Header */}
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle} style={{
            color: isCritical ? 'var(--accent-red)' : 'var(--text-primary)',
          }}>
            {isCritical ? <Siren size={22} /> : <Activity size={22} />}
            Action Plan
          </h2>
          <span className={`${styles.badge} ${badgeClass}`}>
            L{data.crisisLevel} · {crisisLabel}
          </span>
        </div>

        {/* Crisis meter bar */}
        <div role="meter" aria-label="Crisis severity level" aria-valuenow={data.crisisLevel} aria-valuemin={1} aria-valuemax={5} style={{ width: '100%' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.4rem',
          }}>
            <span className={styles.label}>Crisis Severity</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: isCritical ? 'var(--accent-red)' : 'var(--accent-blue)' }}>
              {data.crisisLevel}/5
            </span>
          </div>
          <div style={{
            height: '4px',
            borderRadius: '2px',
            background: 'rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${(data.crisisLevel / 5) * 100}%`,
              borderRadius: '2px',
              background: isCritical
                ? 'linear-gradient(90deg, #ff4d6a, #e11d48)'
                : 'linear-gradient(90deg, #4f8cff, #06d6a0)',
              transition: 'width 0.6s ease-out',
            }} />
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className={styles.statCard}>
            <p className={styles.label}>
              <Clock size={11} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              Incident Type
            </p>
            <p style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: '0.25rem' }}>{data.incidentType}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.label}>
              <MapPin size={11} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              Location
            </p>
            {isEditing ? (
              <input
                type="text"
                value={editableLocation}
                onChange={(e) => setEditableLocation(e.target.value)}
                placeholder="Enter location"
                aria-label="Edit location"
                style={{
                  width: '100%',
                  marginTop: '0.25rem',
                  padding: '0.4rem',
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  fontSize: '0.95rem',
                }}
              />
            ) : (
              <p style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: '0.25rem' }}>{data.extractedLocation || 'Not specified'}</p>
            )}
          </div>
        </div>

        {/* Medical intel */}
        {data.medicalSummary && (
          <div className={styles.medicalBox}>
            <p className={styles.label} style={{ color: 'var(--accent-red)', marginBottom: '0.4rem' }}>
              <HeartPulse size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              Medical Intel
            </p>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{data.medicalSummary}</p>
          </div>
        )}

        {/* Actionable steps */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h3 style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-secondary)',
            }}>
              <CheckSquare size={16} color="var(--accent-green)" /> Immediate Actions
            </h3>
            {isEditing && (
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)' }}>
                {editableSteps.length}/10 steps
              </span>
            )}
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {displaySteps.map((step, idx) => (
              <li
                key={idx}
                className={styles.stepItem}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <span style={{
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  color: 'var(--accent-green)',
                  minWidth: '20px',
                }}>{idx + 1}.</span>
                <span style={{ fontSize: '0.9rem', lineHeight: 1.5, flex: 1 }}>{step}</span>
                {isEditing && (
                  <button
                    onClick={() => removeStep(idx)}
                    aria-label={`Remove step ${idx + 1}`}
                    style={{
                      background: 'rgba(255, 77, 106, 0.1)',
                      border: '1px solid rgba(255, 77, 106, 0.3)',
                      borderRadius: '6px',
                      padding: '4px 6px',
                      cursor: 'pointer',
                      color: 'var(--accent-red)',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'var(--transition-fast)',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* Add new step input (visible only in edit mode) */}
          {isEditing && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <input
                type="text"
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addStep())}
                placeholder="Add a new action step..."
                aria-label="New action step"
                style={{
                  flex: 1,
                  padding: '0.6rem 0.875rem',
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  fontSize: '0.85rem',
                }}
              />
              <button
                onClick={addStep}
                disabled={!newStep.trim()}
                aria-label="Add step"
                style={{
                  padding: '0.6rem 0.875rem',
                  background: 'rgba(6, 214, 160, 0.15)',
                  border: '1px solid rgba(6, 214, 160, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  cursor: newStep.trim() ? 'pointer' : 'not-allowed',
                  color: 'var(--accent-green)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  opacity: newStep.trim() ? 1 : 0.4,
                }}
              >
                <Plus size={16} /> Add
              </button>
            </div>
          )}
        </div>

        {/* Required resources */}
        {data.requiredResources && data.requiredResources.length > 0 && (
          <div>
            <h3 style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-secondary)',
            }}>
              <PackagePlus size={16} color="var(--accent-blue)" /> Dispatch Resources
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {data.requiredResources.map((res, idx) => (
                <span key={idx} className={styles.resourceChip}>
                  {res}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action footer */}
        <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', gap: '0.75rem' }}>
          <button
            className={styles.btnEmergency}
            style={{ flex: 1.4, padding: '0.875rem' }}
            onClick={() => setShowDispatchModal(true)}
          >
            <Siren size={16} /> Confirm & Dispatch
          </button>

          {isEditing ? (
            <button
              className={styles.btnGhost}
              style={{ flex: 1, padding: '0.875rem', justifyContent: 'center', borderColor: 'rgba(6, 214, 160, 0.3)', color: 'var(--accent-green)' }}
              onClick={saveEdits}
            >
              <Check size={16} /> Save Changes
            </button>
          ) : (
            <button
              className={styles.btnGhost}
              style={{ flex: 1, padding: '0.875rem', justifyContent: 'center' }}
              onClick={startEditing}
            >
              Modify Plan
            </button>
          )}
        </div>
      </div>

      {/* ===== DISPATCH CONFIRMATION MODAL ===== */}
      {showDispatchModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dispatch-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeInUp 0.3s ease-out',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !dispatched) setShowDispatchModal(false);
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '480px',
              width: '90%',
              padding: '2rem',
              position: 'relative',
              animation: 'fadeInUp 0.3s ease-out',
            }}
          >
            {/* Close button */}
            {!dispatched && (
              <button
                onClick={() => setShowDispatchModal(false)}
                aria-label="Close dialog"
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            )}

            {dispatched ? (
              /* Success state */
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(6, 214, 160, 0.15)',
                  border: '2px solid var(--accent-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  animation: 'fadeInUp 0.3s ease-out',
                }}>
                  <Check size={32} color="var(--accent-green)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-green)' }}>
                  Dispatch Confirmed!
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Emergency resources have been notified. A {data.incidentType} response team
                  is being dispatched to <strong>{data.extractedLocation || 'the reported location'}</strong>.
                </p>
              </div>
            ) : (
              /* Confirmation state */
              <>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(255, 77, 106, 0.12)',
                    border: '2px solid var(--accent-red)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                  }}>
                    <Siren size={28} color="var(--accent-red)" />
                  </div>
                  <h3 id="dispatch-modal-title" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Confirm Emergency Dispatch
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    You are about to dispatch the following resources for a
                    <strong style={{ color: isCritical ? 'var(--accent-red)' : 'var(--accent-blue)' }}>
                      {' '}Level {data.crisisLevel} {data.incidentType}
                    </strong> incident.
                  </p>
                </div>

                {/* Summary */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--border-color)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className={styles.label}>Location</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{data.extractedLocation || 'Not specified'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className={styles.label}>Actions</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{data.actionableSteps?.length || 0} steps</span>
                  </div>
                  {data.requiredResources?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                      {data.requiredResources.map((res, idx) => (
                        <span key={idx} className={styles.resourceChip} style={{ fontSize: '0.75rem' }}>
                          {res}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    className={styles.btnGhost}
                    style={{ flex: 1, padding: '0.875rem', justifyContent: 'center' }}
                    onClick={() => setShowDispatchModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.btnEmergency}
                    style={{ flex: 1.4, padding: '0.875rem' }}
                    onClick={handleDispatch}
                  >
                    <Siren size={16} /> Dispatch Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
