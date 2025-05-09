export const alumniFields = [
    { label: "NIM", placeholder: "Masukkan NIM", type: "text", fieldName: "nim" }, // Maps to nim in alumniProfiles
    { label: "No. HP", placeholder: "Masukkan nomor HP", type: "tel", fieldName: "phone" }, // Maps to phone in alumniProfiles
    { label: "Jurusan", placeholder: "Masukkan jurusan", type: "text", fieldName: "major" }, // Maps to major in alumniProfiles
    { label: "Tahun Lulus", placeholder: "Masukkan tahun lulus", type: "number", fieldName: "graduationYear" }, // Maps to graduationYear
    { label: "Alamat", placeholder: "Masukkan alamat lengkap", type: "text", fieldName: "address" }, // Maps to address in alumniProfiles
    {
      label: "Bekerja / Studi",
      placeholder: "Pilih Bekerja atau studi",
      type: "select",
      options: ["Bekerja", "Studi", "Belum Bekerja"],
      fieldName: "jobStatus", // Maps to jobStatus in alumniProfiles
    },
    {
      label: "Company",
      placeholder: "Masukkan nama perusahaan",
      type: "text",
      condition: "Bekerja",
      fieldName: "currentCompany", // Maps to currentCompany in alumniProfiles
    },
    {
      label: "Position",
      placeholder: "Masukkan jabatan",
      type: "text",
      condition: "Bekerja",
      fieldName: "jobPosition", // Maps to jobPosition in alumniProfiles
    },
    {
      label: "Berapa lama waktu tunggu anda dalam mendapatkan Pekerjaan pertama?",
      placeholder: "Pilih durasi waktu",
      type: "select",
      options: [
        "< 1 Bulan",
        "< 3 Bulan",
        "< 6 Bulan",
        "< 12 Bulan",
        "> 12 Bulan",
      ],
      condition: "Bekerja",
      fieldName: "jobWaitTime", // Maps to jobWaitTime in alumniProfiles
    },
    {
      label: "Berapakah gaji pertama anda?",
      placeholder: "Pilih kisaran gaji",
      type: "select",
      options: [
        "< 2.000.000",
        "2.000.000 - 5.000.000",
        "5.000.000 - 7.000.000",
        "> 7.000.000",
      ],
      condition: "Bekerja",
      fieldName: "firstSalary", // Maps to firstSalary in alumniProfiles
    },
    {
      label: "Kesesuaian pekerjaan dengan prodi",
      placeholder: "Pilih skala kesesuaian",
      type: "select",
      options: ["1", "2", "3", "4", "5"],
      condition: "Bekerja",
      fieldName: "jobMatchWithMajor", // Maps to jobMatchWithMajor in alumniProfiles
    },
    {
      label: "Saran terkait kurikulum dan sarana prasarana selama perkuliahan",
      placeholder: "Masukkan saran",
      type: "text",
      condition: "Bekerja",
      fieldName: "curriculumFeedback", // Maps to curriculumFeedback in alumniProfiles
    },
    {
      label: "Nama Universitas",
      placeholder: "Masukkan nama universitas",
      type: "text",
      condition: "Studi",
      fieldName: "universityName", // Maps to universityName in alumniProfiles
    },
    {
      label: "Nama Program Studi",
      placeholder: "Masukkan nama program studi",
      type: "text",
      condition: "Studi",
      fieldName: "studyProgram", // Maps to studyProgram in alumniProfiles
    },
    {
      label: "Pembiayaan (mandiri atau beasiswa)",
      placeholder: "Pilih pembiayaan",
      type: "select",
      options: ["Mandiri", "Beasiswa"],
      condition: "Studi",
      fieldName: "fundingSource", // Maps to fundingSource in alumniProfiles
    },
    {
      label: "Asal Beasiswa (jika Beasiswa)",
      placeholder: "Masukkan asal beasiswa",
      type: "text",
      condition: "Studi",
      dependentCondition: "Beasiswa", // Conditional rendering if Beasiswa is selected
      fieldName: "scholarshipSource", // Maps to scholarshipSource in alumniProfiles
    },
];

export const companyFields = [
    { label: "Nomor Telepon Perusahaan", placeholder: "Masukkan nomor telepon perusahaan", type: "tel", fieldName: "contact" }, // Maps to contact in companies
    { label: "Alamat Perusahaan", placeholder: "Masukkan alamat perusahaan lengkap", type: "text", fieldName: "address" }, // Maps to address in companies
    { label: "Industri", placeholder: "Masukkan industri perusahaan", type: "text", fieldName: "industry" }, // Maps to industry in companies
    { label:"Deskripsi Perusahaan", placeholder:"Masukkan deskripsi perusahaan", type:"text", fieldName: "companyDescription" }, // Maps to companyDescription in companies
    { label: "Kontak HRD", placeholder: "Masukkan nama dan email HRD perusahaan", type: "text", fieldName: "hrdContact" }, // Maps to hrdContact in companies
];
