PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_equivalencia_niveles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nivel` integer NOT NULL,
	`min_tiempo_servicio` integer NOT NULL,
	`formacion_crecimiento_personal` text NOT NULL,
	FOREIGN KEY (`nivel`) REFERENCES `niveles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_equivalencia_niveles`("id", "nivel", "min_tiempo_servicio", "formacion_crecimiento_personal") SELECT "id", "nivel", "min_tiempo_servicio", "formacion_crecimiento_personal" FROM `equivalencia_niveles`;--> statement-breakpoint
DROP TABLE `equivalencia_niveles`;--> statement-breakpoint
ALTER TABLE `__new_equivalencia_niveles` RENAME TO `equivalencia_niveles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;