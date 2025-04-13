ALTER TABLE "alumni_profiles" ADD COLUMN "nim" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "alumni_profiles" ADD COLUMN "faculty" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "alumni_profiles" ADD COLUMN "job_position" text;--> statement-breakpoint
ALTER TABLE "companies" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "alumni_profiles" ADD CONSTRAINT "alumni_profiles_nim_unique" UNIQUE("nim");