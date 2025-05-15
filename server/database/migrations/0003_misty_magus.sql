ALTER TABLE `session_to_channels` RENAME TO `RRM_SessionToChannels`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_RRM_SessionToChannels` (
	`session_id` integer NOT NULL,
	`channel_id` integer NOT NULL,
	PRIMARY KEY(`session_id`, `channel_id`),
	FOREIGN KEY (`session_id`) REFERENCES `RRM_Session`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`channel_id`) REFERENCES `RRM_TwitchChannel`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_RRM_SessionToChannels`("session_id", "channel_id") SELECT "session_id", "channel_id" FROM `RRM_SessionToChannels`;--> statement-breakpoint
DROP TABLE `RRM_SessionToChannels`;--> statement-breakpoint
ALTER TABLE `__new_RRM_SessionToChannels` RENAME TO `RRM_SessionToChannels`;--> statement-breakpoint
PRAGMA foreign_keys=ON;