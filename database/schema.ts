import { pgTable, uuid, varchar, text, timestamp, pgEnum, integer } from "drizzle-orm/pg-core";

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
    userId: uuid("user_id").references(() => users.id).notNull().unique(),
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
    rating: integer("rating").notNull(),
    reviewText: text("review_text").notNull(),
    reviewDate: timestamp("review_date", { withTimezone: true }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

