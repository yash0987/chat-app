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
        cb(null, file.originalname);
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
    group.photoURL = `http://localhost:5000/group/photo/${req.file.filename}`;
    group.doj = Date.now();
    group.descrption = "";
    groupMembers.push({ id: req.user.googleID, name: req.user.firstName + req.user.familyName, photoURL: req.user.photoURL});
    console.log(groupMembers);

    async function main() {
        try {
            await client.connect();
            const cursor = await client.db('chat-app').collection('groupChats').findOne( { groupID: group.id } );
            if (!cursor) {
                await client.db('chat-app').collection('groupChats').insertOne( { groupID: group.id, chatMsg: [] } );
                await client.db('chat-app').collection('groupDetails').insertOne( { ...group, members: groupMembers } );
                for (let i = 0; i < groupMembers.length; i++) {
                    await client.db('chat-app').collection('userDetails').updateOne( { googleID: groupMembers[i].id }, { $addToSet: { groups: { id: group.id, name: group.name, photoURL: group.photoURL } } } );
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

router.get('/group/photo/:filename', (req, res) => {
    const filename = req.params.filename;
    res.sendFile(path.join(path.resolve('.'), `./uploads/${filename}`), (err) => {
        if (err) console.log(err);
    })
})

module.exports = router;
