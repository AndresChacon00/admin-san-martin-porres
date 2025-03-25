import type {
  MetaFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/node';
import { json, Link, redirect, useFetcher } from '@remix-run/react';
import { addProfesor } from '~/api/controllers/profesores';
import { ChevronLeft } from 'lucide-react';
import { Input } from '~/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { useForm } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { z } from 'zod';
import {
  datosCargoEmpleado,
  datosPersonalesEmpleado,
  datosProfesionalesEmpleado,
} from '~/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { toast } from 'sonner';
import { extractEmpleadoFormData } from '~/lib/formData';
import { isRole } from '~/lib/auth';

export const meta: MetaFunction = () => {
  return [
    { title: 'Registrar Profesor | San Martín de Porres' },
    { name: 'description', content: 'Registra un profesor en el sistema' },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const authorized = await isRole(request, 'admin');
  if (!authorized) {
    return redirect('/');
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = extractEmpleadoFormData(formData);
  const response = await addProfesor(data);
  return json(response);
};

export default function CrearProfesor() {
  const fetcher = useFetcher<typeof action>();

  const formStepOne = useForm<z.infer<typeof datosPersonalesEmpleado>>({
    resolver: zodResolver(datosPersonalesEmpleado),
    defaultValues: {
      cantidadHijos: 0,
      hijosMenoresSeis: 0,
    },
  });

  const formStepTwo = useForm<z.infer<typeof datosProfesionalesEmpleado>>({
    resolver: zodResolver(datosProfesionalesEmpleado),
    defaultValues: {
      descripcionTitulo: '',
      carreraEstudiando: '',
      mencionTitulo: '',
      postgrado: '',
      tipoLapsoEstudios: '',
      titulo: '',
      numeroLapsosAprobados: 0,
      experienciaLaboral: 0,
    },
  });

  const formStepThree = useForm<z.infer<typeof datosCargoEmpleado>>({
    resolver: zodResolver(datosCargoEmpleado),
    defaultValues: {
      asignacionesMensual: 0,
      contribucionDiscapacidad: 0,
      contribucionDiscapacidadHijos: 0,
      deduccionesMensual: 0,
      horasSemanales: 0,
      porcentajeSso: 0,
      porcentajeFaov: 0,
      porcentajeRpe: 0,
      primaAntiguedad: 0,
      primaAsistencial: 0,
      primaCompensacionAcademica: 0,
      primaGeografica: 0,
    },
  });
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data !== undefined) {
      if (fetcher.data.type === 'success') {
        toast.success('Profesor creado con éxito');
        formStepOne.reset();
        formStepTwo.reset();
        formStepThree.reset();
        setStep(1);
      } else if (fetcher.data.type === 'error') {
        toast.error('Ocurrió un error creando al profesor');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  const goToNext = () => {
    setStep((prev) => prev + 1);
  };

  const submitFull = (stepThreeData: z.infer<typeof datosCargoEmpleado>) => {
    fetcher.submit(
      {
        ...formStepOne.getValues(),
        ...formStepTwo.getValues(),
        ...stepThreeData,
      },
      { method: 'POST', action: '/profesores/nuevo' },
    );
  };

  return (
    <>
      <Link
        to='/profesores'
        className='text-sm text-gray-500 hover:underline inline-flex items-center'
      >
        <ChevronLeft />
        Volver
      </Link>
      <h1 className='text-xl font-bold mb-3'>Agregar Profesor</h1>
      <Form {...formStepOne}>
        <form
          onSubmit={formStepOne.handleSubmit(goToNext)}
          className={cn('w-1/2 pb-12 space-y-3', step === 1 ? '' : 'hidden')}
        >
          <h2 className='text-lg font-semibold'>Datos personales:</h2>
          <FormField
            control={formStepOne.control}
            name='cedula'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cédula</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Ejemplo: V12345678' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepOne.control}
            name='nombreCompleto'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepOne.control}
            name='fechaNacimiento'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de nacimiento</FormLabel>
                <FormControl>
                  <Input {...field} type='date' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepOne.control}
            name='sexo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className='flex flex-col space-y-1'
                  >
                    <FormItem className='flex items-center space-x-3 space-y-0'>
                      <FormControl>
                        <RadioGroupItem value='F' />
                      </FormControl>
                      <FormLabel className='font-normal'>Femenino</FormLabel>
                    </FormItem>
                    <FormItem className='flex items-center space-x-3 space-y-0'>
                      <FormControl>
                        <RadioGroupItem value='M' />
                      </FormControl>
                      <FormLabel className='font-normal'>Masculino</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepOne.control}
            name='estadoCivil'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado civil</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccionar estado civil' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='S'>Soltero</SelectItem>
                    <SelectItem value='C'>Casado</SelectItem>
                    <SelectItem value='D'>Divorciado</SelectItem>
                    <SelectItem value='V'>Viudo</SelectItem>
                    <SelectItem value='R'>R</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepOne.control}
            name='religion'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Religión</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepOne.control}
            name='cantidadHijos'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad de Hijos</FormLabel>
                <FormControl>
                  <Input {...field} type='number' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepOne.control}
            name='hijosMenoresSeis'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hijos menores de seis años</FormLabel>
                <FormControl>
                  <Input {...field} type='number' min={0} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='bg-blue-500 hover:bg-blue-700'>
            Continuar
          </Button>
        </form>
      </Form>

      <Form {...formStepTwo}>
        <form
          onSubmit={formStepTwo.handleSubmit(goToNext)}
          className={cn('w-1/2 pb-12 space-y-3', step === 2 ? '' : 'hidden')}
        >
          <h2 className='text-lg font-semibold'>Datos profesionales</h2>
          <FormField
            control={formStepTwo.control}
            name='fechaIngresoAvec'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de ingreso al AVEC</FormLabel>
                <FormControl>
                  <Input {...field} type='date' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepTwo.control}
            name='fechaIngresoPlantel'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de ingreso al plantel</FormLabel>
                <FormControl>
                  <Input {...field} type='date' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepTwo.control}
            name='titulo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepTwo.control}
            name='descripcionTitulo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción del título</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepTwo.control}
            name='mencionTitulo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mención del título</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepTwo.control}
            name='carreraEstudiando'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carrera estudiando</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepTwo.control}
            name='tipoLapsoEstudios'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de lapso de estudios</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepTwo.control}
            name='numeroLapsosAprobados'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de lapsos aprobados</FormLabel>
                <FormControl>
                  <Input {...field} type='number' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepTwo.control}
            name='postgrado'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postgrado</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepTwo.control}
            name='experienciaLaboral'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Años de experiencia laboral</FormLabel>
                <FormControl>
                  <Input {...field} type='number' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='bg-blue-500 hover:bg-blue-700'>
            Continuar
          </Button>
        </form>
      </Form>

      <Form {...formStepThree}>
        <form
          onSubmit={formStepThree.handleSubmit((values) => {
            submitFull(values);
          })}
          className={cn('w-1/2 pb-12 space-y-3', step === 3 ? '' : 'hidden')}
        >
          <h2 className='text-lg font-semibold'>Datos del cargo</h2>
          <FormField
            control={formStepThree.control}
            name='gradoSistema'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grado en el Sistema</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='nivelSistema'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nivel en el Sistema</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='gradoCentro'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grado en el centro</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='nivelCentro'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nivel en el centro</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='cargo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='horasSemanales'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horas Semanales</FormLabel>
                <FormControl>
                  <Input {...field} type='number' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='sueldo'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sueldo</FormLabel>
                <FormControl>
                  <Input {...field} type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='asignacionesMensual'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asignaciones Mensuales</FormLabel>
                <FormControl>
                  <Input {...field} type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='deduccionesMensual'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deducciones Mensuales</FormLabel>
                <FormControl>
                  <Input {...field} type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='primaAntiguedad'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prima de Antigüedad</FormLabel>
                <FormControl>
                  <Input {...field} type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='primaGeografica'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prima Geográfica</FormLabel>
                <FormControl>
                  <Input {...field} type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='primaCompensacionAcademica'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prima de Compensación Académica</FormLabel>
                <FormControl>
                  <Input {...field} type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='primaAsistencial'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prima Asistencial</FormLabel>
                <FormControl>
                  <Input {...field} type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='contribucionDiscapacidad'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contribución por Discapacidad</FormLabel>
                <FormControl>
                  <Input {...field} type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='contribucionDiscapacidadHijos'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contribución por Discapacidad de Hijos</FormLabel>
                <FormControl>
                  <Input {...field} type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='porcentajeSso'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Porcentaje SSO</FormLabel>
                <FormControl>
                  <Input {...field} type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='porcentajeRpe'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Porcentaje RPE</FormLabel>
                <FormControl>
                  <Input {...field} type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='porcentajeFaov'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Porcentaje FAOV</FormLabel>
                <FormControl>
                  <Input {...field} type='number' step='0.01' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='pagoDirecto'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Pago directo</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='jubilado'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Jubilado</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='cuentaBancaria'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuenta Bancaria</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formStepThree.control}
            name='observaciones'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observaciones</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700'
            disabled={fetcher.state === 'submitting'}
          >
            Registrar
          </Button>
        </form>
      </Form>
    </>
  );
}
