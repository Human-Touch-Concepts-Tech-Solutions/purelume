import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const EditContainer = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  height: 85vh;
  background: #f4f4f6;
  border: 1px solid var(--charcoal, #222);
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 80vh;
  }
`;

export const Sidebar = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e2e8f0;

  @media (max-width: 900px) {
    display: ${props => props.$hideOnMobile ? 'none' : 'flex'};
    height: 80vh;
  }
`;

export const Header = styled.div`
  padding: 1.2rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 { 
    font-size: 1rem; 
    color: var(--charcoal, #222); 
    margin: 0;
  }
`;

export const UnsavedBadge = styled.span`
  font-size: 0.75rem;
  background: #fff3cd;
  color: #856404;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .refresh-btn {
    background: transparent;
    border: 1px solid #ddd;
    padding: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    .spinning {
      animation: ${spin} 1s linear infinite;
    }
  }

  .publish-btn {
    background: var(--gold, #c5a059);
    color: white;
    border: none;
    padding: 0.55rem 1rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.2s;

    &:disabled { 
      background: #ccc; 
      cursor: not-allowed;
    }
  }
`;

export const ProductList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const ProductItem = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.15s;

  background: ${props => props.$active ? '#fdfaf3' : 'transparent'};
  border-left: 4px solid ${props => props.$isModified ? 'var(--gold, #c5a059)' : 'transparent'};

  &:hover { background: #fafafa; }

  img { 
    width: 48px; 
    height: 48px; 
    object-fit: cover; 
    border-radius: 6px; 
    background: #f0f0f0;
  }
  
  div {
    flex: 1;
    overflow: hidden;
    p { 
      font-weight: 600; 
      font-size: 0.88rem; 
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    span { font-size: 0.78rem; color: #666; }
  }

  .status-icon { color: var(--gold, #c5a059); font-size: 1.2rem; }
`;

export const MainForm = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  overflow-y: auto;

  @media (max-width: 900px) {
    display: ${props => props.$showOnMobile ? 'block' : 'none'};
    padding: 1rem;
  }
`;

export const MobileBackBar = styled.div`
  display: none;
  margin-bottom: 1rem;

  button {
    display: flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    font-weight: 600;
    color: var(--charcoal, #222);
    cursor: pointer;
  }

  @media (max-width: 900px) {
    display: block;
  }
`;

export const FormContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.2rem;
    margin-bottom: 1.2rem;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    label { 
      font-size: 0.82rem; 
      font-weight: 600; 
      color: var(--charcoal, #222);
    }

    input, select, textarea { 
      padding: 0.75rem; 
      border: 1px solid #ddd; 
      border-radius: 8px; 
      font-size: 0.95rem;

      &:focus {
        outline: none;
        border-color: var(--gold, #c5a059);
      }
    }
  }

  .full-width {
    width: 100%;
    margin-bottom: 1.2rem;
  }
`;

export const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;

  h2 { font-size: 1.2rem; margin: 0; }
  .product-id { font-size: 0.8rem; background: #eee; padding: 2px 8px; border-radius: 4px; }
`;

export const TagSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;

  .tag-group {
    label {
      display: block;
      font-size: 0.82rem;
      font-weight: 600;
      margin-bottom: 0.4rem;
    }
  }

  .tag-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fff;
    min-height: 44px;
    align-items: center;

    span {
      background: #f0f0f0;
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.82rem;

      svg { 
        cursor: pointer; 
        color: #ff4d4d;
        &:hover { color: red; }
      }
    }

    input { 
      border: none; 
      outline: none; 
      flex: 1; 
      min-width: 120px; 
      font-size: 0.88rem;
    }
  }
`;

export const ImageEditSection = styled.div`
  margin-top: 1.5rem;

  label {
    display: block;
    font-size: 0.82rem;
    font-weight: 600;
    margin-bottom: 0.6rem;
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;

    @media (max-width: 500px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .img-card {
    position: relative;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #ddd;

    img { width: 100%; height: 100%; object-fit: cover; }

    button {
      position: absolute; 
      top: 5px; 
      right: 5px;
      background: rgba(255, 0, 0, 0.85); 
      color: white; 
      border: none;
      border-radius: 50%; 
      width: 22px; 
      height: 22px;
      display: flex; 
      align-items: center; 
      justify-content: center;
      cursor: pointer; 
      font-size: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
  }

  .upload-btn {
    border: 2px dashed #ccc;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #888;
    aspect-ratio: 1;
    font-size: 0.8rem;
    gap: 4px;
    transition: all 0.2s;

    svg { font-size: 1.5rem; }

    &:hover { 
      border-color: var(--gold, #c5a059); 
      color: var(--gold, #c5a059); 
    }
  }
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;

  button {
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
  }

  .save { 
    background: var(--charcoal, #222); 
    color: white; 
    border: none; 
    display: flex; 
    align-items: center; 
    gap: 8px; 

    &:hover {
      background: var(--gold, #c5a059);
    }
  }

  .cancel { 
    background: white; 
    border: 1px solid #ddd; 
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 300px;
  color: #aaa;
  p { margin-top: 1rem; font-size: 0.95rem; }
`;