'use strict';
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const router = express.Router();
const uri = 'mongodb://root:password@mongo:27017/';
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
    const personData = { ...req.body.person, _id: new ObjectId(req.body.person._id) };
    const userData = {
        _id: req.user._id,
        name: req.user.name,
        photoURL: req.user.photoURL
    };

    async function main() {
        try {
            await userDetailsCollection.updateOne( { _id: new ObjectId(userData._id) }, { $addToSet: { sendRequests: personData } } );
            await userDetailsCollection.updateOne( { _id: new ObjectId(personData._id) }, { $addToSet: { receiveRequests: userData } } );
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
    res.json( { success: `Friend request has send to ${personData.name}` } );
})

router.put('/cancelRequest', (req, res) => {
    const personData = { ...req.body.person, _id: new ObjectId(req.body.person._id) };
    const userData = {
        _id: req.user._id,
        name: req.user.name,
        photoURL: req.user.photoURL
    };

    console.log(personData, userData);

    async function main() {
        try {
            await userDetailsCollection.updateOne( { _id: new ObjectId(userData._id) }, { $pull: { sendRequests: { _id: personData._id } } } );
            await userDetailsCollection.updateOne( { _id: new ObjectId(personData._id) }, { $pull: { receiveRequests: { _id: userData._id } } } );
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
    res.json( { success: 'Friend request is cancel' } );
});

router.put('/acceptRequest', (req, res) => {
    const personData = { ...req.body.person, _id: new ObjectId(req.body.person._id) };
    const userData = {
        _id: req.user._id,
        name: req.user.name,
        photoURL: req.user.photoURL
    };

    const IDarray = [userData._id, personData._id].sort();
    const room = IDarray[0] + IDarray[1];

    async function main() {
        try {
            await userDetailsCollection.updateOne( { _id: new ObjectId(userData._id) }, { $addToSet: { friends: personData } } );
            await userDetailsCollection.updateOne( { _id: new ObjectId(userData._id) }, { $pull: { sendRequests: { _id: personData._id } } } );
            await userDetailsCollection.updateOne( { _id: new ObjectId(userData._id) }, { $pull: { receiveRequests: { _id: personData._id } } } );
            await userDetailsCollection.updateOne( { _id: new ObjectId(personData._id) }, { $addToSet: { friends: userData } } );
            await userDetailsCollection.updateOne( { _id: new ObjectId(personData._id) }, { $pull: { sendRequests: { _id: userData._id } } } );
            await userDetailsCollection.updateOne( { _id: new ObjectId(personData._id) }, { $pull: { receiveRequests: { _id: userData._id } } } );
            await personalChatsCollection.insertOne( { chatID: room, chatMsg: [] } );
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
    res.json( { success: 'Friend request is accepted' } );
})

router.put('/declineRequest', (req, res) => {
    const personData = { ...req.body.person, _id: new ObjectId(req.body.person._id) };
    const userData = {
        _id: req.user._id,
        name: req.user.name,
        photoURL: req.user.photoURL
    };

    console.log(personData, userData);

    async function main() {
        try {
            await userDetailsCollection.updateOne( { _id: new ObjectId(userData._id) }, { $pull: { receiveRequests: { _id: userData._id } } } );
            await userDetailsCollection.updateOne( { _id: new ObjectId(personData._id) }, { $pull: { sendRequests: { _id: personData._id } } } );
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
            res.json({ aboutMe: cursor.aboutMe, doj: cursor.doj });
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

router.get('/chat/data/:room', (req, res, next) => {
    const range = parseInt(req.query.range);
    console.log(range * -1);

    async function main() {
        try {
            const countChatMessages = await personalChatsCollection.aggregate([
                { $match: { chatID: req.params.room } },
                { $project: { chatMsg: { $filter: { input: "$chatMsg", as: "chat", cond: { $not: { $in: [ req.user._id.toString(), "$$chat.deleteMsg" ] } } } } } },
                { $project: { chatMsg: { $size: "$chatMsg" } } }
            ]).toArray();

            const countToRetrieveMessages = range <= countChatMessages[0].chatMsg ? 40 : 40 - (range - countChatMessages[0].chatMsg);
            console.log(countChatMessages[0].chatMsg, countToRetrieveMessages);
            
            if (range - countChatMessages[0].chatMsg >= 40) {
                res.json([]);
                return ;
            }

            const cursor = await personalChatsCollection.aggregate([
                { $match: { chatID: req.params.room } },
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
    console.log(req.body);
    async function main() {
        try {
            const cursor = await personalChatsCollection.findOne( { chatID: req.body.room } );

            let updatedMessagesArray = cursor.chatMsg;
            selectedMessages.forEach((elementToRemove) => {
                updatedMessagesArray = updatedMessagesArray.map((element) => {
                    if (element.messageID === elementToRemove) element.deleteMsg.push(req.user._id.toString());
                    return element;
                })
            });

            await personalChatsCollection.updateOne( { chatID: req.body.room }, { $set: { chatMsg: updatedMessagesArray } } );
            res.json({ success: 'messages has been deleted' });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.put('/starAndUnstar/messages', (req, res) => {
    const selectedMessages = req.body.selectedMessages;
    console.log(req.body)
    async function main() {
        try {
            const cursor = await personalChatsCollection.findOne( { chatID: req.body.room } );

            let updatedMessagesArray = cursor.chatMsg;
            selectedMessages.forEach((elementToUpdate) => {
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
            
            await personalChatsCollection.updateOne( { chatID: req.body.room }, { $set: { chatMsg: updatedMessagesArray } } );
            res.json({ success: 'messages has been starred' });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

// not in use now
router.get('/starred/messages/:id', (req, res) => {
    async function main() {
        try {
            const cursor = await personalChatsCollection.findOne( { chatID: req.params.id } );
            let chatMsg = cursor.chatMsg;
            const starMessagesArray = chatMsg.filter((element) =>
                element.deleteMsg.indexOf(req.user._id.toString()) === -1 && element.star.indexOf(req.user._id.toString()) !== -1
            );
            console.log(starMessagesArray);
            res.json(starMessagesArray);
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.get('/groupinfo/:_id', (req, res) => {
    async function main() {
        try {
            const cursor = await client.db('chat-app').collection('groupDetails').findOne( { _id: new ObjectId(req.params._id) } );
            res.json({ profileFileName: cursor.profileFileName, description: cursor.description, doj: cursor.doj });
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

router.get('/group/data/:room', (req, res) => {
    const range = parseInt(req.query.range);
    console.log(range * -1);

    async function main() {
        try {
            const countChatMessages = await groupChatsCollection.aggregate([
                { $match: { _id: new ObjectId(req.params.room) } },
                { $project: { chatMsg: { $filter: { input: "$chatMsg", as: "chat", cond: { $not: { $in: [ req.user._id.toString(), "$$chat.deleteMsg" ] } } } } } },
                { $project: { chatMsg: { $size: "$chatMsg" } } }
            ]).toArray();

            const countToRetrieveMessages = range <= countChatMessages[0].chatMsg ? 40 : 40 - (range - countChatMessages[0].chatMsg);
            
            if (range - countChatMessages[0].chatMsg >= 40) {
                res.json([]);
                return ;
            }

            const cursor = await groupChatsCollection.aggregate([
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

router.delete('/group/delete/messages', (req, res) => {
    const selectedMessages = req.body.selectedMessages;
    async function main() {
        try {
            const cursor = await groupChatsCollection.findOne( { _id: new ObjectId(req.body.room) } );

            let updatedMessagesArray = cursor.chatMsg;
            selectedMessages.forEach((elementToRemove) => {
                updatedMessagesArray = updatedMessagesArray.map((element) => {
                    if (element.messageID === elementToRemove) element.deleteMsg.push(req.user._id.toString());
                    return element;
                })
            });

            await groupChatsCollection.updateOne( { _id: new ObjectId(req.body.room) }, { $set: { chatMsg: updatedMessagesArray } } );
            res.json({ success: 'messages has been deleted' });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

router.put('/group/starAndUnstar/messages', (req, res) => {
    const selectedMessages = req.body.selectedMessages;
    async function main() {
        try {
            const cursor = await groupChatsCollection.findOne( { _id: new ObjectId(req.body.room) } );

            console.log("group message starred")

            let updatedMessagesArray = cursor.chatMsg;
            selectedMessages.forEach((elementToUpdate) => {
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

            console.log(updatedMessagesArray);
            
            await groupChatsCollection.updateOne( { _id: new ObjectId(req.body.room) }, { $set: { chatMsg: updatedMessagesArray } } );
            res.json({ success: 'messages has been starred' });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

//not in use now
router.get('/group/starred/messages/:_id', (req, res) => {
    async function main() {
        try {
            const cursor = await groupChatsCollection.findOne( { _id: new ObjectId(req.params._id) } );
            let chatMsg = cursor.chatMsg;
            const starMessagesArray = chatMsg.filter((element) =>
                element.deleteMsg.indexOf(req.user._id.toString()) === -1 && element.star.indexOf(req.user._id.toString()) !== -1
            );
            res.json(starMessagesArray);
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
})

module.exports = router;