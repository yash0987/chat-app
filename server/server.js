const express = require('express');
const http = require('http');
const passport = require('passport');
const { Server } = require('socket.io');
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
const io = new Server(server, {
    cors: {
        origin: [ 'http://localhost:3000' ],
    }
});

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

io.on('connection', (socket) => {
    console.log(socket.id);

    socket.on('chat-message', (message, room) => {
        if (room !== '') {
            async function main() {
                try {
                    await client.connect();
                    await client.db('chat-app').collection('chats').updateOne( { chatID: room }, { $push: { chatMsg: message } }, { $set: { chatID: room }, upsert: true } );
                } catch (e) {
                    console.error(e);
                } finally {
                    await client.close();
                }
            }
        
            main().catch(console.error);
            socket.broadcast.to(room).emit('receive-message', message);
        }
    })

    socket.on('join-room', (room) => {
        socket.join(room);
    })

    socket.on('leave-room', (room) => {
        socket.leave(room);
    })
})

server.listen(5000, () => {
    console.log('Server is listening to port 5000: http://localhost:5000');
})