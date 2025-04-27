import { pgTable, uuid, varchar, text, timestamp, pgEnum, integer, numeric } from "drizzle-orm/pg-core";

export const ROLE_ENUM = pgEnum("role", ["ADMIN", "ALUMNI", "COMPANY"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  fullName: varchar("full_name", { length: 255 }),
  email: text("email").notNull().unique(),
  pictureUrl: text("picture_url"),
  role: ROLE_ENUM("role").default("ALUMNI"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const companies = pgTable("companies", {
    id: uuid("id").primaryKey().defaultRandom().unique(),
    industry: text("industry").notNull(), // Menyesuaikan dengan "Industri"
    address: text("address").notNull(), // Menyesuaikan dengan "Alamat Perusahaan"
    contact: text("contact").notNull().unique(), // Menyesuaikan dengan "Kontak HRD"
    companyDescription: text("company_description"), // Menambahkan deskripsi perusahaan
    hrdContact: text("hrd_contact"), // Menambahkan kontak HRD (email/nama)
    userId: uuid("user_id").references(() => users.id).notNull(), // Menyimpan ID user (relasi ke tabel users)
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
  
export const alumniProfiles = pgTable("alumni_profiles", {
    id: uuid("id").primaryKey().defaultRandom().unique(),
    userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(), 
    nim: varchar("nim", { length: 20 }).notNull().unique(),
    graduationYear: integer("graduation_year").notNull(),
    faculty: varchar("faculty", { length: 255 }).notNull(),
    major: varchar("major", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 15 }).notNull(),
    address: text("address").notNull(),
    jobStatus: text("job_status").notNull(), 
    currentCompany: text("current_company"),
    jobPosition: text("job_position"), 
    jobWaitTime: varchar("job_wait_time", { length: 20 }), // Waktu tunggu pekerjaan pertama
    firstSalary: varchar("first_salary", { length: 20 }), // Gaji pertama
    jobMatchWithMajor: integer("job_match_with_major"), // Skala kesesuaian pekerjaan dengan prodi
    curriculumFeedback: text("curriculum_feedback"), // Saran terkait kurikulum dan sarana prasarana
    universityName: varchar("university_name", { length: 255 }), // Nama Universitas (untuk Studi)
    studyProgram: varchar("study_program", { length: 255 }), // Nama Program Studi (untuk Studi)
    fundingSource: text("funding_source"), // Pembiayaan (mandiri atau beasiswa)
    scholarshipSource: text("scholarship_source"), // Asal Beasiswa (jika Beasiswa)
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  });
  
export const reviews = pgTable("reviews", {
    id: uuid("id").primaryKey().defaultRandom().unique(),
    companyId: uuid("company_id").references(() => companies.id).notNull(),
    alumniId: uuid("alumni_id").references(() => alumniProfiles.id).notNull(),
    rating: numeric("rating", { precision: 4, scale: 2 }).notNull(),
    reviewText: text("review_text").notNull(),
    reviewDate: timestamp("review_date", { withTimezone: true }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const reviewDetails = pgTable("review_details", {
  id: uuid("id").primaryKey().defaultRandom().unique(),
  reviewId: uuid("review_id").references(() => reviews.id).notNull(), // Menghubungkan ke tabel reviews
  hardSkillsH1: integer("hard_skills_h1").notNull(), 
  hardSkillsH2: integer("hard_skills_h2").notNull(), 
  hardSkillsH3: integer("hard_skills_h3").notNull(), 
  softSkillsS1: integer("soft_skills_s1").notNull(), 
  softSkillsS2: integer("soft_skills_s2").notNull(), 
  softSkillsS3: integer("soft_skills_s3").notNull(), 
  softSkillsS4: integer("soft_skills_s4").notNull(), 
  softSkillsS5: integer("soft_skills_s5").notNull(), 
  productivityP1: integer("productivity_p1").notNull(), 
  productivityP2: integer("productivity_p2").notNull(), 
  productivityP3: integer("productivity_p3").notNull(), 
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

