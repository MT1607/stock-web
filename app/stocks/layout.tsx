import Header from '@/components/header/header';
import SidebarComponent from '@/components/sidebar/sidebar-component';

const IboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex h-full w-full">{children}</div>;
};

export default IboardLayout;
