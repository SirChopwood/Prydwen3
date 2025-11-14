ALTER TABLE `ModCorp_Achievements` ADD `tiers` text;--> statement-breakpoint
ALTER TABLE `ModCorp_AwardedAchievements` ADD `tier` integer DEFAULT 0 NOT NULL;