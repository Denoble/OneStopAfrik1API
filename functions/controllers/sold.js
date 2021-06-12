const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const admin = require("firebase-admin");
const db = admin.firestore();

//const authMiddleware = require('../authMiddleware');

const sold = express();
const { body, validationResult } = require("express-validator");
//products.use(authMiddleware);

sold.use(cors({ origin: true }));
//Get sold products sold from one store in days
sold.get("/store/:id/:days_number", async (req,res) =>{
	var today =  new Date();
	const querryDate = today.setDate(today.getDate()- parseInt(req.params.days_number));
	const snapshot = await db.collection('sold')
	.where("storeId","==",req.params.id)
	.where('createdAt', '>=',querryDate).get();
	let _products = [];
	snapshot.forEach((doc) => {
	  let id = doc.id;
	  let data = doc.data();

	  _products.push({ id, ...data });
	});

	res.status(200).send(JSON.stringify(_products));
  });

const soldProductCreationValidators = [
	body('productName').notEmpty().isLength({ min: 3, max: 30 }),
	body('productId').notEmpty(),
	body('storeEmail').notEmpty().isEmail(),
	body('productImage').notEmpty().isURL()
	.withMessage("profile image is required"),
	body('price').notEmpty(),
	body('description').notEmpty(),
	body('number').isInt(),
	body('weight').optional(),
	body('city').notEmpty(),
	body('country').notEmpty(),
	body('quantitySold').notEmpty().isInt(),
	body('paymentId').optional()
];
sold.post("/add", soldProductCreationValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var errorArray = res.status(400).json({ errors: errors.array() });
    return errorArray;
  }
  	const _product = req.body;
    const doc_ref = await db.collection('sold').add(_product);
    res.status(201).send(JSON.stringify(doc_ref.id));
});
sold.put("/update/:id", async (req, res) => {
  const body = req.body;

  await db.collection('sold').doc(req.params.id).update(body);

  res.status(200).send()
});

sold.delete("delete/:id", async (req, res) => {
  await db.collection("sold").doc(req.params.id).delete();
  res.status(200).send();
})
exports.sold = functions.https.onRequest(sold);