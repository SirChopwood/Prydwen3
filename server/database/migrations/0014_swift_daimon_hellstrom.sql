CREATE TABLE `ModCorp_Cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`file` text NOT NULL,
	`rarity` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ModCorp_UserCards` (
	`discord_id` integer PRIMARY KEY NOT NULL,
	`cards` text DEFAULT '[]' NOT NULL,
	`rolls` integer DEFAULT 0 NOT NULL
);
