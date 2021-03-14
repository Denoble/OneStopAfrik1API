const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const stores = express();
stores.use(cors({origin: true}));
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

  /*const storeCreationValidators = [
    body('name').notEmpty().isLength({ min: 6, max: 30 }),
    body('email').notEmpty().isEmail(),
    body('phoneNumber').notEmpty(),
    body('country').notEmpty(),
    body('province').optional(),
    body('state').optional(),
    body('city').notEmpty,
    body('county').optional(),
    body('streetNumber').notEmpty(),
    body('streetName').notEmpty(),
    body('unitNumber').optional(),
    body('postalCode').notEmpty(),
    body('profileImageUrl').notEmpty(),
    body('accountType').notEmpty().isIn(["store","admin"])
  ];*/
  stores.post("add/", async (req, res) => {
    /*const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var errorArray = res.status(400).json({ errors: errors.array() });
      return errorArray;
    }*/
    const _store = req.body;
    const doc_ref = await db.collection('stores').add(_store);
    res.status(201).send(JSON.stringify(doc_ref.id));
  });
  stores.get("/:id", async (req, res) => {
	const snapshot = await admin.firestore().collection("stores").doc(req.params.id).get();

	const storeId = snapshot.id;
	const storeData = snapshot.data();

	res.status(200).send(JSON.stringify({id: storeId, ...storeData}));
  });

  stores.put("/:id", async (req, res) => {
	  const body = req.body;

	  await admin.firestore().collection('stores').doc(req.params.id).update(body);

	  res.status(200).send()
  });

  stores.delete("/:id", async (req, res) => {
	  await admin.firestore().collection("stores").doc(req.params.id).delete();

	  res.status(200).send();
  })

 exports.stores = functions.https.onRequest(stores);
