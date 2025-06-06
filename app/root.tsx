import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from '@remix-run/react';
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import styles from './tailwind.css?url';

import { SidebarProvider, SidebarTrigger } from '../app/components/ui/sidebar';
import { AppSidebar } from '../app/components/Sidebar';
import { Toaster } from './components/ui/sonner';
import { getSession } from './sessions';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  { rel: 'icon', href: '/logo-fit.png', type: 'image/png' },
  { rel: 'stylesheet', href: styles },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const role = session.get('role');
  return { isLoggedIn: session.has('userId'), role };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>('root');

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <Toaster position='top-center' richColors />
        {data?.isLoggedIn ? (
          <SidebarProvider>
            <AppSidebar role={data.role} />
            <SidebarTrigger />
            <div className='ps-4 pt-12 w-full'>{children}</div>
            <ScrollRestoration />
            <Scripts />
          </SidebarProvider>
        ) : (
          <>
            {children}
            <ScrollRestoration />
            <Scripts />
          </>
        )}
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
