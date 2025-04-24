PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_escala_sueldo_personal` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nivel` integer NOT NULL,
	`grado` integer NOT NULL,
	`tipo_personal` text NOT NULL,
	`escala_sueldo` real NOT NULL,
	FOREIGN KEY (`grado`) REFERENCES `grados`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "check_type_escala_sueldo_personal" CHECK("__new_escala_sueldo_personal"."tipo_personal" IN ('administrativo', 'instructor'))
);
--> statement-breakpoint
INSERT INTO `__new_escala_sueldo_personal`("id", "nivel", "grado", "tipo_personal", "escala_sueldo") SELECT "id", "nivel", "grado", "tipo_personal", "escala_sueldo" FROM `escala_sueldo_personal`;--> statement-breakpoint
DROP TABLE `escala_sueldo_personal`;--> statement-breakpoint
ALTER TABLE `__new_escala_sueldo_personal` RENAME TO `escala_sueldo_personal`;--> statement-breakpoint
PRAGMA foreign_keys=ON;