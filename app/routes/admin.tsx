import { zodResolver } from '@hookform/resolvers/zod';
import { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { useForm } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { newUserSchema, resetPasswordSchema } from '~/lib/validators';
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
import { createUser, resetPassword } from '~/api/controllers/auth.server';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { ROLE_TRANSLATIONS } from '~/constants';
import type { UserRole } from '~/types/usuarios.types';

export const meta: MetaFunction = () => {
  return [{ title: 'Panel administrativo | San Martín de Porres' }];
};

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const email = form.get('email');
  const password = form.get('password');
  const adminPassword = form.get('adminPassword');
  const _action = String(form.get('_action'));

  if (_action === 'new-user') {
    const nombre = form.get('nombre');
    const role = form.get('role');
    return await createUser(
      String(nombre),
      String(email),
      String(role) as UserRole,
      String(password),
      String(adminPassword),
    );
  }

  if (_action === 'reset-password') {
    return await resetPassword(
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

            <ResetPasswordForm />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function NewUserForm() {
  const userForm = useForm<z.infer<typeof newUserSchema>>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      nombre: '',
      email: '',
      adminPassword: '',
      password: '',
      role: undefined,
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const fetcher = useFetcher<typeof action>();

  useEffect(() => {
    if (
      fetcher.state === 'idle' &&
      fetcher.data &&
      fetcher.data._action === 'new-user'
    ) {
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
            name='role'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecciona un rol' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(ROLE_TRANSLATIONS).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

function ResetPasswordForm() {
  const passwordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
      password: '',
      adminPassword: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const fetcher = useFetcher<typeof action>();

  useEffect(() => {
    if (
      fetcher.state === 'idle' &&
      fetcher.data &&
      fetcher.data._action === 'reset-password'
    ) {
      if (fetcher.data.type === 'error') {
        toast.error(fetcher.data.message);
      } else {
        toast.success(fetcher.data.message);
        passwordForm.reset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  return (
    <TabsContent value='reset-password'>
      <Form {...passwordForm}>
        <form
          className='space-y-3'
          onSubmit={passwordForm.handleSubmit((values) => {
            fetcher.submit(
              { ...values, _action: 'reset-password' },
              { method: 'post' },
            );
          })}
        >
          <FormField
            control={passwordForm.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico del usuario</FormLabel>
                <FormControl>
                  <Input {...field} type='email' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={passwordForm.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nueva contraseña</FormLabel>
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
            control={passwordForm.control}
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
            Guardar
          </Button>
        </form>
      </Form>
    </TabsContent>
  );
}
