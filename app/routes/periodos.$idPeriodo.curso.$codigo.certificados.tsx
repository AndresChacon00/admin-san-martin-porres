import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useParams } from '@remix-run/react';
import React, { useState } from 'react';
import { obtenerEstudiantesDeCursoPeriodo } from '~/api/controllers/estudiantesCursoPeriodo';
import { getCursoById } from '~/api/controllers/cursos';
import { getPeriodoById } from '~/api/controllers/periodos';
import { Button } from '~/components/ui/button';

export const loader: LoaderFunction = async ({ params }) => {
  const idPeriodo = String(params.idPeriodo || '');
  const codigo = String(params.codigo || '');
  if (!idPeriodo || !codigo)
    throw new Response('Faltan parámetros', { status: 400 });

  const estudiantes = await obtenerEstudiantesDeCursoPeriodo(idPeriodo, codigo);
  const curso = await getCursoById(codigo);
  const periodo = await getPeriodoById(idPeriodo);

  return json({ estudiantes, curso, periodo });
};

export default function CertificadosPage() {
  const { estudiantes, curso, periodo } = useLoaderData<typeof loader>();
  const { idPeriodo, codigo } = useParams();

  const [selected, setSelected] = useState<Record<string, boolean>>(() => ({}));
  const [horas, setHoras] = useState<number>(300);
  const [firmas, setFirmas] = useState<string[]>([
    'Coordinador General',
    'Instructor',
  ]);

  const toggle = (cedula: string) => {
    setSelected((s) => ({ ...s, [cedula]: !s[cedula] }));
  };

  const addFirma = () => setFirmas((f) => [...f, '']);
  const updateFirma = (i: number, v: string) =>
    setFirmas((f) => f.map((x, idx) => (idx === i ? v : x)));
  const removeFirma = (i: number) =>
    setFirmas((f) => f.filter((_, idx) => idx !== i));

  const generar = async () => {
    // dynamic import to avoid including in server bundle
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    const alumnos = (estudiantes || []).filter((e: any) => selected[e.cedula]);
    if (!alumnos.length) {
      alert('Selecciona al menos un estudiante');
      return;
    }

    for (const alumno of alumnos) {
      // create packet DOM
      const container = document.createElement('div');
      container.style.width = '1122px';
      container.style.height = '793px';
      container.style.position = 'relative';
      container.style.fontFamily = 'serif';
      // background image from public folder (user-provided template)
      container.style.backgroundImage = `url(/plantilla_certificado1.png)`;
      container.style.backgroundSize = 'cover';
      container.style.backgroundPosition = 'center';

      const nameEl = document.createElement('div');
      nameEl.style.position = 'absolute';
      // moved a bit lower so it sits below the center of the template
  nameEl.style.top = '46%';
      nameEl.style.left = '50%';
      nameEl.style.transform = 'translate(-50%, -50%)';
      nameEl.style.fontSize = '42px';
      nameEl.style.fontWeight = '700';
      nameEl.style.textAlign = 'center';
      nameEl.textContent = `${alumno.nombre} ${alumno.apellido}`;
      container.appendChild(nameEl);

      const descEl = document.createElement('div');
      descEl.style.position = 'absolute';
      // nudge the description slightly lower as requested
  descEl.style.top = '60%';
      descEl.style.left = '50%';
      descEl.style.transform = 'translate(-50%, -50%)';
      descEl.style.fontSize = '16px';
      descEl.style.textAlign = 'center';
      descEl.textContent = `Por haber cumplido con los contenidos satisfactoriamente correspondiente: ${horas} horas académicas. ${new Date(periodo?.fechaInicio).toLocaleDateString()} hasta ${new Date(periodo?.fechaFin).toLocaleDateString()}`;
      container.appendChild(descEl);

      const courseEl = document.createElement('div');
      courseEl.style.position = 'absolute';
  courseEl.style.top = '68%';
      courseEl.style.left = '50%';
      courseEl.style.transform = 'translate(-50%, -50%)';
      courseEl.style.fontSize = '36px';
      courseEl.style.fontWeight = '800';
      courseEl.style.textAlign = 'center';
      courseEl.style.letterSpacing = '2px';
      courseEl.style.textTransform = 'uppercase';
      courseEl.textContent = curso?.nombreCurso || codigo;
      container.appendChild(courseEl);

      // firmas area bottom centered (moved up a bit)
      const firmasEl = document.createElement('div');
      firmasEl.style.position = 'absolute';
  firmasEl.style.bottom = '14%';
      firmasEl.style.left = '50%';
      firmasEl.style.transform = 'translateX(-50%)';
      firmasEl.style.width = '80%';
      firmasEl.style.display = 'flex';
      firmasEl.style.justifyContent = 'space-around';
      container.appendChild(firmasEl);

      firmas.forEach((f: string) => {
        const fEl = document.createElement('div');
        fEl.style.textAlign = 'center';
        fEl.style.minWidth = '120px';
        const line = document.createElement('div');
        line.style.borderTop = '1px solid #000';
        line.style.marginBottom = '6px';
        line.style.width = '180px';
        fEl.appendChild(line);
        const label = document.createElement('div');
        label.style.fontSize = '12px';
        label.textContent = f;
        fEl.appendChild(label);
        firmasEl.appendChild(fEl);
      });

      document.body.appendChild(container);
      // capture
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const canvas = await html2canvas(container, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'pt', [canvas.width, canvas.height]);
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${alumno.nombre}_${alumno.apellido}_certificado.pdf`);
      document.body.removeChild(container);
    }
  };

  return (
    <div className='p-6'>
      <h2 className='text-xl font-bold mb-4'>Generación de Certificados</h2>
      <div className='flex gap-6'>
        <div className='w-1/3 border p-2 h-[600px] overflow-auto'>
          <h3 className='font-semibold'>Estudiantes</h3>
          <ul>
            {(estudiantes || []).map((e: any) => (
              <li key={e.cedula} className='flex items-center gap-2 py-1'>
                <input
                  type='checkbox'
                  checked={!!selected[e.cedula]}
                  onChange={() => toggle(e.cedula)}
                />
                <div>
                  {e.nombre} {e.apellido} — {e.cedula}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className='w-2/3'>
          <div className='mb-4'>
            <label className='block'>Horas académicas</label>
            <input
              type='number'
              value={horas}
              onChange={(e) => setHoras(Number(e.target.value))}
              className='border px-2 py-1'
            />
          </div>

          <div className='mb-4'>
            <h4 className='font-semibold'>
              Firmas (se mostrarán centradas abajo)
            </h4>
            {firmas.map((f, i) => (
              <div key={i} className='flex gap-2 items-center mb-1'>
                <input
                  value={f}
                  onChange={(e) => updateFirma(i, e.target.value)}
                  className='border px-2 py-1 flex-1'
                />
                <button
                  onClick={() => removeFirma(i)}
                  className='px-2 py-1 bg-red-500 text-white rounded'
                >
                  Eliminar
                </button>
              </div>
            ))}
            <div className='mt-2'>
              <button
                onClick={addFirma}
                className='px-3 py-1 bg-green-600 text-white rounded'
              >
                Agregar firma
              </button>
            </div>
          </div>

          <div className='mb-4'>
            <Button onClick={generar}>Generar PDF para seleccionados</Button>
          </div>

          <div
            className='border mt-4'
            style={{
              width: '100%',
              height: 560,
              backgroundImage: `url(/plantilla_certificado1.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                // moved a touch lower so preview matches generation adjustments
                top: '46%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: 28,
                fontWeight: 700,
                textAlign: 'center',
              }}
            >
              {'Nombre Apellido'}
            </div>
            <div
              style={{
                position: 'absolute',
                // nudge description down a bit as requested
                top: '60%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: 14,
                textAlign: 'center',
              }}
            >{`Por haber cumplido con los contenidos satisfactoriamente correspondiente: ${horas} horas académicas. ${new Date(periodo?.fechaInicio).toLocaleDateString()} hasta ${new Date(periodo?.fechaFin).toLocaleDateString()}`}</div>
            <div
              style={{
                position: 'absolute',
                top: '68%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: 22,
                fontWeight: 800,
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
            >
              {curso?.nombreCurso || codigo}
            </div>
            <div
              style={{
                position: 'absolute',
                // raise signatures a bit so they're not too close to the edge
                bottom: '14%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              {firmas.map((f, i) => (
                <div key={i} style={{ textAlign: 'center', minWidth: 140 }}>
                  <div
                    style={{
                      borderTop: '1px solid #000',
                      width: 180,
                      marginBottom: 6,
                    }}
                  ></div>
                  <div style={{ fontSize: 12 }}>{f}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
