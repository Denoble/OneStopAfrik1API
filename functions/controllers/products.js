const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
//const authMiddleware = require('../authMiddleware');
const products = express();
const { body, validationResult } = require("express-validator");
//products.use(authMiddleware);
products.use(cors({ origin: true }));
const db = admin.firestore();

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
products.get("/id/:id", async (req,res) =>{
	const snapshot = await db.collection('products').doc(req.params.id).get();

	const _productId = snapshot.id;
	const _productData = snapshot.data();

	res.status(200).send(JSON.stringify({id: _productId, ..._productData}));
  });
  products.get("/storeEmail/:storeEmail", async (req,res) =>{
	const email = req.params.storeEmail
   const snapshot = await db.collection('products')
   .where("storeEmail","==",email).get();
   console.log(JSON.stringify(snapshot)
   );
   let _products = [];
   snapshot.forEach((doc) => {
	 let id = doc.id;
	 let data = doc.data();
	 _products.push({ id, ...data });
   });

   res.status(200).send(JSON.stringify(_products));
 });
products.get('/:country/:city/:category', async(req,res) =>{
  const snapshot = await db.collection("products")
                  .where("city", "==",req.params.city.toLowerCase())
                  .where("country","==",req.params.country.toLowerCase())
				  .where("category", "==",req.params.category.toLowerCase() )
				  .get()

  let _products = [];
  snapshot.forEach((doc) => {
    let id = doc.id;
    let data = doc.data();

    _products.push({ id, ...data });
  });

  res.status(200).send(JSON.stringify(_products));
});

const productCreationValidators = [
	body('category').notEmpty(),
  body('storeEmail').notEmpty().isEmail().normalizeEmail(),
  body('name').notEmpty().toLowerCase().ltrim().rtrim().isLength({ min: 3, max: 30 }),
  body('productImage').notEmpty().isURL()
  .withMessage("profile image is required"),
  body('price').notEmpty(),
  body('description').notEmpty(),
  body('number').isInt(),
  body('weight').optional(),
  body('city').notEmpty().toLowerCase().ltrim().rtrim(),
  body('country').notEmpty().toLowerCase().rtrim().ltrim(),
  body('paymentId').optional()
];
products.post("/add", productCreationValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var errorArray = res.status(400).json({ errors: errors.array() });
    return errorArray;
  }
  	const _product = req.body;
    const doc_ref = await db.collection('products').add(_product);
    res.status(201).send(JSON.stringify(doc_ref.id));

});
products.put("/update/:id",productCreationValidators, async (req, res) => {
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
		console.log(JSON.stringify(errors));
      var errorArray = res.status(400).json({ errors: errors.array() });
      return errorArray;
    }
	  const body = req.body;

	  const doc_ref = await db.collection('products').doc(req.params.id).update(body);

	  res.status(200).send(JSON.stringify(doc_ref.id));
});

products.delete("/delete/:id", async (req, res) => {
	const doc_ref = await db.collection("products").doc(req.params.id).delete();
  res.status(200).send(JSON.stringify(doc_ref.id));
})
exports.products = functions.https.onRequest(products);