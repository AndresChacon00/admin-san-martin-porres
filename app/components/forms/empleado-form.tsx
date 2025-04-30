import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
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
import { TituloSelect } from '~/types/titulos.types';
import { NivelSelect } from '~/types/niveles.types';
import { GradosSelect } from '../../types/grados.types';
import { CargoSelect } from '~/types/cargos.types';

interface EmpleadoFormProps {
  fetcher: FetcherWithComponents<{
    readonly type: 'success' | 'error';
    readonly message: string;
  }>;
  scrollToTop: () => void;
  tipoEmpleado: 'empleados' | 'profesores';
  titulos: TituloSelect[];
  equivalenciasNiveles: EquivalenciaNivel[];
  equivalenciasGrados: EquivalenciaGrado[];
  equivalenciasCargos: EquivalenciaCargo[];
}

export default function EmpleadoForm({
  fetcher,
  scrollToTop,
  tipoEmpleado,
  titulos,
  equivalenciasNiveles,
  equivalenciasGrados,
  equivalenciasCargos,
}: EmpleadoFormProps) {
  const niveles: NivelSelect[] = useMemo(() => {
    const nivelesExtraidos = equivalenciasNiveles
      .map((equiv) => ({
        id: equiv.nivelId,
        nombre: equiv.nombreNivel,
      }))
      .filter(
        (nivel, index, self) =>
          index === self.findIndex((n) => n.id === nivel.id),
      );
    return nivelesExtraidos;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grados: GradosSelect[] = useMemo(() => {
    const gradosExtraidos = equivalenciasGrados
      .map((equiv) => ({
        id: equiv.gradoId,
        codigo: equiv.nombreGrado,
      }))
      .filter(
        (grado, index, self) =>
          index === self.findIndex((g) => g.id === grado.id),
      );
    return gradosExtraidos;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [opcionesCargo, setOpcionesCargo] = useState<CargoSelect[]>(
    equivalenciasCargos
      .map((equiv) => ({
        id: equiv.cargoId,
        codigo: equiv.codigoCargo,
        nombreCargo: equiv.nombreCargo,
        nivelCargo: equiv.nombreNivel,
      }))
      .filter(
        (cargo, index, self) =>
          index === self.findIndex((c) => c.id === cargo.id),
      ),
  );

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
      titulo: undefined,
      carreraEstudiando: '',
      descripcionTitulo: '',
      mencionTitulo: '',
      postgrado: '',
      tipoLapsoEstudios: '',
      numeroLapsosAprobados: 0,
      experienciaLaboral: 0,
    },
  });

  const formStepThree = useForm<z.infer<typeof datosCargoEmpleado>>({
    resolver: zodResolver(datosCargoEmpleado),
    defaultValues: {
      contribucionDiscapacidad: 0,
      contribucionDiscapacidadHijos: 0,
      horasSemanales: 0,
      sueldo: 0,
    },
  });

  const [step, setStep] = useState(1);

  const goToNext = () => {
    scrollToTop();
    setStep(step + 1);
  };

  const goToPrevious = () => setStep(step - 1);

  const updatePositionFormWithEquivalencias = (
    titulo: number,
    experienciaLaboral: number,
    fechaIngresoAvec: string,
    fetchaIngresoPlantel: string,
  ) => {
    // Nivel sistema calculado en base al tiempo de servicio en centros AVEC
    const avecDate = new Date(fechaIngresoAvec);
    const yearsSinceAvecDate =
      new Date().getFullYear() - avecDate.getFullYear();
    const nivelEquivalente = equivalenciasNiveles
      .filter((eq) => eq.minTiempoServicio <= yearsSinceAvecDate)
      .sort((a, b) => b.minTiempoServicio - a.minTiempoServicio);
    if (nivelEquivalente.length === 0) {
      toast.error(
        'No se encontró un nivel equivalente para la experiencia laboral',
      );
      return;
    }
    const nivelSistema = nivelEquivalente[0].nivelId;
    formStepThree.setValue('nivelSistema', nivelSistema);

    // Nivel plantel calculado en base al tiempo de servicio en el plantel
    const plantelDate = new Date(fetchaIngresoPlantel);
    const yearsSincePlantelDate =
      new Date().getFullYear() - plantelDate.getFullYear();
    const nivelEquivalentePlantel = equivalenciasNiveles
      .filter((eq) => eq.minTiempoServicio <= yearsSincePlantelDate)
      .sort((a, b) => b.minTiempoServicio - a.minTiempoServicio);
    if (nivelEquivalentePlantel.length === 0) {
      toast.error(
        'No se encontró un nivel equivalente para la experiencia laboral',
      );
      return;
    }
    const nivelCentro = nivelEquivalentePlantel[0].nivelId;

    // Grado del empleado calculado en base al título y la experienciaLaboral
    const gradoEquivalente = equivalenciasGrados
      .filter(
        (eq) =>
          eq.tituloId === titulo && eq.experienciaLaboral <= experienciaLaboral,
      )
      .sort((a, b) => b.experienciaLaboral - a.experienciaLaboral);
    if (gradoEquivalente.length === 0) {
      toast.error(
        'No se encontró un grado equivalente para la experiencia laboral',
      );
      return;
    }
    const gradoEmpleado = gradoEquivalente[0].gradoId;

    // Cargo del empleado determinado en base a su nivel y grado
    const cargosEquivalentes = equivalenciasCargos
      .filter((eq) => eq.nivelId === nivelSistema)
      .map((eq) => ({
        id: eq.cargoId,
        codigo: eq.codigoCargo,
        nivelCargo: eq.nivelCargo,
        nombreCargo: eq.nombreCargo,
      }));
    setOpcionesCargo(cargosEquivalentes);

    formStepThree.setValue('nivelCentro', nivelCentro);
    formStepThree.setValue('gradoCentro', gradoEmpleado);
    formStepThree.setValue('gradoSistema', gradoEmpleado);
  };

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
        titulos={titulos}
        updateWithEquivalencias={updatePositionFormWithEquivalencias}
      />

      <StepThreeForm
        formStepThree={formStepThree}
        fetcher={fetcher}
        goToPrevious={goToPrevious}
        step={step}
        submitFull={submitFull}
        niveles={niveles}
        grados={grados}
        cargos={opcionesCargo}
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
  titulos,
  updateWithEquivalencias,
}: {
  formStepTwo: UseFormReturn<EmpleadoProfessionalData, unknown, undefined>;
  goToNext: () => void;
  goToPrevious: () => void;
  step: number;
  titulos: TituloSelect[];
  updateWithEquivalencias: (
    titulo: number,
    experienciaLaboral: number,
    fechaIngresoAvec: string,
    fechaIngresoPlantel: string,
  ) => void;
}) {
  return (
    <Form {...formStepTwo}>
      <form
        onSubmit={formStepTwo.handleSubmit((values) => {
          updateWithEquivalencias(
            values.titulo,
            values.experienciaLaboral,
            values.fechaIngresoAvec,
            values.fechaIngresoPlantel,
          );
          goToNext();
        })}
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
              <RequiredLabel>Título</RequiredLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccionar título' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {titulos.map((titulo) => (
                    <SelectItem key={titulo.id} value={String(titulo.id)}>
                      {titulo.nombre} ({titulo.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <RequiredLabel>Años de experiencia laboral</RequiredLabel>
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
  niveles,
  grados,
  cargos,
}: {
  formStepThree: UseFormReturn<EmpleadoPositionData, unknown, undefined>;
  submitFull: (data: EmpleadoPositionData) => void;
  step: number;
  goToPrevious: () => void;
  fetcher: FetcherWithComponents<{
    readonly type: 'success' | 'error';
    readonly message: string;
  }>;
  niveles: NivelSelect[];
  grados: GradosSelect[];
  cargos: CargoSelect[];
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
              <Select
                onValueChange={field.onChange}
                defaultValue={String(field.value)}
                value={String(field.value)}
                name={field.name}
                disabled
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccionar grado' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {grados.map((grado) => (
                    <SelectItem key={grado.id} value={String(grado.id)}>
                      {grado.codigo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Select
                onValueChange={field.onChange}
                defaultValue={String(field.value)}
                value={String(field.value)}
                name={field.name}
                disabled
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccionar nivel' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {niveles.map((nivel) => (
                    <SelectItem key={nivel.id} value={String(nivel.id)}>
                      {nivel.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Select
                onValueChange={field.onChange}
                defaultValue={String(field.value)}
                value={String(field.value)}
                name={field.name}
                disabled
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccionar grado' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {grados.map((grado) => (
                    <SelectItem key={grado.id} value={String(grado.id)}>
                      {grado.codigo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Select
                onValueChange={field.onChange}
                defaultValue={String(field.value)}
                value={String(field.value)}
                name={field.name}
                disabled
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccionar nivel' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {niveles.map((nivel) => (
                    <SelectItem key={nivel.id} value={String(nivel.id)}>
                      {nivel.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Select
                onValueChange={field.onChange}
                defaultValue={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccionar cargo' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cargos.map((cargo) => (
                    <SelectItem key={cargo.id} value={String(cargo.id)}>
                      {cargo.nombreCargo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
