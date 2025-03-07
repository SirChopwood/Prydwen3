DROP TABLE `RRM_SessionToChannels`;--> statement-breakpoint
DROP TABLE `RRM_TwitchChannel`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_RRM_Session` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`requests` text DEFAULT '[]',
	`status` text DEFAULT 'Locked',
	`start_time` text NOT NULL,
	`end_time` text,
	`last_user` text NOT NULL,
	`owner` text NOT NULL,
	`channels` text DEFAULT '[]'
);
--> statement-breakpoint
INSERT INTO `__new_RRM_Session`("id", "requests", "status", "start_time", "end_time", "last_user", "owner", "channels") SELECT "id", "requests", "status", "start_time", "end_time", "last_user", "owner", "channels" FROM `RRM_Session`;--> statement-breakpoint
DROP TABLE `RRM_Session`;--> statement-breakpoint
ALTER TABLE `__new_RRM_Session` RENAME TO `RRM_Session`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_RRM_Request` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text NOT NULL,
	`user` text NOT NULL,
	`code` text NOT NULL,
	`metadata` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_RRM_Request`("id", "text", "user", "code", "metadata") SELECT "id", "text", "user", "code", "metadata" FROM `RRM_Request`;--> statement-breakpoint
DROP TABLE `RRM_Request`;--> statement-breakpoint
ALTER TABLE `__new_RRM_Request` RENAME TO `RRM_Request`;