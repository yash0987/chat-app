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

async function main(room, message) {
    try {
        await client.connect();
        await client.db('chat-app').collection('chats').updateOne( { chatID: room }, { $push: { chatMsg: message } }, { $set: { chatID: room }, upsert: true } );
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

const rooms = {};
wss.on('connection', (ws) => {
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const IDarray = [ data.sender, data.receiver ];
        IDarray.sort();
        const roomID = IDarray[0] + IDarray[1];

        if (!rooms[roomID]) rooms[roomID] = [ws];
        else {
            let flag = true;
            rooms[roomID].forEach((client) => {
                if (client === ws) flag = false;
            })

            if (flag) rooms[roomID].push(ws);
        }

        rooms[roomID].forEach((client) => {
            if (client !== ws) client.send(JSON.stringify(data));
        })

        main(roomID, data).catch(console.error);
    }
})

server.listen(5000, () => {
    console.log('Server is listening to port 5000: http://localhost:5000');
})