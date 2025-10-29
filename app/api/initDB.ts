import fs from 'fs';
import path from 'path';
import db from './db';
import { estudiantes } from './tables/estudiantes';

async function ensurePagosTable() {
  try {
    // Check whether the pagos_estudiantes_curso table exists and has the expected FK order
    // Use underlying libsql client to run PRAGMA
    const result = await db.$client.execute(
      "PRAGMA foreign_key_list('pagos_estudiantes_curso');",
    );

    // result.rows may be an array; if no rows, we need to recreate
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = (result as unknown as any)?.rows;
    const needsRecreate = !rows || (Array.isArray(rows) && rows.length === 0);

    if (needsRecreate) {
      const migrationsPath = path.resolve(
        __dirname,
        '..',
        '..',
        'migrations',
        '20251008_recreate_pagos_estudiantes_curso_fix_fk_order.sql',
      );
      if (fs.existsSync(migrationsPath)) {
        const sql = fs.readFileSync(migrationsPath, 'utf8');
        console.log(
          'Applying migration to recreate pagos_estudiantes_curso...',
        );
        await db.$client.execute(sql);
        console.log('Migration applied.');
      } else {
        console.warn('Migration file not found:', migrationsPath);
      }
    }
  } catch (e) {
    console.warn('Failed to check/apply pagos migration:', e);
  }
}

await ensurePagosTable();

await db.transaction(async (tx) => {
  const estudiantesEjemplo = [
    {
      cedula: '123456789',
      nombre: 'Andres',
      apellido: 'Chacon',
      sexo: 'M',
      fechaNacimiento: new Date(),
      edad: 20,
      religion: 'Ninguna',
      telefono: '999999999',
      correo: 'andresroberto.c@gmail.com',
      direccion: 'Calle Falsa 123',
      ultimoAñoCursado: '2024',
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
