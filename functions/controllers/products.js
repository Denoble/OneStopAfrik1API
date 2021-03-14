const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
const db = admin.firestore();

//const authMiddleware = require('../authMiddleware');

const products = express();
//const { body, validationResult } = require("express-validator");
//products.use(authMiddleware);

products.use(cors({ origin: true }));

products.get('/:country/:city', async(req,res) =>{
  const snapshot = await db.collectionGroup("products")
                  .where("country", "==",req.params.country)
                  .where("city","==",req.params.city).get()

  let _products = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();

    _products.push({ id, ...data });
  });

  res.status(200).send(JSON.stringify(_products));
});

products.get('/', async (req,res) =>{
  const snapshot = await db.collection("products").get();

  let _products = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();

    _products.push({ id, ...data });
  });

  res.status(200).send(JSON.stringify(_products));
});
//Get one product
products.get("/product/:id", async (req,res) =>{
  const snapshot = await db.collection('products').doc(req.params.id).get();

  const _productId = snapshot.id;
  const _productData = snapshot.data();

  res.status(200).send(JSON.stringify({id: _productId, ..._productData}));
});
//Get product from one store
products.get("/products/store/:id", async (req,res) =>{
  const snapshot = await db.collectionGroup('products')
  .where("storeId","==",req.params.id).get();

  let _products = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();

    _products.push({ id, ...data });
  });

  res.status(200).send(JSON.stringify(_products));
});
/*const productCreationValidators = [
  body('storeId').notEmpty(),
  body('name').notEmpty().isLength({ min: 6, max: 30 }),
  body('productImage').notEmpty().withMessage("profile image is required")
  .isMagnetURI().withMessage('not an image uri'),
  body('price').notEmpty().isDecimal,
  body('description').notEmpty(),
  body('number').optional().isIn(),
  body('weight').optional(),
  body('paymentId').optional
];*/
products.post("add/", products, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var errorArray = res.status(400).json({ errors: errors.array() });
    return errorArray;
  }
  const _product = req.body;

  await db.collection('products').add(_product);

  res.status(201).send();
});
products.put("/update/:id", async (req, res) => {
  const body = req.body;

  await db.collection('products').doc(req.params.id).update(body);

  res.status(200).send()
});

products.delete("/delete/:id", async (req, res) => {
  await db.collection("products").doc(req.params.id).delete();
  res.status(200).send();
})
exports.products = functions.https.onRequest(products);