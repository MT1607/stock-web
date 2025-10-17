import Header from '@/components/header';
import SidebarComponent from '@/components/sidebar/sidebar-component';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full w-full">
      <SidebarComponent />
      <div className="flex h-full flex-1 flex-col">
        <Header />
        <main className="flex-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
