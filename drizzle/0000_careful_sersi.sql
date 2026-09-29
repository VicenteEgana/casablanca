CREATE TABLE `content` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`data` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `visits` (
	`visitor` text NOT NULL,
	`point` text NOT NULL,
	`source` text NOT NULL,
	`completed` integer DEFAULT 0 NOT NULL,
	`created` text NOT NULL,
	PRIMARY KEY(`visitor`, `point`)
);
