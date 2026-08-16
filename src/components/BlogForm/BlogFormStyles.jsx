import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const FormContainer = styled.form`
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  padding-bottom: 5rem;
`;

export const Section = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  border: 1px solid var(--charcoal, #222);
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);

  h3 {
    margin-bottom: 1.5rem;
    font-family: var(--heading, serif);
    font-size: 1.3rem;
    color: var(--charcoal, #222);
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 0.8rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const GridTwoCols = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.6rem;
  flex-wrap: wrap;
  gap: 0.5rem;

  small {
    color: #666;
    font-size: 0.85rem;
    code {
      background: #f4f4f4;
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--gold, #c5a059);
    }
  }
`;

export const ImageInsertBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;

  span {
    font-size: 0.85rem;
    font-weight: 600;
    color: #555;
  }

  button {
    display: flex;
    align-items: center;
    gap: 4px;
    background: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: var(--gold, #c5a059);
      color: white;
      border-color: var(--gold, #c5a059);
    }
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.6rem;
    font-weight: 600;
    color: var(--charcoal, #222);
  }

  input, textarea {
    width: 100%;
    padding: 1rem;
    border: 1px solid var(--charcoal, #222);
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: var(--gold, #c5a059);
    }
  }

  textarea {
    min-height: 350px;
    line-height: 1.6;
    font-family: inherit;
  }
`;

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

export const ImageBox = styled.label`
  height: 140px;
  border: 2px dashed var(--charcoal, #222);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #fafafa;
  color: #888;
  
  input { display: none; }
  &:hover { border-color: var(--gold, #c5a059); color: var(--gold, #c5a059); }
`;

export const Preview = styled.div`
  position: relative;
  height: 140px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eee;

  img { width: 100%; height: 100%; object-fit: cover; }
  
  button {
    position: absolute;
    top: 5px; right: 5px;
    background: white;
    border-radius: 50%;
    width: 26px; height: 26px;
    border: none; color: red;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }
`;

export const Badge = styled.span`
  position: absolute;
  bottom: 5px;
  left: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
`;

export const LinkRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-end;

  .label-input { flex: 1; }
  .url-input { flex: 2; }

  button {
    background: none;
    border: none;
    color: #ff4d4d;
    font-size: 1.3rem;
    cursor: pointer;
    padding-bottom: 0.8rem;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;

    button {
      align-self: flex-end;
      padding: 0;
    }
  }
`;

export const AddButton = styled.button`
  background: transparent;
  border: 1px dashed var(--gold, #c5a059);
  color: var(--gold, #c5a059);
  padding: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  
  &:hover { background: #fffcf5; }
`;

export const SubmitButton = styled.button`
  background: var(--charcoal, #222);
  color: white;
  padding: 1.2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background: var(--gold, #c5a059); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export const ProgressModal = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

export const ProgressBox = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);

  h4 { margin: 1rem 0 0.5rem; font-size: 1.2rem; }
  p { color: #666; font-size: 0.9rem; }
`;

export const Spinner = styled.div`
  width: 40px; height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--gold, #c5a059);
  border-radius: 50%;
  margin: 0 auto;
  animation: ${spin} 1s linear infinite;
`;