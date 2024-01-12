'use strict';
const express = require('express');
const { MongoClient } = require('mongodb');

const router = express.Router();
const uri = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(uri);
const userDetailsCollection = client.db('chat-app').collection('userDetails');
const chatsCollection =  client.db('chat-app').collection('chats');

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

router.post('/add/friend', (req, res, next) => {
    const friendData = {
        googleID: req.query.ID,
        fullName: req.query.fullName,
        photoURL: req.query.photoURL
    };

    const userData = {
        googleID: req.user.googleID,
        fullName: `${req.user.firstName} ${req.user.familyName}`,
        photoURL: req.user.photoURL
    };

    async function main() {
        try {
            await userDetailsCollection.updateOne( { googleID: req.user.googleID }, { $addToSet: { sendRequests: friendData } } );
            await userDetailsCollection.updateOne( { googleID: req.query.ID }, { $addToSet: { receiveRequests: userData } } );
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
    res.json( { success: `Friend request has send to ${friendData.fullName}` } );
})

router.delete('/cancelRequest', (req, res) => {
    const friendData = {
        googleID: req.query.ID,
        fullName: req.query.fullName,
        photoURL: req.query.photoURL
    };

    const userData = {
        googleID: req.user.googleID,
        fullName: `${req.user.firstName} ${req.user.familyName}`,
        photoURL: req.user.photoURL
    };

    async function main() {
        try {
            await userDetailsCollection.updateOne( { googleID: req.user.googleID }, { $pull: { sendRequests: friendData } } );
            await userDetailsCollection.updateOne( { googleID: req.query.ID }, { $pull: { receiveRequests: userData } } );
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
    res.json( { success: 'Friend request is cancel' } );
});

router.put('/acceptRequest', (req, res) => {
    const friendData = {
        googleID: req.query.ID,
        fullName: req.query.fullName,
        photoURL: req.query.photoURL
    };

    const userData = {
        googleID: req.user.googleID,
        fullName: `${req.user.firstName} ${req.user.familyName}`,
        photoURL: req.user.photoURL
    };

    const IDarray = [req.user.googleID, req.query.ID].sort();
    const room = IDarray[0] + IDarray[1];

    async function main() {
        try {
            await userDetailsCollection.updateOne( { googleID: req.user.googleID }, { $addToSet: { friends: friendData } } );
            await userDetailsCollection.updateOne( { googleID: req.user.googleID }, { $pull: { receiveRequests: friendData } } );
            await userDetailsCollection.updateOne( { googleID: req.query.ID }, { $addToSet: { friends: userData } } );
            await userDetailsCollection.updateOne( { googleID: req.query.ID }, { $pull: { sendRequests: userData } } );
            await chatsCollection.insertOne( { chatID: room, chatMsg: [] } );
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
    res.json( { success: 'Friend request is accepted' } );
})

router.delete('/declineRequest', (req, res) => {
    const friendData = {
        googleID: req.query.ID,
        fullName: req.query.fullName,
        photoURL: req.query.photoURL
    };

    const userData = {
        googleID: req.user.googleID,
        fullName: `${req.user.firstName} ${req.user.familyName}`,
        photoURL: req.user.photoURL
    };

    async function main() {
        try {
            await userDetailsCollection.updateOne( { googleID: req.user.googleID }, { $pull: { receiveRequests: friendData } } );
            await userDetailsCollection.updateOne( { googleID: req.query.ID }, { $pull: { sendRequests: userData } } );
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

router.get('/friend/groups/:ID', (req, res) => {
    async function main() {
        try {
            const user = await userDetailsCollection.findOne( { googleID: req.user.googleID } );
            const friend = await userDetailsCollection.findOne( { googleID: req.params.ID } );
            const arr1 = user.groups, arr2 = friend.groups;
            const commonGroups = [];

            for (let i = 0; i < arr1.length; i++) {
                for (let j = 0; j < arr2.length; j++) {
                    if (arr1[i].groupID === arr2[j].groupID) {
                        commonGroups.push(arr1[i]);
                    }
                }
            }

            console.log(commonGroups);
            res.json( { commonGroups } );
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.get('/chat/data', (req, res) => {
    async function main() {
        try {
            const cursor = await chatsCollection.findOne( { chatID: req.query.ID } );

            let chatMsg = cursor.chatMsg.filter((element) => element.deleteMsg.indexOf(req.user.googleID) === -1);
            chatMsg = chatMsg.map((element) => {
                const star = element.star.indexOf(req.user.googleID) !== -1;
                return { 
                    messageID: element.messageID,
                    collectedText: element.collectedText,
                    currentMsgTime: element.currentMsgTime,
                    senderID: element.senderID,
                    receiverID: element.newChat.ID,
                    senderName: element.senderName,
                    receiverName: element.newChat.fullName,
                    replyToMessage: element.replyToMessage,
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
    const selectedMessages = JSON.parse(req.query.selectedMessages);
    async function main() {
        try {
            const cursor = await chatsCollection.findOne( { chatID: req.query.ID } );

            let updatedMessagesArray = cursor.chatMsg;
            selectedMessages.forEach((elementToRemove) => {
                updatedMessagesArray = updatedMessagesArray.map((element) => {
                    if (element.messageID === elementToRemove) element.deleteMsg.push(req.user.googleID);
                    return element;
                })
            });
            await chatsCollection.updateOne( { chatID: req.query.ID }, { $set: { chatMsg: updatedMessagesArray } } );
            res.json({ success: 'messages has been deleted' });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.put('/starAndunstar/messages', (req, res) => {
    const selectedMessages = JSON.parse(req.query.selectedMessages);
    async function main() {
        try {
            const cursor = await chatsCollection.findOne( { chatID: req.query.ID } );

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
            await chatsCollection.updateOne( { chatID: req.query.ID }, { $set: { chatMsg: updatedMessagesArray } } );
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
            const cursor = await chatsCollection.findOne( { chatID: req.query.ID } );
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

router.post('/group', (req, res) => {
    const group = {
        groupID: req.query.ID,
        groupName: req.query.name,
        groupPhotoURL: req.query.photoURL,
    };

    const groupMembers = JSON.parse(req.query.friends);
    groupMembers.push(req.user.googleID);

    async function main() {
        try {
            const cursor = await client.db('chat-app').collection('groupChats').findOne( { groupID: group.groupID } );
            if (!cursor) {
                await client.db('chat-app').collection('groupChats').insertOne( { groupID: group.groupID } );
                for (let i = 0; i < groupMembers.length; i++) {
                    await userDetailsCollection.updateOne( { googleID: groupMembers[i] }, { $addToSet: { groups: group } } );
                }

                res.json( { success: "Group has been created" } );
                return ;
            }

            res.json( { success: "Choose another ID" } );
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
});

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

module.exports = router;