CREATE TABLE `RRM_Request` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` integer,
	`text` text NOT NULL,
	`user` text NOT NULL,
	`code` text NOT NULL,
	`metadata` text NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `RRM_Session`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `RRM_Session` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`requests` text DEFAULT '[]',
	`status` text DEFAULT 'Locked',
	`start_time` text NOT NULL,
	`end_time` text,
	`last_user` text NOT NULL,
	`owner_id` integer,
	FOREIGN KEY (`owner_id`) REFERENCES `RRM_TwitchChannel`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `RRM_TwitchChannel` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`channel_name` text NOT NULL,
	`channel_colour` text NOT NULL,
	`channel_image` text
);
--> statement-breakpoint
CREATE TABLE `session_to_channels` (
	`session_id` integer NOT NULL,
	`channel_id` integer NOT NULL,
	PRIMARY KEY(`session_id`, `channel_id`),
	FOREIGN KEY (`session_id`) REFERENCES `RRM_Session`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`channel_id`) REFERENCES `RRM_TwitchChannel`(`id`) ON UPDATE no action ON DELETE no action
);
