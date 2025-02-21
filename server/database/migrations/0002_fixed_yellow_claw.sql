PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_RRM_TwitchChannel` (
	`id` integer PRIMARY KEY NOT NULL,
	`channel_name` text NOT NULL,
	`channel_colour` text DEFAULT '#FFFFFF',
	`channel_image` text
);
--> statement-breakpoint
INSERT INTO `__new_RRM_TwitchChannel`("id", "channel_name", "channel_colour", "channel_image") SELECT "id", "channel_name", "channel_colour", "channel_image" FROM `RRM_TwitchChannel`;--> statement-breakpoint
DROP TABLE `RRM_TwitchChannel`;--> statement-breakpoint
ALTER TABLE `__new_RRM_TwitchChannel` RENAME TO `RRM_TwitchChannel`;--> statement-breakpoint
PRAGMA foreign_keys=ON;