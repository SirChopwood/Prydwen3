CREATE TABLE `ModCorp_Logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_name` text NOT NULL,
	`user_id` text NOT NULL,
	`action` text NOT NULL,
	`reason` text,
	`timestamp` text NOT NULL
);
