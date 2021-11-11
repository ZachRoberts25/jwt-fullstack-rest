import { firebaseConfig } from './firebase-config';
import express from 'express';
import admin from 'firebase-admin';
import { json } from 'body-parser';
import cors from 'cors';

const PORT = 5000;
const HOST = 'localhost';

const app = express();
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

const withAuthorization = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const jwt = req.headers.authorization!;
  try {
    const id = await admin.auth().verifyIdToken(jwt);
    res.locals.userId = id.uid;
  } catch {
    res.status(403).send('Unauthorized');
    return;
  }
  next();
};

app.use(cors());
app.use(json());

app.get('/authenticated', withAuthorization, (req, res) => {
  return res.send({ your: 'cool' }).status(200);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
