const db = require("./db");
const bcrypt = require("./bcrypt");
const csurf = require("csurf");
const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");
const path = require("path");
////////////////////////////////////////////////////////////////////////////////
//UPLOAD
const s3 = require("./s3");
const { s3Url } = require("./config");
const multer = require("multer");
const uidSafe = require("uid-safe");
const server = require("http").Server(app);
const io = require("socket.io").listen(server);
let secrets;

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

if (process.env.NODE_ENV === "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets.json");
}

app.use(compression());
app.use(express.json());
app.use(express.static("./public"));
app.use(express.static("./sql"));

const cookieSessionMiddleware = cookieSession({
    secret: `secrets`,
    maxAge: 24 * 60 * 60 * 1000
});

app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage
    // ,
    // limits: {
    //     fileSize: 9097152
    // }
});

app.get("/friends-wonnabes", (req, res) => {
    console.log("**************************************GET/friends-wonnabes");
    db.selectFriendsWonnabes(req.session.userId)
        .then(result => {
            console.log("result from selectFriendsWonnabes: ", result);
            res.json(result);
        })
        .catch(err => console.log("err in selectFriendsWonnabes: ", err));
});

app.get("/allfriends.json", (req, res) => {
    console.log("**************************************GET/allfriends");
    db.selectFriends(req.session.userId)
        .then(result => {
            res.json(result);
        })
        .catch(err => console.log("err in selectFriends: ", err));
});

app.get("/allpicturesuser/:id", (req, res) => {
    console.log("**************************************GET/allpicturesuser");
    db.selectAllPictures(req.params.id)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log("err in selectAllPictures: ", err);
        });
});

app.get("/allpictures", (req, res) => {
    console.log("**************************************GET/allpictures");
    db.selectAllPictures(req.session.userId)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log("err in selectAllPictures: ", err);
        });
});

app.post("/pictures", uploader.single("file"), s3.upload, (req, res) => {
    console.log("**************************************POST/pictures");
    const imageUrl = s3Url + req.file.filename;

    db.insertPictures(imageUrl, req.session.userId)
        .then(result => {
            db.selectAllPictures(req.session.userId)
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    console.log("err in selectAllPictures: ", err);
                });
        })
        .catch(err => {
            console.log("err in insertPictures: ", err);
        });
});

app.post("/update/:recipient_id.json", (req, res) => {
    console.log(
        "**************************************POST/update/:recipient_id.json"
    );
    db.update(req.session.userId, req.params.recipient_id)
        .then(result => {
            res.json({ success: true });
        })
        .catch(err => {
            console.log("err in do update", err);
            res.json({ success: false });
        });
});

app.get("/friends-status/:recipient_id.json", (req, res) => {
    console.log(
        "**************************************GET/friends-status/:recipient_id.json"
    );
    db.friendsStatus(req.params.recipient_id, req.session.userId)
        .then(result => {
            if (result.length == 0) {
                res.json({ success: false, btnText: "Send Friend Request" });
            } else if (result[0].accepted == false) {
                if (req.session.userId == result[0].sender_id) {
                    res.json({
                        success: false,
                        btnText: "Cancel Friend Request"
                    });
                } else {
                    res.json({
                        success: false,
                        btnText: "Accept Friend Request"
                    });
                }
            } else if (result[0].accepted == true) {
                res.json({ success: true, btnText: "Unfriend" });
            }
        })
        .catch(err => {
            console.log("err in friendsStatus: ", err);
        });
});

app.post("/make-friend-request/:recipient_id.json", (req, res) => {
    console.log(
        "**************************************GET/make-friend-request/:recipient_id.json"
    );

    db.addFriend(req.params.recipient_id, req.session.userId)
        .then(result => {
            res.json({ success: false });
        })
        .catch(err => {
            console.log("err in addFriend: ", err);
        });
});

app.post("/cancel/:recipient_id.json", (req, res) => {
    console.log(
        "**************************************POST/cancel/:recipient_id.json"
    );
    db.cancel(req.params.recipient_id, req.session.userId)
        .then(result => {
            res.json({ success: true });
        })
        .catch(err => {
            console.log("err in cancel:", err);
        });
});

app.get("/users/newest.json", (req, res) => {
    console.log("**************************************GET/user/newest.json");
    db.getNewestUsers()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.log("error in getNewestUsers: ", err);
        });
});

app.get("/users/:first.json", (req, res) => {
    console.log("**************************************GET/user/:first.json");
    db.getUsersByName(req.params.first).then(data => {
        res.json(data);
    });
});

app.get("/user/:id.json", (req, res) => {
    console.log("************************************************GET/user/:id");
    db.getUserById(req.params.id)
        .then(result => {
            result.rows[0].userId = req.session.userId;
            res.json(result.rows[0]);
        })
        .catch(err => {
            console.log("err in getUserById:", err);
        });
});

app.get("/logout", function(req, res) {
    console.log("*********************************************GET/logout");
    req.session = undefined;
    res.json({ success: true });
});

app.post("/bio", (req, res) => {
    console.log("******************************POST/bio");
    let bio = req.body.bio;
    let email = req.session.email;
    db.updateBio(email, bio)
        .then(result => {
            res.json({
                success: true
            });
        })
        .catch(err => {
            console.log("err in update Bio: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("**************************************POST/upload");
    const imageUrl = s3Url + req.file.filename;
    let email = req.session.email;
    db.updateImage(email, imageUrl)
        .then(result => {
            res.json({
                picture_url: imageUrl
            });
        })
        .catch(err => {
            console.log("err in imafe upload: ", err);
        });
});

app.get("/user", function(req, res) {
    console.log("*********************************************GET/user");
    let email = req.session.email;
    db.getUser(email)
        .then(result => {
            result.rows[0].password = "";
            res.json(result.rows[0]);
        })
        .catch(err => {
            console.log("err in getUser GET/user:", err);
        });
});

////////////////////////////////////////////////////////////////////////////////
//WELCOME
app.get("/welcome", function(req, res) {
    console.log("*********************************************GET/welcome");
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
//////////////////////////////////////////////////////////////////////////////
//RESET
app.post("/reset/start", (req, res) => {
    console.log("************************************************POST/reset");
    const email = req.body.email;
    const secretCode = cryptoRandomString({
        length: 6
    });

    db.getUser(email)
        .then(results => {
            if (results.rows[0] == undefined) {
                res.json({ success: false });
            } else {
                db.deleteEmailAndCode(email)
                    .then(what => {
                        db.reset(email, secretCode)
                            .then(result => {
                                let emailCode = result.rows[0].emailcode;
                                let subject = "blablabl";
                                ses.sendEmail(
                                    "wiggly.mandate+funky@spicedling.email",
                                    emailCode,
                                    subject
                                )
                                    .then(result => {
                                        res.json({ success: true });
                                    })
                                    .catch(err => {
                                        console.log("err in sendEmail: ", err);
                                    });
                            })
                            .catch(err => {
                                console.log("err in add code with email", err);
                            });
                    })
                    .catch(err => {
                        console.log("err in deleteEmailAndCode: ", err);
                    });
            }
        })
        .catch(err => {
            console.log(console.log("error in checking email: "), err);
        });
});
///////////////////////////////////////////////////////////////////////////////
//RESET/verify:
app.post("/reset/verify", (req, res) => {
    console.log(
        "************************************************POST/reset/verify"
    );
    let email = req.body.state.email;
    let code = req.body.state.code;
    let newpass = req.body.state.newpass;

    db.getResetCode(email)
        .then(result => {
            if (result.rows[0].emailcode == code) {
                bcrypt
                    .hash(newpass)
                    .then(hashedPass => {
                        console.log("hashedPass: ", hashedPass);
                        db.updatePassword(email, hashedPass)
                            .then(resul => {
                                res.json({ success: true });
                            })
                            .catch(err => {
                                console.log("err updatePassword: ", err);
                            });
                    })
                    .catch(err => {
                        console.log(
                            "err in hashed pass in /reset/verify: ",
                            err
                        );
                    });
            } else {
                res.json({ success: false });
            }
        })
        .catch(err => {
            console.log("error in getResetCode: ", err);
            res.json({ success: false });
        });
});
///////////////////////////////////////////////////////////////////////////////
app.post("/register", (req, res) => {
    console.log(
        "************************************************POST/register"
    );

    const first = req.body.first;
    const last = req.body.last;
    const email = req.body.email;
    const password = req.body.password;
    if (
        first == undefined ||
        last == undefined ||
        email == undefined ||
        password == undefined
    ) {
        res.json({ success: false });
    } else if (req.body == {}) {
        res.json({ success: false });
    } else if (
        first == "" ||
        last == "" ||
        email == "" ||
        password == "" ||
        first.startsWith(" ") ||
        last.startsWith(" ") ||
        email.startsWith(" ") ||
        password.startsWith(" ")
    ) {
        res.json({ success: false });
    } else {
        bcrypt
            .hash(password)
            .then(hashedPass => {
                db.addUser(first, last, email, hashedPass, null)
                    .then(results => {
                        req.session.userId = results.rows[0].id;
                        req.session.email = email;
                        res.json({ success: true });
                    })
                    .catch(err => {
                        console.log("catch err in addUsers", err);
                        res.json({ success: false });
                    });
            })
            .catch(err => {
                console.log("err in hashed pass: ", err);
            });
    }
});

app.post("/login", (req, res) => {
    console.log("******************************POST/login");

    let email = req.body.email;
    let password = req.body.password;

    db.getUser(email)
        .then(results => {
            bcrypt.compare(password, results.rows[0].password).then(result => {
                if (result) {
                    req.session.userId = results.rows[0].id;
                    req.session.email = email;
                    res.json({ success: true });
                } else {
                    res.json({ success: false });
                }
            });
        })
        .catch(err => {
            console.log(console.log("err in login: "), err);
            res.json({ success: false });
        });
});

////////////////////////////////////////////////////////////////////////////////
//LAST ROUTE!!!!!!!!!!!!!!!!!!!!!!!
app.get("*", function(req, res) {
    console.log("************************************************GET/*");
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening.on 8080");
});

let onlineUsers = {};

////////////////////////////////////////////////////////////////////////////////
// SOCKET IO
io.on("connection", async function(socket) {
    console.log("*******************************/io.on!!!!!!");
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;
    onlineUsers[socket.id] = userId;

    socket.on("disconnect", () => {
        console.log(
            "*******************************/socket.on/disconnect!!!!!!"
        );
        delete onlineUsers[socket.id];
        let onlineUsersArr = [];
        Object.entries(onlineUsers).map(onlineUserId => {
            onlineUsersArr.push(onlineUserId[1]);
        });

        db.selectOnlineUsers(onlineUsersArr)
            .then(result => {
                io.sockets.emit("usersOnline", result);
            })
            .catch(err => {
                console.log("err in selectOnlineUsers: ", err);
            });
    });
    /////////////////////////////////////////////////
    // online users
    let onlineUsersArr = [];
    Object.entries(onlineUsers).map(onlineUserId => {
        onlineUsersArr.push(onlineUserId[1]);
    });

    db.selectOnlineUsers(onlineUsersArr)
        .then(result => {
            io.sockets.emit("usersOnline", result);
        })
        .catch(err => {
            console.log("err in selectOnlineUsers: ", err);
        });

    /////////////////////////////////////////////////////
    const messages = await db.getMessages().catch(err => {
        console.log("err in get messages:", err);
    });

    io.sockets.emit("getMessages", messages);

    socket.on("newmessage", async msg => {
        try {
            const data = await db.getUserById(userId);
            const newmessage = await db.insertMessage(
                data.rows[0].first,
                data.rows[0].last,
                msg,
                userId
            );
            data.rows[0].user_id = data.rows[0].id;
            data.rows[0].message = msg;
            data.rows[0].created_at = newmessage[0].created_at;
            io.sockets.emit("newmessage", data.rows[0]);
        } catch (err) {
            console.log("error socket.on: ", err);
        }
    });
});
