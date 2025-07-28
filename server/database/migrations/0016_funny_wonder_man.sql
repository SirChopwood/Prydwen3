CREATE TABLE `ModCorp_Banners` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`file` text NOT NULL,
	`contents` text DEFAULT '[]' NOT NULL,
	`active` integer DEFAULT false
);
