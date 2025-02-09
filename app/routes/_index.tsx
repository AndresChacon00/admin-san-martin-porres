import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [{ title: 'Admin | San Martín de Porres' }];
};

export default function Index() {
  return <div>San Martín de Porres</div>;
}
