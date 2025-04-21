PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_pagos_estudiantes_curso` (
	`id_pago` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id_periodo` integer NOT NULL,
	`codigo_curso` text NOT NULL,
	`id_estudiante` integer NOT NULL,
	`monto` real NOT NULL,
	`fecha` integer NOT NULL,
	`tipo_pago` text NOT NULL,
	`comprobante` text,
	FOREIGN KEY (`id_periodo`,`codigo_curso`,`id_estudiante`) REFERENCES `estudiantes_curso_periodo`(`id_periodo`,`codigo_curso`,`id_estudiante`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_pagos_estudiantes_curso`("id_pago", "id_periodo", "codigo_curso", "id_estudiante", "monto", "fecha", "tipo_pago", "comprobante") SELECT "id_pago", "id_periodo", "codigo_curso", "id_estudiante", "monto", "fecha", "tipo_pago", "comprobante" FROM `pagos_estudiantes_curso`;--> statement-breakpoint
DROP TABLE `pagos_estudiantes_curso`;--> statement-breakpoint
ALTER TABLE `__new_pagos_estudiantes_curso` RENAME TO `pagos_estudiantes_curso`;--> statement-breakpoint
PRAGMA foreign_keys=ON;