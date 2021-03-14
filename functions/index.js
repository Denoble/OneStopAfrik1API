const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
admin.initializeApp();
const users = require('./controllers/users')
const stores = require('./controllers/stores')
const products = require('./controllers/products')

 exports.users = users.users;
 exports.stores = stores.stores;
 exports.products = products.products;