'use client';

import { useState, useRef } from 'react';
import { Mic, Image as ImageIcon, Send, Loader2, X, AlertTriangle, FileText, Zap } from 'lucide-react';
import styles from '../app/components.module.css';

/**
 * Interface that bridges messy human input into structured action data.
 * @param {Object} props
 * @param {function(Object): void} props.onResult - Callback invoked upon successfully receiving structured data from the analyzer API.
 * @returns {JSX.Element} The rendered InputBridge component.
 */
export default function InputBridge({ onResult }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const simulateFranticVoice = () => {
    setText("Oh my god, please help! There's a massive car crash on I-5 North near exit 14. Two cars are crushed, I think someone is bleeding badly from their head! Hurry, we need an ambulance now! The cars are leaking gas too!");
  };

  const simulateMedicalRecord = () => {
    setText("Patient: John Doe. Age: 45. Known allergies: Penicillin. Current presentation: Severe chest pain, diaphoresis, shortness of breath radiating to left arm. EKG shows STEMI. BP: 160/95. HR: 110.");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    processImageFile(file);
  };

  const processImageFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({
          data: reader.result,
          mimeType: file.type,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer?.files[0];
    processImageFile(file);
  };

  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text && !image) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          imageBase64: image ? image.data : null,
          mimeType: image ? image.mimeType : null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        onResult(data);
      } else {
        setError(data.error || 'Failed to process input');
      }
    } catch (err) {
      console.error(err);
      setError('A network error occurred while communicating with the bridge.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`glass-panel ${styles.card}`}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          <Zap size={20} color="#4f8cff" />
          Input Bridge
        </h2>
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          Multi-modal
        </span>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
        Paste chaotic text, drag-and-drop images, or simulate voice transcripts. 
        Gemini processes it all.
      </p>

      {error && (
        <div className={styles.errorBanner}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Textarea with drag-drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            transition: 'var(--transition-fast)',
            ...(isDragOver ? {
              boxShadow: '0 0 0 2px rgba(79, 140, 255, 0.5), inset 0 0 20px rgba(79, 140, 255, 0.05)',
            } : {}),
          }}
        >
          <textarea
            className={styles.textarea}
            placeholder="Type or paste unstructured information here... frantic voice transcripts, medical records, accident reports..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            aria-label="Unstructured input for AI processing"
            style={{
              ...(isDragOver ? { borderColor: 'var(--accent-blue)' } : {}),
            }}
          />
          {isDragOver && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(79, 140, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              border: '2px dashed rgba(79, 140, 255, 0.4)',
              pointerEvents: 'none',
            }}>
              <p style={{ color: '#4f8cff', fontWeight: 600, fontSize: '0.9rem' }}>
                Drop image here
              </p>
            </div>
          )}
        </div>

        {/* Image preview */}
        {image && (
          <div className={styles.imagePreview}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.data} alt="Upload preview" className={styles.imagePreviewImg} />
            <button
              type="button"
              onClick={clearImage}
              className={styles.imagePreviewClose}
              aria-label="Remove uploaded image"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Action buttons row */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={() => fileInputRef.current.click()}
            aria-label="Attach an image file"
          >
            <ImageIcon size={15} /> Attach Image
          </button>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={styles.btnGhost}
            onClick={simulateFranticVoice}
          >
            <Mic size={15} /> 911 Call
          </button>

          <button
            type="button"
            className={styles.btnGhost}
            onClick={simulateMedicalRecord}
          >
            <FileText size={15} /> Medical Record
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={styles.btnPrimary}
          disabled={loading || (!text && !image)}
          style={{ width: '100%', padding: '1rem' }}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Analyzing with Gemini...
            </>
          ) : (
            <>
              <Send size={18} />
              Bridge to Action
            </>
          )}
        </button>
      </form>
    </div>
  );
}
