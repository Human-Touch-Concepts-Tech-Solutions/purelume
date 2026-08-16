'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HiOutlineViewGrid, HiOutlinePlusCircle, HiOutlinePencilAlt, 
  HiOutlineTrash, HiOutlineChartBar, HiOutlineClipboardList, 
  HiOutlineUsers, HiOutlineLogout, HiMenuAlt2, HiX, HiChevronRight 
} from 'react-icons/hi';
import { logoutAction } from '@/app/actions/auth';
import * as S from './SidebarStyles';

const Sidebar = ({ username = "Admin" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMobileSub, setActiveMobileSub] = useState(null);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleMobileSub = (name) => setActiveMobileSub(activeMobileSub === name ? null : name);

  return (
    <>
      <S.Hamburger onClick={toggleSidebar} aria-label="Toggle Navigation">
        {isOpen ? <HiX /> : <HiMenuAlt2 />}
      </S.Hamburger>

      <S.Overlay $show={isOpen} onClick={() => setIsOpen(false)} />

      <S.SidebarContainer $mobileOpen={isOpen}>
        <S.NavSection>
          <MenuLink 
            href="/admin/dashboard" 
            icon={<HiOutlineViewGrid />} 
            label="Dashboard" 
            close={() => setIsOpen(false)} 
            isActive={pathname === '/admin/dashboard'}
          />

          <FlyoutMenu 
            icon={<HiOutlinePlusCircle />} 
            label="Create" 
            isMobileOpen={activeMobileSub === 'create'}
            onMobileClick={() => handleMobileSub('create')}
            isActive={pathname.startsWith('/admin/products/add') || pathname.startsWith('/admin/blog/add')}
          >
            <SubLink href="/admin/products/add" label="Product" close={() => setIsOpen(false)} isActive={pathname === '/admin/products/add'} />
            <SubLink href="/admin/blog/add" label="Blog" close={() => setIsOpen(false)} isActive={pathname === '/admin/blog/add'} />
          </FlyoutMenu>

          <FlyoutMenu 
            icon={<HiOutlinePencilAlt />} 
            label="Edit" 
            isMobileOpen={activeMobileSub === 'edit'}
            onMobileClick={() => handleMobileSub('edit')}
            isActive={pathname.includes('/edit')}
          >
            <SubLink href="/admin/products/edit" label="Product" close={() => setIsOpen(false)} isActive={pathname === '/admin/products/edit'} />
            <SubLink href="/admin/blog/edit" label="Blog" close={() => setIsOpen(false)} isActive={pathname === '/admin/blog/edit'} />
          </FlyoutMenu>

          <FlyoutMenu 
            icon={<HiOutlineTrash />} 
            label="Delete" 
            isMobileOpen={activeMobileSub === 'delete'}
            onMobileClick={() => handleMobileSub('delete')}
            isActive={pathname.includes('/delete')}
          >
            <SubLink href="/admin/products/delete" label="Product" close={() => setIsOpen(false)} isActive={pathname === '/admin/products/delete'} />
            <SubLink href="/admin/blog/delete" label="Blog" close={() => setIsOpen(false)} isActive={pathname === '/admin/blog/delete'} />
          </FlyoutMenu>

          <MenuLink href="/admin/analytics" icon={<HiOutlineChartBar />} label="Analytics" close={() => setIsOpen(false)} isActive={pathname === '/admin/analytics'} />
          <MenuLink href="/admin/orders" icon={<HiOutlineClipboardList />} label="Orders" close={() => setIsOpen(false)} isActive={pathname.startsWith('/admin/orders')} />
          <MenuLink href="/admin/customers" icon={<HiOutlineUsers />} label="Customers" close={() => setIsOpen(false)} isActive={pathname.startsWith('/admin/customers')} />
        </S.NavSection>

        <S.BottomSection>
          <S.UserInfo>
            <div className="avatar">{username[0]?.toUpperCase()}</div>
            <div className="name">{username}</div>
          </S.UserInfo>
          
          <form action={logoutAction}>
            <S.LogoutButton type="submit">
              <HiOutlineLogout />
              <span>Logout</span>
            </S.LogoutButton>
          </form>
        </S.BottomSection>
      </S.SidebarContainer>
    </>
  );
};

const MenuLink = ({ href, icon, label, close, isActive }) => (
  <Link href={href} style={{ textDecoration: 'none' }} onClick={close}>
    <S.NavItem $active={isActive}>
      {icon}
      <span>{label}</span>
    </S.NavItem>
  </Link>
);

const FlyoutMenu = ({ icon, label, children, isMobileOpen, onMobileClick, isActive }) => (
  <S.NavItemWrapper>
    <S.NavItem onClick={onMobileClick} $active={isActive}>
      {icon}
      <span>{label}</span>
      <S.ExpandIcon $isOpen={isMobileOpen}>
        <HiChevronRight />
      </S.ExpandIcon>
    </S.NavItem>
    <S.SubMenuContainer $isOpen={isMobileOpen}>
      {children}
    </S.SubMenuContainer>
  </S.NavItemWrapper>
);

const SubLink = ({ href, label, close, isActive }) => (
  <Link href={href} style={{ textDecoration: 'none' }} onClick={close}>
    <S.SubNavItem $active={isActive}>{label}</S.SubNavItem>
  </Link>
);

export default Sidebar;