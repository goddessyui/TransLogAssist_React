import React, { useState, useEffect } from 'react';

interface InactivityWarningModalProps {
  onContinue: () => void;
  onClear: () => void;
  countdownSeconds: number;
}

export const InactivityWarningModal: React.FC<InactivityWarningModalProps> = ({ onContinue, onClear, countdownSeconds }) => {
  const [countdown, setCountdown] = useState(countdownSeconds);

  useEffect(() => {
    if (countdown <= 0) {
      onClear();
      return;
    }
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, onClear]);

  return (
    <div className="modal-overlay">
      <div className="modal-content" role="alertdialog" aria-modal="true" aria-labelledby="inactivity-title">
        <h2 id="inactivity-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>Session Expiring</h2>
        <p style={{ color: '#475569', marginBottom: '1.5rem' }}>
          For security, the file list will be cleared due to inactivity. This helps protect potentially sensitive information.
        </p>
        <div className="countdown-box">
          <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#35C5CF', margin: 0 }}>
            Clearing in {countdown} second{countdown !== 1 ? 's' : ''}...
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            onClick={onClear}
            className="modal-btn clear-btn"
          >
            Clear Now
          </button>
          <button
            onClick={onContinue}
            className="modal-btn continue-btn"
            autoFocus
          >
            Continue Session
          </button>
        </div>
      </div>
       <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          animation: fade-in-fast 0.2s ease-out forwards;
        }
        .modal-content {
          background-color: #fff;
          border-radius: 0.75rem;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
          padding: 2rem;
          max-width: 28rem;
          width: 100%;
          margin: 1rem;
          border: 1px solid #DBEFF5;
        }
        .countdown-box {
          text-align: center;
          margin-bottom: 1.5rem;
          background-color: #f8fafc;
          padding: 1rem;
          border-radius: 0.5rem;
        }
        .modal-btn {
          padding: 0.5rem 1rem;
          font-weight: 600;
          border-radius: 0.5rem;
          transition: background-color 0.2s;
          border: none;
          cursor: pointer;
        }
        .clear-btn {
          background-color: #EDEDF1;
          color: #334155;
        }
        .clear-btn:hover {
          background-color: #E0E0E2;
        }
        .continue-btn {
          padding: 0.5rem 1.5rem;
          background-color: #35C5CF;
          color: #fff;
        }
        .continue-btn:hover {
          background-color: #2BA9B3;
        }
        @keyframes fade-in-fast {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};