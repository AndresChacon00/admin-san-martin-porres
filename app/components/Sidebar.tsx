import {
  HardHat,
  PencilRuler,
  GraduationCap,
  BookOpen,
  Calendar,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../components/ui/sidebar';
import { Link, useLocation } from '@remix-run/react';
import { cn } from '~/lib/utils';

// Menú de navegación
const items = [
  {
    title: 'Cursos',
    url: '/cursos',
    icon: BookOpen,
  },
  {
    title: 'Estudiantes',
    url: '/estudiantes',
    icon: GraduationCap,
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
  {
    title: 'Periodos',
    url: '/periodos',
    icon: Calendar,
  },
];

export function AppSidebar() {
  const location = useLocation();
  return (
    <Sidebar collapsible='icon' className='bg-blue-900'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' className='flex items-center h-fit'>
              <img src='/logo-fit.png' alt='' width='52' />
              <span className='text-sm text-neutral-200 font-bold !text-wrap'>
                Centro de Capacitación San Martín de Porres
              </span>
            </SidebarMenuButton>
            <hr className='mt-2 border-neutral-800'></hr>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={cn(
                    'hover:bg-blue-800 rounded-md transition-all',
                    location.pathname === item.url ? 'bg-blue-800' : '',
                  )}
                >
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className='text-neutral-200'>
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
