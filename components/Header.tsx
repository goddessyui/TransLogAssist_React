import React from 'react';
import { SoundIcon, InfoIcon } from '@/components/IconComponents';

interface HeaderProps {
    onInfoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onInfoClick }) => {
  return (
    <header style={{ 
      padding: '1rem', /* Reduced from 1.5rem */
      borderBottom: '1px solid #DBEFF5', 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <SoundIcon />
        <div>
          <h3 style={{ 
            fontSize: '1.125rem', 
            lineHeight: '1.75rem',
            fontWeight: '700', 
            color: '#35C5CF', 
            letterSpacing: '-0.025em',
            margin: 0
          }}>
            TransLog Assist
          </h3>
          <p style={{ 
            fontSize: '0.8125rem', 
            lineHeight: '1.25rem',
            color: '#64748b',
            margin: 0
          }}>
            Quick Audio Logging Tool
          </p>
        </div>
      </div>
      <button 
        onClick={onInfoClick}
        aria-label="Show app information"
        className="info-button"
      >
        <InfoIcon />
      </button>
      <style>{`
        .info-button {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #64748b;
          padding: 0.5rem;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s, color 0.2s;
        }
        .info-button:hover {
          background-color: #DBEFF5;
          color: #35C5CF;
        }
      `}</style>
    </header>
  );
};