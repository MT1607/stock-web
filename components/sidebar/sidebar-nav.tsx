'use client';
import { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/store/sidebar-store';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    title: string;
    icon: LucideIcon;
    href: string;
  }[];
}

const SidebarNav = ({ className, items, ...props }: SidebarNavProps) => {
  const location = usePathname();
  const router = useRouter();

  const { isCollapse } = useSidebarStore();

  return (
    <nav className="flex flex-col gap-y-2" {...props}>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.includes(item.href);
        return (
          <Button
            key={item.title}
            variant={isActive ? 'outline' : 'ghost'}
            className={cn(
              isActive && 'bg-blue-800/20 text-blue-600',
              'justify-start'
            )}
            onClick={() => router.push(item.href)}
          >
            <Icon className={'mr-2 size-4'} />
            {isCollapse ? (
              <span className="sr-only">{item.title}</span>
            ) : (
              item.title
            )}
          </Button>
        );
      })}
    </nav>
  );
};

export default SidebarNav;
