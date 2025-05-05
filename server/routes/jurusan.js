const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const jurusanController = require("../controllers/jurusanController");

router.get("/", jurusanController.getAllJurusan);
router.get("/:id", jurusanController.getJurusanById);
router.post("/", upload.none(), jurusanController.createJurusan);
router.put("/:id", jurusanController.updateJurusan);
router.delete("/:id", jurusanController.deleteJurusan);

module.exports = router;
