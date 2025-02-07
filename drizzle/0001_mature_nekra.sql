CREATE TABLE IF NOT EXISTS `empleados` (
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
	`titulo` text NOT NULL,
	`descripcionTitulo` text,
	`mencionTitulo` text,
	`carreraEstudiando` text,
	`tipoLapsoEstudios` text,
	`numeroLapsosAprobados` integer,
	`postgrado` text,
	`experienciaLaboral` integer DEFAULT 0 NOT NULL,
	`gradoSistema` text NOT NULL,
	`nivelSistema` text NOT NULL,
	`gradoCentro` text NOT NULL,
	`nivelCentro` text NOT NULL,
	`cargo` text NOT NULL,
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
	`fechaActualizacion` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `empleados_cedula_unique` ON `empleados` (`cedula`);--> statement-breakpoint
CREATE TABLE `profesores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL
);
