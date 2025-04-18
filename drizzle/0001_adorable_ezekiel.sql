CREATE TABLE `pagos_estudiantes_curso` (
	`id_pago` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id_periodo` integer NOT NULL,
	`codigo_curso` text NOT NULL,
	`id_estudiante` integer NOT NULL,
	`monto` real NOT NULL,
	`fecha` integer NOT NULL,
	`tipo_pago` text NOT NULL,
	`comprobante` text,
	FOREIGN KEY (`id_periodo`) REFERENCES `estudiantes_curso_periodo`(`id_periodo`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`codigo_curso`) REFERENCES `estudiantes_curso_periodo`(`codigo_curso`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes_curso_periodo`(`id_estudiante`) ON UPDATE no action ON DELETE no action
);
