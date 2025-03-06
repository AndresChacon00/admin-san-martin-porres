import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { loginSchema } from '~/lib/validators';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { ActionFunctionArgs, MetaFunction, redirect } from '@remix-run/node';
import { useState } from 'react';
import { EyeIcon, EyeOff } from 'lucide-react';
import { commitSession, getSession } from '~/sessions';
import { useSubmit } from '@remix-run/react';
import { login } from '~/api/controllers/auth.server';

export const meta: MetaFunction = () => {
  return [{ title: 'Iniciar Sesión | San Martín de Porres' }];
};

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const form = await request.formData();
  const email = form.get('email');
  const password = form.get('password');

  const userId = await login(String(email), String(password));

  if (userId == null) {
    session.flash('error', 'Correo o contraseña inválida');

    // Redirect back to the login page with errors.
    return redirect('/iniciar-sesion', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  session.set('userId', String(userId));

  // Login succeeded, send them to the home page.
  return redirect('/cursos', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

export default function IniciarSesion() {
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const submit = useSubmit();

  return (
    <div className='bg-[#e3f5ff] min-h-screen flex items-center justify-center'>
      <Card className='px-6'>
        <CardHeader>
          <CardTitle>Inicia sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form
              className='space-y-3'
              onSubmit={loginForm.handleSubmit((values) =>
                submit(
                  { email: values.email, password: values.password },
                  { method: 'post' },
                ),
              )}
            >
              <FormField
                control={loginForm.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input {...field} type='email' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <div className='flex'>
                        <Input
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          className='max-w-fit px-1'
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? <EyeIcon /> : <EyeOff />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className='link-button w-full !mt-4' type='submit'>
                Ingresar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
