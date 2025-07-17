CREATE TABLE `ModCorp_Team` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`colour` text DEFAULT '#ffbb00' NOT NULL,
	`logourl` text DEFAULT '' NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`discord` text DEFAULT '{"Role":"","Channel":"","Server":""}' NOT NULL
);
