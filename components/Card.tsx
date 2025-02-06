'use client';
import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Input from "./Input";

interface CardProps {
  mode?: 'signin' | 'signup';
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  username: string;
  password: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

const Card: React.FC<CardProps> = ({
  mode = 'signin',
  onSubmit,
  loading,
  username,
  password,
  onUsernameChange,
  onPasswordChange
}) => {
  const router = useRouter();

  return (
    <StyledWrapper>
      <form className="card" onSubmit={onSubmit}>
        <p className="heading">{mode === 'signin' ? 'เข้าสู่ระบบ' : 'ลงทะเบียน'}</p>
        
        <div className="input-container">
          <Input
            username={username}
            password={password}
            onUsernameChange={onUsernameChange}
            onPasswordChange={onPasswordChange}
          />
        </div>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? 'กำลังดำเนินการ...' : (mode === 'signin' ? 'เข้าสู่ระบบ' : 'ลงทะเบียน')}
        </button>

        <p className="footer">
          {mode === 'signin' ? (
            <>ยังไม่มีบัญชี? <span onClick={() => router.push('/register')}>ลงทะเบียน</span></>
          ) : (
            <>มีบัญชีแล้ว? <span onClick={() => router.push('/login')}>เข้าสู่ระบบ</span></>
          )}
        </p>
      </form>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  width: 100%;
  
  .card {
    background-color: rgba(255, 251, 254, 0.95);
    box-shadow: 0 8px 32px rgba(183, 148, 244, 0.1);
    width: 100%;
    min-height: 500px;
    font-family: 'Kanit', sans-serif;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 40px;
    border-radius: 15px;
  }

  .card::before {
    background: linear-gradient(-45deg, #b794f4 0%, #e9d5ff 100%);
    opacity: 0.8;
    width: calc(100% + 10px);
    height: calc(100% + 10px);
    content: '';
    position: absolute;
    inset: 0;
    left: -5px;
    margin: auto;
    border-radius: 15px;
    z-index: -10;
    pointer-events: none;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .heading {
    color: #805ad5;
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 20px;
    letter-spacing: 0.5px;
  }

  .btn {
    background: linear-gradient(-45deg, #9f7aea 0%, #d6bcfa 100%);
    width: 100%;
    padding: 15px;
    border-radius: 8px;
    border: none;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 20px 0;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(159, 122, 234, 0.3);
    }
  }

  .footer {
    color: #718096;
    font-size: 14px;
    
    span {
      color: #805ad5;
      cursor: pointer;
      font-weight: 600;
    }
  }

  .footer span:hover {
    text-decoration: underline;
  }

  .card:hover::before {
    transform: rotate(-2deg) scale(1.02);
  }

  .btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .input-container {
    width: 100%;
    margin: 20px 0;
    padding: 0 20px; // เพิ่ม padding เพื่อให้มีระยะห่างจากขอบ card
  }
`;

export default Card;