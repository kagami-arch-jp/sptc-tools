import React from 'react';
import { toDisplayLink } from '@/api/storage';
import './index.scss';

const fileIconByName = (name) => {
  if (/\.(png|jpg|jpeg|gif|webp|svg|bmp|ico)$/i.test(name)) return '🖼️';
  if (/\.(mp4|webm|avi|mov|mkv)$/i.test(name)) return '🎬';
  if (/\.(mp3|wav|ogg|flac|aac)$/i.test(name)) return '🎵';
  if (/\.pdf$/i.test(name)) return '📄';
  if (/\.(zip|rar|tar|gz|7z)$/i.test(name)) return '📦';
  if (/\.(doc|docx|odt)$/i.test(name)) return '📝';
  if (/\.(xls|xlsx|csv)$/i.test(name)) return '📊';
  if (/\.(ppt|pptx|key)$/i.test(name)) return '📽️';
  if (/\.(txt|md|json|xml|yml|yaml|js|ts|jsx|tsx|css|scss|html|php)$/i.test(name)) return '📃';
  return '📎';
};

const isImageFile = (name) => /\.(png|jpg|jpeg|gif|webp|svg|bmp|ico)$/i.test(name);

const FileList = ({ files, readonly, onRemove }) => {
  if (!files || files.length === 0) return null

  return (
    <div className="file-list">
      {files.map((file) => (
        <div key={file.id} className="file-item">
          <a
            href={toDisplayLink(file.savedName)}
            target="_blank"
            rel="noopener noreferrer"
            className="file-item-link"
            onClick={(e) => e.stopPropagation()}
          >
            {isImageFile(file.name) ? (
              <img src={toDisplayLink(file.savedName)} alt={file.name} className="file-thumbnail" />
            ) : (
              <span className="file-icon">{fileIconByName(file.name)}</span>
            )}
            <div className="file-info">
              <span className="file-name">{file.name}</span>
            </div>
          </a>
          {!readonly && onRemove && (
            <button className="file-remove-btn" onClick={() => onRemove(file.id)}>
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileList;
