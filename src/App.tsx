import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { ConfirmationModal } from './components/common/ConfirmationModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { MemberList } from './components/members/MemberList';
import { MemberForm } from './components/members/MemberForm';
import { MemberProfile } from './components/members/MemberProfile';
import { MemberImportModal } from './components/members/MemberImportModal';
import { ShareManagement } from './components/shares/ShareManagement';
import { ShareCertificate } from './components/shares/ShareCertificate';
import { CollectPaymentView } from './components/payments/CollectPaymentView';
import { ReceiptsList } from './components/receipts/ReceiptsList';
import { MoneyReceiptModal } from './components/receipts/MoneyReceiptModal';
import { DueManagement } from './components/dues/DueManagement';
import { IncomeManagement } from './components/finance/IncomeManagement';
import { ExpenseManagement } from './components/finance/ExpenseManagement';
import { CashBook } from './components/finance/CashBook';
import { ReportsView } from './components/reports/ReportsView';
import { UserManagement } from './components/users/UserManagement';
import { SettingsView } from './components/settings/SettingsView';
import { PublicPortal } from './components/public/PublicPortal';

const MainContent: React.FC = () => {
  const { activeTab, selectedMemberId } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'members':
        return <MemberList />;
      case 'member_new':
        return <MemberForm mode="create" />;
      case 'member_edit':
        return <MemberForm mode="edit" memberId={selectedMemberId} />;
      case 'member_profile':
        return <MemberProfile />;
      case 'member_import':
        return <MemberImportModal />;
      case 'shares':
        return <ShareManagement />;
      case 'share_cert':
        return <ShareCertificate />;
      case 'collect_payment':
        return <CollectPaymentView />;
      case 'receipts':
        return <ReceiptsList />;
      case 'receipt_view':
        return <MoneyReceiptModal />;
      case 'dues':
        return <DueManagement />;
      case 'income':
        return <IncomeManagement />;
      case 'expenses':
        return <ExpenseManagement />;
      case 'cashbook':
        return <CashBook />;
      case 'reports':
        return <ReportsView />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Navigation Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Sticky Header */}
        <Header 
          isSidebarOpen={isSidebarOpen} 
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} 
        />

        {/* Dynamic Workspace Bento Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1600px] w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <ConfirmationModal />
      <GlobalSearchModal />
    </div>
  );
};

const AppWrapper: React.FC = () => {
  const { isAuthenticated, isSupabaseLoading } = useApp();
  
  if (isSupabaseLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-slate-800">ডাটাবেস লোড হচ্ছে...</h2>
        <p className="text-slate-500 mt-2">অনুগ্রহ করে অপেক্ষা করুন</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <PublicPortal />
        <ToastContainer />
      </>
    );
  }
  
  return <MainContent />;
};

export default function App() {
  return (
    <AppProvider>
      <AppWrapper />
    </AppProvider>
  );
}
