'use client';

import { useState } from 'react';
import InputBridge from '../components/InputBridge';
import ActionDashboard from '../components/ActionDashboard';
import { Shield, Zap, Brain, Activity, ArrowRight } from 'lucide-react';

export default function Home() {
  const [structuredData, setStructuredData] = useState(null);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>

      {/* ===== HERO NAVBAR ===== */}
      <nav aria-label="Primary navigation" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f8cff, #a78bfa)',
            padding: '0.625rem',
            borderRadius: '0.875rem',
            boxShadow: '0 0 20px rgba(79, 140, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Shield size={26} color="#fff" />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              margin: 0,
              lineHeight: 1.2,
            }}>
              Lifeline<span style={{ color: '#4f8cff' }}>Core</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Powered by Google Gemini
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.85rem',
            background: 'rgba(6, 214, 160, 0.1)',
            border: '1px solid rgba(6, 214, 160, 0.25)',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#06d6a0',
          }}>
            <span aria-hidden="true" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#06d6a0', boxShadow: '0 0 6px #06d6a0' }}></span>
            <span>System Active</span>
          </span>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem 2rem 3rem',
        textAlign: 'center',
      }}>
        <div className="animate-fade-in" style={{ marginBottom: '1rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            background: 'rgba(79, 140, 255, 0.08)',
            border: '1px solid rgba(79, 140, 255, 0.2)',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 500,
            color: '#4f8cff',
            marginBottom: '1.5rem',
          }}>
            <Zap size={14} /> Google Hackathon 2026
          </span>
        </div>

        <h2 className="animate-fade-in" style={{
          fontSize: 'clamp(2rem, 5vw, 3.25rem)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1.15,
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #f0f0f8 0%, #9898b0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          From Chaos to<br />
          <span style={{
            background: 'linear-gradient(135deg, #4f8cff 0%, #a78bfa 50%, #06d6a0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Structured Action</span>
        </h2>

        <p className="animate-fade-in" style={{
          color: 'var(--text-secondary)',
          fontSize: '1.05rem',
          maxWidth: '600px',
          margin: '0 auto 2rem',
          lineHeight: 1.7,
        }}>
          Feed in frantic voice transcripts, messy medical records, or chaotic scene descriptions. 
          Our AI instantly converts them into verified, life-saving action plans.
        </p>

        {/* Feature pills */}
        <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {[
            { icon: <Brain size={14} />, label: 'Gemini AI Analysis' },
            { icon: <Activity size={14} />, label: 'Crisis Triage' },
            { icon: <ArrowRight size={14} />, label: 'Instant Dispatch' },
          ].map((item, i) => (
            <span key={i} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-color)',
              borderRadius: '999px',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
            }}>
              {item.icon} {item.label}
            </span>
          ))}
        </div>
      </section>

      {/* ===== MAIN CONTENT GRID ===== */}
      <main id="main-content" role="main" aria-label="Emergency triage interface" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 2rem 4rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}>

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <InputBridge onResult={setStructuredData} />

            {/* How it works card */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '0.875rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                <Brain size={14} /> How it works
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { num: '01', text: 'Input any messy, unstructured data — voice, text, or images' },
                  { num: '02', text: 'Gemini AI processes and extracts structured emergency intel' },
                  { num: '03', text: 'Get an instant action plan with severity, location, and steps' },
                ].map((step, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'flex-start',
                  }}>
                    <span style={{
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      color: '#4f8cff',
                      minWidth: '24px',
                    }}>{step.num}</span>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5,
                    }}>{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ minHeight: '500px' }}>
            <ActionDashboard data={structuredData} />
          </div>

        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer role="contentinfo" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '2rem',
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
      }}>
        <p>Built with Google Gemini AI · Lifeline Core © 2026</p>
      </footer>
    </div>
  );
}
