import db from './db';
import { estudiantes } from './tables/estudiantes';

await db.transaction(async (tx) => {
  const estudiantesEjemplo = [
    {
      name: 'Andres',
      age: 20,
      email: 'andresroberto.c@gmail.com',
    },
  ];

  for (const estudiante of estudiantesEjemplo) {
    try {
      await tx.insert(estudiantes).values(estudiante).onConflictDoNothing();
    } catch (e) {
      console.log(e);
    }
  }
});
