'use client';

import { Activity, MapPin, CheckSquare, PackagePlus, AlertOctagon, HeartPulse, Siren, Clock } from 'lucide-react';
import styles from '../app/components.module.css';

/**
 * Represents the structured verification and actionable UI extracted from Gemini.
 * @param {Object} props
 * @param {Object|null} props.data - The parsed structured data payload, containing crisis info and actions.
 * @returns {JSX.Element} The rendered ActionDashboard component.
 */
export default function ActionDashboard({ data }) {
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

  return (
    <div className={`glass-panel animate-fade-in ${styles.card}`} style={{
      ...(isCritical ? {
        borderColor: 'rgba(255, 77, 106, 0.2)',
        boxShadow: '0 0 30px rgba(255, 77, 106, 0.08)',
      } : {}),
    }}>

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
      <div style={{ width: '100%' }}>
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
          <p style={{ fontSize: '1.05rem', fontWeight: 600, marginTop: '0.25rem' }}>{data.extractedLocation || 'Not specified'}</p>
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
          <CheckSquare size={16} color="var(--accent-green)" /> Immediate Actions
        </h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {data.actionableSteps?.map((step, idx) => (
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
              <span style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{step}</span>
            </li>
          ))}
        </ul>
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
        <button className={styles.btnEmergency} style={{ flex: 1.4, padding: '0.875rem' }}>
          <Siren size={16} /> Confirm & Dispatch
        </button>
        <button className={styles.btnGhost} style={{ flex: 1, padding: '0.875rem', justifyContent: 'center' }}>
          Modify Plan
        </button>
      </div>
    </div>
  );
}
