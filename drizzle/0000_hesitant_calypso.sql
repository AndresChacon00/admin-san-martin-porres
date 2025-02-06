CREATE TABLE IF NOT EXISTS `estudiantes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`email` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `estudiantes_email_unique` ON `estudiantes` (`email`);