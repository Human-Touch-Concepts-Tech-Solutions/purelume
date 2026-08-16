'use client';

import Link from 'next/link';
import { 
  HiOutlineCube, 
  HiOutlineCurrencyDollar, 
  HiOutlineUsers,
  HiOutlinePlus,
  HiOutlineDocumentText,
  HiOutlinePencil
} from 'react-icons/hi';
import * as S from './DashboardStyles';

const Dashboard = ({ username = "Admin" }) => {
  return (
    <S.DashboardContainer>
      <S.Header>
        <h1>Welcome, {username}</h1>
        <p>Purelume Performance Overview</p>
      </S.Header>

      {/* Main Key Performance Metrics */}
      <S.StatsGrid>
        <StatItem icon={<HiOutlineCube />} label="Total Products" value="124" trend="+4 this week" />
        <StatItem icon={<HiOutlineCurrencyDollar />} label="Total Revenue" value="$12,450" trend="+12% vs last month" />
        <StatItem icon={<HiOutlineUsers />} label="Total Customers" value="850" trend="+28 new users" />
      </S.StatsGrid>

      {/* Quick Admin Actions */}
      <S.QuickActions>
        <h2>Quick Actions</h2>
        <div className="button-group">
          <Link href="/admin/products/add" passHref style={{ textDecoration: 'none' }}>
            <S.ActionButton $variant="primary">
              <HiOutlinePlus />
              <span>Add New Product</span>
            </S.ActionButton>
          </Link>
          
          <Link href="/admin/blog/create" passHref style={{ textDecoration: 'none' }}>
            <S.ActionButton $variant="secondary">
              <HiOutlineDocumentText />
              <span>Create Blog Post</span>
            </S.ActionButton>
          </Link>

          <Link href="/admin/blog/edit" passHref style={{ textDecoration: 'none' }}>
            <S.ActionButton $variant="dark">
              <HiOutlinePencil />
              <span>Manage Blog Posts</span>
            </S.ActionButton>
          </Link>
        </div>
      </S.QuickActions>
    </S.DashboardContainer>
  );
};

const StatItem = ({ icon, label, value, trend }) => (
  <S.StatCard>
    <div className="icon-box">{icon}</div>
    <div className="details">
      <p>{label}</p>
      <h3>{value}</h3>
      {trend && <span className="trend">{trend}</span>}
    </div>
  </S.StatCard>
);

export default Dashboard;