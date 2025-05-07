import { useSearchParams } from '@remix-run/react';
import { Button } from './ui/button';

export default function Paginator({ hasMorePages }: { hasMorePages: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get('page');

  return (
    <div className='flex gap-2 mt-3 place-self-end'>
      <Button
        variant='outline'
        size='sm'
        disabled={currentPage === '1' || currentPage === null}
        onClick={() =>
          setSearchParams((prev) => {
            prev.set('page', String(Number(currentPage) - 1));
            return prev;
          })
        }
      >
        Anterior
      </Button>
      <Button
        variant='outline'
        size='sm'
        disabled={!hasMorePages}
        onClick={() =>
          setSearchParams((prev) => {
            prev.set('page', String(Number(currentPage) + 1));
            return prev;
          })
        }
      >
        Siguiente
      </Button>
    </div>
  );
}
