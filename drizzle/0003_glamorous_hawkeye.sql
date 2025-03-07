ALTER TABLE `estudiantes` RENAME COLUMN "name" TO "nombre";--> statement-breakpoint
ALTER TABLE `estudiantes` RENAME COLUMN "age" TO "edad";--> statement-breakpoint
ALTER TABLE `estudiantes` RENAME COLUMN "email" TO "correo";--> statement-breakpoint
CREATE TABLE `cursos` (
	`codigo` text PRIMARY KEY NOT NULL,
	`nombre_curso` text NOT NULL,
	`descripcion` text,
	`horario` text,
	`estado` integer DEFAULT 1,
	`precio_total` real
);
--> statement-breakpoint
CREATE TABLE `cursos_periodo` (
	`id_periodo` integer NOT NULL,
	`id_curso` integer NOT NULL,
	FOREIGN KEY (`id_periodo`) REFERENCES `periodo`(`id_periodo`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`id_curso`) REFERENCES `cursos`(`codigo`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `periodo` (
	`id_periodo` integer PRIMARY KEY NOT NULL,
	`fechaInicio` integer NOT NULL,
	`fechaFin` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
DROP INDEX `estudiantes_email_unique`;--> statement-breakpoint
ALTER TABLE `estudiantes` ADD `apellido` text NOT NULL;--> statement-breakpoint
ALTER TABLE `estudiantes` ADD `cedula` text NOT NULL;--> statement-breakpoint
ALTER TABLE `estudiantes` ADD `sexo` text NOT NULL;--> statement-breakpoint
ALTER TABLE `estudiantes` ADD `fechaNacimiento` integer;--> statement-breakpoint
ALTER TABLE `estudiantes` ADD `religion` text NOT NULL;--> statement-breakpoint
ALTER TABLE `estudiantes` ADD `telefono` text NOT NULL;--> statement-breakpoint
ALTER TABLE `estudiantes` ADD `direccion` text NOT NULL;--> statement-breakpoint
ALTER TABLE `estudiantes` ADD `ultimoAñoCursado` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `estudiantes_cedula_unique` ON `estudiantes` (`cedula`);--> statement-breakpoint
CREATE UNIQUE INDEX `estudiantes_correo_unique` ON `estudiantes` (`correo`);