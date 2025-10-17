'use client';
import {
  Banknote,
  CheckCircle2,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  ListCheck,
  LogOut,
  Users,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import SidebarNav from './sidebar-nav';
import { useSession, signOut } from 'next-auth/react';
import { useSidebarStore } from '@/store/sidebar-store';
import Link from 'next/link';

const SidebarComponent = () => {
  const { isCollapse, toggleSidebar } = useSidebarStore();
  const navItem = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Workspaces',
      href: '/workspaces',
      icon: Users,
    },
    {
      title: 'My task',
      href: '/my-tasks',
      icon: ListCheck,
    },
    {
      title: 'Members',
      href: '/members',
      icon: Users,
    },
    {
      title: 'Archived',
      href: '/archived',
      icon: CheckCircle2,
    },
    {
      title: 'License',
      href: '/license',
      icon: Banknote,
    },
  ];
  return (
    <div
      className={cn(
        'bg-sidebar sticky top-0 left-0 flex h-screen flex-col border-r transition-all duration-300',
        isCollapse ? 'w-16 md:w-[80px]' : 'w-16 md:w-[240px]'
      )}
    >
      <div className={'mb-4 flex h-14 items-center border-b px-4'}>
        <Link href={'/dashboard'} className={'flex items-center'}>
          {!isCollapse && (
            <div className={'flex items-center gap-2'}>
              <Wrench className={'size-6 text-blue-600'} />
              <span className={'hidden text-lg font-semibold md:block'}>
                PrM
              </span>
            </div>
          )}
          {isCollapse && <Wrench className={'size-6 text-blue-600'} />}
        </Link>

        <Button
          variant={'ghost'}
          className={'ml-auto hidden hover:cursor-pointer md:block'}
          onClick={toggleSidebar}
        >
          {isCollapse ? (
            <ChevronsRight className={'size-4'} />
          ) : (
            <ChevronsLeft className={'size-4'} />
          )}
        </Button>
      </div>

      <ScrollArea className={'flex-1 px-3 py-2'}>
        <SidebarNav items={navItem} />
      </ScrollArea>

      <div className={'w-full lg:w-[80px]'}>
        <Button
          variant={'ghost'}
          size={isCollapse ? 'icon' : 'default'}
          onClick={() => signOut({ callbackUrl: '/' })}
          className={'hover:cursor-pointer'}
        >
          <LogOut className={cn(isCollapse && 'mr-2')} />
          <span className={'hidden md:block'}>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default SidebarComponent;
