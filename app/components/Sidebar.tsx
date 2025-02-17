import { Home, HardHat, PencilRuler } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../components/ui/sidebar';
import { Link, useLocation } from '@remix-run/react';
import { cn } from '~/lib/utils';

// Menu items.
const items = [
  {
    title: 'Inicio',
    url: '/',
    icon: Home,
  },
  {
    title: 'Empleados',
    url: '/empleados',
    icon: HardHat,
  },
  {
    title: 'Profesores',
    url: '/profesores',
    icon: PencilRuler,
  },
];

export function AppSidebar() {
  const location = useLocation();
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>San Martín de Porres</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={cn(
                    'hover:bg-gray-100 rounded-md transition-all',
                    location.pathname === item.url ? 'bg-gray-100' : '',
                  )}
                >
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
