import { zodResolver } from '@hookform/resolvers/zod';
import { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { useForm } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { newUserSchema } from '~/lib/validators';
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
import { EyeIcon, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useFetcher } from '@remix-run/react';
import { createUser } from '~/api/controllers/auth.server';
import { toast } from 'sonner';

export const meta: MetaFunction = () => {
  return [{ title: 'Panel administrativo | San Martín de Porres' }];
};

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const nombre = form.get('nombre');
  const email = form.get('email');
  const password = form.get('password');
  const adminPassword = form.get('adminPassword');
  const _action = String(form.get('_action'));

  if (_action === 'new-user') {
    return await createUser(
      String(nombre),
      String(email),
      String(password),
      String(adminPassword),
    );
  }

  return null;
}

export default function AdminPage() {
  return (
    <div className='bg-[#e3f5ff] min-h-screen flex flex-col justify-center items-center'>
      <Card className='pt-6'>
        <CardHeader>
          <img
            src='/logo-fit.png'
            alt=''
            width='80'
            className='place-self-center'
          />
          <CardTitle className='text-center text-xl'>
            Panel administrativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='new-user'>
            <TabsList>
              <TabsTrigger value='new-user'>Crear usuario</TabsTrigger>
              <TabsTrigger value='reset-password'>
                Reestablecer contraseña
              </TabsTrigger>
            </TabsList>

            <NewUserForm />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function NewUserForm() {
  const userForm = useForm<z.infer<typeof newUserSchema>>({
    resolver: zodResolver(newUserSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const fetcher = useFetcher<typeof action>();

  useEffect(() => {
    if (fetcher.state && fetcher.data && fetcher.data._action === 'new-user') {
      if (fetcher.data.type === 'error') {
        toast.error(fetcher.data.message);
      } else {
        toast.success(fetcher.data.message);
        userForm.reset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  return (
    <TabsContent value='new-user'>
      <Form {...userForm}>
        <form
          className='space-y-3'
          onSubmit={userForm.handleSubmit((values) => {
            fetcher.submit(
              { ...values, _action: 'new-user' },
              { method: 'post' },
            );
          })}
        >
          <FormField
            control={userForm.control}
            name='nombre'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} type='text' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={userForm.control}
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
            control={userForm.control}
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

          <FormField
            control={userForm.control}
            name='adminPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clave de administrador</FormLabel>
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
            Crear usuario
          </Button>
        </form>
      </Form>
    </TabsContent>
  );
}
