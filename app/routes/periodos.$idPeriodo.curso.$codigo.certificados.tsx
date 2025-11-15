import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useParams, useFetcher } from '@remix-run/react';
import React, { useState, useRef } from 'react';
import { obtenerEstudiantesDeCursoPeriodo } from '~/api/controllers/estudiantesCursoPeriodo';
import { getCursoById } from '~/api/controllers/cursos';
import {
  getTemplateLayout,
  saveTemplateLayout,
} from '~/api/controllers/cursos';
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
  const templateLayout = await getTemplateLayout(codigo);

  return json({ estudiantes, curso, periodo, templateLayout });
};

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
  const { idPeriodo, codigo } = useParams();
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
    },
  } as any;

  const [layout, setLayout] = useState<any>(
    () => templateLayout ?? defaultLayout,
  );

  const toggle = (cedula: string) => {
    setSelected((s) => ({ ...s, [cedula]: !s[cedula] }));
  };

  const addFirma = () => setFirmas((f) => [...f, '']);
  const updateFirma = (i: number, v: string) =>
    setFirmas((f) => f.map((x, idx) => (idx === i ? v : x)));
  const removeFirma = (i: number) =>
    setFirmas((f) => f.filter((_, idx) => idx !== i));

  function updatePos(id: string, newPos: { top: number; left: number }) {
    setLayout((prev: any) => {
      // support nested keys like 'back.content'
      if (id.includes('.')) {
        const parts = id.split('.');
        if (parts.length === 2) {
          const [p1, p2] = parts;
          return {
            ...prev,
            [p1]: {
              ...(prev[p1] || {}),
              [p2]: { ...((prev[p1] && prev[p1][p2]) || {}), ...newPos },
            },
          };
        }
      }
      return {
        ...prev,
        [id]: { ...(prev[id] || {}), ...newPos },
      };
    });
  }

  function saveLayout() {
    const fd = new FormData();
    fd.set('layout', JSON.stringify(layout));
    fetcher.submit(fd, { method: 'post' });
  }

  // Back side content (topics & subtopics)
  const [showBack, setShowBack] = useState(false);
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
    const base = (layout?.back?.content?.top ??
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
    setLayout((prev: any) => {
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
    setLayout((prev: any) => {
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

    const alumnos = (estudiantes || []).filter((e: any) => selected[e.cedula]);
    if (!alumnos.length) {
      alert('Selecciona al menos un estudiante');
      return;
    }

    for (const alumno of alumnos) {
      // target PDF pixel size (matches previous behavior)
      const targetW = 1122;
      const targetH = 793;

      // helper to capture a node and scale it so the resulting canvas matches target dimensions
      async function captureNode(
        node: HTMLElement | null,
        fallbackBuilder?: () => Promise<{
          canvasW: number;
          canvasH: number;
          data: string;
        }>,
      ) {
        if (!node) {
          if (fallbackBuilder) return fallbackBuilder();
          throw new Error('No node to capture');
        }
        const rect = node.getBoundingClientRect();
        // compute a uniform scale so width matches target width
        const scale = Math.max(1, targetW / rect.width);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const canvas = await html2canvas(node, { scale, useCORS: true });
        return {
          canvasW: canvas.width,
          canvasH: canvas.height,
          data: canvas.toDataURL('image/png'),
        };
      }

      // capture front from the visible preview container when possible
      let frontResult;
      try {
        frontResult = await captureNode(containerRef.current, async () => {
          // fallback: build minimal front container (old behavior)
          const container = document.createElement('div');
          container.style.width = `${targetW}px`;
          container.style.height = `${targetH}px`;
          container.style.position = 'relative';
          container.style.fontFamily = 'serif';
          container.style.backgroundImage = `url(/plantilla_certificado1.png)`;
          container.style.backgroundSize = 'cover';
          container.style.backgroundPosition = 'center';
          const nameEl = document.createElement('div');
          const np = layout?.name ?? defaultLayout.name;
          nameEl.style.position = 'absolute';
          nameEl.style.top = `${np.top}%`;
          nameEl.style.left = `${np.left}%`;
          nameEl.style.transform = 'translate(-50%, -50%)';
          nameEl.style.fontSize = `${np.fontSize}px`;
          nameEl.style.fontWeight = '700';
          nameEl.style.textAlign = np.align || 'center';
          nameEl.textContent = `${alumno.nombre} ${alumno.apellido}`;
          container.appendChild(nameEl);
          document.body.appendChild(container);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const canvas = await html2canvas(container, { scale: 1 });
          const data = canvas.toDataURL('image/png');
          document.body.removeChild(container);
          return { canvasW: canvas.width, canvasH: canvas.height, data };
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Front capture failed', err);
        continue;
      }

      // capture back from the visible preview inner box (the white 90% container)
      let backResult;
      try {
        const previewInner =
          backPreviewRef.current?.querySelector(':scope > div');
        backResult = await captureNode(
          previewInner as HTMLElement | null,
          async () => {
            // fallback minimal back
            const backContainer = document.createElement('div');
            backContainer.style.width = `${targetW}px`;
            backContainer.style.height = `${targetH}px`;
            backContainer.style.position = 'relative';
            backContainer.style.fontFamily = 'serif';
            backContainer.style.backgroundColor = '#fff';
            document.body.appendChild(backContainer);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const canvas2 = await html2canvas(backContainer, { scale: 1 });
            const data2 = canvas2.toDataURL('image/png');
            document.body.removeChild(backContainer);
            return {
              canvasW: canvas2.width,
              canvasH: canvas2.height,
              data: data2,
            };
          },
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Back capture failed', err);
        continue;
      }

      // build PDF using pixel sizes from captures
      const pdf = new jsPDF('l', 'px', [
        frontResult.canvasW,
        frontResult.canvasH,
      ]);
      pdf.addImage(
        frontResult.data,
        'PNG',
        0,
        0,
        frontResult.canvasW,
        frontResult.canvasH,
      );
      pdf.addPage([backResult.canvasW, backResult.canvasH]);
      pdf.addImage(
        backResult.data,
        'PNG',
        0,
        0,
        backResult.canvasW,
        backResult.canvasH,
      );
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
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={showBack}
                onChange={() => setShowBack((s) => !s)}
              />
              <span>Mostrar reverso</span>
            </label>
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
            {/* Preview / Editor blocks - show draggable handles when editing */}
            {!showBack && (
              <>
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
                      justifyContent: 'space-around',
                      width: '80%',
                    }}
                  >
                    {firmas.map((f, i) => (
                      <div
                        key={i}
                        style={{ textAlign: 'center', minWidth: 140 }}
                      >
                        <div
                          style={{
                            borderTop: '1px solid #000',
                            width: 180,
                            marginBottom: 6,
                          }}
                        />
                        <div style={{ fontSize: 12 }}>{f}</div>
                      </div>
                    ))}
                  </div>
                </PreviewBlock>
              </>
            )}

            {showBack && (
              // Back preview/editor: render on a separate white canvas (not over the front template)
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ffffff',
                }}
                ref={backPreviewRef}
              >
                <div
                  style={{
                    width: '90%',
                    height: '90%',
                    position: 'relative',
                    border: '1px solid #e5e7eb',
                    background: '#fff',
                  }}
                >
                  {/* render each topic as an independent draggable block */}
                  {(backTopics || []).map((t, ti) => (
                    <PreviewBlock
                      key={ti}
                      id={`back_topic_${ti}`}
                      containerRef={backPreviewRef}
                      pos={getTopicPos(ti)}
                      isEdit={isEdit}
                      onChange={(
                        _id: string,
                        p: { top: number; left: number },
                      ) => updateTopicPos(ti, p)}
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
                  {/* Stamps area: two movable stamp placeholders */}
                  {['Sello AVEC', 'Sello FUNDACECASMAR'].map((label, si) => (
                    <PreviewBlock
                      key={`stamp_${si}`}
                      id={`back_stamp_${si}`}
                      containerRef={backPreviewRef}
                      pos={getStampPos(si)}
                      isEdit={isEdit}
                      onChange={(
                        _id: string,
                        p: { top: number; left: number },
                      ) => updateStampPos(si, p)}
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
                        <div style={{ fontSize: 12, fontWeight: 700 }}>
                          {label}
                        </div>
                      </div>
                    </PreviewBlock>
                  ))}
                </div>
              </div>
            )}
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
    } catch {}
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
