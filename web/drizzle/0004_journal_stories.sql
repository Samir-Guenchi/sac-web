ALTER TABLE `journal_entries` ADD `body` text;--> statement-breakpoint
ALTER TABLE `journal_entries` ADD `gallery` text DEFAULT '[]' NOT NULL;