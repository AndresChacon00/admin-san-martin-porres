import { Home, HardHat, BookOpen } from 'lucide-react'; // Added BookOpen for Cursos icon

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
import { Link } from '@remix-run/react';

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
    title: 'Cursos',
    url: '/cursos',
    icon: BookOpen, // Added icon for Cursos
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>San Martín de Porres</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
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
