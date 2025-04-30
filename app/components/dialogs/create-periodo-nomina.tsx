import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { z } from 'zod';
import { periodoNominaSchema } from '~/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useFetcher } from '@remix-run/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function CreatePeriodoNominaDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const form = useForm<z.infer<typeof periodoNominaSchema>>({
    resolver: zodResolver(periodoNominaSchema),
    defaultValues: {
      nombre: '',
    },
  });

  const fetcher = useFetcher<{ type: string; message: string }>();

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data !== undefined) {
      if (fetcher.data.type === 'success') {
        toast.success(fetcher.data.message);
        form.reset();
        onClose();
      } else if (fetcher.data.type === 'error') {
        toast.error(fetcher.data.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear periodo de nómina</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className='space-y-4'
            onSubmit={form.handleSubmit((data) =>
              fetcher.submit(data, {
                method: 'post',
                action: '/periodos-nomina/nuevo',
              }),
            )}
          >
            <FormField
              name='nombre'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del periodo</FormLabel>
                  <Input placeholder='Nombre del periodo' {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='link-button w-full'>Guardar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
