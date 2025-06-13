# Dokumentasi Perubahan Fitur "Ajukan Proposal"

Dokumentasi ini menjelaskan struktur proyek dan file-file yang telah disesuaikan agar fitur **Ajukan Proposal** dapat dijalankan oleh:

* **Mahasiswa** (ketua proposal)
* **Dosen** (ketua atau anggota proposal)
* **Admin** (tanpa syarat kepemilikan)

## 📁 Struktur Proyek (Ringkas)

```
proposal-management/
├── client/
│   └── src/
│       ├── components/
│       │   └── Proposals/
│       │       ├── ProposalCard.js       ← UI tombol Ajukan & loading state
│       │       └── ProposalList.js       ← logika canEdit, onStatusChange
│       └── services/
│           └── proposalService.js        ← API call POST /:id/submit
├── server/
│   ├── controllers/
│   │   └── proposal.controller.js       ← method submit dengan check role & ownership
│   ├── middlewares/
│   │   └── auth.js                      ← checkRole menerima DOSEN & ADMIN
│   └── routes/
│       └── proposals.js                 ← route POST /:id/submit diperluas peran
└── prisma/
    └── schema.prisma                    ← enum ProposalStatus mencakup SUBMITTED
```

## 📄 Penjelasan File-File Utama

### 1. `client/src/services/proposalService.js`

* Fungsi baru `submitProposal(id)` memanggil API:

  ```js
  submitProposal: async (id) => {
    return api.post(`/proposals/${id}/submit`);
  }
  ```
* Mengembalikan `{ success, data }` atau `{ success, error }`.

### 2. `client/src/components/Proposals/ProposalCard.js`

* Import `proposalService` dan gunakan `handleSubmit` untuk:

  1. Konfirmasi via `window.confirm`
  2. Panggil `submitProposal(id)`
  3. `onStatusChange(proposal.id, 'SUBMITTED')` saat berhasil
* `loadingSubmit` state untuk men-disable tombol dan ubah label menjadi "Mengajukan...".

### 3. `client/src/components/Proposals/ProposalList.js`

* Tambah fungsi `handleStatusChange` untuk update state list:

  ```js
  const handleStatusChange = (id, newStatus) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };
  ```
* `canEdit(proposal)` sekarang mencakup:

  * `user.role === 'ADMIN'`
  * `user.role === 'MAHASISWA' && proposal.ketuaId === user.id`
  * `user.role === 'DOSEN' && (proposal.ketuaId === user.id || proposal.members.some(...))`
* Prop `onStatusChange` diteruskan ke `<ProposalCard />`.

### 4. `server/routes/proposals.js`

* Route submit diperbarui:

  ```js
  router.post(
    '/:id/submit',
    checkRole('MAHASISWA','DOSEN','ADMIN'),
    proposalController.submit
  );
  ```
* Pastikan urutan: `router.post('/:id/submit'...)` sebelum `router.post('/', ...)`.

### 5. `server/controllers/proposal.controller.js`

* Method `submit`:

  1. Cari proposal (include `members`).
  2. Validasi `isKetuaMahasiswa`, `isDosenMember`, `isAdmin`:

     ```js
     const isKetuaMahasiswa = req.user.role === 'MAHASISWA' && proposal.ketuaId === req.user.id;
     const isDosen = req.user.role === 'DOSEN' && (
       proposal.ketuaId === req.user.id ||
       proposal.members.some(m => m.userId === req.user.id)
     );
     const isAdmin = req.user.role === 'ADMIN';
     ```
  3. Cek `proposal.status === 'DRAFT'`.
  4. Update `status: 'SUBMITTED'` & `tanggal_submit: new Date()`.

### 6. `server/middlewares/auth.js`

* Fungsi `checkRole` mendukung variadic roles:

  ```js
  const checkRole = (...allowedRoles) => (req, res, next) => {
    const roles = allowedRoles.flat();
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, `Role ${req.user.role} tidak diizinkan`, 403);
    }
    next();
  };
  ```

## ✅ Rekomendasi & Verifikasi

1. **Restart server** setelah perubahan route/middleware.
2. **Clear cache browser** atau hard‑reload jika perlu.
3. **Cek Network tab** di DevTools:

   * URL: `/proposals/:id/submit`
   * Method: `POST`
4. **Perhatikan console log** dari middleware `checkRole` dan controller `submit`:

   * `Role check passed`
   * `ENTER submit controller <id> <role>`
5. **Uji manual** via cURL/Postman:

   ```bash
   curl -X POST http://localhost:4000/api/proposals/123/submit \
     -H "Authorization: Bearer <token>"
   ```

Dengan dokumentasi ini, Anda dapat melacak dan memahami setiap bagian yang disesuaikan untuk mendukung fitur **Ajukan Proposal** bagi Mahasiswa, Dosen, dan Admin.

## 🛠️ Program Penyesuaian dan Cara Implementasi

Di bawah ini adalah contoh potongan kode (snippet) untuk masing‑masing file yang telah diubah, beserta langkah implementasinya:

---

### 1. `server/routes/proposals.js`

**Penyesuaian**:

```diff
- router.post(
-   '/:id/submit',
-   checkRole('MAHASISWA'),
-   proposalController.submit
- );
+ router.post(
+   '/:id/submit',
+   checkRole('MAHASISWA', 'DOSEN', 'ADMIN'),
+   proposalController.submit
+ );
```

**Cara implementasi**:

1. Buka file `server/routes/proposals.js`.
2. Ganti argumen `checkRole` pada route `POST '/:id/submit'` sesuai snippet.
3. Simpan dan **restart** server.

---

### 2. `server/middlewares/auth.js`

**Penyesuaian**:

```js
const checkRole = (...allowedRoles) => (req, res, next) => {
  // flatten dan validasi role
  const roles = allowedRoles.flat();
  if (!roles.includes(req.user.role)) {
    return errorResponse(res, `Akses ditolak. Role ${req.user.role} tidak diizinkan`, 403);
  }
  next();
};
```

**Cara implementasi**:

1. Pastikan file `auth.js` di folder `server/middlewares` berisi variadic `...allowedRoles`.
2. Jika ada perubahan, simpan dan restart server.

---

### 3. `server/controllers/proposal.controller.js`

**Penyesuaian pada method `submit`**:

```diff
- const isDosen = req.user.role === 'DOSEN';
+ const isDosen =
+   req.user.role === 'DOSEN' &&
+   (
+     proposal.ketuaId === req.user.id ||
+     proposal.members.some(m => m.userId === req.user.id)
+   );
```

**Cara implementasi**:

1. Buka `proposal.controller.js`.
2. Temukan blok logika `isDosen` dalam method `submit`.
3. Ganti sesuai snippet, lalu simpan.
4. Restart server.

---

### 4. `client/src/services/proposalService.js`

**Penyesuaian**:

```js
// Tambahkan di dalam objec proposalService
submitProposal: async (id) => {
  return api.post(`/proposals/${id}/submit`);
},
```

**Cara implementasi**:

1. Buka file `proposalService.js`.
2. Tambahkan atau perbaiki fungsi `submitProposal` seperti di atas.
3. Simpan dan jalankan ulang aplikasi client (misal `npm start`).

---

### 5. `client/src/components/Proposals/ProposalList.js`

**Penyesuaian pada `canEdit` dan `onStatusChange`**:

```js
const canEdit = proposal => (
  user.role === 'ADMIN' ||
  (user.role === 'MAHASISWA' && proposal.ketuaId === user.id) ||
  (user.role === 'DOSEN' && (
    proposal.ketuaId === user.id ||
    proposal.members?.some(m => m.userId === user.id)
  ))
);

const handleStatusChange = (id, newStatus) => {
  setProposals(prev =>
    prev.map(p => p.id === id ? { ...p, status: newStatus } : p)
  );
};
```

**Cara implementasi**:

1. Buka `ProposalList.js`.
2. Perbarui fungsi `canEdit` dan tambahkan `handleStatusChange` jika belum ada.
3. Pastikan `onStatusChange={handleStatusChange}` diteruskan ke `ProposalCard`.
4. Simpan dan refresh aplikasi.

---

### 6. `client/src/components/Proposals/ProposalCard.js`

**Penyesuaian**:

```js
// Di dalam component ProposalCard
const handleSubmit = async () => {
  if (proposal.status !== 'DRAFT') return;
  setLoadingSubmit(true);
  const result = await proposalService.submitProposal(proposal.id);
  if (result.success) onStatusChange(proposal.id, 'SUBMITTED');
  setLoadingSubmit(false);
};
```

**Cara implementasi**:

1. Buka `ProposalCard.js`.
2. Ganti aksi tombol Ajukan untuk memanggil `handleSubmit`.
3. Pastikan `disabled={loadingSubmit}` dan teks tombol menyesuaikan.
4. Simpan & refresh client.

---

Setelah semua penyesuaian di atas, **restart** server dan client, kemudian uji coba kembali:

* Login sebagai Mahasiswa (ketua), Dosen (ketua/anggota), dan Admin.
* Pastikan tombol “Ajukan” muncul dan saat diklik akan berhasil mengubah status menjadi **SUBMITTED**.

Dokumentasi ini mempermudah tracking perubahan kode dan langkah-langkah implementasinya. 🚀
