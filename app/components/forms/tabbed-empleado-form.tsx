import { FetcherWithComponents } from '@remix-run/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  datosCargoEmpleado,
  datosPersonalesEmpleado,
  datosProfesionalesEmpleado,
} from '~/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
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
import RequiredLabel from './required-label';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { CircleHelp } from 'lucide-react';
import { TituloSelect } from '~/types/titulos.types';
import { NivelSelect } from '~/types/niveles.types';
import { GradosSelect } from '~/types/grados.types';
import { CargoSelect } from '~/types/cargos.types';

interface TabbedEmpleadoFormProps {
  empleadoId: number;
  fetcher: FetcherWithComponents<{
    type: string | 'success' | 'error';
    message: string | undefined;
  }>;
  formOneDefault: {
    cedula?: string;
    nombreCompleto?: string;
    fechaNacimiento?: string;
    sexo?: 'F' | 'M';
    estadoCivil?: 'S' | 'C' | 'D' | 'V' | 'R';
    religion?: string;
    cantidadHijos: number;
    hijosMenoresSeis: number;
  };
  formTwoDefault: {
    fechaIngresoAvec?: string;
    fechaIngresoPlantel?: string;
    titulo: number;
    descripcionTitulo: string;
    mencionTitulo: string;
    carreraEstudiando: string;
    tipoLapsoEstudios: string;
    numeroLapsosAprobados: number;
    postgrado: string;
    experienciaLaboral: number;
  };
  formThreeDefault: {
    gradoSistema: number;
    nivelSistema: number;
    gradoCentro: number;
    nivelCentro: number;
    cargo: number;
    horasSemanales: number;
    sueldo: number;
    asignacionesMensual: number;
    deduccionesMensual: number;
    primaAntiguedad: number;
    primaGeografica: number;
    primaCompensacionAcademica: number;
    primaAsistencial: number;
    contribucionDiscapacidad: number;
    contribucionDiscapacidadHijos: number;
    porcentajeSso: number;
    porcentajeRpe: number;
    porcentajeFaov: number;
    pagoDirecto: boolean;
    jubilado: boolean;
    cuentaBancaria: string;
    observaciones: string;
  };
  titulos: TituloSelect[];
  niveles: NivelSelect[];
  grados: GradosSelect[];
  cargos: CargoSelect[];
}

export default function TabbedEmpleadoForm({
  empleadoId,
  fetcher,
  formOneDefault,
  formTwoDefault,
  formThreeDefault,
  titulos,
  niveles,
  grados,
  cargos,
}: TabbedEmpleadoFormProps) {
  const formStepOne = useForm<z.infer<typeof datosPersonalesEmpleado>>({
    resolver: zodResolver(datosPersonalesEmpleado),
    defaultValues: formOneDefault,
  });

  const formStepTwo = useForm<z.infer<typeof datosProfesionalesEmpleado>>({
    resolver: zodResolver(datosProfesionalesEmpleado),
    defaultValues: formTwoDefault,
  });

  const formStepThree = useForm<z.infer<typeof datosCargoEmpleado>>({
    resolver: zodResolver(datosCargoEmpleado),
    defaultValues: formThreeDefault,
  });

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data !== undefined) {
      if (fetcher.data.type === 'success') {
        toast.success('Empleado editado con éxito');
      } else if (fetcher.data.type === 'error') {
        toast.error('Ocurrió un error editando al empleado');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data]);

  return (
    <Tabs defaultValue='personal'>
      <TabsList>
        <TabsTrigger value='personal'>Datos personales</TabsTrigger>
        <TabsTrigger value='professional'>Datos profesionales</TabsTrigger>
        <TabsTrigger value='position'>Datos del cargo</TabsTrigger>
      </TabsList>

      <TabsContent value='personal'>
        <Form {...formStepOne}>
          <form
            onSubmit={formStepOne.handleSubmit((values) => {
              fetcher.submit(
                { ...values, empleadoId, step: 1 },
                { method: 'POST' },
              );
            })}
            className='w-1/2 pb-12 space-y-3'
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

            <Button type='submit' className='bg-blue-500 hover:bg-blue-700'>
              Guardar cambios
            </Button>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value='professional'>
        <Form {...formStepTwo}>
          <form
            onSubmit={formStepTwo.handleSubmit((values) => {
              fetcher.submit(
                { ...values, empleadoId, step: 2 },
                { method: 'POST' },
              );
            })}
            className='w-1/2 pb-12 space-y-3'
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
                  <FormLabel>Años de experiencia laboral</FormLabel>
                  <FormControl>
                    <Input {...field} type='number' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='bg-blue-500 hover:bg-blue-700'>
              Guardar cambios
            </Button>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value='position'>
        <Form {...formStepThree}>
          <form
            onSubmit={formStepThree.handleSubmit((values) => {
              fetcher.submit(
                { ...values, empleadoId, step: 3 },
                { method: 'POST' },
              );
            })}
            className='w-1/2 pb-12 space-y-3'
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

            <Button
              type='submit'
              className='bg-blue-500 hover:bg-blue-700'
              disabled={fetcher.state === 'submitting'}
            >
              Registrar
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
}
