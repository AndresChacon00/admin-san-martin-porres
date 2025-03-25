import { FormLabel } from '../ui/form';

export default function RequiredLabel({ children }: { children: string }) {
  return (
    <FormLabel>
      {children}
      <span className='text-destructive ml-1'>*</span>
    </FormLabel>
  );
}
