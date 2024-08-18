'use strict';
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const router = express.Router();
const uri = 'mongodb://root:password@mongo:27017/';
const client = new MongoClient(uri);
const db = client.db('chat-app');
const userDetailsCollection = db.collection('userDetails');
const personalChatsCollection =  db.collection('personalChats');
const starredMessageCollection = db.collection('starredMessage');

(async () => await client.connect())();

router.get('/', (req, res) => {
    res.json( { connect: true, description: "server has been started" } );
})

router.get('/user', (req, res, next) => {
    if (req.user) {
        res.json(req.user);
    }
    next();
})

router.get('/search/user', (req, res) => {
    const searchUser = req.query.search;
    console.log(searchUser);
    async function main() {
        try {
            const cursor = await userDetailsCollection.find({}).toArray();
            let record = cursor.filter((element) => {
                const userFullName = element.name.toLowerCase();
                if (userFullName.includes(searchUser)) {
                    return element;
                }
            });

            record = record.map(({ friends, email, sendRequests, receiveRequests, groups, ...rest }) => rest);
            res.json({ success: true, record });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.put('/theme', (req, res) => {
    const theme = req.body.theme;
    async function main() {
        try {
            await userDetailsCollection.updateOne( { _id: new ObjectId(req.user._id) }, { $set: { theme } } );
            res.json({ success: true, description: 'theme has been changed' });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.post('/add/friend', (req, res, next) => {
    const personData = { ...req.body.person, personalId: new ObjectId(req.body.person.personalId) };
    const userData = {
        personalId: req.user._id,
        name: req.user.name,
        photoURL: req.user.photoURL
    };

    async function main() {
        try {
            await userDetailsCollection.updateOne( { _id: new ObjectId(userData.personalId) }, { $addToSet: { sendRequests: personData } } );
            await userDetailsCollection.updateOne( { _id: new ObjectId(personData.personalId) }, { $addToSet: { receiveRequests: userData } } );
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
    res.json( { success: `Friend request has send to ${personData.name}` } );
})

router.put('/cancelRequest', (req, res) => {
    const personData = { ...req.body.person, personalId: new ObjectId(req.body.person.personalId) };
    const userData = {
        personalId: req.user._id,
        name: req.user.name,
        photoURL: req.user.photoURL
    };

    console.log(personData, userData);

    async function main() {
        try {
            await userDetailsCollection.updateOne( { _id: new ObjectId(userData.personalId) }, { $pull: { sendRequests: { personalId: personData.personalId } } } );
            await userDetailsCollection.updateOne( { _id: new ObjectId(personData.personalId) }, { $pull: { receiveRequests: { personalId: userData.personalId } } } );
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
    res.json( { success: 'Friend request is cancel' } );
});

router.put('/acceptRequest', (req, res) => {
    const personData = { ...req.body.person, personalId: new ObjectId(req.body.person.personalId) };
    const userData = {
        personalId: req.user._id,
        name: req.user.name,
        photoURL: req.user.photoURL
    };

    async function main() {
        try {
            const { insertedId } = await personalChatsCollection.insertOne( { chatMsg: [] } );
            await userDetailsCollection.updateOne( { _id: new ObjectId(userData.personalId) }, { $addToSet: { friends: { _id: insertedId, ...personData } } } );
            await userDetailsCollection.updateOne( { _id: new ObjectId(userData.personalId) }, { $pull: { sendRequests: { personalId: personData.personalId } } } );
            await userDetailsCollection.updateOne( { _id: new ObjectId(userData.personalId) }, { $pull: { receiveRequests: { personalId: personData.personalId } } } );
            await userDetailsCollection.updateOne( { _id: new ObjectId(personData.personalId) }, { $addToSet: { friends: { _id: insertedId, ...userData } } } );
            await userDetailsCollection.updateOne( { _id: new ObjectId(personData.personalId) }, { $pull: { sendRequests: { personalId: userData.personalId } } } );
            await userDetailsCollection.updateOne( { _id: new ObjectId(personData.personalId) }, { $pull: { receiveRequests: { personalId: userData.personalId } } } );
            res.json( { _id: insertedId, success: 'Friend request is accepted' } );
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.put('/declineRequest', (req, res) => {
    const personData = { ...req.body.person, personalId: new ObjectId(req.body.person.personalId) };
    const userData = {
        personalId: req.user._id,
        name: req.user.name,
        photoURL: req.user.photoURL
    };

    console.log(personData, userData);

    async function main() {
        try {
            await userDetailsCollection.updateOne( { _id: new ObjectId(userData.personalId) }, { $pull: { receiveRequests: { personalId: personData.personalId } } } );
            await userDetailsCollection.updateOne( { _id: new ObjectId(personData.personalId) }, { $pull: { sendRequests: { personalId: userData.personalId } } } );
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
    res.json( { success: 'Friend request is cancel' } );
});

router.get('/aboutme/:_id', (req, res) => {
    const _id = req.params._id;
    async function main() {
        try {
            const cursor = await userDetailsCollection.findOne({ _id: new ObjectId(_id) });
            res.json({ _id: cursor._id, name: cursor.name, photoURL: cursor.photoURL, aboutMe: cursor.aboutMe, doj: cursor.doj });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.put('/unfriend', (req, res) => {
    console.log("unfriend")
    async function main() {
        try {
            await userDetailsCollection.updateOne( { googleID: req.user.googleID }, { $pull: { friends: { googleID: req.body.id } } } );
            await userDetailsCollection.updateOne( { googleID: req.body.id }, { $pull: { friends: { googleID: req.user.googleID } } } );
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
    res.json( { success: "Unfriend has been done" } );
})

router.get('/common/groups/:_id', (req, res) => {
    async function main() {
        try {
            const user = await userDetailsCollection.findOne( { _id: new ObjectId(req.user._id) } );
            const friend = await userDetailsCollection.findOne( { _id: new ObjectId(req.params._id) } );
            const userGroups = user.groups, friendGroups = friend.groups;
            const commonGroups = userGroups.filter((group1) => friendGroups.some((group2) => group1._id.toString() === group2._id.toString()));
            res.json(commonGroups);
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.get('/starred/messages/:_id', (req, res) => {
    async function main() {
        try {
            const starredMessage = await starredMessageCollection.aggregate([
                { $match: { _id: req.params._id } },
                { $project: { starredMessage: {  } } }
            ]);
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.get('/chat/data/:room', (req, res, next) => {
    const range = parseInt(req.query.range);
    const collectionName = req.query.chatType === 'group' ? 'groupChats' : 'personalChats';
    console.log(range * -1);

    async function main() {
        try {
            const countChatMessages = await db.collection(collectionName).aggregate([
                { $match: { _id: new ObjectId(req.params.room) } },
                { $project: { chatMsg: { $filter: { input: "$chatMsg", as: "chat", cond: { $not: { $in: [ req.user._id.toString(), "$$chat.deleteMsg" ] } } } } } },
                { $project: { chatMsg: { $size: "$chatMsg" } } }
            ]).toArray();

            const countToRetrieveMessages = range <= countChatMessages[0].chatMsg ? 40 : 40 - (range - countChatMessages[0].chatMsg);
            console.log(countChatMessages[0].chatMsg, countToRetrieveMessages);
            
            if (range - countChatMessages[0].chatMsg >= 40) {
                res.json([]);
                return ;
            }

            const cursor = await db.collection(collectionName).aggregate([
                { $match: { _id: new ObjectId(req.params.room) } },
                { $project: { chatMsg: { $filter: { input: "$chatMsg", as: "chat", cond: { $not: { $in: [ req.user._id.toString(), "$$chat.deleteMsg" ] } } } } } },
                { $project: { chatMsg: { $slice: [ "$chatMsg", range * -1, countToRetrieveMessages ] } } }
            ]).toArray();
            
            const chatMsg = cursor[0].chatMsg.map((element) => {
                const star = element.star.indexOf(req.user._id.toString()) !== -1;
                return {
                    messageID: element.messageID,
                    collectedText: element.collectedText,
                    editedStatus: element.editedStatus,
                    name: element.name,
                    lastModified: element.lastModified,
                    size: element.size,
                    currentMsgTime: element.currentMsgTime,
                    senderID: element.senderID,
                    senderName: element.senderName,
                    senderPhotoURL: element.senderPhotoURL,
                    replyToMessage: element.replyToMessage,
                    type: element.type,
                    star
                };
            })
            res.json(chatMsg);
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.delete('/delete/messages', (req, res) => {
    const selectedMessages = req.body.selectedMessages;
    const collectionName = req.query.chatType === 'group' ? 'groupChats' : 'personalChats';
    console.log(req.body);
    async function main() {
        try {
            const cursor = await db.collection(collectionName).findOne( { _id: new ObjectId(req.body.room) } );

            let updatedMessagesArray = cursor.chatMsg;
            selectedMessages.forEach((elementToRemove) => {
                updatedMessagesArray = updatedMessagesArray.map((element) => {
                    if (element.messageID === elementToRemove) element.deleteMsg.push(req.user._id.toString());
                    return element;
                })
            });

            await db.collection(collectionName).updateOne( { _id: new ObjectId(req.body.room) }, { $set: { chatMsg: updatedMessagesArray } } );
            res.json({ success: 'messages has been deleted' });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.put('/starAndUnstar/messages', (req, res) => {
    const selectedMessages = req.body.selectedMessages;
    const selectedMessagesIDs = selectedMessages.map(message => { return message.messageID; });
    const collectionName = req.query.chatType === 'group' ? 'groupChats' : 'personalChats';
    console.log(req.body)
    async function main() {
        try {
            const cursor = await db.collection(collectionName).findOne( { _id: new ObjectId(req.body.room) } );

            let updatedMessagesArray = cursor.chatMsg;
            selectedMessagesIDs.forEach((elementToUpdate) => {
                updatedMessagesArray = updatedMessagesArray.map((element) => {
                    if (element.messageID === elementToUpdate && req.body.starStatus === 1) {
                        if (element.star.indexOf(req.user._id.toString()) === -1) element.star.push(req.user._id.toString());
                    }
                    else if (element.messageID === elementToUpdate && req.body.starStatus !== 1) {
                        element.star  = element.star.filter((ID) => ID !== req.user._id.toString());
                    }
                    return element;
                })
            })
            
            await db.collection(collectionName).updateOne( { _id: new ObjectId(req.body.room) }, { $set: { chatMsg: updatedMessagesArray } } );
            res.json({ success: 'messages has been starred' });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

// not in use now
// router.get('/starred/messages/:id', (req, res) => {
//     async function main() {
//         try {
//             const cursor = await personalChatsCollection.findOne( { _id: req.params.id } );
//             let chatMsg = cursor.chatMsg;
//             const starMessagesArray = chatMsg.filter((element) =>
//                 element.deleteMsg.indexOf(req.user._id.toString()) === -1 && element.star.indexOf(req.user._id.toString()) !== -1
//             );
//             console.log(starMessagesArray);
//             res.json(starMessagesArray);
//         } catch (e) {
//             console.error(e);
//         }
//     }

//     main().catch(console.error);
// })

router.get('/groupinfo/:_id', (req, res) => {
    async function main() {
        try {
            const cursor = await db.collection('groupDetails').findOne( { _id: new ObjectId(req.params._id) } );
            res.json({ _id: cursor._id, name: cursor.name, profileFileName: cursor.profileFileName, photoURL: cursor.photoURL, description: cursor.description, doj: cursor.doj });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.get('/group/members/:_id', (req, res) => {
    async function main() {
        try {
            const cursor = await client.db('chat-app').collection('groupDetails').findOne( { _id: new ObjectId(req.params._id) } );
            res.json(cursor.members);
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.get('/groups/list', (req, res) => {
    async function main() {
        try {
            const cursor = await userDetailsCollection.findOne( { _id: req.user._id } );
            res.json(cursor.groups);
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

module.exports = router;