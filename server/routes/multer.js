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
            group._id = _id;
            group.photoURL = `http://localhost:5000/group/photo/${req.file.filename}`;
            group.profileFileName = req.file.filename;
            group.doj = Date.now();
            group.description = "";
            groupMembers = groupMembers.map((member) => {
                return { ...member, _id: new ObjectId(member.personalId) };
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
        photoURL: `http://localhost:5000/group/photo/${req.body.profileFileName}`
    };
    console.log(req.file)

    async function main() {
        try {
            await client.db('chat-app').collection('userDetails').updateOne( { _id: req.user._id }, { $set: changeDetails } );
            const userToUpdate = await client.db('chat-app').collection('userDetails').findOne( { _id: req.user._id } ); 
            delete changeDetails.aboutMe;
            userToUpdate.groups.forEach(async (group) => {
                await client.db('chat-app').collection('groupDetails').updateOne( { _id: group._id, "members._id": req.user._id }, { $set: { "members.$.name": changeDetails.name, "members.$.photoURL": changeDetails.photoURL } } );
            })
            userToUpdate.friends.forEach(async (friend) => {
                await client.db('chat-app').collection('userDetails').updateOne( { _id: friend.personalId, "friends.personalId": req.user._id }, { $set: { "friends.$.name": changeDetails.name, "friends.$.photoURL": changeDetails.photoURL } } );
            })
            userToUpdate.sendRequests.forEach(async (requestPerson) => {
                await client.db('chat-app').collection('userDetails').updateOne( { _id: requestPerson.personalId, "sendRequests.personalId": req.user._id }, { $set: { "sendRequests.$.name": changeDetails.name, "sendRequests.$.photoURL": changeDetails.photoURL } } );
            })
            userToUpdate.receiveRequests.forEach(async (requestPerson) => {
                await client.db('chat-app').collection('userDetails').updateOne( { _id: requestPerson.personalId, "receiveRequests.personalId": req.user._id }, { $set: { "receiveRequests.$.name": changeDetails.name, "receiveRequests.$.photoURL": changeDetails.photoURL } } );
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
        _id: new ObjectId(req.body._id),
        name: req.body.name,
        description: req.body.description,
        photoURL: `http://localhost:5000/group/photo/${req.body.profileFileName}`
    };
    console.log(req.file)

    async function main() {
        try {
            await client.db('chat-app').collection('groupDetails').updateOne( { _id: new ObjectId(req.body._id) }, { $set: changeDetails } );
            const groupToUpdate = await client.db('chat-app').collection('groupDetails').findOne( { _id: new ObjectId(req.body._id) } );
            if (groupToUpdate._id === changeDetails._id || groupToUpdate.name === changeDetails.name || groupToUpdate.photoURL === changeDetails.photoURL) {
                groupToUpdate.members.forEach(async (member) => {
                    delete changeDetails.description;
                    await client.db('chat-app').collection('userDetails').updateOne( { _id: member._id, "groups._id": new ObjectId(req.body._id) }, { $set: { "groups.$": changeDetails } } );
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
