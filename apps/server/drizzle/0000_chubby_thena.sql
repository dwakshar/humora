CREATE TABLE "billing_history" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"plan" text,
	"amount" numeric,
	"currency" text,
	"status" text,
	"created_at" text NOT NULL,
	"dodo_subscription_id" text
);
--> statement-breakpoint
CREATE TABLE "sites" (
	"sitekey" text PRIMARY KEY NOT NULL,
	"domain" text NOT NULL,
	"environment" text NOT NULL,
	"user_id" uuid NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"verifications_this_month" integer DEFAULT 0 NOT NULL,
	"total_verifications" integer DEFAULT 0 NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "used_tokens" (
	"jti" text PRIMARY KEY NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"plan" text DEFAULT 'free' NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"dodo_customer_id" text,
	"dodo_subscription_id" text,
	"subscription_status" text DEFAULT 'none' NOT NULL,
	"subscription_ends_at" text,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"payment_method_last4" text,
	"payment_method_brand" text,
	"payment_method_expiry" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"session_id" text PRIMARY KEY NOT NULL,
	"sitekey" text NOT NULL,
	"score" integer,
	"verdict" text,
	"token" text,
	"used" boolean DEFAULT false NOT NULL,
	"timestamp" text NOT NULL,
	"domain" text
);
--> statement-breakpoint
ALTER TABLE "billing_history" ADD CONSTRAINT "billing_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_sitekey_sites_sitekey_fk" FOREIGN KEY ("sitekey") REFERENCES "public"."sites"("sitekey") ON DELETE no action ON UPDATE no action;