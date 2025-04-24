CREATE TABLE `escala_sueldo_personal` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nivel` integer NOT NULL,
	`grado` integer NOT NULL,
	`tipo_personal` text NOT NULL,
	`escala_sueldo` real NOT NULL,
	FOREIGN KEY (`nivel`) REFERENCES `niveles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`grado`) REFERENCES `grados`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "check_type_escala_sueldo_personal" CHECK("escala_sueldo_personal"."tipo_personal" IN ('administrativo', 'instructor'))
);
