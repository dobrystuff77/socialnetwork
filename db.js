const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

exports.addUser = function(first, last, email, password, picture_url, bio) {
    return db.query(
        `INSERT INTO users (first, last, email, password, picture_url, bio)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`, ///zapobiega atakom  //
        [first, last, email, password, picture_url || null, bio || null]
    );
};

exports.getUser = function(email) {
    return db.query(`SELECT * FROM users WHERE email = $1`, [email]);
};

exports.getUserById = function(id) {
    return db.query(`SELECT * FROM users WHERE id = $1`, [id]);
};

/////////////////////////////////////////////////////////////////////////////
exports.reset = function(email, emailcode) {
    return db.query(
        `INSERT INTO reset (email, emailcode)
        VALUES ($1, $2)
        RETURNING emailcode`,
        [email, emailcode]
    );
};

exports.deleteEmailAndCode = function(email) {
    return db.query(
        `DELETE FROM reset
        WHERE email = $1`,
        [email]
    );
};

//////////////////////////////////////////////////////////////////////////
exports.getResetCode = function(email) {
    return db.query(
        `SELECT * FROM reset
            WHERE email=$1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`,
        [email]
    );
};

exports.updatePassword = function(email, password) {
    return db.query(
        `UPDATE users SET password =$2
        WHERE email = $1`,
        [email, password]
    );
};
//////////////////////////////////////////////////////////////////////////////
exports.updateImage = function(email, picture_url) {
    return db.query(
        `UPDATE users SET picture_url =$2
        WHERE email = $1`,
        [email, picture_url]
    );
};

exports.updateBio = function(email, bio) {
    return db.query(
        `UPDATE users SET bio =$2
        WHERE email = $1`,
        [email, bio]
    );
};
////////////////////////////////////////////////////////////////////////////////
//Users
exports.getUsersByName = function(first) {
    return db
        .query(
            `SELECT first, last, picture_url, id FROM users WHERE first ILIKE $1;`,
            [first + "%"]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.getNewestUsers = function() {
    return db
        .query(
            `SELECT first, last, picture_url, id FROM users
            ORDER BY id DESC
            LIMIT 8`
        )
        .then(({ rows }) => {
            return rows;
        });
};
////////////////////////////////////////////////////////////////////////////////
// FRIEND BUTTON
exports.friendsStatus = function(recipient_id, sender_id) {
    return db
        .query(
            `SELECT * FROM friendships
             WHERE recipient_id = $1 AND sender_id = $2
             OR recipient_id = $2 AND sender_id = $1;`,
            [recipient_id, sender_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.addFriend = function(recipient_id, sender_id) {
    return db.query(
        `INSERT INTO friendships (recipient_id, sender_id)
        VALUES ($1, $2)
        `,
        [recipient_id, sender_id]
    );
};

exports.cancel = function(recipient_id, sender_id) {
    return db.query(
        `DELETE FROM friendships
        WHERE recipient_id = $1 AND sender_id = $2
        OR recipient_id = $2 AND sender_id = $1`,
        [recipient_id, sender_id]
    );
};

exports.update = function(recipient_id, sender_id) {
    return db.query(
        `UPDATE friendships SET accepted = true
        WHERE recipient_id = $1 AND sender_id = $2
        `,
        [recipient_id, sender_id]
    );
};
////////////////////////////////////////////////////////////////////////////////
//MORE PICTURES
exports.insertPictures = function(picture, user_id) {
    return db.query(
        `INSERT INTO pictures
        (picture, user_id)
        VALUES ($1, $2)
        `,
        [picture, user_id]
    );
};

exports.selectAllPictures = function(user_id) {
    return db
        .query(
            `SELECT * FROM pictures
            WHERE user_id = $1
            ORDER BY id DESC
            `,
            [user_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.selectFriendsWonnabes = function(user_id) {
    return db
        .query(
            `
      SELECT users.id, first, last, picture_url, accepted
      FROM friendships
      JOIN users
      ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
      OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
      OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
  `,
            [user_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.selectFriends = function(user_id) {
    return db
        .query(
            `
      SELECT users.id, first, last, picture_url, accepted
      FROM friendships
      JOIN users
      ON (accepted = true AND recipient_id = $1 AND sender_id = users.id)
      OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
  `,
            [user_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.insertMessage = function(first, last, message, user_id) {
    return db
        .query(
            `INSERT INTO chat (first, last, message, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
            [first, last, message, user_id]
        )
        .then(({ rows }) => rows);
};
exports.getMessages = function() {
    return db
        .query(
            `SELECT chat.id, chat.user_id, chat.message, chat.created_at, users.first, users.last, users.picture_url FROM chat
            JOIN users
            ON
            chat.user_id = users.id
            ORDER BY chat.id DESC
            LIMIT 10`
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.selectOnlineUsers = onlineUsers => {
    return db
        .query(
            `SELECT id, first, last, picture_url
            FROM users
            WHERE id = ANY ($1)`,
            [onlineUsers]
        )
        .then(({ rows }) => rows);
};
