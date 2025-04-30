import { CircleHelp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export default function HelpTooltip({
  text,
  size = 19,
}: {
  text: string;
  size?: number;
}) {
  return (
    <Tooltip>
      <TooltipTrigger className='align-middle'>
        <CircleHelp size={size} />
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
}
