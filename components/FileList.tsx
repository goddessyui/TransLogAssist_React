
import React, { useMemo } from 'react';
import type { AudioFile, SortOption } from '@/types';
import { CopyIcon, GoBackIcon } from './IconComponents';

interface FileListProps {
  files: AudioFile[];
  onCopyAndClear: () => void;
  sortOrder: SortOption;
  onSortChange: (newOrder: SortOption) => void;
  // Removed onReorder as manual mode is deprecated
  // onReorder: (files: AudioFile[]) => void;
  onStartOver: () => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onCopyAndClear, sortOrder, onSortChange, onStartOver }) => {
  // Removed drag-and-drop state as manual mode is deprecated
  // const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  // const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const { formattedTotalDuration } = useMemo(() => {
    const totalSeconds = files.reduce((acc, file) => acc + file.durationInSeconds, 0);
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return {
      formattedTotalDuration: `${h}:${m}:${s}`
    };
  }, [files]);

  // Removed drag-and-drop handlers as manual mode is deprecated
  // const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
  //   if (sortOrder !== 'manual') return;
  //   e.dataTransfer.setData('text/plain', index.toString());
  //   e.dataTransfer.effectAllowed = 'move';
  //   setTimeout(() => {
  //     setDraggedIndex(index);
  //   }, 0);
  // };

  // const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
  //   e.preventDefault();
  // };

  // const handleDragEnter = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
  //   if (sortOrder !== 'manual' || draggedIndex === null || draggedIndex === index) return;
  //   e.preventDefault();
  //   setDropTargetIndex(index);
  // };
  
  // const handleDragLeave = (e: React.DragEvent<HTMLTableRowElement>) => {
  //   const relatedTarget = e.relatedTarget as Node;
  //   if (!e.currentTarget.contains(relatedTarget)) {
  //     setDropTargetIndex(null);
  //   }
  // };

  // const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
  //   if (sortOrder !== 'manual' || draggedIndex === null) return;
  //   e.preventDefault();
  //   const newFiles = [...files];
  //   const draggedItem = newFiles.splice(draggedIndex, 1)[0];
  //   newFiles.splice(index, 0, draggedItem);
  //   onReorder(newFiles);
  //   setDraggedIndex(null);
  //   setDropTargetIndex(null);
  // };
  
  // const handleDragEnd = () => {
  //   setDraggedIndex(null);
  //   setDropTargetIndex(null);
  // };

  return (
    <div className="file-list-container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="file-list-header">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a' }}>Uploaded Audio Files</h3>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label htmlFor="sort-order" style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginRight: '0.5rem' }}>Sort by:</label>
          <select 
            id="sort-order"
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            style={{
              borderRadius: '0.375rem', 
              border: '1px solid #81C9F3', 
              boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
              fontSize: '0.875rem',
              padding: '0.25rem 0.5rem'
            }}
          >
            <option value="alpha-asc">Alphabetical (A-Z)</option>
            <option value="date-asc">Date Modified (Oldest First)</option>
            <option value="date-desc">Date Modified (Newest First)</option>
            {/* Removed Manual option */}
            {/* <option value="manual">Manual</option> */}
          </select>
        </div>
      </div>
      
      <div className="summary-bar">
        <div><strong>Total Files:</strong> {files.length}</div>
        <div><strong>Total Duration:</strong> {formattedTotalDuration}</div>
      </div>

      {files.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem 0', color: '#64748b', border: '1px dashed #cbd5e1', borderRadius: '0.5rem', marginTop: '1.5rem' }}>
          No audio files uploaded yet.
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="file-table">
              <thead>
                <tr>
                  {/* Removed drag handle column */}
                  {/* <th scope="col" style={{ width: '1%' }}></th> */}
                  <th scope="col" style={{ width: '5%' }}>#</th>
                  <th scope="col" style={{ width: '15%' }}>Duration</th>
                  <th scope="col" style={{ width: 'auto' }}>File Name</th>
                  <th 
                    scope="col" 
                    style={{ width: '18%' }}
                    title="This reflects the file's last modified date."
                  >
                    Date Modified
                  </th>
                  <th scope="col" style={{ width: '12%', textAlign: 'right' }}>Size (MB)</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, index) => (
                  <tr 
                    key={file.id}
                    // Removed drag-and-drop attributes
                    // draggable={sortOrder === 'manual'}
                    // onDragStart={(e) => handleDragStart(e, index)}
                    // onDragOver={handleDragOver}
                    // onDragEnter={(e) => handleDragEnter(e, index)}
                    // onDragLeave={handleDragLeave}
                    // onDrop={(e) => handleDrop(e, index)}
                    // onDragEnd={handleDragEnd}
                    className={`
                      file-row
                      ${file.isDuplicate ? 'duplicate-row' : ''}
                    `}
                  >
                    {/* Removed drag handle cell */}
                    {/* <td className="drag-handle-cell">
                      {sortOrder === 'manual' && <DragHandleIcon />}
                    </td> */}
                    <td style={{ textAlign: 'center', color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        {index + 1}
                        {file.isDuplicate && (
                          <span
                            title="This file is a potential duplicate."
                            style={{
                              display: 'inline-block',
                              width: '0.6rem',
                              height: '0.6rem',
                              borderRadius: '50%',
                              backgroundColor: '#facc15', // yellow-400
                              verticalAlign: 'middle',
                            }}
                          />
                        )}
                      </div>
                    </td>
                    <td className="mono" style={{ color: '#35C5CF' }}>{file.duration}</td>
                    <td style={{ fontWeight: '500', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {file.name.replace(/\.[^/.]+$/, "")}
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      {new Date(file.lastModified).toLocaleString()}
                    </td>
                    <td className="mono" style={{ color: '#64748b', textAlign: 'right' }}>
                      {file.size}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="actions-footer">
            <button
              onClick={onStartOver}
              className="start-over-btn"
            >
              <GoBackIcon />
              Start Over
            </button>
            <button 
              onClick={onCopyAndClear}
              className="copy-clear-btn"
            >
              <CopyIcon />
              Copy All & Clear List
            </button>
          </div>
        </>
      )}

      <style>{`
        .file-list-container {
          animation: fade-in 0.5s ease-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .file-list-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 0.75rem; /* Reduced from 1rem */
        }
        @media (min-width: 640px) {
          .file-list-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
        .summary-bar {
          display: flex;
          justify-content: space-between;
          background-color: #f8fafc; /* slate-50 */
          color: #334155; /* slate-700 */
          font-size: 0.875rem;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem; /* Reduced vertical padding from 0.75rem to 0.5rem */
          margin-bottom: 1rem; /* Reduced from 1.5rem */
          border: 1px solid #e2e8f0; /* slate-200 */
        }
        .table-container {
          position: relative;
          background-color: #fff;
          border-radius: 0.5rem;
          border: 1px solid #DBEFF5;
          overflow-y: auto;
          flex: 1; /* Allow table container to grow/shrink */
          max-height: calc(100vh - 420px); /* Dynamic max height based on viewport for no scrolling */
          table-layout: fixed; /* Ensures fixed table layout */
        }
        .file-table {
          width: 100%;
          text-align: left;
          border-collapse: collapse;
        }
        .file-table thead {
          background-color: #f8fafc; /* slate-50 */
          font-size: 0.75rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .file-table th, .file-table td {
          padding: 0.6rem 0.8rem; /* Reduced from 0.75rem 1rem */
          border-bottom: 1px solid #DBEFF5;
          /* Removed general white-space: nowrap; */
        }
        .file-table td:first-child, .file-table th:first-child {
          padding-left: 1.25rem; /* Adjusted for consistency */
        }
        .file-table td:last-child, .file-table th:last-child {
          padding-right: 1.25rem; /* Adjusted for consistency */
        }
        .file-table th {
          font-weight: 600;
        }
        .file-table .mono {
          font-family: monospace;
        }
        .file-row {
          transition: background-color 0.2s ease-in-out;
          font-size: 0.875rem;
        }
        .file-row:last-child td {
          border-bottom: none;
        }
        .file-row:hover {
          background-color: #f1f5f9; /* slate-100 */
        }
        .file-row.duplicate-row {
            background-color: #fefce8; /* yellow-50 */
        }
        .file-row.duplicate-row:hover {
            background-color: #fef9c3; /* yellow-100 */
        }
        /* Removed .file-row.draggable */
        /* Removed .file-row.draggable:active */
        /* Removed .file-row.dragging */
        /* Removed .drop-indicator-top td */
        /* Removed .drag-handle-cell */
        /* Removed .drag-handle-cell svg */
        /* Removed .file-row.draggable:hover .drag-handle-cell svg */

        .actions-footer {
          margin-top: 1rem; /* Reduced from 1.5rem */
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .start-over-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background-color: transparent;
          color: #334155;
          font-weight: 600;
          border-radius: 0.5rem;
          border: 1px solid #81C9F3;
          cursor: pointer;
          transition: background-color 0.2s;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        }
        .start-over-btn:hover {
          background-color: #DBEFF5;
        }
        .copy-clear-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background-color: #21929b; /* WCAG compliant contrast */
          color: #fff;
          font-weight: bold;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }
        .copy-clear-btn:hover {
          background-color: #1e828a;
        }
      `}</style>
    </div>
  );
};
