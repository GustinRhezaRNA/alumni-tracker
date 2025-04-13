CREATE TYPE "public"."role" AS ENUM('ADMIN', 'ALUMNI', 'COMPANY');--> statement-breakpoint
CREATE TABLE "alumni_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"graduation_year" integer NOT NULL,
	"major" varchar(255) NOT NULL,
	"phone" varchar(15) NOT NULL,
	"address" text NOT NULL,
	"job_status" text NOT NULL,
	"current_company" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "alumni_profiles_id_unique" UNIQUE("id"),
	CONSTRAINT "alumni_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"industry" text NOT NULL,
	"address" text NOT NULL,
	"contact" text NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "companies_id_unique" UNIQUE("id"),
	CONSTRAINT "companies_contact_unique" UNIQUE("contact")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"alumni_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"review_text" text NOT NULL,
	"review_date" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "reviews_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(255),
	"email" text NOT NULL,
	"google_id" text,
	"picture_url" text,
	"role" "role" DEFAULT 'ALUMNI',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_id_unique" UNIQUE("id"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id")
);
--> statement-breakpoint
ALTER TABLE "alumni_profiles" ADD CONSTRAINT "alumni_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_alumni_id_alumni_profiles_id_fk" FOREIGN KEY ("alumni_id") REFERENCES "public"."alumni_profiles"("id") ON DELETE no action ON UPDATE no action;