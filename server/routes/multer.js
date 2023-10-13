'use strict';
const express = require('express');
const path = require('path');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, req.user.googleID +  Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 5 * 1000 * 1000 } });

router.post('/wallpaper', upload.single('wallpaper'), (req, res, next) => {
    console.log(req.file);
    console.log(req.body);
    res.json({ success: 'true', description: "Image uploaded" });
    next();
})

module.exports = router;