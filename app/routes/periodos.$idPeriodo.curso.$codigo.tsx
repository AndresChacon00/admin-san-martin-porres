import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { inscribirEstudianteCursoPeriodo } from '~/api/controllers/estudiantesCursoPeriodo';
import { Outlet } from '@remix-run/react';

export const action: ActionFunction = async ({ request, params }) => {
	try {
		const formData = await request.formData();
		const actionType = formData.get('actionType');
		const idPeriodo = String(params.idPeriodo);
		const codigoCurso = params.codigo;

		console.log('[ACTION] inscribirEstudiante -', { actionType, idPeriodo, codigoCurso });

		if (actionType === 'inscribir') {
			const cedula = String(formData.get('cedula') || '');
			console.log('[ACTION] inscribir payload cedula:', cedula);
			if (!cedula || !idPeriodo || !codigoCurso) {
				return json({ error: 'Datos inválidos' }, { status: 400 });
			}

			const result = await inscribirEstudianteCursoPeriodo({
				idPeriodo,
				codigoCurso,
				cedulaEstudiante: cedula,
			});

			// Log the controller/service result so we can debug why it's returning 400
			console.log('[ACTION] inscribir - controller result:', result);

			const resObj = result as unknown as { type?: string; message?: string } | null;
			if (resObj && resObj.type === 'error') {
				return json({ error: resObj.message || 'Error' }, { status: 400 });
			}

			return json({ success: true, message: 'Estudiante inscrito' }, { status: 200 });
		}

		return json({ error: 'Action type no soportado' }, { status: 400 });
	} catch (err: unknown) {
		console.error('Error en action periodos.$idPeriodo.curso.$codigo:', err);
		const details =
			err && typeof err === 'object' && 'message' in err
				? String((err as unknown as { message?: unknown }).message)
				: String(err);
		return json({ error: 'Excepción en servidor', details }, { status: 500 });
	}
};

export default function RouteContainer() {
	// Render children (the _index route) so page content shows.
	return <Outlet />;
}
