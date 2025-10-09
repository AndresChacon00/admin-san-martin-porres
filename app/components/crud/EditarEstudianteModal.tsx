import { useState, ChangeEvent, FormEvent, useCallback } from 'react';
import { useFetcher } from '@remix-run/react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Input } from '~/components/ui/input';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';

interface FormValues {
  nombre: string;
  apellido: string;
  cedula: string;
  sexo: string;
  fechaNacimiento: Date | null;
  edad: number;
  religion: string;
  telefono: string;
  correo: string;
  direccion: string;
  ultimoAñoCursado: string;
}

interface EditarEstudianteModalProps {
  estudiante: FormValues;
  open: boolean;
  onClose: () => void;
}

export function EditarEstudianteModal({
  estudiante,
  open: openProp,
  onClose,
}: EditarEstudianteModalProps) {
  const [values, setValues] = useState<FormValues>(() => ({
    ...estudiante,
  }));
  const [open, setOpen] = useState<boolean>(!!openProp);
  const [loading, setLoading] = useState(false);
  const fetcher = useFetcher();

  const controlled = typeof openProp !== 'undefined';
  const dialogOpen = controlled ? openProp : open;
  const setDialogOpen = useCallback(
    (v: boolean) => {
      if (controlled) {
        if (!v) onClose?.();
      } else {
        setOpen(v);
      }
    },
    [controlled, onClose]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setValues((prev) => {
      // Handle fechaNacimiento specifically
      if (name === 'fechaNacimiento') {
        const parsedDate = new Date(value);
        if (isNaN(parsedDate.getTime())) {
          console.error('Invalid date format:', value);
          return prev; // Do not update if the date is invalid
        }
        return { ...prev, [name]: parsedDate };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('actionType', 'editar');
    Object.entries(values).forEach(([key, value]) => {
      // convert dates to ISO if necessary
      if (value instanceof Date) formData.append(key, value.toISOString());
      else formData.append(key, String(value));
    });

    setLoading(true);
    try {
      const res = await fetch('/estudiantes', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData,
      });

      // try headers first
      const headerMsg = res.headers.get('x-error-message') || res.headers.get('x-message');
      if (headerMsg && !res.ok) {
        toast.error(`(${res.status}) ${headerMsg}`);
        setDialogOpen(false);
        return;
      }

      const rawHeader = res.headers.get('x-raw-error');
      if (rawHeader) {
        toast.error(`(${res.status}) ${rawHeader}`);
        setDialogOpen(false);
        return;
      }

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/html') && !res.ok) {
        const html = await res.text();
        const uniqueMatch = html.match(/UNIQUE constraint failed:\s*([\w.-]+)/i);
        if (uniqueMatch) {
          const full = uniqueMatch[1];
          const colMatch = full.match(/(?:\.|_)(correo|cedula|email|cedula)/i);
          const col = colMatch ? colMatch[1].toLowerCase() : full.toLowerCase();
          const friendly = col.includes('correo') || col.includes('email') ? 'correo' : col.includes('cedula') ? 'cédula' : col;
          toast.error(`(${res.status}) Estudiante ya existe (${friendly} duplicado)`);
          setDialogOpen(false);
          return;
        }
        toast.error(`(${res.status}) Error del servidor`);
        // eslint-disable-next-line no-console
        console.error('Server HTML response snippet:', html.slice(0, 500));
        setDialogOpen(false);
        return;
      }

      // try parse json
      let d: { type?: string; message?: string } | null = null;
      try {
        d = await res.json();
      } catch (err) {
        d = null;
      }

      if (d && (d.type === 'success' || d.type === 'succes')) {
        try {
          window.dispatchEvent(new Event('refreshEstudiantes'));
        } catch (_) {
          // ignore in non-browser environments
        }
        fetcher.load(window.location.pathname);
        toast.success(d.message || 'Estudiante actualizado');
        setDialogOpen(false);
        return;
      }

      if (d && d.type === 'error') {
        toast.error(d.message || 'Ocurrió un error');
        setDialogOpen(false);
        return;
      }

      if (res.ok) {
        try {
          window.dispatchEvent(new Event('refreshEstudiantes'));
        } catch (_) {
          // ignore in non-browser environments
        }
        fetcher.load(window.location.pathname);
        toast.success('Estudiante actualizado');
        setDialogOpen(false);
        return;
      }

      // fallback
      toast.error(`(${res.status}) ${res.statusText || 'Ocurrió un error'}`);
      setDialogOpen(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error en fetch editar estudiante:', err);
      toast.error('Error al comunicarse con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // fetcher-based effect removed: this component now uses direct fetch and handles
  // success/error/toast/close inside the submit flow.

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar estudiante</DialogTitle>
          <DialogDescription>
            Modifica los datos del estudiante
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
          {/* Cedula (non-editable) */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='cedula' className='text-right'>
              Cédula
            </Label>
            <Input
              id='cedula'
              name='cedula'
              value={values.cedula}
              readOnly
              className='col-span-3'
            />
          </div>
          {/* Nombre */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='nombre' className='text-right'>
              Nombre
            </Label>
            <Input
              id='nombre'
              name='nombre'
              value={values.nombre}
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>
          {/* Apellido */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='apellido' className='text-right'>
              Apellido
            </Label>
            <Input
              id='apellido'
              name='apellido'
              value={values.apellido}
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>

          {/* Sexo */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='sexo' className='text-right'>
              Sexo
            </Label>
            <div className='col-span-3'>
              <RadioGroup
                value={String(values.sexo ?? '')}
                onValueChange={(v) => setValues((p) => ({ ...p, sexo: v }))}
                className='flex gap-4'
                aria-label='Sexo'
              >
                <div className='flex items-center gap-2'>
                  <RadioGroupItem value='M' aria-label='Masculino' />
                  <span>Masculino</span>
                </div>
                <div className='flex items-center gap-2'>
                  <RadioGroupItem value='F' aria-label='Femenino' />
                  <span>Femenino</span>
                </div>
              </RadioGroup>
            </div>
          </div>
          {/* Fecha de Nacimiento */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='fechaNacimiento' className='text-right'>
              Fecha de Nacimiento
            </Label>
            <Input
              id='fechaNacimiento'
              name='fechaNacimiento'
              type='date'
              value={
                values.fechaNacimiento
                  ? values.fechaNacimiento.toISOString().split('T')[0]
                  : ''
              }
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>
          {/* Edad */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='edad' className='text-right'>
              Edad
            </Label>
            <Input
              id='edad'
              name='edad'
              type='number'
              value={values.edad}
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>
          {/* Religión */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='religion' className='text-right'>
              Religión
            </Label>
            <Input
              id='religion'
              name='religion'
              value={values.religion}
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>
          {/* Teléfono */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='telefono' className='text-right'>
              Teléfono
            </Label>
            <Input
              id='telefono'
              name='telefono'
              value={values.telefono}
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>
          {/* Correo */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='correo' className='text-right'>
              Correo
            </Label>
            <Input
              id='correo'
              name='correo'
              type='email'
              value={values.correo}
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>
          {/* Dirección */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='direccion' className='text-right'>
              Dirección
            </Label>
            <Input
              id='direccion'
              name='direccion'
              value={values.direccion}
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>
          {/* Último Año Cursado */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='ultimoAñoCursado' className='text-right'>
              Último Año Cursado
            </Label>
            <Input
              id='ultimoAñoCursado'
              name='ultimoAñoCursado'
              value={values.ultimoAñoCursado}
              onChange={handleChange}
              className='col-span-3'
              required
            />
          </div>
          <DialogFooter>
            <Button type='submit' className='link-button' disabled={loading}>
              {loading ? 'Guardando...' : 'Confirmar cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
