PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_equivalencia_cargos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cargo` integer NOT NULL,
	`nivel` integer NOT NULL,
	`tipo_personal` text NOT NULL,
	FOREIGN KEY (`cargo`) REFERENCES `cargos`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`nivel`) REFERENCES `niveles`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "check_type_equiv_cargos" CHECK("__new_equivalencia_cargos"."tipo_personal" IN ('administrativo', 'instructor'))
);
--> statement-breakpoint
INSERT INTO `__new_equivalencia_cargos`("id", "cargo", "nivel", "tipo_personal") SELECT "id", "cargo", "nivel", "tipo_personal" FROM `equivalencia_cargos`;--> statement-breakpoint
DROP TABLE `equivalencia_cargos`;--> statement-breakpoint
ALTER TABLE `__new_equivalencia_cargos` RENAME TO `equivalencia_cargos`;--> statement-breakpoint
PRAGMA foreign_keys=ON;