ALTER TABLE "alumni_profiles" DROP CONSTRAINT "alumni_profiles_user_id_unique";--> statement-breakpoint
ALTER TABLE "alumni_profiles" DROP CONSTRAINT "alumni_profiles_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "alumni_profiles" ADD CONSTRAINT "alumni_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;