const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const prodiController = require("../controllers/prodiController");

router.get("/", prodiController.getAllProdi);
router.get("/:id", prodiController.getProdiById);
router.post("/", upload.none(), prodiController.createProdi);
router.put("/:id", prodiController.updateProdi);
router.delete("/:id", prodiController.deleteProdi);

module.exports = router;
