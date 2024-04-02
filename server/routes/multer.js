'use strict';
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { MongoClient, ObjectId } = require('mongodb');

const router = express.Router();
const uri = 'mongodb://root:password@mongo:27017/';
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
            const filename = `${req.query.id}${filetype}`;
            res.download(`./uploads/${filename}`, fileOriginalName);
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.post('/group', upload.single('groupPhoto'), (req, res, next) => {
    const group = JSON.parse(req.body.group);
    let groupMembers = JSON.parse(req.body.friends);
    console.log(groupMembers);

    async function main() {
        try {
            await client.connect();
            const { insertedId:_id } = await client.db('chat-app').collection('groupChats').insertOne( { chatMsg: [] } );
            const fileNewName = `P-${_id}.${req.file.filename.split('.').pop()}`;
            group._id = _id;
            group.photoURL = `http://localhost:5000/group/photo/P-${_id}.${req.file.filename.split('.').pop()}`;
            group.doj = Date.now();
            group.description = "";
            fs.rename(req.file.filename, fileNewName, (err) => {
                if (err) console.error(err);
            })
            groupMembers = groupMembers.map((member) => {
                return { ...member, _id: new ObjectId(member._id) };
            });
            groupMembers.push({ _id: req.user._id, name: req.user.name, photoURL: req.user.photoURL});
            await client.db('chat-app').collection('groupDetails').insertOne( { ...group, members: groupMembers } );
            for (let i = 0; i < groupMembers.length; i++) {
                await client.db('chat-app').collection('userDetails').updateOne( { _id: groupMembers[i]._id }, { $addToSet: { groups: { _id: group._id, name: group.name, photoURL: group.photoURL } } } );
            }

            res.json( { _id, success: "Group has been created" } );
        } catch (e) {
            console.error(e);
        }
    }
    
    main().catch(console.error);
});

router.put('/update/profile', upload.single('profilePhoto'), (req, res) => {
    const changeDetails = {
        name: req.body.name,
        aboutMe: req.body.aboutMe,
        photoURL: req.body.photoURL
    };
    console.log(req.file)

    if (req.file) changeDetails.photoURL = `http://localhost:5000/group/photo/${req.file.filename}`;

    async function main() {
        try {
            await client.db('chat-app').collection('userDetails').updateOne( { googleID: req.user.googleID }, { $set: changeDetails } );
            const userToUpdate = await client.db('chat-app').collection('userDetails').findOne( { googleID: req.user.googleID } );
            delete changeDetails.aboutMe;
            userToUpdate.groups.forEach(async (group) => {
                await client.db('chat-app').collection('groupDetails').updateOne( { id: group.id, "members.id": req.user.googleID }, { $set: { "members.$": { ...changeDetails, id: req.body.id } } } );
            })
            
            userToUpdate.friends.forEach(async (friend) => {
                await client.db('chat-app').collection('userDetails').updateOne( { googleID: friend.id, "friends.id": req.user.googleID }, { $set: { "friends.$": { ...changeDetails, id: req.body.id } } } );
            })

            res.json({ success: true, description: 'Profile has been updated' });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.put('/group/update/profile', upload.single('profilePhoto'), (req, res) => {
    const changeDetails = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        photoURL: req.body.photoURL
    };
    console.log(req.file)

    if (req.file) changeDetails.photoURL = `http://localhost:5000/group/photo/${req.file.filename}`;

    async function main() {
        try {
            await client.db('chat-app').collection('groupDetails').updateOne( { id: req.body.id }, { $set: changeDetails } );
            const groupToUpdate = await client.db('chat-app').collection('groupDetails').findOne( { id: req.body.id } );
            if (groupToUpdate.id === changeDetails.id || groupToUpdate.name === changeDetails.name || groupToUpdate.photoURL === changeDetails.photoURL) {
                groupToUpdate.members.forEach(async (member) => {
                    delete changeDetails.description;
                    await client.db('chat-app').collection('userDetails').updateOne( { googleID: member.id, "groups.id": req.body.id }, { $set: { "groups.$": changeDetails } } );
                });
            }
            
            res.json({ success: true, description: 'Group profile has been updated' });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.get('/group/photo/:filename', (req, res) => {
    const filename = req.params.filename;
    res.sendFile(path.join(path.resolve('.'), `./uploads/${filename}`), (err) => {
        if (err) console.log(err);
    })
})

router.get('/wallpaper/:filename', (req, res) => {
    console.log(req.params.filename);
    const filename = req.params.filename;
    res.sendFile(path.join(path.resolve('.'), `./uploads/${filename}`, (err) => {
        if (err) console.log(err);
    }))
})

module.exports = router;
