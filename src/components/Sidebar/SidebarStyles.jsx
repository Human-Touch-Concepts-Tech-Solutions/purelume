import styled from 'styled-components';

export const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  height: 100dvh;
  background-color: var(--ivory, #F7F7F5);
  border-right: 1px solid var(--border, #e5e5e5);
  width: ${props => (props.$mobileOpen ? '280px' : '70px')};
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0,0,0,0.03);

  @media (min-width: 769px) {
    &:hover {
      width: 250px;
    }
  }

  @media (max-width: 768px) {
    transform: ${props => (props.$mobileOpen ? 'translateX(0)' : 'translateX(-100%)')};
    width: 280px;
  }
`;

export const NavSection = styled.div`
  flex: 1;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  /* CHANGED: visible overflow prevents desktop submenus from being hidden/cut off */
  overflow-y: visible;
  overflow-x: visible;
`;

export const NavItemWrapper = styled.div`
  position: relative;
  width: 100%;

  /* Desktop hover trigger */
  @media (min-width: 769px) {
    &:hover > div:last-child {
      display: flex !important;
      flex-direction: column;
    }
  }
`;

export const NavItem = styled.div`
  display: flex;
  align-items: center;
  min-height: 48px;
  padding: 0.75rem 1.25rem;
  color: ${props => (props.$active ? 'var(--gold, #d6b36a)' : 'black')};
  background-color: ${props => (props.$active ? 'rgba(214, 179, 106, 0.08)' : 'transparent')};
  border-left: 4px solid ${props => (props.$active ? 'var(--gold, #d6b36a)' : 'transparent')};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  user-select: none;

  svg { 
    font-size: 1.5rem; 
    min-width: 32px; 
    color: ${props => (props.$active ? 'var(--gold, #d6b36a)' : 'var(--charcoal, #333)')};
  }
  
  span {
    margin-left: 0.75rem;
    font-weight: 600;
    font-size: 0.9rem;
    font-family: var(--heading, sans-serif);
    opacity: 0;
    letter-spacing: 0.08rem;
    text-transform: uppercase;
    transition: opacity 0.2s ease;
    ${SidebarContainer}:hover & { opacity: 1; }
    @media (max-width: 768px) { opacity: 1; }
  }

  &:hover {
    background-color: var(--gold, #d6b36a);
    color: white;
    svg { color: white; }
  }
`;

export const SubMenuContainer = styled.div`
  display: none; 
  position: absolute;
  left: 100%;
  top: 0;
  background-color: var(--ivory, #F7F7F5);
  min-width: 180px;
  border: 1px solid var(--border, #e5e5e5);
  box-shadow: 4px 4px 12px rgba(0,0,0,0.08);
  border-radius: 0 8px 8px 0;
  z-index: 2000;
  padding: 0.5rem 0;

  @media (max-width: 768px) {
    display: ${props => (props.$isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: static;
    background-color: #ebebeb;
    box-shadow: none;
    border: none;
    border-radius: 0;
    padding: 0;
  }
`;

export const SubNavItem = styled.div`
  padding: 0.75rem 1.5rem;
  color: ${props => (props.$active ? 'var(--gold, #d6b36a)' : 'var(--charcoal, #333)')};
  font-size: 0.85rem;
  font-family: var(--heading, sans-serif);
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.05rem;
  text-transform: uppercase;
  transition: background 0.2s;
  
  &:hover {
    background-color: var(--gold, #d6b36a);
    color: white;
  }
`;

export const ExpandIcon = styled.div`
  margin-left: auto;
  font-size: 1rem;
  opacity: 0;
  transition: transform 0.3s;
  ${SidebarContainer}:hover & { opacity: 1; }
  
  @media (max-width: 768px) {
    opacity: 1;
    transform: ${props => (props.$isOpen ? 'rotate(90deg)' : 'rotate(0deg)')};
  }
`;

export const BottomSection = styled.div`
  border-top: 1px solid var(--border, #e5e5e5);
  padding: 0.75rem 0;
  background-color: var(--ivory, #F7F7F5);
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1.25rem;
  margin-bottom: 0.5rem;

  .avatar {
    width: 36px; 
    height: 36px; 
    background: var(--gold, #d6b36a); 
    color: white;
    border-radius: 50%; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    font-weight: bold; 
    min-width: 36px;
  }
  .name {
    font-family: var(--heading, sans-serif);
    letter-spacing: 0.05rem;
    margin-left: 0.75rem; 
    font-size: 0.875rem; 
    font-weight: 600; 
    opacity: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    ${SidebarContainer}:hover & { opacity: 1; }
    @media (max-width: 768px) { opacity: 1; }
  }
`;

export const LogoutButton = styled.button`
  width: 100%; 
  display: flex; 
  align-items: center; 
  padding: 0.75rem 1.25rem; 
  font-family: var(--heading, sans-serif);
  background: transparent; 
  border: none; 
  color: #dc2626; 
  cursor: pointer; 
  font-size: 0.875rem; 
  letter-spacing: 0.05rem;
  text-transform: uppercase;
  transition: background 0.2s;

  svg { font-size: 1.5rem; min-width: 32px; }
  span {
    margin-left: 0.75rem; 
    font-weight: 600; 
    opacity: 0;
    ${SidebarContainer}:hover & { opacity: 1; }
    @media (max-width: 768px) { opacity: 1; }
  }

  &:hover {
    background-color: #fee2e2;
  }
`;

export const Hamburger = styled.button`
  display: none;
  position: fixed;
  top: 1rem; 
  left: 1rem;
  z-index: 1100; 
  font-size: 1.5rem;
  background: var(--ivory, #F7F7F5);
  border: 1px solid var(--border, #e5e5e5);
  border-radius: 8px;
  padding: 0.5rem;
  color: black;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  @media (max-width: 768px) { display: flex; }
`;

export const Overlay = styled.div`
  display: ${props => (props.$show ? 'block' : 'none')};
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100vw; 
  height: 100vh;
  background: rgba(0, 0, 0, 0.4); 
  backdrop-filter: blur(2px);
  z-index: 900;
`;