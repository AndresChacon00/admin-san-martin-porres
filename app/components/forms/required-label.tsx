import { FormLabel } from '../ui/form';
import { Label } from '../ui/label';

export default function RequiredLabel({
  children,
  htmlFor = '',
}: {
  children: string;
  htmlFor?: string;
}) {
  if (htmlFor) {
    return (
      <Label htmlFor={htmlFor}>
        {children} <span className='text-destructive ml-1'>*</span>
      </Label>
    );
  }

  return (
    <FormLabel>
      {children}
      <span className='text-destructive ml-1'>*</span>
    </FormLabel>
  );
}
