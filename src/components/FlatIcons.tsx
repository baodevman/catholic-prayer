import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  active?: boolean;
}

export const IconWheat: React.FC<IconProps> = ({ size = 20, color = 'var(--gold-primary)', className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M 20.67 3.83 L 20.47 3.78 L 20.32 3.68 L 19.28 3.38 L 18.79 3.28 L 18.44 3.28 L 17.84 3.18 L 17.65 3.08 L 17.30 3.04 L 16.80 3.04 L 16.41 3.13 L 16.01 3.38 L 15.71 3.73 L 15.52 3.73 L 15.12 3.63 L 15.22 3.53 L 15.37 3.53 L 15.47 3.43 L 15.57 3.43 L 15.86 3.23 L 16.36 2.79 L 16.56 2.69 L 17.94 2.49 L 18.59 2.49 L 18.49 2.44 L 17.20 2.44 L 16.36 2.59 L 15.86 2.54 L 15.52 2.59 L 15.17 2.69 L 14.82 2.89 L 14.62 3.08 L 14.43 3.38 L 14.38 3.58 L 13.68 3.58 L 14.13 3.28 L 14.48 2.94 L 14.67 2.59 L 14.87 2.39 L 16.06 1.90 L 16.61 1.75 L 16.36 1.75 L 15.91 1.85 L 15.12 2.09 L 14.87 2.24 L 14.58 2.34 L 14.23 2.34 L 13.88 2.44 L 13.58 2.59 L 13.19 2.99 L 13.09 3.13 L 12.99 3.38 L 12.99 3.58 L 12.89 3.73 L 12.79 3.78 L 12.25 3.78 L 12.40 3.68 L 12.74 3.28 L 12.94 2.89 L 13.04 2.54 L 13.29 2.29 L 13.93 1.90 L 14.92 1.50 L 14.48 1.55 L 13.54 1.95 L 12.89 2.34 L 12.20 2.59 L 11.85 2.89 L 11.60 3.28 L 11.50 3.63 L 11.50 4.03 L 11.36 4.17 L 11.11 4.22 L 10.86 4.37 L 10.81 4.27 L 11.01 4.03 L 11.26 3.43 L 11.36 2.79 L 11.90 2.24 L 12.79 1.55 L 12.69 1.55 L 11.75 2.14 L 11.11 2.74 L 10.76 2.89 L 10.56 3.04 L 10.22 3.43 L 10.02 3.88 L 9.97 4.27 L 10.02 4.77 L 8.98 5.51 L 8.09 6.35 L 7.10 7.64 L 6.75 8.24 L 6.30 9.23 L 6.21 9.33 L 5.91 10.12 L 5.56 11.26 L 5.56 11.46 L 5.46 11.65 L 5.46 11.90 L 5.36 12.15 L 5.36 12.40 L 5.26 12.64 L 5.26 13.04 L 5.17 13.39 L 5.17 13.93 L 5.07 14.43 L 5.12 17.25 L 5.07 17.40 L 4.97 17.25 L 4.92 17.05 L 4.92 16.75 L 4.82 16.51 L 4.72 15.86 L 4.72 15.47 L 4.62 15.17 L 4.62 14.58 L 4.52 14.03 L 4.52 13.29 L 4.42 12.74 L 4.42 12.20 L 4.32 11.46 L 4.03 10.17 L 3.78 9.42 L 3.48 8.78 L 2.99 7.99 L 2.74 7.69 L 2.54 7.54 L 3.18 8.83 L 3.43 9.57 L 3.43 9.77 L 3.53 9.97 L 3.53 10.22 L 3.63 10.46 L 3.63 10.81 L 3.73 11.16 L 3.73 11.70 L 3.83 12.15 L 3.83 13.29 L 3.93 14.82 L 4.03 15.22 L 4.03 15.67 L 4.12 16.31 L 4.22 16.56 L 4.22 16.80 L 4.57 18.09 L 4.77 18.54 L 4.77 18.69 L 5.17 19.68 L 5.51 20.37 L 5.66 21.31 L 5.96 22.45 L 6.06 22.50 L 6.30 22.45 L 6.35 21.11 L 6.45 20.77 L 6.45 20.37 L 6.55 20.07 L 6.55 19.78 L 6.65 19.58 L 6.65 19.33 L 6.75 19.13 L 6.75 18.93 L 6.95 18.24 L 7.05 18.09 L 7.10 17.79 L 7.79 16.21 L 8.63 14.92 L 9.47 14.03 L 10.37 13.39 L 11.21 12.99 L 10.71 13.04 L 9.72 13.44 L 8.93 13.98 L 8.43 14.43 L 7.79 15.17 L 7.20 16.11 L 6.80 16.90 L 6.70 17.30 L 6.50 17.70 L 6.50 17.84 L 6.35 18.14 L 6.30 17.89 L 6.35 17.40 L 6.45 17.15 L 6.45 16.85 L 6.55 16.61 L 6.55 16.36 L 6.65 16.16 L 6.70 15.76 L 6.85 15.22 L 7.44 13.63 L 7.89 12.74 L 8.48 11.80 L 8.98 11.21 L 9.52 10.66 L 10.27 10.12 L 10.86 9.82 L 11.65 9.57 L 12.20 9.62 L 12.35 10.17 L 12.54 10.56 L 12.89 10.91 L 13.29 11.16 L 13.54 11.26 L 13.63 11.36 L 13.93 11.85 L 14.38 12.45 L 14.38 12.35 L 14.18 11.95 L 13.73 11.26 L 13.63 10.66 L 13.54 10.37 L 13.24 9.92 L 12.89 9.62 L 13.14 9.57 L 13.58 9.67 L 13.78 9.82 L 13.78 10.51 L 13.83 10.71 L 14.18 11.31 L 14.67 11.80 L 15.02 12.79 L 15.12 12.89 L 15.17 13.09 L 15.27 13.24 L 15.27 13.14 L 15.12 12.84 L 15.07 12.50 L 14.97 12.35 L 14.87 12.00 L 14.87 11.80 L 14.82 11.75 L 14.87 11.06 L 14.82 10.86 L 14.58 10.27 L 14.38 10.07 L 14.53 10.02 L 14.67 10.07 L 15.02 10.27 L 15.17 10.42 L 15.07 10.81 L 15.07 11.46 L 15.22 11.95 L 15.42 12.30 L 15.57 12.45 L 15.62 12.64 L 15.62 13.04 L 15.86 14.13 L 15.86 13.78 L 15.81 13.73 L 15.76 13.04 L 15.76 12.40 L 15.91 11.95 L 15.91 11.36 L 15.76 10.76 L 16.31 11.21 L 16.31 11.36 L 16.11 11.85 L 16.06 12.10 L 16.06 12.59 L 16.16 12.94 L 16.36 13.34 L 16.36 14.67 L 16.41 14.77 L 16.51 13.39 L 16.80 12.74 L 16.85 12.35 L 16.80 11.75 L 17.15 12.10 L 17.25 12.30 L 16.95 12.84 L 16.85 13.14 L 16.85 13.83 L 17.00 14.28 L 16.90 14.92 L 16.90 16.01 L 17.05 14.77 L 17.15 14.33 L 17.55 13.63 L 17.60 13.39 L 17.55 12.89 L 17.65 12.84 L 17.84 13.09 L 17.99 13.39 L 17.70 13.73 L 17.55 14.03 L 17.45 14.38 L 17.50 15.47 L 17.40 15.96 L 17.40 17.15 L 17.45 17.25 L 17.45 16.56 L 17.60 15.47 L 17.70 15.27 L 17.84 15.12 L 18.14 14.58 L 18.24 13.98 L 18.34 14.08 L 18.49 14.53 L 18.29 14.72 L 18.09 15.02 L 17.89 15.52 L 17.89 16.31 L 17.99 16.61 L 17.99 17.75 L 18.09 18.09 L 18.09 18.44 L 18.19 18.64 L 18.24 18.98 L 18.14 18.24 L 18.09 16.75 L 18.14 16.56 L 18.34 16.26 L 18.74 15.42 L 18.74 15.71 L 18.64 15.96 L 18.64 16.66 L 18.79 17.15 L 19.38 18.24 L 19.53 19.63 L 19.53 20.52 L 19.63 19.63 L 19.53 18.44 L 19.53 17.89 L 19.63 17.55 L 19.63 16.95 L 19.53 16.46 L 19.33 16.06 L 18.88 15.57 L 18.93 15.22 L 19.23 15.67 L 19.73 16.11 L 20.07 16.51 L 20.37 17.50 L 20.37 17.70 L 20.47 17.89 L 20.47 18.14 L 20.57 18.39 L 20.57 18.69 L 20.67 18.83 L 20.67 18.98 L 20.67 18.83 L 20.62 18.79 L 20.62 18.19 L 20.52 17.94 L 20.52 17.65 L 20.42 17.20 L 20.32 17.00 L 20.32 16.80 L 20.07 16.16 L 20.02 15.71 L 19.83 15.27 L 19.28 14.67 L 18.98 14.53 L 18.74 14.48 L 18.64 14.38 L 18.49 13.98 L 18.59 13.93 L 19.08 14.38 L 19.68 14.62 L 20.02 14.97 L 20.62 15.86 L 21.06 16.75 L 21.06 16.66 L 20.82 16.01 L 20.47 15.37 L 20.07 14.77 L 19.88 14.58 L 19.73 14.18 L 19.53 13.83 L 19.28 13.58 L 18.83 13.34 L 18.64 13.29 L 18.29 13.29 L 18.19 13.24 L 17.94 12.79 L 18.04 12.74 L 18.14 12.84 L 18.64 13.09 L 19.23 13.19 L 19.43 13.29 L 19.78 13.58 L 20.72 14.58 L 20.67 14.43 L 20.42 14.08 L 20.07 13.68 L 19.33 12.99 L 19.23 12.79 L 18.74 12.30 L 18.34 12.10 L 17.50 12.10 L 17.15 11.65 L 17.25 11.60 L 17.50 11.75 L 17.99 11.85 L 18.64 11.85 L 19.08 12.10 L 19.73 12.54 L 20.37 13.09 L 19.88 12.54 L 19.53 12.25 L 18.69 11.70 L 18.04 11.11 L 17.75 10.96 L 17.50 10.91 L 17.05 10.91 L 16.80 10.96 L 16.61 11.06 L 16.16 10.66 L 16.41 10.61 L 17.75 10.61 L 18.49 10.96 L 19.53 11.65 L 18.98 11.16 L 18.04 10.56 L 17.70 10.42 L 17.25 10.07 L 16.66 9.82 L 16.16 9.82 L 15.76 9.97 L 15.47 10.17 L 15.02 9.92 L 14.92 9.82 L 15.42 9.77 L 15.81 9.67 L 16.21 9.47 L 16.46 9.42 L 17.10 9.57 L 17.94 9.87 L 18.44 10.12 L 18.54 10.12 L 18.39 10.02 L 17.35 9.52 L 16.90 9.38 L 16.51 9.33 L 15.57 8.93 L 14.97 8.93 L 14.67 9.03 L 14.33 9.23 L 14.08 9.47 L 13.73 9.42 L 13.44 9.28 L 13.63 9.18 L 13.88 9.13 L 14.28 8.93 L 14.62 8.63 L 14.87 8.53 L 16.46 8.58 L 16.36 8.58 L 16.16 8.48 L 15.52 8.38 L 14.53 8.38 L 14.33 8.29 L 13.54 8.29 L 12.94 8.58 L 12.74 8.78 L 12.45 9.23 L 11.80 9.23 L 11.01 9.42 L 10.61 9.57 L 9.67 10.12 L 8.88 10.81 L 8.48 11.26 L 7.79 12.25 L 7.15 13.49 L 6.80 14.33 L 6.60 14.92 L 6.50 15.42 L 6.40 15.57 L 6.21 16.41 L 6.01 17.50 L 5.91 18.44 L 5.91 19.18 L 5.81 19.73 L 5.66 19.03 L 5.66 18.64 L 5.56 18.34 L 5.51 17.89 L 5.51 17.10 L 5.41 16.36 L 5.41 15.17 L 5.56 13.34 L 5.66 13.04 L 5.61 12.99 L 5.76 12.10 L 5.86 11.90 L 5.86 11.65 L 5.96 11.46 L 5.96 11.26 L 6.25 10.27 L 6.35 10.12 L 6.35 9.97 L 6.70 9.18 L 7.10 8.38 L 7.84 7.25 L 8.33 6.65 L 9.13 5.86 L 9.92 5.26 L 10.02 5.26 L 10.37 5.61 L 10.66 5.81 L 11.16 6.01 L 11.41 6.06 L 11.80 6.06 L 12.35 5.96 L 12.40 6.01 L 12.89 6.11 L 13.04 6.21 L 13.24 6.21 L 13.44 6.30 L 13.88 6.35 L 12.45 5.81 L 11.95 5.31 L 11.36 5.02 L 10.56 4.92 L 10.76 4.77 L 11.21 4.57 L 11.46 4.52 L 12.10 5.21 L 12.45 5.41 L 12.99 5.56 L 13.54 5.56 L 14.43 6.06 L 15.07 6.25 L 14.23 5.81 L 13.98 5.61 L 13.73 5.51 L 13.29 4.92 L 12.94 4.62 L 12.54 4.42 L 12.10 4.32 L 12.20 4.22 L 12.74 4.08 L 12.99 4.12 L 13.09 4.37 L 13.29 4.67 L 13.73 5.07 L 14.18 5.26 L 14.72 5.36 L 15.67 6.01 L 16.11 6.16 L 15.22 5.56 L 14.77 5.12 L 14.67 4.87 L 14.33 4.42 L 14.08 4.22 L 13.78 4.08 L 13.68 3.93 L 14.33 3.93 L 14.43 4.03 L 14.48 4.22 L 14.67 4.57 L 15.02 4.97 L 15.37 5.17 L 15.86 5.31 L 16.36 5.76 L 16.71 6.01 L 16.85 6.06 L 17.00 6.21 L 17.25 6.30 L 16.80 5.96 L 16.01 5.21 L 15.71 4.57 L 15.52 4.32 L 15.27 4.12 L 14.97 3.98 L 15.47 3.93 L 15.62 3.98 L 15.76 4.12 L 15.91 4.62 L 16.36 5.12 L 16.56 5.26 L 17.05 5.46 L 17.60 5.91 L 17.99 6.16 L 18.54 6.40 L 17.70 5.81 L 17.15 5.31 L 16.95 4.82 L 16.46 4.22 L 16.61 4.17 L 16.80 4.27 L 17.25 4.67 L 17.84 4.87 L 18.24 4.92 L 18.59 4.92 L 19.18 4.82 L 19.58 4.87 L 19.73 4.97 L 19.88 4.97 L 20.02 5.07 L 20.17 5.07 L 20.67 5.26 L 21.46 5.66 L 21.41 5.56 L 20.32 4.97 L 19.97 4.82 L 19.43 4.67 L 18.88 4.22 L 18.49 4.03 L 17.94 3.88 L 17.50 3.88 L 16.80 4.08 L 16.61 3.98 L 16.46 3.98 L 16.36 3.88 L 16.85 3.83 L 17.25 3.73 L 17.75 3.53 L 17.94 3.38 L 18.83 3.43 L 19.13 3.53 L 19.43 3.53 L 19.68 3.63 L 19.92 3.63 L 20.12 3.73 L 20.32 3.73 Z"
    />
  </svg>
);

export const IconHome: React.FC<IconProps> = ({ size = 22, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const IconSparkles: React.FC<IconProps> = ({ size = 22, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    <path d="M5 3 4 5.5 1.5 6.5 4 7.5 5 10l1-2.5 2.5-1L6 5.5Z" />
  </svg>
);

export const IconSettings: React.FC<IconProps> = ({ size = 22, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconUser: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const IconUsers: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const IconShare: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

export const IconRefresh: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

export const IconCheck: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const IconPlus: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const IconTrash: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const IconSearch: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const IconBookOpen: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export const IconCalendar: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const IconLink: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export const IconSun: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

export const IconMoon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export const IconBriefcase: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

export const IconGraduationCap: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

export const IconHomeHeart: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M12 11.5a2 2 0 0 0-2 2c0 1.5 2 3 2 3s2-1.5 2-3a2 2 0 0 0-2-2z" />
  </svg>
);

export const IconPrayingHands: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2v20M8 6l4-4 4 4M8 18l4 4 4-4" />
  </svg>
);

export const IconStethoscope: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.3.3 0 1 0 .2.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </svg>
);

export const IconCompass: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

export const IconLock: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const IconLogOut: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export const IconLogIn: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

export const IconHeart: React.FC<IconProps & { filled?: boolean }> = ({ size = 18, color = 'currentColor', className, filled = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? color : 'none'}
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const IconEdit: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const IconZoomIn: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

export const IconZoomOut: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

