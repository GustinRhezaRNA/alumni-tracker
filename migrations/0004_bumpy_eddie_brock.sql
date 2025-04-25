CREATE TABLE "review_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_id" uuid NOT NULL,
	"hard_skills_h1" numeric(4, 2) NOT NULL,
	"hard_skills_h2" numeric(4, 2) NOT NULL,
	"hard_skills_h3" numeric(4, 2) NOT NULL,
	"soft_skills_s1" numeric(4, 2) NOT NULL,
	"soft_skills_s2" numeric(4, 2) NOT NULL,
	"soft_skills_s3" numeric(4, 2) NOT NULL,
	"soft_skills_s4" numeric(4, 2) NOT NULL,
	"soft_skills_s5" numeric(4, 2) NOT NULL,
	"productivity_p1" numeric(4, 2) NOT NULL,
	"productivity_p2" numeric(4, 2) NOT NULL,
	"productivity_p3" numeric(4, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "review_details_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "review_details" ADD CONSTRAINT "review_details_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE no action ON UPDATE no action;