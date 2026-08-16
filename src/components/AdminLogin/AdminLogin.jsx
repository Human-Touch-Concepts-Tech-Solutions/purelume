'use client';

import { useState } from 'react';
import Image from 'next/image';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { loginAction } from '@/app/actions/auth';
import * as S from './AdminLoginStyles';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setErrorMessage(result.error);
      setLoading(false);
    }
  };

  return (
    <S.LoginWrapper>
      <S.LoginCard>
        <S.LogoContainer>
          <Image 
            src="/logo.png" 
            alt="Purelume Logo" 
            sizes="300px"
            fill 
            style={{ objectFit: 'contain' }} 
            priority 
          />
        </S.LogoContainer>
        
        <S.Title>Admin Portal</S.Title>
        <S.Subtitle>Please enter your details to sign in.</S.Subtitle>

        {errorMessage && (
          <div style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1rem',
            background: '#fee2e2',
            color: '#dc2626',
            borderRadius: '8px',
            fontSize: '0.875rem',
            textAlign: 'center',
            fontWeight: 500
          }}>
            {errorMessage}
          </div>
        )}

        <S.Form onSubmit={handleSubmit}>
          <S.InputGroup>
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              placeholder="Enter your username"
              required 
            />
          </S.InputGroup>

          <S.InputGroup>
            <label htmlFor="password">Password</label>
            <S.PasswordWrapper>
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                name="password" 
                placeholder="••••••••"
                required 
              />
              <S.EyeIcon type="button" onClick={togglePasswordVisibility}>
                {showPassword ? <HiEye /> : <HiEyeOff />}
              </S.EyeIcon>
            </S.PasswordWrapper>
          </S.InputGroup>

          <S.LoginButton type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Sign In'}
          </S.LoginButton>
        </S.Form>
      </S.LoginCard>
    </S.LoginWrapper>
  );
};

export default AdminLogin;