import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 80px);
  background-color: #f8fafc;
  width: 100%;
  overflow: hidden;

  .spin {
    animation: ${spin} 1s linear infinite;
  }
`;

export const Sidebar = styled.aside`
  width: 320px;
  background-color: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    display: ${(props) => (props.$showOnMobile ? 'flex' : 'none')};
  }
`;

export const SearchInputWrapper = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;

  input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 0.9rem;
    color: #1e293b;

    &::placeholder {
      color: #94a3b8;
    }
  }
`;

export const ProductScrollList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const ProductListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${(props) => (props.$isActive ? '#f1f5f9' : 'transparent')};
  border: 1px solid ${(props) => (props.$isActive ? '#cbd5e1' : 'transparent')};
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8fafc;
  }
`;

export const ProductThumb = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 6px;
  background-color: #e2e8f0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ProductListInfo = styled.div`
  flex: 1;
  overflow: hidden;

  h4 {
    font-size: 0.9rem;
    font-weight: 600;
    color: #0f172a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
  }

  p {
    display: flex;
    justify-content: space-between;
    font-size: 0.78rem;
    color: #64748b;
    margin-top: 0.25rem;

    .price {
      font-weight: 600;
      color: #059669;
    }
  }
`;

export const Main = styled.main`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem;
    display: ${(props) => (props.$showOnMobile ? 'block' : 'none')};
  }
`;

export const HeaderToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;

  .title-group {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }
  }
`;

export const MobileBackButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #475569;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

export const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background-color: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #dc2626;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const GallerySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const MainImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 12px;
  overflow: hidden;
  background-color: #e2e8f0;
  border: 1px solid #cbd5e1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const DownloadOverlayButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.75);
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(15, 23, 42, 0.95);
    transform: scale(1.05);
  }
`;

export const ThumbnailRow = styled.div`
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

export const ThumbnailCard = styled.div`
  width: 70px;
  height: 55px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${(props) => (props.$isActive ? '#2563eb' : '#cbd5e1')};
  opacity: ${(props) => (props.$isActive ? 1 : 0.7)};
  transition: all 0.2s ease;

  &:hover {
    opacity: 1;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const NoImagePlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 4 / 3;
  background-color: #f1f5f9;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  color: #94a3b8;
  gap: 0.5rem;

  p {
    font-size: 0.875rem;
  }
`;

export const DetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const ProductTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

export const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

export const MetaCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;

  .icon {
    font-size: 1.5rem;
    color: #3b82f6;
  }

  label {
    display: block;
    font-size: 0.75rem;
    color: #64748b;
    text-transform: uppercase;
    font-weight: 600;
  }

  p {
    font-size: 1rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }
`;

export const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #334155;

  a {
    color: #2563eb;
    text-decoration: underline;
  }
`;

export const TagSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #64748b;
  }
`;

export const BadgeGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

export const Badge = styled.span`
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${(props) => (props.$colorBadge ? '#fef3c7' : '#e0f2fe')};
  color: ${(props) => (props.$colorBadge ? '#92400e' : '#0369a1')};
`;

export const DescriptionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;

  label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
  }

  p {
    font-size: 0.9rem;
    color: #334155;
    line-height: 1.5;
    margin: 0;
    white-space: pre-line;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 3rem;
  color: #94a3b8;
  text-align: center;
  gap: 0.75rem;

  p {
    font-size: 0.9rem;
    margin: 0;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(2px);
`;

export const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 440px;
  padding: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .warning-icon {
    color: #ef4444;
  }

  h3 {
    font-size: 1.15rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    flex: 1;
  }

  .close-btn {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 0.2rem;

    &:hover {
      color: #0f172a;
    }
  }
`;

export const ModalBody = styled.div`
  p {
    font-size: 0.95rem;
    color: #334155;
    margin: 0 0 0.5rem 0;
  }

  .subtext {
    font-size: 0.825rem;
    color: #64748b;
    line-height: 1.4;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const ModalButton = styled.button`
  padding: 0.55rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s ease;

  ${(props) =>
    props.$variant === 'danger'
      ? `
    background-color: #ef4444;
    color: #ffffff;
    &:hover:not(:disabled) {
      background-color: #dc2626;
    }
  `
      : `
    background-color: #ffffff;
    border-color: #cbd5e1;
    color: #475569;
    &:hover:not(:disabled) {
      background-color: #f1f5f9;
    }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;