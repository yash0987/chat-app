'use strict';
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { MongoClient } = require('mongodb');

const router = express.Router();
const uri = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(uri);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // cb(null, file.originalname);
        cb(null, req.user.googleID +  Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 5 * 1000 * 1000 } });
const fileFields = [ { name: 'document', maxCount: 5 }, { name: 'gallery', maxCount: 5 }, { name: 'audio', maxCount: 5 } ];

router.post('/wallpaper', upload.single('wallpaper'), (req, res, next) => {
    console.log(req.file);
    res.json({ success: true, description: "Image uploaded" });
    next();
})

router.post('/upload/files', upload.fields(fileFields), (req, res, next) => {
    console.log(req.files);
    const files = Object.values(req.files)[0];
    let epoch = parseInt(req.query.epoch);
    files.forEach((file) => {
        const fileNewName = req.user.googleID + epoch;
        fs.rename(`./uploads/${file.filename}`, `./uploads/${fileNewName}${path.extname(file.originalname)}`, (err) => {
        // fs.rename(`./uploads/${file.originalname}`, `./uploads/${fileNewName}.${path.extname(file.originalname)}`, (err) => {
            if (err) console.error(err);
        })
        epoch++;
    })
    res.json({ success: true, description: "File uploaded" });
    next();
})

router.get('/download/file', (req, res) => {
    async function main() {
        try {
            const fileOriginalName = req.query.filename;
            const filetype = path.extname(fileOriginalName);
            const filename = `${req.query.ID}${filetype}`;
            res.download(`./uploads/${filename}`, fileOriginalName);
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.post('/group', upload.single('groupPhoto'), (req, res, next) => {
    const group = JSON.parse(req.body.group);
    const groupMembers = JSON.parse(req.body.friends);
    group.groupPhotoURL = `http://localhost:5000/group/photo/${req.file.filename}`;
    groupMembers.push(req.user.googleID);
    console.log(groupMembers);

    async function main() {
        try {
            await client.connect();
            const cursor = await client.db('chat-app').collection('groupChats').findOne( { groupID: group.groupID } );
            if (!cursor) {
                await client.db('chat-app').collection('groupChats').insertOne( { groupID: group.groupID, chatMsg: [] } );
                for (let i = 0; i < groupMembers.length; i++) {
                    await client.db('chat-app').collection('userDetails').updateOne( { googleID: groupMembers[i] }, { $addToSet: { groups: group } } );
                }

                res.json( { success: "Group has been created" } );
                next();
                return ;
            }

            res.json( { success: "Choose another ID" } );
            next();
        } catch (e) {
            console.error(e);
        }
    }
    
    main().catch(console.error);
});

module.exports = router;
