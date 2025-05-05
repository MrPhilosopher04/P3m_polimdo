const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET semua prodi
exports.getAllProdi = async (req, res) => {
  try {
    const prodi = await prisma.prodi.findMany({ include: { jurusan: true } });
    res.json(prodi);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data prodi" });
  }
};

// GET prodi by ID
exports.getProdiById = async (req, res) => {
  try {
    const prodi = await prisma.prodi.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    res.json(prodi);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data prodi" });
  }
};

// POST prodi
exports.createProdi = async (req, res) => {
  try {
    const { nama, jurusanId } = req.body;
    const newProdi = await prisma.prodi.create({
      data: {
        nama,
        jurusanId: parseInt(jurusanId),
      },
    });
    res.status(201).json(newProdi);
  } catch (error) {
    res.status(500).json({ error: "Gagal membuat prodi" });
  }
};

// PUT prodi
exports.updateProdi = async (req, res) => {
  try {
    const { nama, jurusanId } = req.body;
    const updated = await prisma.prodi.update({
      where: { id: parseInt(req.params.id) },
      data: {
        nama,
        jurusanId: parseInt(jurusanId),
      },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Gagal memperbarui prodi" });
  }
};

// DELETE prodi
exports.deleteProdi = async (req, res) => {
  try {
    await prisma.prodi.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Prodi dihapus" });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus prodi" });
  }
};
