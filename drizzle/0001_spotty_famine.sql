CREATE TABLE `pagos` (
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
	`bono_nocturno` real DEFAULT 0 NOT NULL,
	`horas_extras_nocturnas` real DEFAULT 0 NOT NULL,
	`horas_extras_diurnas` real DEFAULT 0 NOT NULL,
	`feriados_trabajados` real DEFAULT 0 NOT NULL,
	`retroactivos` real DEFAULT 0 NOT NULL,
	`ley_politica_habitacional_faov` real NOT NULL,
	`descuento_sso` real NOT NULL,
	`descuento_spf` real NOT NULL,
	FOREIGN KEY (`empleadoId`) REFERENCES `empleados`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`periodoNominaId`) REFERENCES `periodos_nomina`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`registradoPorId`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `periodos_nomina` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `periodos_nomina_nombre_unique` ON `periodos_nomina` (`nombre`);