'use strict';
const express = require('express');
const { MongoClient } = require('mongodb');

const router = express.Router();
const uri = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(uri);

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
            await client.connect();
            const cursor = await client.db('chat-app').collection('userDetails').find({}).toArray();
            let record = cursor.filter((element) => {
                const userFullName = (element.firstName + " " + element.familyName).toLowerCase();
                if (userFullName.includes(searchUser)) {
                    return element;
                }
            });

            record = record.map(({ friendsID, email, sendRequestID, receiveRequestID, groups, ...rest }) => rest);
            res.json({ success: true, record });
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
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
            await client.connect();
            await client.db('chat-app').collection('userDetails').updateOne( { googleID: req.user.googleID }, { $addToSet: { sendRequestID: friendData } } );
            await client.db('chat-app').collection('userDetails').updateOne( { googleID: req.query.ID }, { $addToSet: { receiveRequestID: userData } } );
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
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
            await client.connect();
            await client.db('chat-app').collection('userDetails').updateOne( { googleID: req.user.googleID }, { $pull: { sendRequestID: friendData } } );
            await client.db('chat-app').collection('userDetails').updateOne( { googleID: req.query.ID }, { $pull: { receiveRequestID: userData } } );
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
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

    async function main() {
        try {
            await client.connect();
            await client.db('chat-app').collection('userDetails').updateOne( { googleID: req.user.googleID }, { $addToSet: { friendsID: friendData } } );
            await client.db('chat-app').collection('userDetails').updateOne( { googleID: req.user.googleID }, { $pull: { receiveRequestID: friendData } } );
            await client.db('chat-app').collection('userDetails').updateOne( { googleID: req.query.ID }, { $addToSet: { friendsID: userData } } );
            await client.db('chat-app').collection('userDetails').updateOne( { googleID: req.query.ID }, { $pull: { sendRequestID: userData } } );
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
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
            await client.connect();
            await client.db('chat-app').collection('userDetails').updateOne( { googleID: req.user.googleID }, { $pull: { receiveRequestID: friendData } } );
            await client.db('chat-app').collection('userDetails').updateOne( { googleID: req.query.ID }, { $pull: { sendRequestID: userData } } );
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    main().catch(console.error);
    res.json( { success: 'Friend request is cancel' } );
});

router.get('/friend/:ID', (req, res) => {
    const ID = req.params.ID;

    async function main() {
        try {
            await client.connect();
            const cursor = await client.db('chat-app').collection('userDetails').findOne( { googleID: ID } );
            res.json(cursor);
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    main().catch(console.error);
});

router.get('/friends/list', (req, res) => {
    async function main() {
        try {
            await client.connect();
            const cursor = await client.db('chat-app').collection('userDetails').findOne( { googleID: req.user.googleID } );
            res.json(cursor.friendsID);
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    main().catch(console.error);
})

router.get('/friends/request/send', (req, res) => {
    async function main() {
        try {
            await client.connect();
            const cursor = await client.db('chat-app').collection('userDetails').findOne( { googleID: req.user.googleID } );
            res.json(cursor.sendRequestID);
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    main().catch(console.error);
})

router.get('/friends/request/receive', (req, res) => {
    async function main() {
        try {
            await client.connect();
            const cursor = await client.db('chat-app').collection('userDetails').findOne( { googleID: req.user.googleID } );
            res.json(cursor.receiveRequestID);
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    main().catch(console.error);
})

router.get('/friend/data/:ID', (req, res) => {
    async function main() {
        try {
            await client.connect();
            const cursor = await client.db('chat-app').collection('userDetails').findOne( { googleID: req.params.ID } );
            res.json(cursor);
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    main().catch(console.error);
})

router.put('/unfriend/:ID', (req, res) => {
    console.log("unfriend")
    async function main() {
        try {
            await client.connect();
            await client.db('chat-app').collection('userDetails').updateOne( { googleID: req.user.googleID }, { $pull: { friendsID: { googleID: req.params.ID } } } );
            await client.db('chat-app').collection('userDetails').updateOne( { googleID: req.params.ID }, { $pull: { friendsID: { googleID: req.user.googleID } } } );
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    main().catch(console.error);
    res.json( { success: "Unfriend has been done" } );
})

router.get('/friend/groups/:ID', (req, res) => {
    async function main() {
        try {
            await client.connect();
            const user = await client.db('chat-app').collection('userDetails').findOne( { googleID: req.user.googleID } );
            const friend = await client.db('chat-app').collection('userDetails').findOne( { googleID: req.params.ID } );
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
        } finally {
            await client.close();
        }
    }

    main().catch(console.error);
})

router.get('/chat/data', (req, res) => {
    async function main() {
        try {
            await client.connect();
            const cursor = await client.db('chat-app').collection('chats').findOne( { chatID: req.query.ID } );

            let chatMsg = cursor.chatMsg.filter((element) => element.deleteMsg.indexOf(req.user.googleID) === -1);
            chatMsg = chatMsg.map((element) => {
                const star = element.star.indexOf(req.user.googleID) !== -1;
                return { 
                    messageID: element.messageID,
                    collectedText: element.collectedText,
                    currentMsgTime: element.currentMsgTime,
                    senderID: element.senderID,
                    receiverID: element.receiverID,
                    senderName: element.senderName,
                    receiverName: element.receiverName,
                    star
                };
            })
            res.json(chatMsg);
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    main().catch(console.error);
})

router.delete('/delete/messages', (req, res) => {
    const selectedMessages = JSON.parse(req.query.selectedMessages);
    async function main() {
        try {
            await client.connect();
            const cursor = await client.db('chat-app').collection('chats').findOne( { chatID: req.query.ID } );

            let updatedMessagesArray = cursor.chatMsg;
            selectedMessages.forEach((elementToRemove) => {
                updatedMessagesArray = updatedMessagesArray.map((element) => {
                    if (element.messageID === elementToRemove) element.deleteMsg.push(req.user.googleID);
                    return element;
                })
            });
            await client.db('chat-app').collection('chats').updateOne( { chatID: req.query.ID }, { $set: { chatMsg: updatedMessagesArray } } );
            res.json({ success: 'messages has been deleted' });
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    main().catch(console.error);
})

router.put('/starAndunstar/messages', (req, res) => {
    const selectedMessages = JSON.parse(req.query.selectedMessages);
    async function main() {
        try {
            await client.connect();
            const cursor = await client.db('chat-app').collection('chats').findOne( { chatID: req.query.ID } );

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
            await client.db('chat-app').collection('chats').updateOne( { chatID: req.query.ID }, { $set: { chatMsg: updatedMessagesArray } } );
            res.json({ success: 'messages has been starred' });
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    main().catch(console.error);
})

router.get('/starred/messages', (req, res) => {
    async function main() {
        try {
            await client.connect();
            const cursor = await client.db('chat-app').collection('chats').findOne( { chatID: req.query.ID } );
            let chatMsg = cursor.chatMsg;
            const starMessagesArray = chatMsg.filter((element) =>
                element.deleteMsg.indexOf(req.user.googleID) === -1 && element.star.indexOf(req.user.googleID) !== -1
            );
            console.log(starMessagesArray);
            res.json(starMessagesArray);
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
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

    groupMembers = JSON.parse(req.query.friends);
    groupMembers.push(req.user.googleID);

    async function main() {
        try {
            await client.connect();
            const cursor = await client.db('chat-app').collection('groupChats').findOne( { groupID: group.groupID } );
            if (!cursor) {
                await client.db('chat-app').collection('groupChats').insertOne( { groupID: group.groupID } );
                for (let i = 0; i < groupMembers.length; i++) {
                    await client.db('chat-app').collection('userDetails').updateOne( { googleID: groupMembers[i] }, { $addToSet: { groups: group } } );
                }

                res.json( { success: "Group has been created" } );
                return ;
            }

            res.json( { success: "Choose another ID" } );
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    main().catch(console.error);
});

router.get('/groups/list', (req, res) => {
    async function main() {
        try {
            await client.connect();
            const cursor = await client.db('chat-app').collection('userDetails').findOne( { googleID: req.user.googleID } );
            res.json(cursor.groups);
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    main().catch(console.error);
})

module.exports = router;