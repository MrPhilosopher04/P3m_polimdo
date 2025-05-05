const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET semua jurusan
exports.getAllJurusan = async (req, res) => {
  try {
    const jurusan = await prisma.jurusan.findMany();
    res.json(jurusan);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data jurusan" });
  }
};

// GET jurusan by ID
exports.getJurusanById = async (req, res) => {
  try {
    const jurusan = await prisma.jurusan.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    res.json(jurusan);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data jurusan" });
  }
};

// POST jurusan
exports.createJurusan = async (req, res) => {
  try {
    const { nama } = req.body;
    const newJurusan = await prisma.jurusan.create({
      data: { nama },
    });
    res.status(201).json(newJurusan);
  } catch (error) {
    res.status(500).json({ error: "Gagal membuat jurusan" });
  }
};

// PUT jurusan
exports.updateJurusan = async (req, res) => {
  try {
    const { nama } = req.body;
    const updated = await prisma.jurusan.update({
      where: { id: parseInt(req.params.id) },
      data: { nama },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Gagal memperbarui jurusan" });
  }
};

// DELETE jurusan
exports.deleteJurusan = async (req, res) => {
  try {
    await prisma.jurusan.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Jurusan dihapus" });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus jurusan" });
  }
};
