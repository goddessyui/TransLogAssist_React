import React, { useState, useCallback } from 'react';
import { UploadCloudIcon } from './IconComponents';

interface UploadFormProps {
  onFilesSelected: (files: FileList) => void;
  isProcessing: boolean;
  progress: { current: number, total: number } | null;
  lastCopied: string;
}

const accentColor = '#35C5CF';

export const UploadForm: React.FC<UploadFormProps> = ({ onFilesSelected, isProcessing, progress, lastCopied }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  }, [onFilesSelected]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      // Reset the input value to allow re-selecting the same file(s)
      e.target.value = '';
    }
  };
  

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '1rem' }}> {/* Reduced from 1.5rem */}
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', lineHeight: '1.2' }}> {/* Reduced from 1.75rem */}
          Fast file logs
        </h1>
        <p style={{ color: '#4b5563', maxWidth: '42rem', margin: '0.5rem auto 0', fontSize: '1rem', lineHeight: 1.5, visibility: lastCopied ? 'hidden' : 'visible' }}>
          Upload audio files to automatically extract their names and durations, ready to be copied into your log.
        </p>
      </div>

      {isProcessing ? (
        <div className="processing-container">
            {progress && progress.total > 0 ? (
                <>
                    <div className="progress-bar-bg">
                        <div 
                            className="progress-bar-fg"
                            style={{ width: `${(progress.current / progress.total) * 100}%` }}>
                        </div>
                    </div>
                    <p className="processing-text">
                        Processing file {progress.current} of {progress.total}...
                    </p>
                </>
            ) : (
                <>
                    <div className="spinner"></div>
                    <p className="processing-text" style={{ marginTop: '1rem' }}>Preparing files...</p>
                </>
            )}
        </div>
      ) : (
        <form style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <input 
            type="file" 
            id="audioFiles" 
            name="audioFiles[]" 
            multiple 
            accept=".m4a,.mp3,.wav,.ogg,.flac" 
            required 
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <label 
            htmlFor="audioFiles"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`dropzone ${isDragging ? 'dragging' : ''}`}
          >
            <div className="dropzone-icon-container">
              <UploadCloudIcon />
            </div>
            <div style={{ color: '#4b5563' }}>
              <strong style={{ color: accentColor, fontWeight: '600' }}>Click to upload</strong> or drag & drop
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Supports .m4a, .mp3, .wav, and more</div>
            </div>
          </label>
        </form>
      )}
      <style>{`
        .processing-container {
          padding: 2rem 0; /* Adjusted from 2.5rem */
          min-height: 180px; /* Reduced from 220px */
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex: 1; /* Allow to grow in height */
        }
        .progress-bar-bg {
          width: 100%;
          background-color: #e5e7eb;
          border-radius: 9999px;
          height: 0.625rem;
          max-width: 28rem;
          margin: 0 auto;
        }
        .progress-bar-fg {
          background-color: ${accentColor};
          height: 0.625rem;
          border-radius: 9999px;
          transition: width 0.3s ease-in-out;
        }
        .processing-text {
          color: #047481;
          font-weight: 500;
          margin-top: 1rem;
        }
        .spinner {
          width: 3rem;
          height: 3rem;
          border: 4px dashed ${accentColor};
          border-radius: 50%;
          animation: spin 1.5s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem; /* Reduced from 2rem */
          border: 2px dashed #9ca3af;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: background-color 0.3s, border-color 0.3s;
          min-height: 180px; /* Reduced from 220px */
          flex: 1; /* Allow to grow in height */
        }
        .dropzone:hover {
          border-color: ${accentColor};
          background-color: #DBEFF5;
        }
        .dropzone.dragging {
          border-color: ${accentColor};
          background-color: #DBEFF5;
        }
        .dropzone-icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 4rem;
          height: 4rem;
          background-color: #DBEFF5;
          border-radius: 50%;
          margin-bottom: 1rem;
          box-shadow: 0 0 0 8px #fff; /* Simulates ring */
        }
      `}</style>
    </div>
  );
};