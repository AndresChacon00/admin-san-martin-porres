PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_primas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`tipoFactor` text,
	`factor` real NOT NULL,
	`campoBase` text NOT NULL,
	`frecuencia` text NOT NULL,
	CONSTRAINT "check_tipoFactor" CHECK("__new_primas"."tipoFactor" IN ('porcentaje', 'dias', 'factor', 'constante') OR "__new_primas"."tipoFactor" IS NULL),
	CONSTRAINT "check_campoBase" CHECK("__new_primas"."campoBase" IN ('Salario Base', 'Salario Integral', 'Sueldo Base Mínimo', 'Hijos')),
	CONSTRAINT "check_frecuencia" CHECK("__new_primas"."frecuencia" IN ('mensual', 'anual'))
);
--> statement-breakpoint
INSERT INTO `__new_primas`("id", "nombre", "tipoFactor", "factor", "campoBase", "frecuencia") SELECT "id", "nombre", "tipoFactor", "factor", "campoBase", "frecuencia" FROM `primas`;--> statement-breakpoint
DROP TABLE `primas`;--> statement-breakpoint
ALTER TABLE `__new_primas` RENAME TO `primas`;--> statement-breakpoint
PRAGMA foreign_keys=ON;