import type { ActionFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useParams, useFetcher } from '@remix-run/react';
import React, { useState, useRef } from 'react';
import { obtenerEstudiantesDeCursoPeriodo } from '~/api/controllers/estudiantesCursoPeriodo';
import {
  getCursoById,
  getTemplateLayout,
  saveTemplateLayout,
} from '~/api/controllers/cursos';
import { getPeriodoById } from '~/api/controllers/periodos';
import { Button } from '~/components/ui/button';

export async function loader({ params }: LoaderFunctionArgs) {
  const idPeriodo = String(params.idPeriodo || '');
  const codigo = String(params.codigo || '');
  if (!idPeriodo || !codigo)
    throw new Response('Faltan parámetros', { status: 400 });

  const [estudiantes, curso, periodo, templateLayout] = await Promise.all([
    obtenerEstudiantesDeCursoPeriodo(idPeriodo, codigo),
    getCursoById(codigo),
    getPeriodoById(idPeriodo),
    getTemplateLayout(codigo),
  ]);

  if ('type' in estudiantes || 'type' in curso || 'type' in periodo) {
    return redirect(`/periodos/${idPeriodo}/curso/${codigo}`);
  }

  return json({
    estudiantes,
    curso,
    periodo,
    templateLayout,
  });
}

export const action: ActionFunction = async ({ request, params }) => {
  const codigo = String(params.codigo || '');
  const form = await request.formData();
  const layout = form.get('layout');
  if (!layout)
    return json({ ok: false, message: 'No layout' }, { status: 400 });
  try {
    const layoutStr = String(layout);
    await saveTemplateLayout(codigo, layoutStr);
    return json({ ok: true });
  } catch (error) {
    console.error('Error saving layout', error);
    return json({ ok: false, message: 'Error' }, { status: 500 });
  }
};

export default function CertificadosPage() {
  const { estudiantes, curso, periodo, templateLayout } =
    useLoaderData<typeof loader>();
  const { codigo } = useParams();
  const fetcher = useFetcher();

  const [selected, setSelected] = useState<Record<string, boolean>>(() => ({}));
  const [horas, setHoras] = useState<number>(300);
  const [firmas, setFirmas] = useState<string[]>([
    'Coordinador General',
    'Instructor',
  ]);
  const [isEdit, setIsEdit] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const backPreviewRef = useRef<HTMLDivElement | null>(null);

  const defaultLayout = {
    name: { top: 46, left: 50, fontSize: 42, align: 'center' },
    description: {
      top: 60,
      left: 50,
      fontSize: 16,
      align: 'center',
      widthPercent: 80,
    },
    course: { top: 68, left: 50, fontSize: 36, align: 'center' },
    signatures: [
      { top: 86, left: 25 },
      { top: 86, left: 75 },
    ],
    signaturesGap: 140,
    back: {
      content: { top: 15, left: 10, widthPercent: 80, fontSize: 12 },
      // default positions for individual topics (indexed array)
      topicPositions: [
        { top: 18, left: 10 },
        { top: 30, left: 10 },
      ],
      // default positions for stamps (sellos) on the back
      stampPositions: [
        { top: 78, left: 25 },
        { top: 78, left: 75 },
      ],
      topicsList: [],
    },
  };

  const [layout, setLayout] = useState(() => templateLayout ?? defaultLayout);

  const toggle = (cedula: string) => {
    setSelected((s) => ({ ...s, [cedula]: !s[cedula] }));
  };

  const addFirma = () => setFirmas((f) => [...f, '']);
  const updateFirma = (i: number, v: string) =>
    setFirmas((f) => f.map((x, idx) => (idx === i ? v : x)));
  const removeFirma = (i: number) =>
    setFirmas((f) => f.filter((_, idx) => idx !== i));

  function updatePos(id: string, newPos: { top: number; left: number }) {
    setLayout((prev) => {
      // support nested keys like 'back.content'
      if (id.includes('.')) {
        const parts = id.split('.');
        if (parts.length === 2) {
          const [p1, p2] = parts;

          return {
            ...prev,
            [p1]: {
              ...((prev[p1] as object) || {}),
              [p2]: {
                ...((prev[p1] && (prev[p1] as Record<string, object>)[p2]) ||
                  {}),
                ...newPos,
              },
            },
          };
        }
      }
      return {
        ...prev,
        [id]: { ...((prev[id] as object) || {}), ...newPos },
      };
    });
  }

  function saveLayout() {
    const fd = new FormData();
    fd.set('layout', JSON.stringify(layout));
    fetcher.submit(fd, { method: 'post' });
  }

  // Back side content (topics & subtopics)
  const [backTopics, setBackTopics] = useState<
    { title: string; items: string[] }[]
  >(
    () =>
      layout?.back?.topicsList ?? [
        { title: 'Contenido', items: ['Tema 1', 'Tema 2'] },
      ],
  );

  // helper to get topic position (falls back to default spacing)
  function getTopicPos(index: number) {
    const positions = layout?.back?.topicPositions ?? [];
    if (positions[index]) return positions[index];
    // fallback compute: base top from content top + spacing
    const base = (layout.back?.content?.top ??
      defaultLayout.back.content.top) as number;
    return {
      top: base + index * 8,
      left: layout?.back?.content?.left ?? defaultLayout.back.content.left,
    };
  }

  function updateTopicPos(
    index: number,
    newPos: { top: number; left: number },
  ) {
    setLayout((prev) => {
      const next = { ...prev };
      next.back = { ...(next.back || {}) };
      const arr = Array.isArray(next.back.topicPositions)
        ? [...next.back.topicPositions]
        : [];
      arr[index] = { ...(arr[index] || {}), ...newPos };
      next.back.topicPositions = arr;
      return next;
    });
  }

  // stamps (sellos) positioning helpers
  function getStampPos(index: number) {
    const positions = layout?.back?.stampPositions ?? [];
    if (positions[index]) return positions[index];
    return { top: 78, left: index === 0 ? 25 : 75 };
  }

  function updateStampPos(
    index: number,
    newPos: { top: number; left: number },
  ) {
    setLayout((prev) => {
      const next = { ...prev };
      next.back = { ...(next.back || {}) };
      const arr = Array.isArray(next.back.stampPositions)
        ? [...next.back.stampPositions]
        : [];
      arr[index] = { ...(arr[index] || {}), ...newPos };
      next.back.stampPositions = arr;
      return next;
    });
  }

  function addTopic() {
    setBackTopics((t) => [...t, { title: 'Nuevo Tema', items: [''] }]);
  }

  function updateTopicTitle(i: number, v: string) {
    setBackTopics((t) =>
      t.map((x, idx) => (idx === i ? { ...x, title: v } : x)),
    );
  }

  function addSubtopic(i: number) {
    setBackTopics((t) =>
      t.map((x, idx) =>
        idx === i ? { ...x, items: [...x.items, 'Nuevo subtema'] } : x,
      ),
    );
  }

  function updateSubtopic(i: number, j: number, v: string) {
    setBackTopics((t) =>
      t.map((x, idx) =>
        idx === i
          ? { ...x, items: x.items.map((s, sidx) => (sidx === j ? v : s)) }
          : x,
      ),
    );
  }

  function removeSubtopic(i: number, j: number) {
    setBackTopics((t) =>
      t.map((x, idx) =>
        idx === i
          ? { ...x, items: x.items.filter((_, sidx) => sidx !== j) }
          : x,
      ),
    );
  }

  function removeTopic(i: number) {
    setBackTopics((t) => t.filter((_, idx) => idx !== i));
  }

  // When saving layout, also persist backTopics inside layout.back.topicsList
  async function saveLayoutAndTopics() {
    const merged = {
      ...layout,
      back: {
        ...(layout.back || {}),
        topicsList: backTopics,
        topicPositions: layout?.back?.topicPositions ?? [],
        stampPositions: layout?.back?.stampPositions ?? [],
      },
    };
    setLayout(merged);
    const fd = new FormData();
    fd.set('layout', JSON.stringify(merged));
    fetcher.submit(fd, { method: 'post' });
  }

  const generar = async () => {
    // dynamic import to avoid including in server bundle
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    const alumnos = estudiantes.filter((e) => selected[e.cedula]);
    if (!alumnos.length) {
      alert('Selecciona al menos un estudiante');
      return;
    }

    // We'll build front pages programmatically (so generation is independent
    // of the current UI state like `showBack`) and capture the back once
    // (reusable for all students in the course).
    // target page: Letter size landscape (11in x 8.5in). We'll compute
    // pixel targets using a CSS DPI (96) so the off-screen DOM matches
    // the PDF aspect ratio.
    const CSS_DPI = 96;
    const PAGE_IN_W = 11; // inches (landscape width)
    const PAGE_IN_H = 8.5; // inches (landscape height)
    const targetW = Math.round(PAGE_IN_W * CSS_DPI);
    const targetH = Math.round(PAGE_IN_H * CSS_DPI);

    // build an off-screen front node for a given student
    async function buildAndCaptureFront(alumno: (typeof estudiantes)[number]) {
      const node = document.createElement('div');
      node.style.width = `${targetW}px`;
      node.style.height = `${targetH}px`;
      node.style.position = 'relative';
      node.style.fontFamily = 'serif';
      node.style.backgroundImage = `url(/plantilla_certificado1.png)`;
      node.style.backgroundSize = 'cover';
      node.style.backgroundPosition = 'center';

      // front does not include the registry box (only the back page should show it)

      // Name
      const np = layout?.name ?? defaultLayout.name;
      const nameEl = document.createElement('div');
      nameEl.style.position = 'absolute';
      nameEl.style.top = `${np.top}%`;
      nameEl.style.left = `${np.left}%`;
      nameEl.style.transform = 'translate(-50%, -50%)';
      nameEl.style.fontSize = `${np.fontSize}px`;
      nameEl.style.fontWeight = '700';
      nameEl.style.textAlign = np.align || 'center';
      nameEl.textContent = `${alumno.nombre} ${alumno.apellido}`;
      node.appendChild(nameEl);

      // Description
      const dp = layout?.description ?? defaultLayout.description;
      const descEl = document.createElement('div');
      descEl.style.position = 'absolute';
      descEl.style.top = `${dp.top}%`;
      descEl.style.left = `${dp.left}%`;
      descEl.style.transform = 'translate(-50%, -50%)';
      descEl.style.fontSize = `${dp.fontSize}px`;
      descEl.style.textAlign = dp.align || 'center';
      if (dp.widthPercent) descEl.style.width = `${dp.widthPercent}%`;
      descEl.textContent = `Por haber cumplido con los contenidos satisfactoriamente correspondiente: ${horas} horas académicas. ${new Date(periodo?.fechaInicio).toLocaleDateString()} hasta ${new Date(periodo?.fechaFin).toLocaleDateString()}`;
      node.appendChild(descEl);

      // Course
      const cp = layout?.course ?? defaultLayout.course;
      const courseEl = document.createElement('div');
      courseEl.style.position = 'absolute';
      courseEl.style.top = `${cp.top}%`;
      courseEl.style.left = `${cp.left}%`;
      courseEl.style.transform = 'translate(-50%, -50%)';
      courseEl.style.fontSize = `${cp.fontSize}px`;
      courseEl.style.fontWeight = '800';
      courseEl.style.textAlign = cp.align || 'center';
      courseEl.style.letterSpacing = '2px';
      courseEl.style.textTransform = 'uppercase';
      courseEl.textContent = curso?.nombreCurso || '';
      node.appendChild(courseEl);

      // Signatures area: center with configurable gap (matches preview)
      const sTop = (layout?.signatures?.[0]?.top ??
        defaultLayout.signatures[0].top) as number;
      const gap = layout?.signaturesGap ?? defaultLayout.signaturesGap;
      const firmasEl = document.createElement('div');
      firmasEl.style.position = 'absolute';
      firmasEl.style.top = `${sTop}%`;
      firmasEl.style.left = '50%';
      firmasEl.style.transform = 'translateX(-50%)';
      firmasEl.style.display = 'flex';
      firmasEl.style.justifyContent = 'center';
      firmasEl.style.gap = `${gap}px`;
      firmasEl.style.width = '80%';
      node.appendChild(firmasEl);

      // Distribute signatures evenly depending on how many there are.
      const sigCount = Math.max(1, (firmas || []).length);
      const percentPer = Math.floor(80 / sigCount); // each signature cell basis in % of page width

      (firmas || []).forEach((f: string) => {
        const fEl = document.createElement('div');
        fEl.style.textAlign = 'center';
        fEl.style.minWidth = '80px';
        fEl.style.flex = `0 0 ${percentPer}%`;
        const line = document.createElement('div');
        line.style.borderTop = '1px solid #000';
        line.style.marginBottom = '6px';
        // use percentage so it scales with the signature cell
        line.style.width = '60%';
        line.style.marginLeft = 'auto';
        line.style.marginRight = 'auto';
        fEl.appendChild(line);
        const label = document.createElement('div');
        label.style.fontSize = '12px';
        label.textContent = f;
        fEl.appendChild(label);
        firmasEl.appendChild(fEl);
      });

      // append off-screen, capture, remove
      node.style.position = 'absolute';
      node.style.left = '-9999px';
      document.body.appendChild(node);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const canvas = await html2canvas(node, {
        scale: window.devicePixelRatio || 1,
        useCORS: true,
      });
      const data = canvas.toDataURL('image/png');
      document.body.removeChild(node);
      return { canvasW: canvas.width, canvasH: canvas.height, data };
    }

    // build and capture back once (reusable for all students)
    async function buildAndCaptureBack() {
      const node = document.createElement('div');
      node.style.width = `${targetW}px`;
      node.style.height = `${targetH}px`;
      node.style.position = 'relative';
      node.style.fontFamily = 'serif';
      // use the public asset 'plantilla certificado reverso.png' as background
      // encode the URI to handle the space in the filename
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - encodeURI is available in the browser runtime
      node.style.backgroundImage = `url("${encodeURI('/plantilla certificado reverso.png')}")`;
      node.style.backgroundSize = 'cover';
      node.style.backgroundPosition = 'center';

      // content block
      const backPos = layout?.back?.content ?? defaultLayout.back.content;
      const backBlock = document.createElement('div');
      backBlock.style.position = 'absolute';
      backBlock.style.top = `${backPos.top}%`;
      backBlock.style.left = `${backPos.left}%`;
      backBlock.style.transform = 'translate(-50%, 0)';
      backBlock.style.width = backPos.widthPercent
        ? `${backPos.widthPercent}%`
        : '80%';
      backBlock.style.fontSize = `${backPos.fontSize || 12}px`;
      backBlock.style.color = '#000';
      node.appendChild(backBlock);

      const topics =
        backTopics && backTopics.length
          ? backTopics
          : (layout?.back?.topicsList ?? []);
      const positions = layout?.back?.topicPositions ?? [];
      topics.forEach((t, ti: number) => {
        const pos = positions[ti] ?? {
          top: (backPos.top || 15) + ti * 8,
          left: backPos.left || 10,
        };
        const tDiv = document.createElement('div');
        tDiv.style.position = 'absolute';
        tDiv.style.top = `${pos.top}%`;
        tDiv.style.left = `${pos.left}%`;
        tDiv.style.transform = 'translate(-50%, 0)';
        tDiv.style.width = backPos.widthPercent
          ? `${backPos.widthPercent}%`
          : '80%';
        tDiv.style.color = '#000';

        const h = document.createElement('div');
        h.style.fontWeight = '700';
        h.textContent = t.title;
        tDiv.appendChild(h);
        const ul = document.createElement('ul');
        ul.style.marginLeft = '12px';
        (t.items || []).filter(Boolean).forEach((it: string) => {
          const li = document.createElement('li');
          li.style.fontSize = `${backPos.fontSize || 12}px`;
          li.textContent = it;
          ul.appendChild(li);
        });
        tDiv.appendChild(ul);
        node.appendChild(tDiv);
      });

      // stamps
      const stampLabels = ['Sello AVEC', 'Sello FUNDACECASMAR'];
      const stampPositions = layout?.back?.stampPositions ?? [];
      stampLabels.forEach((label, si) => {
        const pos = stampPositions[si] ?? {
          top: si === 0 ? 78 : 78,
          left: si === 0 ? 25 : 75,
        };
        const sDiv = document.createElement('div');
        sDiv.style.position = 'absolute';
        sDiv.style.top = `${pos.top}%`;
        sDiv.style.left = `${pos.left}%`;
        sDiv.style.transform = 'translate(-50%, 0)';
        sDiv.style.textAlign = 'center';
        sDiv.style.width = '200px';

        const line = document.createElement('div');
        line.style.borderTop = '2px solid #000';
        line.style.width = '160px';
        line.style.margin = '0 auto 6px auto';
        sDiv.appendChild(line);

        const lbl = document.createElement('div');
        lbl.style.fontSize = '12px';
        lbl.style.fontWeight = '700';
        lbl.textContent = label;
        sDiv.appendChild(lbl);

        node.appendChild(sDiv);
      });

      node.style.position = 'absolute';
      node.style.left = '-9999px';
      document.body.appendChild(node);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const canvas = await html2canvas(node, {
        scale: window.devicePixelRatio || 1,
        useCORS: true,
      });
      const data = canvas.toDataURL('image/png');
      document.body.removeChild(node);
      return { canvasW: canvas.width, canvasH: canvas.height, data };
    }

    let backResult;
    try {
      // prefer capturing the rendered back preview if available, else build from layout
      const previewInner = backPreviewRef.current?.querySelector(
        ':scope > div',
      ) as HTMLElement | null;
      if (previewInner) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const canvas = await html2canvas(previewInner, {
          scale: window.devicePixelRatio || 1,
          useCORS: true,
        });
        backResult = {
          canvasW: canvas.width,
          canvasH: canvas.height,
          data: canvas.toDataURL('image/png'),
        };
      } else {
        backResult = await buildAndCaptureBack();
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Back capture failed', err);
      return;
    }

    for (const alumno of alumnos) {
      let frontResult;
      try {
        frontResult = await buildAndCaptureFront(alumno);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Front capture failed', err);
        continue;
      }

      // Create PDF in inches as Letter landscape so pages print correctly.
      const pdf = new jsPDF('l', 'in', [PAGE_IN_W, PAGE_IN_H]);
      // Add images stretched to full page in inches.
      pdf.addImage(frontResult.data, 'PNG', 0, 0, PAGE_IN_W, PAGE_IN_H);
      pdf.addPage([PAGE_IN_W, PAGE_IN_H]);
      pdf.addImage(backResult.data, 'PNG', 0, 0, PAGE_IN_W, PAGE_IN_H);
      pdf.save(`${alumno.nombre}_${alumno.apellido}_certificado.pdf`);
    }
  };

  return (
    <div className='p-6'>
      <h2 className='text-xl font-bold mb-4'>Generación de Certificados</h2>
      <div className='flex gap-6'>
        <div className='w-1/3 border p-2 h-[600px] overflow-auto'>
          <h3 className='font-semibold'>Estudiantes</h3>
          <ul>
            {estudiantes.map((e) => (
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
          <div className='mt-4'>
            <h4 className='font-semibold mb-2'>
              Temario (reverso del certificado)
            </h4>
            <div className='space-y-3'>
              {backTopics.map((t, ti) => (
                <div key={ti} className='border p-2 rounded'>
                  <div className='flex gap-2 items-center mb-2'>
                    <input
                      className='border px-2 py-1 flex-1'
                      value={t.title}
                      onChange={(e) => updateTopicTitle(ti, e.target.value)}
                    />
                    <button
                      onClick={() => removeTopic(ti)}
                      className='px-2 py-1 bg-red-500 text-white rounded'
                    >
                      Eliminar
                    </button>
                  </div>
                  <div className='space-y-2'>
                    {t.items.map((it, ii) => (
                      <div key={ii} className='flex gap-2 items-center'>
                        <input
                          className='border px-2 py-1 flex-1'
                          value={it}
                          onChange={(e) =>
                            updateSubtopic(ti, ii, e.target.value)
                          }
                        />
                        <button
                          onClick={() => removeSubtopic(ti, ii)}
                          className='px-2 py-1 bg-gray-300 rounded'
                        >
                          Borrar
                        </button>
                      </div>
                    ))}
                    <div>
                      <button
                        onClick={() => addSubtopic(ti)}
                        className='px-2 py-1 bg-blue-600 text-white rounded'
                      >
                        Agregar subtema
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className='flex gap-2'>
                <button
                  onClick={addTopic}
                  className='px-3 py-1 bg-green-600 text-white rounded'
                >
                  Agregar tema
                </button>
                <button
                  onClick={saveLayoutAndTopics}
                  className='px-3 py-1 bg-indigo-600 text-white rounded'
                >
                  Guardar temas (reverso)
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='w-2/3'>
          <div className='mb-4'>
            <label htmlFor='horas' className='block'>
              Horas académicas
            </label>
            <input
              id='horas'
              name='horas'
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

          <div className='mb-4 flex items-center gap-3'>
            <Button onClick={generar}>Generar PDF para seleccionados</Button>
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={isEdit}
                onChange={() => setIsEdit((s) => !s)}
              />
              <span>Editar plantilla</span>
            </label>
            {/* Removed "Mostrar reverso" toggle — back preview is always visible below */}
            {isEdit && (
              <div className='ml-4 flex gap-2'>
                <Button onClick={saveLayout} className='mr-2'>
                  Guardar plantilla
                </Button>
                <Button onClick={saveLayoutAndTopics}>Guardar + temas</Button>
              </div>
            )}
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
            ref={containerRef}
          >
            {/* Front preview / Editor - always visible (top) */}
            <PreviewBlock
              id='name'
              containerRef={containerRef}
              pos={layout?.name ?? defaultLayout.name}
              isEdit={isEdit}
              onChange={(id: string, p: { top: number; left: number }) =>
                updatePos(id, p)
              }
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  textAlign: 'center',
                }}
              >
                {'Nombre Apellido'}
              </div>
            </PreviewBlock>

            <PreviewBlock
              id='description'
              containerRef={containerRef}
              pos={layout?.description ?? defaultLayout.description}
              isEdit={isEdit}
              onChange={(id: string, p: { top: number; left: number }) =>
                updatePos(id, p)
              }
            >
              <div
                style={{ fontSize: 14, textAlign: 'center' }}
              >{`Por haber cumplido con los contenidos satisfactoriamente correspondiente: ${horas} horas académicas. ${new Date(periodo?.fechaInicio).toLocaleDateString()} hasta ${new Date(periodo?.fechaFin).toLocaleDateString()}`}</div>
            </PreviewBlock>

            <PreviewBlock
              id='course'
              containerRef={containerRef}
              pos={layout?.course ?? defaultLayout.course}
              isEdit={isEdit}
              onChange={(id: string, p: { top: number; left: number }) =>
                updatePos(id, p)
              }
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  textAlign: 'center',
                }}
              >
                {curso?.nombreCurso || codigo}
              </div>
            </PreviewBlock>

            {/* Signatures area - simple non-draggable area when not editing; when editing allow moving the signature area */}
            <PreviewBlock
              id='signatures'
              containerRef={containerRef}
              pos={
                layout?.signatures?.[0]
                  ? { top: layout.signatures[0].top, left: 50 }
                  : defaultLayout.signatures[0]
              }
              isEdit={isEdit}
              onChange={(id: string, p: { top: number; left: number }) =>
                updatePos('signatures', { top: p.top, left: p.left })
              }
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: `${Math.max(8, Math.floor((layout?.signaturesGap ?? defaultLayout.signaturesGap) / Math.max(1, firmas.length)))}px`,
                  width: '80%',
                }}
              >
                {firmas.map((f, i) => {
                  const per = Math.floor(80 / Math.max(1, firmas.length));
                  return (
                    <div
                      key={i}
                      style={{
                        textAlign: 'center',
                        minWidth: 80,
                        flex: `0 0 ${per}%`,
                      }}
                    >
                      <div
                        style={{
                          borderTop: '1px solid #000',
                          width: '60%',
                          marginBottom: 6,
                          marginLeft: 'auto',
                          marginRight: 'auto',
                        }}
                      />
                      <div style={{ fontSize: 12 }}>{f}</div>
                    </div>
                  );
                })}
              </div>
            </PreviewBlock>
          </div>

          {/* Back preview / Editor - rendered as a separate box below the front preview */}
          <div className='border mt-4 p-2' ref={backPreviewRef}>
            <div
              style={{
                width: '100%',
                height: 560,
                position: 'relative',
                border: '1px solid #e5e7eb',
                backgroundImage: `url(${encodeURI('/plantilla certificado reverso.png')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden',
              }}
            >
              {/* Registro en la EFAVEC - esquina superior derecha */}
              <div
                style={{
                  position: 'absolute',
                  top: '9%',
                  right: '6%',
                  width: 150,
                  background: 'rgba(255,255,255,0.95)',
                  padding: 8,
                  border: '1px solid #000',
                  fontSize: 12,
                  lineHeight: '1.2',
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    marginBottom: 6,
                    textAlign: 'center',
                  }}
                >
                  Registro en la EFAVEC
                </div>
                <table
                  style={{
                    width: '100%',
                    fontSize: 12,
                    borderCollapse: 'collapse',
                  }}
                >
                  <tbody>
                    <tr>
                      <td style={{ width: '30%', verticalAlign: 'top' }}>
                        Libro:
                      </td>
                      <td>__________</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>Folio:</td>
                      <td>__________</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>N°:</td>
                      <td>__________</td>
                    </tr>
                    <tr>
                      <td style={{ verticalAlign: 'top' }}>Fecha:</td>
                      <td>__________</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {(backTopics || []).map((t, ti) => (
                <PreviewBlock
                  key={ti}
                  id={`back_topic_${ti}`}
                  containerRef={backPreviewRef}
                  pos={getTopicPos(ti)}
                  isEdit={isEdit}
                  onChange={(_id: string, p: { top: number; left: number }) =>
                    updateTopicPos(ti, p)
                  }
                >
                  <div style={{ width: '100%', color: '#000' }}>
                    <div style={{ fontWeight: 700 }}>{t.title}</div>
                    <ul style={{ marginLeft: 12 }}>
                      {t.items.filter(Boolean).map((it, ii) => (
                        <li key={ii} style={{ fontSize: 12 }}>
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                </PreviewBlock>
              ))}

              {['Sello AVEC', 'Sello FUNDACECASMAR'].map((label, si) => (
                <PreviewBlock
                  key={`stamp_${si}`}
                  id={`back_stamp_${si}`}
                  containerRef={backPreviewRef}
                  pos={getStampPos(si)}
                  isEdit={isEdit}
                  onChange={(_id: string, p: { top: number; left: number }) =>
                    updateStampPos(si, p)
                  }
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        borderTop: '2px solid #000',
                        width: 160,
                        marginBottom: 6,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                      }}
                    />
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{label}</div>
                  </div>
                </PreviewBlock>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Draggable preview wrapper component used only in this route **/
function PreviewBlock({
  id,
  pos,
  onChange,
  children,
  containerRef,
  isEdit,
}: any) {
  const dragging = useRef(false);
  const origin = useRef({ x: 0, y: 0 });

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    origin.current = { x: e.clientX, y: e.clientY };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current || !containerRef.current) return;
    const dx = e.clientX - origin.current.x;
    const dy = e.clientY - origin.current.y;
    origin.current = { x: e.clientX, y: e.clientY };
    const rect = containerRef.current.getBoundingClientRect();
    const leftPx = (pos.left / 100) * rect.width + dx;
    const topPx = (pos.top / 100) * rect.height + dy;
    const newLeft = Math.max(0, Math.min(100, (leftPx / rect.width) * 100));
    const newTop = Math.max(0, Math.min(100, (topPx / rect.height) * 100));
    onChange(id, { top: newTop, left: newLeft });
  }

  function onPointerUp(e: React.PointerEvent) {
    dragging.current = false;
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  }

  return (
    <div
      onPointerDown={isEdit ? onPointerDown : undefined}
      onPointerMove={isEdit ? onPointerMove : undefined}
      onPointerUp={isEdit ? onPointerUp : undefined}
      style={{
        position: 'absolute',
        top: `${pos.top}%`,
        left: `${pos.left}%`,
        transform: 'translate(-50%, -50%)',
        cursor: isEdit ? 'grab' : 'default',
        userSelect: 'none',
        width: pos.widthPercent ? `${pos.widthPercent}%` : undefined,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
}
