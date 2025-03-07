import { redirect, type ActionFunctionArgs } from '@remix-run/node';
import { destroySession, getSession } from '~/sessions';

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  return redirect('/iniciar-sesion', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
}
