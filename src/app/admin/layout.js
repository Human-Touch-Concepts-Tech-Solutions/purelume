'use client';

import Sidebar from '@/components/Sidebar/Sidebar';
import styled from 'styled-components';

export default function AdminLayout({ children }) {
  return (
    <AdminWrapper>
      <Sidebar username="Admin" />
      <MainContent>
        {children}
      </MainContent>
    </AdminWrapper>
  );
}

const AdminWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f9f9f8;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 70px; /* Accounts for collapsed sidebar width on desktop */
  padding: 2rem;
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1.5rem;
    padding-top: 4.5rem; /* Leaves room for mobile hamburger button */
  }
`;