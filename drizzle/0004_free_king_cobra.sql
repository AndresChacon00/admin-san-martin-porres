CREATE TABLE `primas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tipoFactor` text,
	`factor` real NOT NULL,
	`campoBase` text NOT NULL,
	`frecuencia` text NOT NULL,
	CONSTRAINT "check_tipoFactor" CHECK("primas"."tipoFactor" IN ('porcentaje', 'dias', 'factor')),
	CONSTRAINT "check_campoBase" CHECK("primas"."campoBase" IN ('Salario Base', 'Salario Integral', 'Sueldo Base Mínimo', 'Hijos')),
	CONSTRAINT "check_frecuencia" CHECK("primas"."frecuencia" IN ('mensual', 'anual'))
);
--> statement-breakpoint
CREATE TABLE `primas_academicas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titulo` integer NOT NULL,
	`porcentaje` real NOT NULL,
	FOREIGN KEY (`titulo`) REFERENCES `titulos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `primas_antiguedad` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tiempoServicio` integer NOT NULL,
	`porcentaje` real NOT NULL
);
