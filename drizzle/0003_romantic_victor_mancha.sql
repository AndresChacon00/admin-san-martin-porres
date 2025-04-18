ALTER TABLE `pagos` RENAME TO `pagos_nomina`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_pagos_nomina` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`empleadoId` integer NOT NULL,
	`periodoNominaId` integer NOT NULL,
	`registradoPorId` integer NOT NULL,
	`fecha` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`cargo_empleado` text NOT NULL,
	`sueldo_base_mensual` real NOT NULL,
	`prima_antiguedad` real NOT NULL,
	`prima_academica` real NOT NULL,
	`prima_por_hijo` real NOT NULL,
	`prima_compensatoria` real NOT NULL,
	`total_asignaciones` real NOT NULL,
	`bono_nocturno` real DEFAULT 0 NOT NULL,
	`horas_extras_nocturnas` real DEFAULT 0 NOT NULL,
	`horas_extras_diurnas` real DEFAULT 0 NOT NULL,
	`feriados_trabajados` real DEFAULT 0 NOT NULL,
	`retroactivos` real DEFAULT 0 NOT NULL,
	`total_adicional` real NOT NULL,
	`ley_politica_habitacional_faov` real NOT NULL,
	`descuento_sso` real NOT NULL,
	`descuento_spf` real NOT NULL,
	`total_deducciones` real NOT NULL,
	`total_nomina` real NOT NULL,
	FOREIGN KEY (`empleadoId`) REFERENCES `empleados`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`periodoNominaId`) REFERENCES `periodos_nomina`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`registradoPorId`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
INSERT INTO `__new_pagos_nomina`("id", "empleadoId", "periodoNominaId", "registradoPorId", "fecha", "cargo_empleado", "sueldo_base_mensual", "prima_antiguedad", "prima_academica", "prima_por_hijo", "prima_compensatoria", "total_asignaciones", "bono_nocturno", "horas_extras_nocturnas", "horas_extras_diurnas", "feriados_trabajados", "retroactivos", "total_adicional", "ley_politica_habitacional_faov", "descuento_sso", "descuento_spf", "total_deducciones", "total_nomina") SELECT "id", "empleadoId", "periodoNominaId", "registradoPorId", "fecha", "cargo_empleado", "sueldo_base_mensual", "prima_antiguedad", "prima_academica", "prima_por_hijo", "prima_compensatoria", "total_asignaciones", "bono_nocturno", "horas_extras_nocturnas", "horas_extras_diurnas", "feriados_trabajados", "retroactivos", "total_adicional", "ley_politica_habitacional_faov", "descuento_sso", "descuento_spf", "total_deducciones", "total_nomina" FROM `pagos_nomina`;--> statement-breakpoint
DROP TABLE `pagos_nomina`;--> statement-breakpoint
ALTER TABLE `__new_pagos_nomina` RENAME TO `pagos_nomina`;--> statement-breakpoint
PRAGMA foreign_keys=ON;