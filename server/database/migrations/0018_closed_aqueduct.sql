CREATE TABLE `ModCorp_Achievements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`file` text NOT NULL,
	`type` text DEFAULT 'Medal' NOT NULL
);
