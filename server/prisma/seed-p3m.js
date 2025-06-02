const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Mulai seeding data...');

  // ==================== CREATE USERS ====================
  
  // 1. Admin
  const admin = await prisma.user.create({
    data: {
      nip: 'ADM001',
      nama: 'Admin Sistem P3M',
      email: 'admin@p3m.ac.id',
      password: 'admin123',
      role: 'ADMIN',
      no_telp: '081234567890',
      status: 'AKTIF',
    },
  });

  // 2. Dosen
  const dosen1 = await prisma.user.create({
    data: {
      nip: 'DSN001',
      nama: 'Dr. Andi Wijaya, M.Kom',
      email: 'andi@p3m.ac.id',
      password: 'dosen123',
      role: 'DOSEN',
      no_telp: '081234567891',
      bidang_keahlian: 'Artificial Intelligence, Machine Learning',
      status: 'AKTIF',
    },
  });

  const dosen2 = await prisma.user.create({
    data: {
      nip: 'DSN002',
      nama: 'Dr. Sari Melati, M.T',
      email: 'sari@p3m.ac.id',
      password: 'dosen123',
      role: 'DOSEN',
      no_telp: '081234567892',
      bidang_keahlian: 'Software Engineering, Database Systems',
      status: 'AKTIF',
    },
  });

  // 3. Mahasiswa
  const mahasiswa1 = await prisma.user.create({
    data: {
      nim: '2021001',
      nama: 'Budi Santoso',
      email: 'budi@student.ac.id',
      password: 'mhs123',
      role: 'MAHASISWA',
      no_telp: '081234567893',
      jurusan: 'Teknik Informatika',
      status: 'AKTIF',
    },
  });

  const mahasiswa2 = await prisma.user.create({
    data: {
      nim: '2021002',
      nama: 'Dewi Lestari',
      email: 'dewi@student.ac.id',
      password: 'mhs123',
      role: 'MAHASISWA',
      no_telp: '081234567894',
      jurusan: 'Sistem Informasi',
      status: 'AKTIF',
    },
  });

  // 4. Reviewer
  const reviewer1 = await prisma.user.create({
    data: {
      nip: 'REV001',
      nama: 'Prof. Dr. Ahmad Rahman, M.Sc',
      email: 'ahmad@reviewer.ac.id',
      password: 'reviewer123',
      role: 'REVIEWER',
      no_telp: '081234567895',
      bidang_keahlian: 'Computer Vision, Deep Learning',
      institusi: 'Universitas Indonesia',
      status: 'AKTIF',
    },
  });

  const reviewer2 = await prisma.user.create({
    data: {
      nip: 'REV002',
      nama: 'Dr. Rina Sari, M.Kom',
      email: 'rina@reviewer.ac.id',
      password: 'reviewer123',
      role: 'REVIEWER',
      no_telp: '081234567896',
      bidang_keahlian: 'Information Systems, Data Mining',
      institusi: 'Institut Teknologi Bandung',
      status: 'AKTIF',
    },
  });

  // ==================== CREATE SKEMA ====================
  
  const skemaPenelitian = await prisma.skema.create({
    data: {
      kode: 'PEN-2025-001',
      nama: 'Penelitian Dasar Mahasiswa',
      kategori: 'PENELITIAN',
      luaran_wajib: 'Artikel Jurnal Nasional/Internasional, Laporan Penelitian',
      dana_min: 2000000,
      dana_max: 10000000,
      batas_anggota: 3,
      tahun_aktif: '2025',
      tanggal_buka: new Date('2025-02-01'),
      tanggal_tutup: new Date('2025-03-31'),
      status: 'AKTIF',
    },
  });

  const skemaPengabdian = await prisma.skema.create({
    data: {
      kode: 'PKM-2025-001',
      nama: 'Pengabdian Kepada Masyarakat',
      kategori: 'PENGABDIAN',
      luaran_wajib: 'Laporan Kegiatan, Dokumentasi Video, Publikasi Media',
      dana_min: 3000000,
      dana_max: 15000000,
      batas_anggota: 5,
      tahun_aktif: '2025',
      tanggal_buka: new Date('2025-02-15'),
      tanggal_tutup: new Date('2025-04-15'),
      status: 'AKTIF',
    },
  });

  const skemaHibah = await prisma.skema.create({
    data: {
      kode: 'HIB-2025-001',
      nama: 'Hibah Penelitian Dosen Muda',
      kategori: 'HIBAH_INTERNAL',
      luaran_wajib: 'Artikel Jurnal Internasional, Produk/Prototype',
      dana_min: 5000000,
      dana_max: 25000000,
      batas_anggota: 4,
      tahun_aktif: '2025',
      tanggal_buka: new Date('2025-03-01'),
      tanggal_tutup: new Date('2025-05-01'),
      status: 'AKTIF',
    },
  });

  // ==================== CREATE PROPOSALS ====================
  
  // Proposal oleh Dosen
  const proposalDosen = await prisma.proposal.create({
    data: {
      judul: 'Implementasi Machine Learning untuk Deteksi Dini Penyakit Tanaman',
      abstrak: 'Penelitian ini bertujuan untuk mengembangkan sistem deteksi dini penyakit tanaman menggunakan teknik machine learning dan computer vision. Sistem akan dapat mengidentifikasi berbagai jenis penyakit tanaman berdasarkan citra daun yang diambil menggunakan smartphone.',
      kata_kunci: 'machine learning, computer vision, deteksi penyakit tanaman, deep learning',
      skemaId: skemaHibah.id,
      ketuaId: dosen1.id,
      tahun: 2025,
      dana_diusulkan: 20000000,
      status: 'SUBMITTED',
      tanggal_submit: new Date(),
      reviewerId: reviewer1.id,
    },
  });

  // Proposal oleh Mahasiswa
  const proposalMahasiswa = await prisma.proposal.create({
    data: {
      judul: 'Aplikasi Mobile untuk Monitoring Kesehatan Mental Mahasiswa',
      abstrak: 'Pengembangan aplikasi mobile berbasis Android untuk membantu mahasiswa dalam monitoring dan mengelola kesehatan mental mereka. Aplikasi akan dilengkapi dengan fitur mood tracking, konsultasi online, dan edukasi kesehatan mental.',
      kata_kunci: 'mobile application, kesehatan mental, android, mood tracking',
      skemaId: skemaPenelitian.id,
      ketuaId: mahasiswa1.id,
      tahun: 2025,
      dana_diusulkan: 7500000,
      status: 'REVIEW',
      tanggal_submit: new Date(),
      reviewerId: reviewer2.id,
    },
  });

  // Proposal Pengabdian
  const proposalPengabdian = await prisma.proposal.create({
    data: {
      judul: 'Pelatihan Digital Marketing untuk UMKM di Kota Manado',
      abstrak: 'Program pengabdian masyarakat berupa pelatihan digital marketing untuk meningkatkan kemampuan UMKM dalam memasarkan produk secara online. Kegiatan meliputi workshop, pendampingan, dan evaluasi implementasi.',
      kata_kunci: 'digital marketing, UMKM, pelatihan, e-commerce',
      skemaId: skemaPengabdian.id,
      ketuaId: dosen2.id,
      tahun: 2025,
      dana_diusulkan: 12000000,
      status: 'DRAFT',
    },
  });

  // ==================== CREATE PROPOSAL MEMBERS ====================
  
  // Anggota untuk proposal dosen
  await prisma.proposalMember.create({
    data: {
      proposalId: proposalDosen.id,
      userId: dosen2.id,
      peran: 'ANGGOTA',
    },
  });

  await prisma.proposalMember.create({
    data: {
      proposalId: proposalDosen.id,
      userId: mahasiswa1.id,
      peran: 'ANGGOTA',
    },
  });

  // Anggota untuk proposal mahasiswa
  await prisma.proposalMember.create({
    data: {
      proposalId: proposalMahasiswa.id,
      userId: mahasiswa2.id,
      peran: 'ANGGOTA',
    },
  });

  // ==================== CREATE REVIEWS ====================
  
  const review1 = await prisma.review.create({
    data: {
      proposalId: proposalDosen.id,
      reviewerId: reviewer1.id,
      skor_total: 85.5,
      catatan: 'Proposal sangat baik dengan metodologi yang jelas. Disarankan untuk menambahkan dataset yang lebih beragam untuk meningkatkan akurasi model.',
      rekomendasi: 'LAYAK',
      tanggal_review: new Date(),
    },
  });

  const review2 = await prisma.review.create({
    data: {
      proposalId: proposalMahasiswa.id,
      reviewerId: reviewer2.id,
      skor_total: 78.0,
      catatan: 'Proposal memiliki potensi yang baik. Perlu diperjelas mengenai target pengguna dan fitur keamanan data pengguna.',
      rekomendasi: 'REVISI',
      tanggal_review: new Date(),
    },
  });

  // ==================== CREATE PENGUMUMAN ====================
  
  await prisma.pengumuman.create({
    data: {
      judul: 'Pembukaan Pendaftaran Skema Penelitian 2025',
      konten: 'Pendaftaran skema penelitian dasar mahasiswa tahun 2025 telah dibuka. Batas waktu pendaftaran hingga 31 Maret 2025. Silakan lengkapi dokumen yang diperlukan dan submit proposal melalui sistem.',
      kategori: 'PENELITIAN',
      status: 'AKTIF',
    },
  });

  await prisma.pengumuman.create({
    data: {
      judul: 'Workshop Penulisan Proposal Penelitian',
      konten: 'Akan diadakan workshop penulisan proposal penelitian pada tanggal 15 Februari 2025. Workshop ditujukan untuk mahasiswa dan dosen yang akan mengajukan proposal penelitian.',
      kategori: 'PENGUMUMAN',
      status: 'AKTIF',
    },
  });

  console.log('✅ Seed data berhasil dimasukkan');
  console.log('📊 Data yang berhasil dibuat:');
  console.log(`   - ${await prisma.user.count()} Users`);
  console.log(`   - ${await prisma.skema.count()} Skema`);
  console.log(`   - ${await prisma.proposal.count()} Proposals`);
  console.log(`   - ${await prisma.proposalMember.count()} Proposal Members`);
  console.log(`   - ${await prisma.review.count()} Reviews`);
  console.log(`   - ${await prisma.pengumuman.count()} Pengumuman`);
}

main()
  .catch(e => {
    console.error('❌ Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
  });