ALTER TABLE "review_details" DROP CONSTRAINT "review_details_review_id_reviews_id_fk";
--> statement-breakpoint
ALTER TABLE "review_details" ADD CONSTRAINT "review_details_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;