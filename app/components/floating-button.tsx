import { cn } from '~/lib/utils';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export default function FloatingButton({
  position = 'right',
  onClick,
  children,
}: {
  position?: 'left' | 'right';
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn('fixed bottom-7 z-50', {
        'left-9': position === 'left',
        'right-9': position === 'right',
      })}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size='icon'
            className='rounded-full bg-gray-900 text-gray-50 hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300 size-12 [&_svg]:size-8'
            onClick={onClick}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className='text-[0.9rem]'>Ayuda</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
