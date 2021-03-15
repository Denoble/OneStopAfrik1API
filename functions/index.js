const admin = require("firebase-admin");
admin.initializeApp();
const users = require('./controllers/users')
const stores = require('./controllers/stores')
const products = require('./controllers/products')

 exports.users = users.user;
 exports.stores = stores.stores;
 exports.products = products.products;