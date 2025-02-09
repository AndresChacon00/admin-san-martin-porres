PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_profesores` (
	`id` integer PRIMARY KEY NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `empleados`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_profesores`("id") SELECT "id" FROM `profesores`;--> statement-breakpoint
DROP TABLE `profesores`;--> statement-breakpoint
ALTER TABLE `__new_profesores` RENAME TO `profesores`;--> statement-breakpoint
PRAGMA foreign_keys=ON;