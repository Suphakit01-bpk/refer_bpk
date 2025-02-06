'use client';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
// แก้ไขเส้นทางการ import ให้ถูกต้อง
import Card from '@/components/Card';
import Loader from '@/components/Loader';
import HeartRateLoader from '@/components/HeartRateLoader';

// Update SweetAlert2 styles with pastel theme
const Toast = Swal.mixin({
  background: 'rgba(255, 251, 254, 0.95)',
  color: '#805ad5',
  customClass: {
    popup: 'swal-popup',
    title: 'swal-title',
    htmlContainer: 'swal-html',
    confirmButton: 'swal-confirm-button',
    icon: 'swal-icon'
  },
});

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'การเข้าสู่ระบบล้มเหลว');
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      
      await Toast.fire({
        icon: 'success',
        title: 'เข้าสู่ระบบสำเร็จ',
        text: 'กำลังนำท่านไปยังหน้าหลัก...',
        timer: 1500,
        showConfirmButton: false,
        iconColor: '#9f7aea',
        background: 'rgba(255, 251, 254, 0.95)',
      });

      router.push('/dashboard');
    } catch (err: any) {
      Toast.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.message,
        confirmButtonText: 'ตกลง',
        iconColor: '#9f7aea',
        background: 'rgba(255, 251, 254, 0.95)',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      {/* {loading && <HeartRateLoader />} */}
      <LoginContainerStyled>
        <Card
          mode="signin"
          onSubmit={handleSubmit}
          loading={loading}
          username={username}
          password={password}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
        />
      </LoginContainerStyled>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  
  /* Remove the gradient overlay */
  /* &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.2) 100%
    );
    z-index: -1;
  } */

  /* Update SweetAlert2 custom styles */
  .swal-popup {
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(183, 148, 244, 0.1);
    border: 1px solid rgba(233, 213, 255, 0.5);
  }

  .swal-title {
    color: #805ad5;
    font-family: 'Kanit', sans-serif;
    font-weight: 600;
  }

  .swal-html {
    color: #718096;
    font-family: 'Kanit', sans-serif;
  }

  .swal-icon {
    &.swal2-success {
      border-color: #9f7aea !important;
      
      .swal2-success-line-tip,
      .swal2-success-line-long {
        background-color: #9f7aea !important;
      }
      
      .swal2-success-ring {
        border-color: #d6bcfa !important;
      }
    }
    
    &.swal2-error {
      border-color: #fc8181 !important;
      
      .swal2-x-mark-line-left,
      .swal2-x-mark-line-right {
        background-color: #fc8181 !important;
      }
    }
  }

  .swal-confirm-button {
    background: linear-gradient(-45deg, #9f7aea 0%, #d6bcfa 100%) !important;
    border-radius: 8px !important;
    font-family: 'Kanit', sans-serif;
    padding: 12px 24px;
    transition: all 0.3s ease !important;
    
    &:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 5px 15px rgba(159, 122, 234, 0.3) !important;
    }
    
    &:focus {
      box-shadow: 0 0 0 3px rgba(159, 122, 234, 0.3) !important;
    }
  }
`;

const LoginContainerStyled = styled.div`
  animation: fadeIn 0.5s ease-in-out;
  width: 100%;
  max-width: 450px;  // กำหนดความกว้างสูงสุด
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
