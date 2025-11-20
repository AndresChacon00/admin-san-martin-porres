import db from '../db';
import { sueldos_y_salarios } from '../tables/sueldos-y-salarios';
import { eq } from 'drizzle-orm';

export async function getSueldoYSalario(clave: string) {
  const resultado = await db.select().from(sueldos_y_salarios).where(eq(sueldos_y_salarios.clave, clave)).limit(1);
  return resultado[0]?.valor ?? null;
}

export async function setSueldoYSalario(clave: string, valor: number) {
  const existente = await db.select().from(sueldos_y_salarios).where(eq(sueldos_y_salarios.clave, clave)).limit(1);
  if (existente.length > 0) {
    await db.update(sueldos_y_salarios).set({ valor }).where(eq(sueldos_y_salarios.clave, clave));
  } else {
    await db.insert(sueldos_y_salarios).values({ clave, valor });
  }
}

export async function getAllSueldosYSalarios() {
  const resultado = await db.select().from(sueldos_y_salarios);
  return resultado;
}
