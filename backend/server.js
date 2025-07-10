const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const crypto = require('crypto');
const cors = require('cors');

dotenv.config();

const algorithm = 'aes-256-cbc';
const secretKey = process.env.SECRET_KEY || '12345678901234567890123456789012';

function encrypt(text) {
  const iv = crypto.randomBytes(16); // 16 bytes IV
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  if (!text || !text.includes(':')) {
    throw new Error('Invalid encrypted text format');
  }

  const [ivHex, encryptedHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}


const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'PassOP';

let collection;

client.connect().then(() => {
  const db = client.db(dbName);
  collection = db.collection('passwords');

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});

app.get('/', async (req, res) => {
  const data = await collection.find({}).toArray();

  const decryptedData = data.map((item) => {
    try {
      const decrypted = decrypt(item.password);
      return { ...item, password: decrypted };
    } catch (error) {
      return { ...item, password: '[decryption failed]' }; // prevent crash
    }
  });

  res.json(decryptedData);
});


app.post('/', async (req, res) => {
  const { site, username, password } = req.body;
  const encryptedPassword = encrypt(password);
  const result = await collection.insertOne({ site, username, password: encryptedPassword });
  res.json(result);
});

app.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { site, username, password } = req.body;
  try {
    const encryptedPassword = encrypt(password);
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { site, username, password: encryptedPassword } }
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});

app.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  res.json(result);
});
