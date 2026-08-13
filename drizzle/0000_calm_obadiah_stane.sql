CREATE TABLE `quote_attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quoteRequestId` int NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` varchar(600) NOT NULL,
	`originalName` varchar(500) NOT NULL,
	`contentType` varchar(160) NOT NULL,
	`byteSize` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quote_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quote_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestType` varchar(32) NOT NULL,
	`shape` varchar(32),
	`quantity` varchar(120) NOT NULL,
	`delivery` varchar(120) NOT NULL,
	`wire` text,
	`priority` varchar(32),
	`materialFlexibility` varchar(32),
	`requirements` text,
	`note` text,
	`companyName` varchar(255) NOT NULL,
	`contactName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(64) NOT NULL,
	`notificationStatus` enum('skipped','sent','failed') NOT NULL DEFAULT 'skipped',
	`notificationNote` varchar(500),
	`status` enum('new','reviewing','quoted','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quote_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('admin','user') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
ALTER TABLE `quote_attachments` ADD CONSTRAINT `quote_attachments_quoteRequestId_quote_requests_id_fk` FOREIGN KEY (`quoteRequestId`) REFERENCES `quote_requests`(`id`) ON DELETE cascade ON UPDATE no action;