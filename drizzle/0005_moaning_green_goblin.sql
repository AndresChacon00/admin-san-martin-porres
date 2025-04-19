PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_primas_academicas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nivelAcademico` text NOT NULL,
	`porcentaje` real NOT NULL,
	CONSTRAINT "check_nivelAcademico" CHECK("__new_primas_academicas"."nivelAcademico" IN ('TSU', 'LICENCIADO', 'POSTGRADO EN ESPECIALIDAD', 'MAESTRIA', 'DOCTORADO'))
);
--> statement-breakpoint
DROP TABLE `primas_academicas`;--> statement-breakpoint
ALTER TABLE `__new_primas_academicas` RENAME TO `primas_academicas`;--> statement-breakpoint
PRAGMA foreign_keys=ON;