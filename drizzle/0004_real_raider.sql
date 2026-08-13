CREATE TABLE `quote_estimate_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`estimateId` int NOT NULL,
	`sortOrder` int NOT NULL,
	`description` varchar(255) NOT NULL,
	`specification` text,
	`quantity` int NOT NULL DEFAULT 1,
	`unit` varchar(32) NOT NULL DEFAULT '式',
	`unitPrice` int NOT NULL DEFAULT 0,
	CONSTRAINT `quote_estimate_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quote_estimates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quoteRequestId` int NOT NULL,
	`estimateNumber` varchar(80) NOT NULL,
	`issueDate` varchar(32) NOT NULL,
	`validUntil` varchar(80) NOT NULL,
	`taxRate` int NOT NULL DEFAULT 10,
	`deliveryTerms` text,
	`paymentTerms` text,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quote_estimates_id` PRIMARY KEY(`id`),
	CONSTRAINT `quote_estimates_quote_request_unique` UNIQUE(`quoteRequestId`)
);
--> statement-breakpoint
ALTER TABLE `quote_estimate_items` ADD CONSTRAINT `quote_estimate_items_estimateId_quote_estimates_id_fk` FOREIGN KEY (`estimateId`) REFERENCES `quote_estimates`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `quote_estimates` ADD CONSTRAINT `quote_estimates_quoteRequestId_quote_requests_id_fk` FOREIGN KEY (`quoteRequestId`) REFERENCES `quote_requests`(`id`) ON DELETE cascade ON UPDATE no action;