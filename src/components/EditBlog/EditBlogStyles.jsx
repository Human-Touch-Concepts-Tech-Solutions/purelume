import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const BlogListSidebar = styled.aside`
  width: 320px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: calc(100vh - 120px);
  position: sticky;
  top: 1.5rem;

  @media (max-width: 900px) {
    width: 100%;
    height: auto;
    position: static;
    display: ${({ $showOnMobile }) => ($showOnMobile ? 'flex' : 'none')};
  }
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  
  input {
    width: 100%;
    padding: 0.65rem 0.75rem 0.65rem 2.25rem;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: #0f172a;
    }
  }

  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
  }
`;

export const BlogScrollList = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  padding-right: 0.25rem;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

export const BlogListItem = styled.div`
  padding: 0.85rem;
  border-radius: 8px;
  border: 1px solid ${({ $isActive }) => ($isActive ? '#0f172a' : '#f1f5f9')};
  background: ${({ $isActive }) => ($isActive ? '#f8fafc' : '#ffffff')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #94a3b8;
    background: #f8fafc;
  }

  h4 {
    font-size: 0.925rem;
    font-weight: 600;
    color: #0f172a;
    margin: 0 0 0.35rem 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  p {
    font-size: 0.775rem;
    color: #64748b;
    margin: 0;
    display: flex;
    justify-content: space-between;
  }
`;

export const EditorMain = styled.main`
  flex: 1;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 900px) {
    display: ${({ $showOnMobile }) => ($showOnMobile ? 'flex' : 'none')};
  }

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

export const HeaderToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
  gap: 1rem;
  flex-wrap: wrap;

  .title-group {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    h2 {
      margin: 0;
      font-size: 1.35rem;
      color: #0f172a;
    }
  }

  .action-buttons {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
`;

export const MobileBackButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #0f172a;
  padding: 0.25rem;

  @media (max-width: 900px) {
    display: flex;
    align-items: center;
  }
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $variant }) =>
    $variant === 'primary'
      ? `
    background: #0f172a;
    color: #ffffff;
    border: none;
    &:hover { background: #1e293b; }
  `
      : $variant === 'danger'
      ? `
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
    &:hover { background: #fee2e2; }
  `
      : `
    background: #ffffff;
    color: #334155;
    border: 1px solid #cbd5e1;
    &:hover { background: #f8fafc; }
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  grid-column: ${({ $fullWidth }) => ($fullWidth ? '1 / -1' : 'span 1')};

  label {
    font-size: 0.825rem;
    font-weight: 600;
    color: #334155;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  input, select, textarea {
    width: 100%;
    padding: 0.65rem 0.85rem;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 0.925rem;
    color: #0f172a;
    background: #ffffff;
    outline: none;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: #0f172a;
    }
  }

  textarea {
    resize: vertical;
    font-family: inherit;
    line-height: 1.5;
  }
`;

export const SlugWrapper = styled.div`
  display: flex;
  gap: 0.5rem;

  input {
    flex: 1;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 1rem 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ImageGalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const ImageCard = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${({ $isFeatured }) => ($isFeatured ? '#10b981' : '#e2e8f0')};
  background: #f1f5f9;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .badge {
    position: absolute;
    top: 4px;
    left: 4px;
    background: #10b981;
    color: #ffffff;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover .overlay {
    opacity: 1;
  }
`;

export const OverlayIconButton = styled.button`
  background: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 0.35rem;
  color: #0f172a;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f1f5f9;
  }
`;

export const ContentToolbar = styled.div`
  display: flex;
  gap: 0.5rem;
  background: #f8fafc;
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  flex-wrap: wrap;
`;

export const ToolbarButton = styled.button`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.35rem 0.6rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
`;

export const MarkdownTextArea = styled.textarea`
  border-radius: 0 0 8px 8px !important;
  font-family: monospace, monospace;
  font-size: 0.9rem !important;
  min-height: 250px;
`;

export const LinkList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const LinkRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  input {
    flex: 1;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  color: #64748b;
  text-align: center;

  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #94a3b8;
  }

  p {
    margin: 0;
    font-size: 0.95rem;
  }
`;
export const EmbeddedImageBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  gap: 1rem;
  flex-wrap: wrap;

  .img-preview {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    img {
      width: 60px;
      height: 45px;
      object-fit: cover;
      border-radius: 4px;
      border: 1px solid #cbd5e1;
    }

    span {
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
    }
  }

  .block-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: ${(props) => (props.$variant === 'danger' ? '#ef4444' : '#475569')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${(props) => (props.$variant === 'danger' ? '#fee2e2' : '#f1f5f9')};
    border-color: ${(props) => (props.$variant === 'danger' ? '#fca5a5' : '#94a3b8')};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;