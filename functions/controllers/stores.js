const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const stores = express();
const { body, validationResult } = require("express-validator");

stores.use(cors({origin: true}));
const db = admin.firestore();
stores.get('/', async (req,res) =>{
    const snapshot = await db.collection("stores").get();
    let _stores = [];
    snapshot.forEach((doc) => {
      let id = doc.id;
      let data = doc.data();

      _stores.push({ id, ...data });
    });

    res.status(200).send(JSON.stringify(_stores));
  });

  const storeCreationValidators = [
    body('name').notEmpty().isLength({ min: 2, max: 30 }),
    body('email').notEmpty().isEmail(),
    body('phoneNumber').notEmpty(),
    body('country').notEmpty(),
    body('province').optional(),
    body('state').optional(),
    body('city').notEmpty(),
    body('county').optional(),
    body('streetNumber').notEmpty(),
    body('streetName').notEmpty(),
    body('unitNumber').optional(),
    body('postalCode').notEmpty(),
    body('profileImageUrl').notEmpty(),
    body('accountType').notEmpty().isIn(["store","admin"])
  ];
  stores.post("/add",storeCreationValidators, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
		console.log(JSON.stringify(errors));
      var errorArray = res.status(400).json({ errors: errors.array() });
      return errorArray;
    }
    const _store = req.body;
	console.log(JSON.stringify(_store));
    const doc_ref = await db.collection('stores').add(_store);
    res.status(201).send(JSON.stringify(doc_ref.id));
  });
  stores.get("/id/:id", async (req, res) => {
	const snapshot = await db.collection("stores").doc(req.params.id).get();

	const storeId = snapshot.id;
	const storeData = snapshot.data();

	res.status(200).send(JSON.stringify({id: storeId, ...storeData}));
  });
  stores.get("/email/:email", async (req, res) => {
	  const email = req.params.email
	const snapshot = await db.collection("stores")
		.where("email","==",email)
		.get();
	console.log(JSON.stringify(snapshot));
	let _stores = [];
    snapshot.forEach((doc) => {
      let id = doc.id;
      let data = doc.data();

      _stores.push({ id, ...data });
    });

    res.status(200).send(JSON.stringify(_stores[0]));
  });

  stores.put("/update/:id", async (req, res) => {
	  const body = req.body;

	  await admin.firestore().collection('stores').doc(req.params.id).update(body);

	  res.status(200).send()
  });

  stores.delete("/:id", async (req, res) => {
	  await admin.firestore().collection("stores").doc(req.params.id).delete();

	  res.status(200).send();
  })

 exports.stores = functions.https.onRequest(stores);
