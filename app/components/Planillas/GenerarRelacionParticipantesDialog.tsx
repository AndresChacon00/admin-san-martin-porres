import { generarPlanillaPDF } from '~/components/Planillas/GenerarRelacionParticipantes';
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
import { Form, json, useLoaderData } from '@remix-run/react';
import { getCursoById } from '~/api/controllers/cursos';

interface Estudiante {
  cedula: string;
  nombre: string;
  apellido: string;
  genero: string;
  deuda: number;
}

interface GenerarRelacionParticipantesDialogProps {
  idPeriodo: string;
  codigoCurso: string;
  estudiantesInscritos: Estudiante[];
  curso: any;
}

export function GenerarRelacionParticipantesDialog({
  idPeriodo,
  codigoCurso,
  estudiantesInscritos,
  curso,
}: GenerarRelacionParticipantesDialogProps) {
  const handleGeneratePDF = async () => {
    const coordinadorGeneral =
      (document.getElementById('coordinadorGeneral') as HTMLInputElement)
        ?.value || '';

    await generarPlanillaPDF({
      idPeriodo,
      codigoCurso,
      estudiantesInscritos,
      coordinadorGeneral,
      curso,
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className=''>Generar relación participantes</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Relación Participantes</DialogTitle>
          <DialogDescription>
            Ingrese los datos solicitados para el curso {codigoCurso} en el
            periodo {idPeriodo}.
          </DialogDescription>
        </DialogHeader>
        <Form method='post'>
          {/* Coordinador General */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='coordinadorGeneral' className='text-right'>
              Coordinador general
            </Label>
            <Input
              id='coordinadorGeneral'
              name='coordinadorGeneral'
              className='col-span-3'
            />
          </div>
          <DialogFooter>
            <Button type='button' onClick={handleGeneratePDF}>
              Descargar Planilla en PDF
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
