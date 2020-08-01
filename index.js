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
const io = require("socket.io")(server);
let secrets;
let onlineUsers = {};

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
    maxAge: 1000 * 60 * 60 * 24 * 90
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
            console.log("result from selectFriends: ", result);
            res.json(result);
        })
        .catch(err => console.log("err in selectFriends: ", err));
});

app.get("/allpicturesuser/:id", (req, res) => {
    console.log("**************************************GET/allpicturesuser");
    console.log("req.params.id:", req.params.id);
    db.selectAllPictures(req.params.id)
        .then(result => {
            console.log("result from selectAllPictures: ", result);
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
            console.log("result from selectAllPictures: ", result);
            res.json(result);
        })
        .catch(err => {
            console.log("err in selectAllPictures: ", err);
        });
});

app.post("/pictures", uploader.single("file"), s3.upload, (req, res) => {
    console.log("**************************************POST/pictures");
    console.log("req.file.filename: ", req.file.filename);
    console.log("s3Url: ", s3Url);
    const imageUrl = s3Url + req.file.filename;
    console.log("imageUrl: ", imageUrl);

    db.insertPictures(imageUrl, req.session.userId)
        .then(result => {
            console.log("result form insertPicture: ", result);
            db.selectAllPictures(req.session.userId)
                .then(result => {
                    console.log("result from selectAllPictures: ", result);
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
    console.log("req.params.recipient_id: ", req.params.recipient_id);
    console.log("req.session.userId: ", req.session.userId);
    db.update(req.session.userId, req.params.recipient_id)
        .then(result => {
            console.log("result from update: ", result);
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
    console.log("req.params.recipient_id: ", req.params.recipient_id);
    console.log("req.session.userId: ", req.session.userId);
    db.friendsStatus(req.params.recipient_id, req.session.userId)
        .then(result => {
            console.log("results from friendsStatus:", result);
            // console.log("results.accepted", result[0].accepted);
            console.log("req.session.userId: ", req.session.userId);
            // console.log("result[0].sender_id: ", result[0].sender_id);

            if (result.length == 0) {
                console.log("result.length == 0");
                res.json({ success: false, btnText: "Send Friend Request" });
            } else if (result[0].accepted == false) {
                console.log("result[0].accepted == false");
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
                console.log("result[0].accepted == true");
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
    console.log("req.params.recipient_id: ", req.params.recipient_id);
    console.log("req.session.userId: ", req.session.userId);

    db.addFriend(req.params.recipient_id, req.session.userId)
        .then(result => {
            console.log("result from addFriend: ", result);
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
    console.log("req.params.recipient_id: ", req.params.recipient_id);
    console.log("req.session.userId: ", req.session.userId);
    db.cancel(req.params.recipient_id, req.session.userId)
        .then(result => {
            console.log("result from cancel: ", result);
            res.json({ success: true });
        })
        .catch(err => {
            console.log("err in cancel:", err);
        });
});
//

app.get("/users/newest.json", (req, res) => {
    console.log("**************************************GET/user/newest.json");
    db.getNewestUsers()
        .then(data => {
            console.log("results from getNewestUsers: ", data);
            res.json(data);
        })
        .catch(err => {
            console.log("error in getNewestUsers: ", err);
        });
});

app.get("/users/:first.json", (req, res) => {
    console.log("**************************************GET/user/:first.json");
    console.log("req.params.first", req.params.first);
    db.getUsersByName(req.params.first).then(data => {
        res.json(data);
    });
});

app.get("/user/:id.json", (req, res) => {
    console.log("************************************************GET/user/:id");
    //.json to dodatek ktory rozroznia sciezki frontendu od backendu
    console.log("req.params.id: ", req.params.id);
    db.getUserById(req.params.id)
        .then(result => {
            console.log("result from get user by id: ", result);
            result.rows[0].userId = req.session.userId;
            console.log("result.rows[0].userId: ", result.rows[0].userId);
            res.json(result.rows[0]);
        })
        .catch(err => {
            console.log("err in getUserById:", err);
        });
    // console.log("req.session.userId: ", req.session.userId);
    //
    // res.json({ userId: req.sessin.userId });
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
            console.log("results from updateBio: ", result);
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
    console.log("req.file.filename: ", req.file.filename);
    console.log("s3Url: ", s3Url);
    const imageUrl = s3Url + req.file.filename;
    let email = req.session.email;
    console.log("imageUrl: ", imageUrl);
    db.updateImage(email, imageUrl)
        .then(result => {
            console.log("result from image upload: ", result);
            res.json({
                picture_url: imageUrl
            });
        })
        .catch(err => {
            console.log("err in imafe upload: ", err);
        });
});

////////////////////////////////////////////////////////////////////////////////
app.get("/user", function(req, res) {
    console.log("*********************************************GET/user");
    console.log("email in req.session.email:", req.session.email);
    let email = req.session.email;
    db.getUser(email)
        .then(result => {
            // console.log("result from addUser GET/user: ", result);
            result.rows[0].password = "";
            console.log("result.rows[0]: ", result.rows[0]);
            res.json(result.rows[0]);
        })
        .catch(err => {
            console.log("err in getUser GET/user:", err);
        });
    // first last id image bio
    // query po te info
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
////////////////////////////////////////////////////////////////////////////////
//RESET
app.post("/reset/start", (req, res) => {
    console.log("************************************************POST/reset");
    const email = req.body.email;
    const secretCode = cryptoRandomString({
        length: 6
    });

    console.log("email:", email);
    db.getUser(email)
        .then(results => {
            if (results.rows[0] == undefined) {
                console.log("Tere is no email in data: ");
                res.json({ success: false });
            } else {
                db.deleteEmailAndCode(email)
                    .then(what => {
                        // console.log(
                        //     "result from deleteEmailAndCode: ",
                        //     what.rows[0]
                        // );
                        db.reset(email, secretCode)
                            .then(result => {
                                // console.log("result from reset:", result);
                                let emailCode = result.rows[0].emailcode;
                                console.log("emailCode: ", emailCode);
                                let subject = "blablabl";
                                ses.sendEmail(
                                    "wiggly.mandate+funky@spicedling.email",
                                    emailCode,
                                    subject
                                )
                                    .then(result => {
                                        console.log(
                                            "result from sendEmail:",
                                            result
                                        );
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
            // res.json({ success: false });
        });
});
///////////////////////////////////////////////////////////////////////////////
//RESET/verify:
app.post("/reset/verify", (req, res) => {
    console.log(
        "************************************************POST/reset/verify"
    );
    console.log("req.body: ", req.body);
    console.log("code: ", req.body.state.code);
    console.log("email: ", req.body.state.email);
    console.log("newpass: ", req.body.state.newpass);
    let email = req.body.state.email;
    let code = req.body.state.code;
    let newpass = req.body.state.newpass;

    db.getResetCode(email)
        .then(result => {
            console.log("result from getResetCode: ", result.rows[0].emailcode);
            if (result.rows[0].emailcode == code) {
                console.log("valid code!!!!"); //////////////////////////////////// hash password
                bcrypt
                    .hash(newpass)
                    .then(hashedPass => {
                        console.log("hashedPass: ", hashedPass);
                        db.updatePassword(email, hashedPass)
                            .then(resul => {
                                console.log(
                                    "results from updating password: ",
                                    resul
                                );
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
    console.log("first:", first);
    // const hashedPass = req.body.password;
    if (
        first == undefined ||
        last == undefined ||
        email == undefined ||
        password == undefined
    ) {
        res.json({ success: false });
    } else if (req.body == {}) {
        console.log("req.body empty object!!!: ", req.body);
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
        console.log("empty fields in registration");
        res.json({ success: false });
    } else {
        bcrypt
            .hash(password)
            .then(hashedPass => {
                console.log("hashedPass: ", hashedPass);
                db.addUser(first, last, email, hashedPass, null)
                    .then(results => {
                        console.log("result of adding user!!: ", results);
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

    console.log("email: ", email);
    console.log("password", password);

    db.getUser(email)
        .then(results => {
            console.log("getUser: ", results);
            console.log("getUser id: ", results.rows[0].id);
            // console.log("results.rows[0].password", results.rows[0].password);
            // console.log("email", email);
            bcrypt.compare(password, results.rows[0].password).then(result => {
                console.log("compareing result: ", result);
                if (result) {
                    console.log("user exist, do smth :)");
                    req.session.userId = results.rows[0].id;
                    req.session.email = email;
                    res.json({ success: true });
                } else {
                    console.log("wrong password but user exist :)");
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
        console.log("!req.session.userId");
        res.redirect("/welcome");
    } else {
        console.log(`"__dirname + "/index.html"`);
        res.sendFile(__dirname + "/index.html");
    }
});
///////////////////////////////////////////////////////////////////////////////
server.listen(process.env.PORT || 8080, function() {
    console.log("I'm listening.on 8080");
});

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
        // console.log("actuall user: ", userId);
        // console.log(`user with id: ${socket.id} is now disconnected`);
        // console.log("onlineUsers before delete:", onlineUsers);
        delete onlineUsers[socket.id];
        // console.log("onlineUsers after delete:", onlineUsers);
        let onlineUsersArr = [];
        Object.entries(onlineUsers).map(onlineUserId => {
            onlineUsersArr.push(onlineUserId[1]);
        });

        db.selectOnlineUsers(onlineUsersArr)
            .then(result => {
                // console.log(
                //     "result from selectOnlineUsers!!!!!!!!!!!!!: ",
                //     result
                // );
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
            console.log("result from selectOnlineUsers!!!!!!!!!!!!!: ", result);
            io.sockets.emit("usersOnline", result);
        })
        .catch(err => {
            console.log("err in selectOnlineUsers: ", err);
        });

    console.log(
        "userId from socket.request.session.userId: ",
        socket.request.session.userId
    );

    /////////////////////////////////////////////////////
    const messages = await db.getMessages().catch(err => {
        console.log("err in get messages:", err);
    });

    io.sockets.emit("getMessages", messages);

    socket.on("newmessage", async msg => {
        console.log("on the server...", msg);
        try {
            const data = await db.getUserById(userId);
            console.log("first: ", data.rows[0].first);
            console.log("last: ", data.rows[0].last);
            console.log("picture_url: ", data.rows[0].picture_url);
            console.log("data:", data.rows[0]);
            const newmessage = await db.insertMessage(
                data.rows[0].first,
                data.rows[0].last,
                msg,
                userId
            );
            // newmessage[0].picture_url = data.rows[0].picture_url;
            // console.log("new message:", newmessage[0].created_at);
            data.rows[0].message = msg;
            data.rows[0].created_at = newmessage[0].created_at;
            io.sockets.emit("newmessage", data.rows[0]);
        } catch (err) {
            console.log("error socket.on: ", err);
        }

        // db.getUserById(userId)
        //     .then(result => {
        //         console.log("result get user by id:", result);
        //     })
        //     .catch(err => console.log(err));
        // db.insertMessage("adi", "wys", "message", userId)
        //     .then(result => {
        //         console.log(result);
        //         io.sockets.emit("muffin", msg);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     });
    });

    // db.getLastTenChatMessages()
    //     .then(data => {
    //         io.sockets.emit("chatMessages", data.rows);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
});
