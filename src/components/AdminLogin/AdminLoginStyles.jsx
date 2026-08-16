import styled from 'styled-components';

export const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  background-color: #e9e2d8;
  padding: 1.5rem;
  box-sizing: border-box;
  overflow-x: hidden; /* Prevents unwanted horizontal browser scrollbars */
`;

export const LoginCard = styled.div`
  background: #F7F7F5;
  width: 100%;
  max-width: 460px; /* Increased from 400px to allow a larger logo */
  padding: 2.5rem 2rem; /* Reduced horizontal padding slightly for internal room */
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border, #e5e5e5);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

export const LogoContainer = styled.div`
  position: relative;
  width: 280px; /* Now fits cleanly inside the card */
  height: 90px;
  margin-bottom: 0.5rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  color: black;
  font-family: var(--heading);
  margin-bottom: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  text-align: center;
`;

export const Subtitle = styled.p`
  color: #2b2b2b;
  font-size: 0.875rem;
  margin-bottom: 2rem;
  font-family: var(--body);
  text-align: center;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  font-family: var(--body);
  box-sizing: border-box;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: black;
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1.5px solid var(--charcoal, #333);
    font-size: 1rem;
    transition: all 0.2s;
    font-family: var(--body);
    background: transparent;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: var(--gold, #d6b36a);
      box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.1);
    }
  }
`;

export const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;

  input {
    width: 100%;
    padding: 0.75rem 3rem 0.75rem 1rem !important;
    border-radius: 8px;
    border: 1.5px solid var(--charcoal, #333);
    font-size: 1rem;
    background: transparent;
    transition: all 0.2s;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: var(--gold, #d6b36a);
    }
  }
`;

export const EyeIcon = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--charcoal, #333);
  font-size: 1.25rem;
  user-select: none;
  z-index: 2;
  background: none;
  border: none;
  padding: 0;

  &:hover {
    color: var(--rose, #d66a6a);
  }
`;

export const LoginButton = styled.button`
  background-color: var(--gold, #d6b36a);
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  margin-top: 1rem;
  transition: all 0.3s ease;
  font-family: var(--body);
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  width: 100%;

  &:hover {
    background-color: var(--charcoal, #333);
    transform: translateY(-1px);
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
  }
`;