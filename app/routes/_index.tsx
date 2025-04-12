import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/react';
import { getSession } from '~/sessions';

export async function loader({ request }: LoaderFunctionArgs) {
  // Check session and redirect as needed
  const session = await getSession(request.headers.get('Cookie'));
  if (session.has('userId')) {
    // Redirect based on role
    const role = session.get('role');
    if (role === 'admin') {
      return redirect('/empleados');
    } else {
      return redirect('/cursos');
    }
  } else {
    return redirect('/iniciar-sesion');
  }
}

export default function Index() {
  return null;
}
