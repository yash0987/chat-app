'use strict'
const express = require('express');
const http = require('http');
const passport = require('passport');
const { WebSocketServer } = require('ws');
const { MongoClient } = require('mongodb');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const session = require('express-session');
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const filesRouter = require('./routes/multer');

const app = express();
const server = http.createServer(app);
const uri = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2';
const client = new MongoClient(uri);
const wss = new WebSocketServer({ server });

// app.user(session(secret: 'anything') app.use(passport.initialize()) app.use(passport.session()) should be one after another 
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/', dbName: 'chat-app', ttl: 7 * 24 * 60 * 60 })
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

async function main(room, message) {
    try {
        const isGroup = message.newChat.isGroup;
        delete message.isGroup;
        await client.connect();
        isGroup ?
        await client.db('chat-app').collection('groupChats').updateOne( { groupID: room }, { $push: { chatMsg: message } }, { $set: { groupID: room, chatMsg: [] }, upsert: true } ) :
        await client.db('chat-app').collection('personalChats').updateOne( { chatID: room }, { $push: { chatMsg: message } }, { $set: { chatID: room, chatMsg: [] }, upsert: true } );
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

const rooms = {};

function join(senderID, newChat, roomID, ws) {
    leave(ws);
    console.log("Joining");
    ws.senderGoogleID = senderID;
    ws.chatInfo = newChat;
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
    let roomID;
    if (!ws.chatInfo) return ;
    if (ws.chatInfo.isGroup) roomID = ws.chatInfo.ID;
    else {
        const IDarray = [ ws.senderGoogleID, ws.chatInfo.ID ].sort();
        roomID = IDarray[0] + IDarray[1];
    }
    console.log("i am leaving")
    if (!rooms[roomID]) return ;

    rooms[roomID] = rooms[roomID].filter((client) => client.senderGoogleID !== ws.senderGoogleID);
}

function send(data, senderID, isGroup, roomID) {
    console.log("Sending " + roomID);
    rooms[roomID].forEach((client) => {
        if (client.senderGoogleID !== senderID) {
            client.send(JSON.stringify(data));
        }
    })

    // data['deleteMsg'] = [];
    // data['star'] = [];
    data = data.map((element) => {
        return { ...element, deleteMsg: [], star: [] };
    })
    main(roomID, isGroup, data).catch(console.error);
}

wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.on('pong', () => {
        console.log("pong");
        ws.isAlive = true;
    });
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const { newChat, senderID, action } = data[0];
        const { ID: receiverID, isGroup } = newChat;
        console.log(data);
        let roomID;
        if (isGroup) roomID = receiverID;
        else {
            const IDarray = [ senderID, receiverID ].sort();
            roomID = IDarray[0] + IDarray[1];
        }

        if (action === 'join') join(senderID, newChat, roomID, ws);
        else if (action === 'leave') leave(ws);
        else if (action === 'send') send(data, senderID, isGroup, roomID);
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
