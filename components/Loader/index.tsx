'use client';
import React from 'react';
import styled from 'styled-components';

interface LoaderProps {
  fullscreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ fullscreen = true }) => {
  return (
    <LoaderWrapper $fullscreen={fullscreen}>
      <div className="loading">
        <svg width="64px" height="48px">
          <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back" />
          <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front" />
        </svg>
      </div>
    </LoaderWrapper>
  );
}

const LoaderWrapper = styled.div<{ $fullscreen: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  ${props => props.$fullscreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    z-index: 9999;
  `}

  .loading svg polyline {
    fill: none;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .loading svg polyline#back {
    fill: none;
    stroke: #9f7aea33;
  }

  .loading svg polyline#front {
    fill: none;
    stroke: #805ad5;
    stroke-dasharray: 48, 144;
    stroke-dashoffset: 192;
    animation: dash_682 1.4s linear infinite;
  }

  @keyframes dash_682 {
    72.5% {
      opacity: 0;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
`;

export default Loader;
