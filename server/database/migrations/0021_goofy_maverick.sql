CREATE TABLE `RRM_Group` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`desc` text DEFAULT '' NOT NULL,
	`channels` text DEFAULT '[]' NOT NULL
);
