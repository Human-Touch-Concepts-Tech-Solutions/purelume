import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const FormContainer = styled.form`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  padding-bottom: 5rem;
  position: relative;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding-bottom: 3rem;
  }
`;

export const Section = styled.div`
  background: #ffffff;
  padding: 1.8rem;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

  @media (max-width: 600px) {
    padding: 1.2rem;
    margin-bottom: 1.2rem;
  }

  h3 {
    margin-bottom: 1.2rem;
    font-family: var(--heading, sans-serif);
    color: var(--charcoal, #222);
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 0.6rem;
    font-size: 1.15rem;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1.2rem;

  label {
    display: block;
    margin-bottom: 0.4rem;
    font-weight: 600;
    font-size: 0.85rem;
    color: var(--charcoal, #333);
  }

  input, textarea, select {
    width: 100%;
    padding: 0.75rem 0.9rem;
    border: 1px solid #dcdcdc;
    border-radius: 8px;
    font-family: var(--body, sans-serif);
    font-size: 0.92rem;
    background: #fff;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--gold, #d4af37);
      box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
    }

    &:read-only {
      background: #f7f7f7;
      color: #666;
      cursor: not-allowed;
    }
  }

  textarea {
    height: 110px;
    resize: vertical;
  }
`;

export const InputWithAction = styled.div`
  display: flex;
  gap: 0.5rem;

  input {
    flex: 1;
  }

  button {
    padding: 0 0.9rem;
    background: #f2f2f2;
    border: 1px solid #dcdcdc;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    color: var(--charcoal, #333);
    transition: background 0.2s;

    &:hover {
      background: #e5e5e5;
    }
  }
`;

export const GridTwoCols = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const UploadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 1rem;
  margin-top: 0.8rem;
`;

export const UploadBox = styled.label`
  border: 2px dashed #bbb;
  border-radius: 12px;
  height: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #777;
  background: #fafafa;

  &:hover {
    border-color: var(--gold, #d4af37);
    background: #fdfaf3;
    color: var(--gold, #d4af37);
  }

  input { display: none; }
  svg { font-size: 1.8rem; margin-bottom: 0.4rem; }
  span { font-size: 0.78rem; font-weight: 600; text-align: center; }
`;

export const PreviewCard = styled.div`
  position: relative;
  height: 130px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e2e2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 6px;
    right: 6px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #ff4d4d;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    
    &:hover { background: #ffffff; transform: scale(1.1); }
  }
`;

export const TagInputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0.5rem;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  background: #fff;
  min-height: 45px;
  align-items: center;

  .tag {
    background: var(--charcoal, #222);
    color: white;
    padding: 3px 10px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;

    button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-weight: bold;
      display: flex;
      align-items: center;
      padding: 0;
      &:hover { color: var(--gold, #d4af37); }
    }
  }

  input {
    border: none !important;
    flex: 1;
    min-width: 100px;
    padding: 0.2rem !important;
    box-shadow: none !important;
    font-size: 0.85rem;
  }
`;

export const SubmitButton = styled.button`
  background: var(--gold, #d4af37);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  transition: all 0.25s ease;

  &:hover:not(:disabled) {
    background: var(--charcoal, #222);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.12);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

export const SecondaryButton = styled(SubmitButton)`
  background: white;
  color: var(--charcoal, #222);
  border: 2px solid var(--charcoal, #222);
  margin-bottom: 0.8rem;
  
  &:hover:not(:disabled) {
    background: #f5f5f5;
    color: var(--charcoal, #222);
  }
`;

export const QueueHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  h3 {
    margin-bottom: 0;
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const CountBadge = styled.span`
  background: var(--gold, #d4af37);
  color: #fff;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
`;

export const QueueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--gold, #d4af37);
    border-radius: 10px;
  }
`;

export const QueueItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid var(--gold, #d4af37);

  .info {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .title {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--charcoal, #222);
    }

    small {
      font-size: 0.72rem;
      color: #666;
    }
  }

  .actions {
    display: flex;
    gap: 0.4rem;

    button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.1rem;
      padding: 4px;
      display: flex;
      align-items: center;
      transition: transform 0.2s;
      
      &:hover { transform: scale(1.15); }
    }
    .edit { color: var(--charcoal, #222); }
    .delete { color: #ff4d4d; }
  }
`;

/* Progress Overlay / Modal */
export const ProgressModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const ProgressBox = styled.div`
  background: #fff;
  padding: 2.5rem 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);

  h4 {
    margin: 1rem 0 0.5rem;
    font-size: 1.2rem;
    color: var(--charcoal, #222);
  }

  p {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 1.2rem;
  }
`;

export const Spinner = styled.div`
  width: 42px;
  height: 42px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--gold, #d4af37);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #eee;
  border-radius: 10px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: var(--gold, #d4af37);
  width: ${props => props.$percent || 0}%;
  transition: width 0.3s ease;
`;