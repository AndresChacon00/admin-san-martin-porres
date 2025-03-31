import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import {
  datosCargoEmpleado,
  datosPersonalesEmpleado,
  datosProfesionalesEmpleado,
} from '~/lib/validators';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { cn } from '~/lib/utils';
import RequiredLabel from './required-label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { FetcherWithComponents } from '@remix-run/react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { CircleHelp } from 'lucide-react';
import {
  EquivalenciaCargo,
  EquivalenciaGrado,
  EquivalenciaNivel,
} from '~/types/equivalencias.types';
import {
  EmpleadoPersonalData,
  EmpleadoPositionData,
  EmpleadoProfessionalData,
} from '~/types/empleados.types';

interface EmpleadoFormProps {
  fetcher: FetcherWithComponents<{
    readonly type: 'success' | 'error';
    readonly message: string;
  }>;
  scrollToTop: () => void;
  tipoEmpleado: 'empleados' | 'profesores';
  equivalenciasNiveles: EquivalenciaNivel[];
  equivalenciasGrados: EquivalenciaGrado[];
  equivalenciasCargos: EquivalenciaCargo[];
}

export default function EmpleadoForm({
  fetcher,
  scrollToTop,
  tipoEmpleado,
  equivalenciasNiveles,
  equivalenciasGrados,
  equivalenciasCargos,
}: EmpleadoFormProps) {
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
      titulo: '',
      carreraEstudiando: '',
      descripcionTitulo: '',
      mencionTitulo: '',
      postgrado: '',
      tipoLapsoEstudios: '',
      numeroLapsosAprobados: undefined,
      experienciaLaboral: undefined,
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

  const goToNext = () => {
    scrollToTop();
    setStep(step + 1);
  };

  const goToPrevious = () => setStep(step - 1);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data !== undefined) {
      if (fetcher.data.type === 'success') {
        toast.success('Empleado creado con éxito');
        formStepOne.reset();
        formStepTwo.reset();
        formStepThree.reset();
        setStep(1);
      } else if (fetcher.data.type === 'error') {
        toast.error('Ocurrió un error creando al empleado');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  const submitFull = (stepThreeData: z.infer<typeof datosCargoEmpleado>) => {
    fetcher.submit(
      {
        ...formStepOne.getValues(),
        ...formStepTwo.getValues(),
        ...stepThreeData,
      },
      { method: 'POST', action: `/${tipoEmpleado}/nuevo` },
    );
  };

  return (
    <>
      <StepOneForm formStepOne={formStepOne} goToNext={goToNext} step={step} />

      <StepTwoForm
        formStepTwo={formStepTwo}
        step={step}
        goToNext={goToNext}
        goToPrevious={goToPrevious}
      />

      <StepThreeForm
        formStepThree={formStepThree}
        fetcher={fetcher}
        goToPrevious={goToPrevious}
        step={step}
        submitFull={submitFull}
      />
    </>
  );
}

function StepOneForm({
  formStepOne,
  goToNext,
  step,
}: {
  formStepOne: UseFormReturn<EmpleadoPersonalData, unknown, undefined>;
  goToNext: () => void;
  step: number;
}) {
  return (
    <Form {...formStepOne}>
      <form
        onSubmit={formStepOne.handleSubmit(goToNext)}
        className={cn('w-1/2 pb-12 space-y-3 mt-2', step === 1 ? '' : 'hidden')}
      >
        <h2 className='text-lg font-semibold'>Datos personales:</h2>
        <FormField
          control={formStepOne.control}
          name='cedula'
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Cédula</RequiredLabel>
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
              <RequiredLabel>Nombre completo</RequiredLabel>
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
              <RequiredLabel>Fecha de nacimiento</RequiredLabel>
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
              <RequiredLabel>Sexo</RequiredLabel>
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
              <RequiredLabel>Estado civil</RequiredLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <RequiredLabel>Religión</RequiredLabel>
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
              <div className='flex gap-2 items-center'>
                <RequiredLabel>Cantidad de Hijos</RequiredLabel>
                <Tooltip>
                  <TooltipTrigger>
                    <CircleHelp size={19} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Solo los menores de edad que estén estudiando</p>
                  </TooltipContent>
                </Tooltip>
              </div>
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
              <RequiredLabel>Hijos menores de seis años</RequiredLabel>
              <FormControl>
                <Input {...field} type='number' min={0} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end'>
          <Button type='submit' className='bg-blue-500 hover:bg-blue-700'>
            Continuar
          </Button>
        </div>
      </form>
    </Form>
  );
}

function StepTwoForm({
  formStepTwo,
  goToNext,
  goToPrevious,
  step,
}: {
  formStepTwo: UseFormReturn<EmpleadoProfessionalData, unknown, undefined>;
  goToNext: () => void;
  goToPrevious: () => void;
  step: number;
}) {
  return (
    <Form {...formStepTwo}>
      <form
        onSubmit={formStepTwo.handleSubmit(goToNext)}
        className={cn('w-1/2 pb-12 space-y-3 mt-2', step === 2 ? '' : 'hidden')}
      >
        <h2 className='text-lg font-semibold'>Datos profesionales</h2>
        <FormField
          control={formStepTwo.control}
          name='fechaIngresoAvec'
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Fecha de ingreso al AVEC</RequiredLabel>
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
              <RequiredLabel>Fecha de ingreso al plantel</RequiredLabel>
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
        <div className='flex justify-between'>
          <Button
            type='button'
            variant='secondary'
            className='text-neutral-700'
            onClick={goToPrevious}
          >
            Atrás
          </Button>
          <Button type='submit' className='bg-blue-500 hover:bg-blue-700'>
            Continuar
          </Button>
        </div>
      </form>
    </Form>
  );
}

function StepThreeForm({
  formStepThree,
  submitFull,
  step,
  goToPrevious,
  fetcher,
}: {
  formStepThree: UseFormReturn<EmpleadoPositionData, unknown, undefined>;
  submitFull: (data: EmpleadoPositionData) => void;
  step: number;
  goToPrevious: () => void;
  fetcher: FetcherWithComponents<{
    readonly type: 'success' | 'error';
    readonly message: string;
  }>;
}) {
  return (
    <Form {...formStepThree}>
      <form
        onSubmit={formStepThree.handleSubmit((values) => {
          submitFull(values);
        })}
        className={cn('w-1/2 pb-12 space-y-3 mt-2', step === 3 ? '' : 'hidden')}
      >
        <h2 className='text-lg font-semibold'>Datos del cargo</h2>
        <FormField
          control={formStepThree.control}
          name='gradoSistema'
          render={({ field }) => (
            <FormItem>
              <RequiredLabel>Grado en el Sistema</RequiredLabel>
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
              <RequiredLabel>Nivel en el Sistema</RequiredLabel>
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
              <RequiredLabel>Grado en el centro</RequiredLabel>
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
              <RequiredLabel>Nivel en el centro</RequiredLabel>
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
              <RequiredLabel>Cargo</RequiredLabel>
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
              <RequiredLabel>Horas Semanales</RequiredLabel>
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
              <RequiredLabel>Sueldo</RequiredLabel>
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
              <RequiredLabel>Asignaciones Mensuales</RequiredLabel>
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
              <RequiredLabel>Deducciones Mensuales</RequiredLabel>
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
              <RequiredLabel>Prima de Antigüedad</RequiredLabel>
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
              <RequiredLabel>Prima Geográfica</RequiredLabel>
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
              <RequiredLabel>Prima de Compensación Académica</RequiredLabel>
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
              <RequiredLabel>Prima Asistencial</RequiredLabel>
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
              <RequiredLabel>Contribución por Discapacidad</RequiredLabel>
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
              <RequiredLabel>
                Contribución por Discapacidad de Hijos
              </RequiredLabel>
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
              <RequiredLabel>Porcentaje SSO</RequiredLabel>
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
              <RequiredLabel>Porcentaje RPE</RequiredLabel>
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
              <RequiredLabel>Porcentaje FAOV</RequiredLabel>
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

        <div className='flex justify-between'>
          <Button
            type='button'
            variant='secondary'
            className='text-neutral-700'
            onClick={goToPrevious}
          >
            Atrás
          </Button>
          <Button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700'
            disabled={fetcher.state === 'submitting'}
          >
            Registrar
          </Button>
        </div>
      </form>
    </Form>
  );
}
