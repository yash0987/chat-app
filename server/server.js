'use strict'
const express = require('express');
const http = require('http');
const passport = require('passport');
const { WebSocketServer } = require('ws');
const { MongoClient, ObjectId } = require('mongodb');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const session = require('express-session');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const filesRouter = require('./routes/multer');

const app = express();
const server = http.createServer(app);
const uri = 'mongodb://root:password@mongo:27017/';
const client = new MongoClient(uri);
const wss = new WebSocketServer({ server });

// app.user(session(secret: 'anything') app.use(passport.initialize()) app.use(passport.session()) should be one after another 
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: 'mongodb://root:password@mongo:27017/', dbName: 'chat-app', ttl: 7 * 24 * 60 * 60 })
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors( { origin: 'http://localhost:3000', methods: "GET,HEAD,PUT,PATCH,POST,DELETE", credentials: true } ));
app.use(express.json());

app.use('/', authRouter);

app.get('/auth/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('http://localhost:3000/');
    });
});

// main endpoints from here
const authCheck = (req, res, next) => {
    if (!req.user) {
      res.json({
        authenticated: false,
        message: "user has not been authenticated"
      });
    }
    next();
};

app.use('/', authCheck, indexRouter);
app.use('/', authCheck, filesRouter);

// (async () => await client.connect())();

async function main(room, chatType, messages) {
    messages = messages.map((element) => {
        delete element.chat;
        return element;
    });

    try {
        await client.connect();
        chatType === 'group' ?
        await client.db('chat-app').collection('groupChats').updateOne( { _id: new ObjectId(room) }, { $push: { chatMsg: { $each: messages } } }, { $set: { groupID: room, chatMsg: [] }, upsert: true } ) :
        await client.db('chat-app').collection('personalChats').updateOne( { _id: new ObjectId(room) }, { $push: { chatMsg: { $each: messages } } }, { $set: { chatID: room, chatMsg: [] }, upsert: true } );
    } catch (e) {
        console.error(e);
    }
}

const rooms = {};

function join(senderID, chat, roomID, ws) {
    leave(ws);
    console.log("Joining");
    ws.senderGoogleID = senderID;
    ws.chatInfo = chat;
    if (!rooms[roomID]) {
        rooms[roomID] = [ws];
        return ;
    }

    let flag = true;
    rooms[roomID].forEach((client) => {
        if (client.senderGoogleID === ws.senderGoogleID) flag = false;
    })

    if (flag) {
        rooms[roomID].push(ws);
    }
}

function leave(ws) {
    if (!ws.chatInfo) return ;
    const roomID = ws.chatInfo.id;
    console.log("i am leaving")
    if (!rooms[roomID]) return ;

    rooms[roomID] = rooms[roomID].filter((client) => client.senderGoogleID !== ws.senderGoogleID);
}

function send(data, senderID, chatType, roomID) {
    console.log("Sending " + roomID);
    rooms[roomID].forEach((client) => {
        if (client.senderGoogleID !== senderID) {
            client.send(JSON.stringify(data));
        }
    })

    data = data.map((element) => {
        return { ...element, deleteMsg: [], star: [] };
    })
    main(roomID, chatType, data).catch(console.error);
}

function editMessage(data, senderID, chatType, roomID) {
    console.log(roomID)
    rooms[roomID].forEach((client) => {
        if (client.senderGoogleID !== senderID) {
            console.log('i am sending edited message')
            client.send(JSON.stringify(data));
        }
    })

    const { editedMessage, messageID } = data[0];
    async function main() {
        try {
            await client.connect();
            chatType === 'group' ?
            await client.db('chat-app').collection('groupChats').updateOne({ _id: new ObjectId(roomID), "chatMsg.messageID": messageID }, { $set: { "chatMsg.$.collectedText": editedMessage, "chatMsg.$.editedStatus": true } }) :
            await client.db('chat-app').collection('personalChats').updateOne({ _id: new ObjectId(roomID), "chatMsg.messageID": messageID }, { $set: { "chatMsg.$.collectedText": editedMessage, "chatMsg.$.editedStatus": true } });
        } catch (e) {
            console.error(e);
        }
    }

    main().catch(console.error);
}

wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.on('pong', () => {
        console.log("pong");
        ws.isAlive = true;
    });
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const { senderID, chat, action } = data[0];
        const { id: receiverID, chatType } = chat;
        console.log(chat, data[0].collectedText);
        const roomID = receiverID;

        switch (action) {
            case 'join':
                join(senderID, chat, roomID, ws);
                break;
            case 'leave':
                leave(ws);
                break;
            case 'send':
                send(data, senderID, chatType, roomID);
                break;
            case 'edit':
                editMessage(data, senderID, chatType, roomID);
                break;
            default:
                break;
        }
    }
})

setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();
        console.log("ping");
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);

server.listen(5000, () => {
    console.log('Server is listening to port 5000: http://localhost:5000');
})
