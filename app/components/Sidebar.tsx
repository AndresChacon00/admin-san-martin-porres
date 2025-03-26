import {
  HardHat,
  PencilRuler,
  GraduationCap,
  BookOpen,
  Calendar,
  LogOut,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../components/ui/sidebar';
import { Link, useFetcher, useLocation } from '@remix-run/react';
import { cn } from '~/lib/utils';
import { Button } from './ui/button';
import { UserRole } from '~/types/usuarios.types';

type SidebarItemT = {
  title: string;
  url: string;
  icon: React.ComponentType;
  roles: UserRole[];
};

// Menú de navegación
const items: SidebarItemT[] = [
  {
    title: 'Cursos',
    url: '/cursos',
    icon: BookOpen,
    roles: ['admin', 'secretaria'],
  },
  {
    title: 'Estudiantes',
    url: '/estudiantes',
    icon: GraduationCap,
    roles: ['admin', 'secretaria'],
  },
  {
    title: 'Empleados',
    url: '/empleados',
    icon: HardHat,
    roles: ['admin'],
  },
  {
    title: 'Profesores',
    url: '/profesores',
    icon: PencilRuler,
    roles: ['admin'],
  },
  {
    title: 'Periodos',
    url: '/periodos',
    icon: Calendar,
    roles: ['admin', 'secretaria'],
  },
];

export function AppSidebar({ role }: { role: UserRole | undefined }) {
  const location = useLocation();
  const fetcher = useFetcher();

  const filteredItems = items.filter(
    (item) => role && item.roles.includes(role),
  );

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
              {filteredItems.map((item) => (
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                variant='ghost'
                className='text-white hover:bg-blue-800 bg-opacity-20'
                onClick={() =>
                  fetcher.submit(
                    {},
                    { method: 'post', action: '/cerrar-sesion' },
                  )
                }
              >
                <LogOut size='5' />
                <span>Cerrar sesión</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
