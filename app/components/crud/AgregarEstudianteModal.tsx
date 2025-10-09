import { useState, ChangeEvent, FormEvent } from 'react';
import { useFetcher } from '@remix-run/react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
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
  fechaNacimiento: string;
  edad: string;
  religion: string;
  telefono: string;
  correo: string;
  direccion: string;
  ultimoAñoCursado: string;
}

export function AgregarEstudianteModal() {
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<FormValues>({
    nombre: '',
    apellido: '',
    cedula: '',
    sexo: '',
    fechaNacimiento: '',
    edad: '',
    religion: '',
    telefono: '',
    correo: '',
    direccion: '',
    ultimoAñoCursado: '',
  });
  // errors state unused for now
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('actionType', 'agregar');
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    // Use fetch directly to ensure we request JSON and receive a structured response
    (async () => {
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

        // First, try to read helpful headers that the server may set even when the body is empty
        const headerMsg = res.headers.get('x-error-message') || res.headers.get('x-message');
        if (headerMsg && !res.ok) {
          toast.error(`(${res.status}) ${headerMsg}`);
          setOpen(false);
          setLoading(false);
          return;
        }

        // If server returned HTML (dev overlay / error page), try to parse it and detect DB unique errors
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('text/html') && !res.ok) {
          try {
            const html = await res.text();
            // Heuristic: look for SQLite UNIQUE constraint message using regex (case-insensitive)
            const uniqueMatch = html.match(/UNIQUE constraint failed:\s*([\w.-]+)/i);
            if (uniqueMatch) {
              const full = uniqueMatch[1]; // e.g. estudiantes.correo
              const colMatch = full.match(/(?:\.|_)(correo|cedula|email|cedula)/i);
              const col = colMatch ? colMatch[1].toLowerCase() : full.toLowerCase();
              const friendly = col.includes('correo') || col.includes('email') ? 'correo' : col.includes('cedula') ? 'cédula' : col;
              toast.error(`(${res.status}) Estudiante ya existe (${friendly} duplicado)`);
              setOpen(false);
              setLoading(false);
              return;
            }
            // otherwise show a short generic message without the raw HTML
            toast.error(`(${res.status}) Error del servidor (ver consola para detalles)`);
            // also log the HTML snippet to console for debugging
            // eslint-disable-next-line no-console
            console.error('Server HTML response snippet:', html.slice(0, 500));
            setOpen(false);
            setLoading(false);
            return;
          } catch (e) {
            // ignore and fall through to other fallbacks
          }
        }

        let d: { type?: string; message?: string } | null = null;
        // Try to parse JSON; if parsing fails, try to get plain text body
        let textBody: string | null = null;
        try {
          d = await res.json();
        } catch (err) {
          d = null;
          try {
            textBody = await res.text();
          } catch {
            textBody = null;
          }
        }
        // Log response for visibility when debugging in the browser (including headers)
        // eslint-disable-next-line no-console
        console.debug('AgregarEstudiante response', {
          status: res.status,
          redirected: res.redirected,
          json: d,
          text: textBody,
          headers: Object.fromEntries(Array.from(res.headers.entries())),
        });
        // If server provided a raw error header, show it (this will include DB error details)
        const rawHeader = res.headers.get('x-raw-error');
        if (rawHeader) {
          toast.error(`(${res.status}) ${rawHeader}`);
          setOpen(false);
          setLoading(false);
          return;
        }
            // If the server returned JSON with {type: ...} handle it
          if (d && (d.type === 'success' || d.type === 'succes')) {
            toast.success(d.message || 'Estudiante agregado');
            setOpen(false);
            try {
              window.dispatchEvent(new Event('refreshEstudiantes'));
            } catch (_) {
              // ignore in non-browser environments
            }
            fetcher.load(window.location.pathname);
            return;
          }

        // If server returned JSON error or any JSON body with a message
        if (d) {
          // d can be object, string, array, etc. Normalize to message
          let extracted: string | null = null;
          if (typeof d === 'string') extracted = d;
          else if (Array.isArray(d)) extracted = JSON.stringify(d);
          else if (typeof d === 'object' && d !== null) {
            const dd = d as { type?: string; message?: string; error?: string };
            extracted = dd.message || dd.error || (dd.type ? JSON.stringify(dd) : null);
          }

          if (extracted) {
            const isErrorType = typeof d === 'object' && d !== null && 'type' in d && (d as { type?: string }).type === 'error';
            if (isErrorType || !res.ok) {
              const label = `(${res.status}) ${extracted}`;
              toast.error(label);
              setOpen(false);
              return;
            }
          }
        }

        // If we couldn't parse JSON/text, try reading error message from headers
        if (!d && !textBody) {
          const headerMsg = res.headers.get('x-error-message') || res.headers.get('x-message');
          if (headerMsg) {
            toast.error(`(${res.status}) ${headerMsg}`);
            setOpen(false);
            setLoading(false);
            return;
          }
        }

        // Fallbacks: if HTTP status indicates success treat as success
        if (res.ok) {
          toast.success('Estudiante agregado');
          setOpen(false);
          try {
            window.dispatchEvent(new Event('refreshEstudiantes'));
          } catch (_) {
            // ignore in non-browser environments
          }
          fetcher.load(window.location.pathname);
          return;
        }

        // At this point response is not ok and we didn't get a structured JSON error
        const fallbackMsg = d ? ((d as { message?: string; error?: string }).message || (d as { message?: string; error?: string }).error) : textBody;
        if (fallbackMsg) {
          toast.error(`(${res.status}) ${fallbackMsg}`);
        } else {
          toast.error(`(${res.status}) ${res.statusText || 'Ocurrió un error inesperado'}`);
        }
        setOpen(false);
      } catch (err: unknown) {
        console.error('Error en fetch:', String(err));
        toast.error('Error al comunicarse con el servidor');
        setOpen(false);
      } finally {
        setLoading(false);
      }
    })();
  };

  // We handle success/error directly in the fetch flow above. No fetcher effect needed.

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="link-button" onClick={() => setOpen(true)}>Agregar Estudiante</Button>
      </DialogTrigger>
      <DialogContent>
    {/* using controlled open state to close the dialog on submit result */}
        <DialogHeader>
          <DialogTitle>Agregar estudiante</DialogTitle>
          <DialogDescription>
            Ingresa los datos del nuevo estudiante.
          </DialogDescription>
        </DialogHeader>
  <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
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

          {/* Cédula */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='cedula' className='text-right'>
              Cédula
            </Label>
            <Input
              id='cedula'
              name='cedula'
              value={values.cedula}
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
                value={values.sexo}
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
              value={values.fechaNacimiento}
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
              {loading ? 'Guardando...' : 'Agregar estudiante'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
