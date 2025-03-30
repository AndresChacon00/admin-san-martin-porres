CREATE TABLE `estudiantes_curso_periodo` (
	`id_periodo` integer NOT NULL,
	`codigo_curso` text NOT NULL,
	`id_estudiante` integer NOT NULL,
	FOREIGN KEY (`id_periodo`) REFERENCES `periodo`(`id_periodo`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`codigo_curso`) REFERENCES `cursos`(`codigo`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes`(`id`) ON UPDATE no action ON DELETE no action
);
