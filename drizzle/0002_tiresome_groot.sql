PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_estudiantes_curso_periodo` (
	`id_periodo` integer NOT NULL,
	`codigo_curso` text NOT NULL,
	`id_estudiante` integer NOT NULL,
	PRIMARY KEY(`id_periodo`, `codigo_curso`, `id_estudiante`),
	FOREIGN KEY (`id_periodo`) REFERENCES `periodo`(`id_periodo`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`codigo_curso`) REFERENCES `cursos`(`codigo`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_estudiantes_curso_periodo`("id_periodo", "codigo_curso", "id_estudiante") SELECT "id_periodo", "codigo_curso", "id_estudiante" FROM `estudiantes_curso_periodo`;--> statement-breakpoint
DROP TABLE `estudiantes_curso_periodo`;--> statement-breakpoint
ALTER TABLE `__new_estudiantes_curso_periodo` RENAME TO `estudiantes_curso_periodo`;--> statement-breakpoint
PRAGMA foreign_keys=ON;