import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

import { Input } from './ui/input';
import { Label } from './ui/label';

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant='outline'>Add Student</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar estudiante</DialogTitle>
          <DialogDescription>
            Agrega los datos de un nuevo estudiante acá
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
