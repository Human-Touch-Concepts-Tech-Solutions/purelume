'use client';

import Sidebar from '@/components/Sidebar/Sidebar';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  
  // Skip sidebar and admin layout for the login route
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

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
  margin-left: 70px;
  padding: 2rem;
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1.5rem;
    padding-top: 4.5rem;
  }
`;