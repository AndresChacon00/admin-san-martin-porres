CREATE TABLE `titulos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`codigo` text NOT NULL,
	`nombre` text NOT NULL
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_equivalencia_grados` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`grado` integer NOT NULL,
	`titulo` integer NOT NULL,
	`experiencia_laboral` integer,
	`formacion_tecnico_profesional` text NOT NULL,
	`tipo_personal` text NOT NULL,
	FOREIGN KEY (`grado`) REFERENCES `grados`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`titulo`) REFERENCES `titulos`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "check_type_equiv_grados" CHECK("__new_equivalencia_grados"."tipo_personal" IN ('administrativo', 'instructor'))
);
--> statement-breakpoint
INSERT INTO `__new_equivalencia_grados`("id", "grado", "titulo", "experiencia_laboral", "formacion_tecnico_profesional", "tipo_personal") SELECT "id", "grado", "titulo", "experiencia_laboral", "formacion_tecnico_profesional", "tipo_personal" FROM `equivalencia_grados`;--> statement-breakpoint
DROP TABLE `equivalencia_grados`;--> statement-breakpoint
ALTER TABLE `__new_equivalencia_grados` RENAME TO `equivalencia_grados`;--> statement-breakpoint
PRAGMA foreign_keys=ON;