import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { loader as configLoader, action as configAction } from '~/api/controllers/sueldos-y-salarios.server';
import { useRef } from 'react';

export const meta: MetaFunction = () => [
  { title: 'Configurar Sueldos y Salarios | San Martín de Porres' },
  { name: 'description', content: 'Configurar valores de sueldo mínimo y salario integral' },
];

export const loader = configLoader;
export const action = configAction;

export default function SueldosYSalarios() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const ref = useRef<HTMLHeadingElement>(null);

  // Validar si la respuesta tiene datos o error
  const sueldosYSalarios = 'sueldosYSalarios' in data ? data.sueldosYSalarios : [];
  const errorLoader = 'error' in data ? data.error : null;

  const sueldoMinimo = sueldosYSalarios.find((c: any) => c.clave === 'sueldo_minimo')?.valor || '';
  const salarioIntegral = sueldosYSalarios.find((c: any) => c.clave === 'salario_integral')?.valor || '';

  return (
    <div className='pb-8'>
      <h1 className='text-xl font-bold mb-4' ref={ref}>
        Sueldos y salarios
      </h1>
      <div className='w-2/5'>
        {errorLoader && (
          <p className='text-red-600 mt-2 text-sm'>Error: {errorLoader}</p>
        )}
        <fetcher.Form method='post' className='space-y-6'>
          <div>
            <h2 className='font-bold mt-4 mb-2 text-base'>Valores actuales</h2>
            <div className='flex flex-col gap-4'>
              <div>
                <label className='block text-sm font-normal mb-1'>Sueldo mínimo</label>
                <input
                  type='number'
                  name='sueldo_minimo'
                  defaultValue={sueldoMinimo}
                  step='0.01'
                  min='0'
                  className='border rounded px-2 py-1 w-full text-sm'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-normal mb-1'>Salario integral</label>
                <input
                  type='number'
                  name='salario_integral'
                  defaultValue={salarioIntegral}
                  step='0.01'
                  min='0'
                  className='border rounded px-2 py-1 w-full text-sm'
                  required
                />
              </div>
            </div>
          </div>
          <button
            type='submit'
            className='bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 w-full mt-4 text-sm font-medium'
            disabled={fetcher.state === 'submitting'}
          >
            Guardar cambios
          </button>
          {fetcher.data && 'success' in fetcher.data && fetcher.data.success && (
            <p className='text-green-600 mt-2 text-sm'>Configuración actualizada correctamente.</p>
          )}
          {fetcher.data && 'error' in fetcher.data && (
            <p className='text-red-600 mt-2 text-sm'>Error: {fetcher.data.error}</p>
          )}
        </fetcher.Form>
      </div>
    </div>
  );
}
