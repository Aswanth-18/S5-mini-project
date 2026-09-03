import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from '../components/common/TopNav';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopNav isSidebarCollapsed={true} />
      <main className="p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;