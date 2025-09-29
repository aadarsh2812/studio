'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, Users, BarChart, User, HeartPulse } from 'lucide-react';
import { SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useAuth } from '@/lib/hooks';
import SidebarDeviceStatus from '@/components/dashboard/sidebar-device-status';
import SportsSelector from '@/components/dashboard/sports-selector';
import type { UserRole } from '@/lib/types';

const navItems = {
  all: [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/profile', label: 'Profile', icon: User },
  ],
  coach: [
    { href: '/team', label: 'My Team', icon: Users },
  ],
  athlete: [],
  physiotherapist: [
    { href: '/team', label: 'Athletes', icon: Users },
  ],
};

const getNavLinks = (role: UserRole) => {
  return [...navItems.all, ...navItems[role]];
};

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);

  if (!user) return null;

  const links = getNavLinks(user.role);
  
  const handleConnect = () => {
    setIsDeviceConnected(true);
    // You would typically connect to a real device here
    window.dispatchEvent(new CustomEvent('device-connection-change', { detail: { connected: true } }));
  };

  return (
    <SidebarContent className="p-2">
      {/* Device Status at the top of sidebar */}
      <SidebarDeviceStatus 
        isConnected={isDeviceConnected} 
        onConnect={handleConnect} 
      />
      
      {/* Sports Selector */}
      <SportsSelector 
        onSportChange={(sportId) => console.log('Selected sport:', sportId)} 
      />
      
      <SidebarMenu>
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarContent>
  );
}
