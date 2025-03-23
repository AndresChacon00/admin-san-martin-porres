PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_usuarios` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL,
	CONSTRAINT "check_role" CHECK("__new_usuarios"."role" IN ('admin', 'secretaria'))
);
--> statement-breakpoint
INSERT INTO `__new_usuarios`("id", "nombre", "email", "password", "role") SELECT "id", "nombre", "email", "password", "role" FROM `usuarios`;--> statement-breakpoint
DROP TABLE `usuarios`;--> statement-breakpoint
ALTER TABLE `__new_usuarios` RENAME TO `usuarios`;--> statement-breakpoint
PRAGMA foreign_keys=ON;