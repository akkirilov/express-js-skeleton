const crypto = require('../utils/crypto.js');
const User = require('../models/User');
const { salt } = require('../config/config');

const args = process.argv.slice(2);

const command = args[0];
switch (command) {
    case 'create':
        let username = args[1];
        let password = args[2];
        let email = args[3];
        if (!email) {
            email = username + '@akkdev.com';
        }
        create(username, password, email);
        break;
    case 'drop':
        let id = parseInt(args[1]);
        drop(id);
        break;
    case 'pass':
        changePass(parseInt(args[1]), args[2]);
        break;
    default:
        console.log('USAGE');
        console.log('node users.js create username password email');
        console.log('node users.js drop id');
        console.log('node users.js pass id new-pass');
        break;
}

function create(username, password, email) {
    User.findByUsername(username).then(function(targetUser) {
            if (targetUser) {
                console.log("ERROR: Username taken!");
                return;
            }
        
            password = crypto.generateHashedPassword(salt, password);
            const user = {
                username,
                password,
                email
            };
            User.create(user).then(function(newUser) {
                    console.log("INFO: Registration successful:", newUser);
                }).catch((e) => {
                    console.log("ERROR:", e);
                });
        }).catch((e) => {
            console.log("ERROR:", e);
        });
}

function drop(id) {
    console.log("INFO:Deleting user with id:", id);
    User.findById(id).then(function(targetUser) {
            if (!targetUser) {
                console.log("ERROR: User doesn't exists!");
                return;
            }

            User.drop(id).then(function(user) {
                    console.log("INFO: User deleted successful:", user);
                }).catch((e) => {
                    console.log("ERROR:", e);
                });
        }).catch((e) => {
            console.log("ERROR:", e);
        });
}

function changePass(id, password) {
    User.findById(id).then(function(targetUser) {
        if (!targetUser) {
            console.log("ERROR: User doesn't exists!");
            return;
        }
        password = crypto.generateHashedPassword(salt, password);
        User.update(id, {password}).then(function(user) {
            console.log("INFO: User updated successful:", user);
        });
    });
}
