CREATE TABLE `primas_pago_nomina` (
	`idPrima` integer NOT NULL,
	`idPago` integer NOT NULL,
	`monto` real NOT NULL,
	PRIMARY KEY(`idPago`, `idPrima`),
	FOREIGN KEY (`idPrima`) REFERENCES `primas`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`idPago`) REFERENCES `pagos_nomina`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "monto_check_primas_pago" CHECK("primas_pago_nomina"."monto" > 0)
);
--> statement-breakpoint
ALTER TABLE `pagos_nomina` DROP COLUMN `prima_por_hijo`;--> statement-breakpoint
ALTER TABLE `pagos_nomina` DROP COLUMN `prima_compensatoria`;--> statement-breakpoint
ALTER TABLE `pagos_nomina` DROP COLUMN `bono_nocturno`;--> statement-breakpoint
ALTER TABLE `pagos_nomina` DROP COLUMN `horas_extras_nocturnas`;--> statement-breakpoint
ALTER TABLE `pagos_nomina` DROP COLUMN `horas_extras_diurnas`;--> statement-breakpoint
ALTER TABLE `pagos_nomina` DROP COLUMN `feriados_trabajados`;--> statement-breakpoint
ALTER TABLE `pagos_nomina` DROP COLUMN `retroactivos`;