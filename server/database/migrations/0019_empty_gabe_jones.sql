CREATE TABLE `ModCorp_AwardedAchievements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`discord_user_id` text NOT NULL,
	`achievement` integer NOT NULL,
	`timestamp` text NOT NULL,
	`note` text
);
