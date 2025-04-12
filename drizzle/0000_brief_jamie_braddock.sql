CREATE TABLE `cargos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`codigo` text NOT NULL,
	`nivel_cargo` text NOT NULL,
	`nombre_cargo` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cursos` (
	`codigo` text PRIMARY KEY NOT NULL,
	`nombre_curso` text NOT NULL,
	`descripcion` text,
	`estado` integer DEFAULT 1,
	`precio_total` real
);
--> statement-breakpoint
CREATE TABLE `cursos_periodo` (
	`id_periodo` integer NOT NULL,
	`id_curso` integer NOT NULL,
	`horario` text NOT NULL,
	FOREIGN KEY (`id_periodo`) REFERENCES `periodo`(`id_periodo`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`id_curso`) REFERENCES `cursos`(`codigo`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `empleados` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cedula` text NOT NULL,
	`nombreCompleto` text NOT NULL,
	`fechaNacimiento` integer NOT NULL,
	`sexo` text NOT NULL,
	`estadoCivil` text NOT NULL,
	`religion` text NOT NULL,
	`hijosMenoresSeis` integer DEFAULT 0 NOT NULL,
	`montoMensualGuarderia` real DEFAULT 0 NOT NULL,
	`fechaIngresoAvec` integer NOT NULL,
	`fechaIngresoPlantel` integer NOT NULL,
	`titulo` integer NOT NULL,
	`descripcionTitulo` text,
	`mencionTitulo` text,
	`carreraEstudiando` text,
	`tipoLapsoEstudios` text,
	`numeroLapsosAprobados` integer,
	`postgrado` text,
	`experienciaLaboral` integer DEFAULT 0 NOT NULL,
	`gradoSistema` integer NOT NULL,
	`nivelSistema` integer NOT NULL,
	`gradoCentro` integer NOT NULL,
	`nivelCentro` integer NOT NULL,
	`cargo` integer NOT NULL,
	`horasSemanales` real NOT NULL,
	`sueldo` real NOT NULL,
	`asignacionesMensual` real DEFAULT 0 NOT NULL,
	`deduccionesMensual` real DEFAULT 0 NOT NULL,
	`primaAntiguedad` real DEFAULT 0 NOT NULL,
	`primaGeografica` real DEFAULT 0 NOT NULL,
	`primaCompensacionAcademica` real DEFAULT 0 NOT NULL,
	`cantidadHijos` integer NOT NULL,
	`primaAsistencial` real DEFAULT 0 NOT NULL,
	`contribucionDiscapacidad` real DEFAULT 0 NOT NULL,
	`contribucionDiscapacidadHijos` real DEFAULT 0 NOT NULL,
	`porcentajeSso` real DEFAULT 0 NOT NULL,
	`porcentajeRpe` real DEFAULT 0 NOT NULL,
	`porcentajeFaov` real DEFAULT 0 NOT NULL,
	`pagoDirecto` integer NOT NULL,
	`jubilado` integer NOT NULL,
	`cuentaBancaria` text NOT NULL,
	`observaciones` text,
	`fechaRegistro` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`fechaActualizacion` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	FOREIGN KEY (`titulo`) REFERENCES `titulos`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`gradoSistema`) REFERENCES `grados`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`nivelSistema`) REFERENCES `niveles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`gradoCentro`) REFERENCES `grados`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`nivelCentro`) REFERENCES `niveles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`cargo`) REFERENCES `cargos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `empleados_cedula_unique` ON `empleados` (`cedula`);--> statement-breakpoint
CREATE TABLE `equivalencia_cargos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cargo` integer NOT NULL,
	`nivel` integer NOT NULL,
	`tipo_personal` text NOT NULL,
	FOREIGN KEY (`cargo`) REFERENCES `cargos`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`nivel`) REFERENCES `niveles`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "check_type_equiv_cargos" CHECK("equivalencia_cargos"."tipo_personal" IN ('administrativo', 'instructor'))
);
--> statement-breakpoint
CREATE TABLE `equivalencia_grados` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`grado` integer NOT NULL,
	`titulo` integer NOT NULL,
	`experiencia_laboral` integer DEFAULT 0 NOT NULL,
	`formacion_tecnico_profesional` text NOT NULL,
	`tipo_personal` text NOT NULL,
	FOREIGN KEY (`grado`) REFERENCES `grados`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`titulo`) REFERENCES `titulos`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "check_type_equiv_grados" CHECK("equivalencia_grados"."tipo_personal" IN ('administrativo', 'instructor'))
);
--> statement-breakpoint
CREATE TABLE `equivalencia_niveles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nivel` integer NOT NULL,
	`min_tiempo_servicio` integer NOT NULL,
	`formacion_crecimiento_personal` text NOT NULL,
	FOREIGN KEY (`nivel`) REFERENCES `niveles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `estudiantes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`apellido` text NOT NULL,
	`cedula` text NOT NULL,
	`sexo` text NOT NULL,
	`fechaNacimiento` integer,
	`edad` integer NOT NULL,
	`religion` text NOT NULL,
	`telefono` text NOT NULL,
	`correo` text NOT NULL,
	`direccion` text NOT NULL,
	`ultimoAñoCursado` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `estudiantes_cedula_unique` ON `estudiantes` (`cedula`);--> statement-breakpoint
CREATE UNIQUE INDEX `estudiantes_correo_unique` ON `estudiantes` (`correo`);--> statement-breakpoint
CREATE TABLE `estudiantes_curso_periodo` (
	`id_periodo` integer NOT NULL,
	`codigo_curso` text NOT NULL,
	`id_estudiante` integer NOT NULL,
	FOREIGN KEY (`id_periodo`) REFERENCES `periodo`(`id_periodo`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`codigo_curso`) REFERENCES `cursos`(`codigo`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`id_estudiante`) REFERENCES `estudiantes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `estudiantes_curso_periodo_id_periodo_codigo_curso_id_estudiante_unique` ON `estudiantes_curso_periodo` (`id_periodo`,`codigo_curso`,`id_estudiante`);--> statement-breakpoint
CREATE TABLE `grados` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`codigo` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `grados_codigo_unique` ON `grados` (`codigo`);--> statement-breakpoint
CREATE TABLE `niveles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `niveles_nombre_unique` ON `niveles` (`nombre`);--> statement-breakpoint
CREATE TABLE `periodo` (
	`id_periodo` integer PRIMARY KEY NOT NULL,
	`fechaInicio` integer NOT NULL,
	`fechaFin` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profesores` (
	`id` integer PRIMARY KEY NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `empleados`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `titulos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`codigo` text NOT NULL,
	`nombre` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL,
	CONSTRAINT "check_role" CHECK("usuarios"."role" IN ('admin', 'secretaria'))
);
