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
import { Form } from '@remix-run/react';

interface Estudiante {
  cedula: string;
  nombre: string;
  apellido: string;
  deuda: number;
}

interface GenerarRelacionParticipantesDialogProps {
  idPeriodo: number;
  codigoCurso: string;
  estudiantesInscritos: Estudiante[];
}

export function GenerarRelacionParticipantesDialog({
  idPeriodo,
  codigoCurso,
  estudiantesInscritos,
}: GenerarRelacionParticipantesDialogProps) {
  const handleGeneratePDF = async () => {
    const nombreCentro =
      (document.getElementById('nombreCentro') as HTMLInputElement)?.value ||
      '';
    const coordinadorGeneral =
      (document.getElementById('coordinadorGeneral') as HTMLInputElement)
        ?.value || '';

    await generarPlanillaPDF({
      idPeriodo,
      codigoCurso,
      estudiantesInscritos,
      nombreCentro,
      coordinadorGeneral,
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
          {/* Nombre del centro */}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='nombreCentro' className='text-right'>
              Nombre del Centro
            </Label>
            <Input
              id='nombreCentro'
              name='nombreCentro'
              className='col-span-3'
            />
          </div>
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
