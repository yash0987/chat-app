'use strict';
const express = require('express');
const { MongoClient } = require('mongodb');

const router = express.Router();
const uri = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(uri);
const userDetailsCollection = client.db('chat-app').collection('userDetails');
const personalChatsCollection =  client.db('chat-app').collection('personalChats');
const groupChatsCollection =  client.db('chat-app').collection('groupChats');

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
                const userFullName = (element.firstName + " " + element.familyName).toLowerCase();
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
    const color = parseInt(req.query.theme);
    async function main() {
        try {
            await userDetailsCollection.updateOne( { googleID: req.user.googleID }, { $set: { theme: color } } );
            res.json({ success: true, description: 'theme has been changed' });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.post('/add/friend', (req, res, next) => {
    const personData = JSON.parse(req.query.person);
    const userData = {
        id: req.user.googleID,
        name: `${req.user.firstName} ${req.user.familyName}`,
        photoURL: req.user.photoURL
    };

    async function main() {
        try {
            await userDetailsCollection.updateOne( { googleID: userData.id }, { $addToSet: { sendRequests: personData } } );
            await userDetailsCollection.updateOne( { googleID: personData.id }, { $addToSet: { receiveRequests: userData } } );
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
    res.json( { success: `Friend request has send to ${personData.name}` } );
})

router.put('/cancelRequest', (req, res) => {
    const personData = JSON.parse(req.query.person);
    const userData = {
        id: req.user.googleID,
        name: `${req.user.firstName} ${req.user.familyName}`,
        photoURL: req.user.photoURL
    };

    async function main() {
        try {
            await userDetailsCollection.updateOne( { googleID: userData.id }, { $pull: { sendRequests: personData } } );
            await userDetailsCollection.updateOne( { googleID: personData.id }, { $pull: { receiveRequests: userData } } );
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
    res.json( { success: 'Friend request is cancel' } );
});

router.put('/acceptRequest', (req, res) => {
    const personData = JSON.parse(req.query.person);
    const userData = {
        id: req.user.googleID,
        name: `${req.user.firstName} ${req.user.familyName}`,
        photoURL: req.user.photoURL
    };

    const IDarray = [userData.id, personData.id].sort();
    const room = IDarray[0] + IDarray[1];

    async function main() {
        try {
            await userDetailsCollection.updateOne( { googleID: userData.id }, { $addToSet: { friends: personData } } );
            await userDetailsCollection.updateOne( { googleID: userData.id }, { $pull: { receiveRequests: personData } } );
            await userDetailsCollection.updateOne( { googleID: personData.id }, { $addToSet: { friends: userData } } );
            await userDetailsCollection.updateOne( { googleID: personData.id }, { $pull: { sendRequests: userData } } );
            await personalChatsCollection.insertOne( { chatID: room, chatMsg: [] } );
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
    res.json( { success: 'Friend request is accepted' } );
})

router.put('/declineRequest', (req, res) => {
    const personData = JSON.parse(req.query.person);
    const userData = {
        id: req.user.googleID,
        name: `${req.user.firstName} ${req.user.familyName}`,
        photoURL: req.user.photoURL
    };

    async function main() {
        try {
            await userDetailsCollection.updateOne( { googleID: userData.id }, { $pull: { receiveRequests: personData } } );
            await userDetailsCollection.updateOne( { googleID: personData.id }, { $pull: { sendRequests: userData } } );
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
    res.json( { success: 'Friend request is cancel' } );
});

router.get('/friend/:ID', (req, res) => {
    const ID = req.params.ID;

    async function main() {
        try {
            const cursor = await userDetailsCollection.findOne( { googleID: ID } );
            res.json(cursor);
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
});

router.get('/friends/list', (req, res) => {
    async function main() {
        try {
            const cursor = await userDetailsCollection.findOne( { googleID: req.user.googleID } );
            res.json(cursor.friends);
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.get('/friends/request/send', (req, res) => {
    async function main() {
        try {
            const cursor = await userDetailsCollection.findOne( { googleID: req.user.googleID } );
            res.json(cursor.sendRequests);
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.get('/friends/request/receive', (req, res) => {
    async function main() {
        try {
            const cursor = await userDetailsCollection.findOne( { googleID: req.user.googleID } );
            res.json(cursor.receiveRequests);
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.get('/friend/data/:ID', (req, res) => {
    async function main() {
        try {
            const cursor = await userDetailsCollection.findOne( { googleID: req.params.ID } );
            res.json(cursor);
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.get('/aboutme/:ID', (req, res) => {
    const id = req.params.ID;
    async function main() {
        try {
            const cursor = await userDetailsCollection.findOne({ googleID: req.params.ID });
            res.json({ aboutMe: cursor.aboutMe, doj: cursor.doj });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.put('/unfriend/:ID', (req, res) => {
    console.log("unfriend")
    async function main() {
        try {
            await userDetailsCollection.updateOne( { googleID: req.user.googleID }, { $pull: { friends: { googleID: req.params.ID } } } );
            await userDetailsCollection.updateOne( { googleID: req.params.ID }, { $pull: { friends: { googleID: req.user.googleID } } } );
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
    res.json( { success: "Unfriend has been done" } );
})

router.get('/common/groups/:ID', (req, res) => {
    console.log(req.params.ID);
    async function main() {
        try {
            const user = await userDetailsCollection.findOne( { googleID: req.user.googleID } );
            const friend = await userDetailsCollection.findOne( { googleID: req.params.ID } );
            const userGroups = user.groups, friendGroups = friend.groups;
            const commonGroups = userGroups.filter((group1) => friendGroups.some((group2) => group1.id === group2.id));
            res.json(commonGroups);
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.get('/chat/data', (req, res) => {
    async function main() {
        try {
            const cursor = await personalChatsCollection.findOne( { chatID: req.query.ID } );

            let chatMsg = cursor.chatMsg.filter((element) => element.deleteMsg.indexOf(req.user.googleID) === -1);
            chatMsg = chatMsg.map((element) => {
                const star = element.star.indexOf(req.user.googleID) !== -1;
                return {
                    messageID: element.messageID,
                    collectedText: element.collectedText,
                    name: element.name,
                    lastModified: element.lastModified,
                    size: element.size,
                    currentMsgTime: element.currentMsgTime,
                    senderID: element.senderID,
                    senderName: element.senderName,
                    senderPhotoURL: element.senderPhotoURL,
                    // receiverID: element.newChat.ID,
                    // receiverName: element.newChat.fullName,
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

router.delete('/delete/messages/:room', (req, res) => {
    const selectedMessages = JSON.parse(req.query.selectedMessages);
    async function main() {
        try {
            const cursor = await personalChatsCollection.findOne( { chatID: req.params.room } );

            let updatedMessagesArray = cursor.chatMsg;
            selectedMessages.forEach((elementToRemove) => {
                updatedMessagesArray = updatedMessagesArray.map((element) => {
                    if (element.messageID === elementToRemove) element.deleteMsg.push(req.user.googleID);
                    return element;
                })
            });

            await personalChatsCollection.updateOne( { chatID: req.params.room }, { $set: { chatMsg: updatedMessagesArray } } );
            res.json({ success: 'messages has been deleted' });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.put('/starAndunstar/messages/:room', (req, res) => {
    const selectedMessages = JSON.parse(req.query.selectedMessages);
    async function main() {
        try {
            const cursor = await personalChatsCollection.findOne( { chatID: req.params.room } );

            let updatedMessagesArray = cursor.chatMsg;
            selectedMessages.forEach((elementToUpdate) => {
                updatedMessagesArray.map((element) => {
                    if (element.messageID === elementToUpdate && req.query.starStatus === 'true') {
                        if (element.star.indexOf(req.user.googleID) === -1) element.star.push(req.user.googleID);
                    }
                    else if (element.messageID === elementToUpdate && req.query.starStatus !== 'true') {
                        element.star  = element.star.filter((ID) => ID !== req.user.googleID);
                    }
                    return element;
                })
            })
            
            await personalChatsCollection.updateOne( { chatID: req.params.room }, { $set: { chatMsg: updatedMessagesArray } } );
            res.json({ success: 'messages has been starred' });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.get('/starred/messages', (req, res) => {
    async function main() {
        try {
            const cursor = await personalChatsCollection.findOne( { chatID: req.query.ID } );
            let chatMsg = cursor.chatMsg;
            const starMessagesArray = chatMsg.filter((element) =>
                element.deleteMsg.indexOf(req.user.googleID) === -1 && element.star.indexOf(req.user.googleID) !== -1
            );
            console.log(starMessagesArray);
            res.json(starMessagesArray);
        } catch (e) {
            console.error(e);
        }
    }

    console.log("show me starred messages")

    main().catch(console.error);
})

router.get('/groups/list', (req, res) => {
    async function main() {
        try {
            const cursor = await userDetailsCollection.findOne( { googleID: req.user.googleID } );
            res.json(cursor.groups);
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.get('/group/data', (req, res) => {
    async function main() {
        try {
            const cursor = await groupChatsCollection.findOne( { groupID: req.query.ID } );

            let chatMsg = cursor.chatMsg.filter((element) => element.deleteMsg.indexOf(req.user.googleID) === -1);
            chatMsg = chatMsg.map((element) => {
                const star = element.star.indexOf(req.user.googleID) !== -1;
                return {
                    messageID: element.messageID,
                    collectedText: element.collectedText,
                    name: element.name,
                    lastModified: element.lastModified,
                    size: element.size,
                    currentMsgTime: element.currentMsgTime,
                    senderID: element.senderID,
                    senderName: element.senderName,
                    senderPhotoURL: element.senderPhotoURL,
                    // receiverID: element.newChat.ID,
                    // receiverName: element.newChat.fullName,
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

router.delete('/group/delete/messages/:room', (req, res) => {
    const selectedMessages = JSON.parse(req.query.selectedMessages);
    async function main() {
        try {
            const cursor = await groupChatsCollection.findOne( { groupID: req.params.room } );

            let updatedMessagesArray = cursor.chatMsg;
            selectedMessages.forEach((elementToRemove) => {
                updatedMessagesArray = updatedMessagesArray.map((element) => {
                    if (element.messageID === elementToRemove) element.deleteMsg.push(req.user.googleID);
                    return element;
                })
            });

            await groupChatsCollection.updateOne( { groupID: req.params.room }, { $set: { chatMsg: updatedMessagesArray } } );
            res.json({ success: 'messages has been deleted' });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.put('/group/starAndunstar/messages/:room', (req, res) => {
    const selectedMessages = JSON.parse(req.query.selectedMessages);
    async function main() {
        try {
            const cursor = await groupChatsCollection.findOne( { groupID: req.params.room } );

            let updatedMessagesArray = cursor.chatMsg;
            selectedMessages.forEach((elementToUpdate) => {
                updatedMessagesArray.map((element) => {
                    if (element.messageID === elementToUpdate && req.query.starStatus === 'true') {
                        if (element.star.indexOf(req.user.googleID) === -1) element.star.push(req.user.googleID);
                    }
                    else if (element.messageID === elementToUpdate && req.query.starStatus !== 'true') {
                        element.star  = element.star.filter((ID) => ID !== req.user.googleID);
                    }
                    return element;
                })
            })
            
            await groupChatsCollection.updateOne( { groupID: req.params.room }, { $set: { chatMsg: updatedMessagesArray } } );
            res.json({ success: 'messages has been starred' });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.get('/group/starred/messages', (req, res) => {
    async function main() {
        try {
            const cursor = await groupChatsCollection.findOne( { groupID: req.query.ID } );
            let chatMsg = cursor.chatMsg;
            const starMessagesArray = chatMsg.filter((element) =>
                element.deleteMsg.indexOf(req.user.googleID) === -1 && element.star.indexOf(req.user.googleID) !== -1
            );
            console.log(starMessagesArray);
            res.json(starMessagesArray);
        } catch (e) {
            console.error(e);
        }
    }

    console.log("show me starred messages")

    main().catch(console.error);
})

module.exports = router;