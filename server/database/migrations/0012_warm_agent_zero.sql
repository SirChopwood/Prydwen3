PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ModCorp_Team` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`colour` text DEFAULT '#ffbb00' NOT NULL,
	`logo_url` text DEFAULT '' NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`discord` text DEFAULT '{"role":"","channel":"","server":""}' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_ModCorp_Team`("id", "name", "description", "colour", "logo_url", "score", "discord") SELECT "id", "name", "description", "colour", "logo_url", "score", "discord" FROM `ModCorp_Team`;--> statement-breakpoint
DROP TABLE `ModCorp_Team`;--> statement-breakpoint
ALTER TABLE `__new_ModCorp_Team` RENAME TO `ModCorp_Team`;--> statement-breakpoint
PRAGMA foreign_keys=ON;