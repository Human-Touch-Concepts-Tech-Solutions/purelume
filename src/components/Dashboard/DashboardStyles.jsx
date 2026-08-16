import styled from 'styled-components';

export const DashboardContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  font-family: var(--body, sans-serif);
`;

export const Header = styled.header`
  margin-bottom: 2rem;

  h1 {
    font-family: var(--heading, serif);
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    color: var(--charcoal, #222);
    margin-bottom: 0.25rem;
  }

  p {
    color: var(--text-muted, #666);
    font-size: 0.95rem;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2.5rem;
`;

export const StatCard = styled.div`
  background: var(--ivory, #FFFFFF);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border, #E5E5E5);
  display: flex;
  align-items: center;
  gap: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
  }

  .icon-box {
    font-size: 1.8rem;
    color: white;
    background: var(--gold, #D6B36A);
    width: 52px;
    height: 52px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .details {
    display: flex;
    flex-direction: column;

    p {
      font-size: 0.85rem;
      color: var(--text-muted, #777);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.05rem;
    }
    h3 {
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--charcoal, #222);
      margin: 0.2rem 0;
    }
    .trend {
      font-size: 0.75rem;
      color: #10B981; /* Soft Emerald Green */
      font-weight: 500;
    }
  }
`;

export const QuickActions = styled.section`
  background: var(--ivory, #F7F7F5);
  padding: 1.75rem;
  border-radius: 16px;
  border: 1px solid var(--border, #E5E5E5);

  h2 {
    font-family: var(--heading, serif);
    font-size: 1.25rem;
    margin-bottom: 1.25rem;
    color: var(--charcoal, #222);
  }

  .button-group {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;

    @media (max-width: 900px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 580px) {
      grid-template-columns: 1fr;
    }
  }
`;

export const ActionButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.9rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.03rem;
  text-transform: uppercase;
  transition: all 0.25s ease;
  min-height: 48px;
  cursor: pointer;
  user-select: none;

  ${props => {
    switch (props.$variant) {
      case 'secondary':
        return `
          background-color: #EFECE6;
          color: var(--charcoal, #222);
          &:hover {
            background-color: var(--gold, #D6B36A);
            color: #FFFFFF;
          }
        `;
      case 'dark':
        return `
          background-color: var(--charcoal, #222);
          color: #FFFFFF;
          &:hover {
            background-color: #000000;
          }
        `;
      case 'primary':
      default:
        return `
          background-color: var(--gold, #D6B36A);
          color: #FFFFFF;
          &:hover {
            background-color: var(--charcoal, #222);
          }
        `;
    }
  }}

  svg {
    font-size: 1.25rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;