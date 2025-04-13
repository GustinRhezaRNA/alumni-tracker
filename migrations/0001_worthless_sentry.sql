ALTER TABLE "users" DROP CONSTRAINT "users_google_id_unique";--> statement-breakpoint
ALTER TABLE "alumni_profiles" ADD COLUMN "job_wait_time" varchar(20);--> statement-breakpoint
ALTER TABLE "alumni_profiles" ADD COLUMN "first_salary" varchar(20);--> statement-breakpoint
ALTER TABLE "alumni_profiles" ADD COLUMN "job_match_with_major" integer;--> statement-breakpoint
ALTER TABLE "alumni_profiles" ADD COLUMN "curriculum_feedback" text;--> statement-breakpoint
ALTER TABLE "alumni_profiles" ADD COLUMN "university_name" varchar(255);--> statement-breakpoint
ALTER TABLE "alumni_profiles" ADD COLUMN "study_program" varchar(255);--> statement-breakpoint
ALTER TABLE "alumni_profiles" ADD COLUMN "funding_source" text;--> statement-breakpoint
ALTER TABLE "alumni_profiles" ADD COLUMN "scholarship_source" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "company_description" text;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "hrd_contact" text;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "google_id";