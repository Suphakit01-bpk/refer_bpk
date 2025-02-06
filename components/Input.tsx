'use client';
import React from 'react';
import styled from 'styled-components';

interface InputProps {
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  username: string;
  password: string;
}

const Input: React.FC<InputProps> = ({
  onUsernameChange,
  onPasswordChange,
  username,
  password
}) => {
  return (
    <StyledWrapper>
      <div className="form-control">
        <input 
          required 
          type="text" 
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
        />
        <label>
          {['U', 's', 'e', 'r', 'n', 'a', 'm', 'e'].map((letter, index) => (
            <span key={index} style={{transitionDelay: `${350 - (index * 50)}ms`}}>
              {letter}
            </span>
          ))}
        </label>
      </div>
      <div className="form-control">
        <input 
          required 
          type="password" 
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
        <label>
          {['P', 'a', 's', 's', 'w', 'o', 'r', 'd'].map((letter, index) => (
            <span key={index} style={{transitionDelay: `${350 - (index * 50)}ms`}}>
              {letter}
            </span>
          ))}
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 100%;

  .form-control {
    position: relative;
    margin: 20px 0 40px;
    width: 100%;
  }

  .form-control input {
    background-color: transparent;
    border: 0;
    border-bottom: 2px #d6bcfa solid;
    display: block;
    width: 100%;
    padding: 15px 0;
    font-size: 18px;
    color: #4a5568;
  }

  .form-control input:focus,
  .form-control input:valid {
    outline: 0;
    border-bottom-color: #805ad5;
  }

  .form-control label {
    position: absolute;
    top: 15px;
    left: 0;
    pointer-events: none;
  }

  .form-control label span {
    display: inline-block;
    font-size: 18px;
    min-width: 5px;
    color: #718096;
    transition: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  .form-control input:focus+label span,
  .form-control input:valid+label span {
    color: #805ad5;
    transform: translateY(-30px);
  }
`;

export default Input;
