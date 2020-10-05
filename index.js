const express = require('express')
const bodyParser = require('body-parser')
const cors= require('cors')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;

const app = express()
const port = 5000
app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xtjxl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db('ema-jhon-simple').collection('emaJhonSimple');
  const orderCollection = client.db('ema-jhon-simple').collection('orders');

  app.post('/addProduct', (req, res)=>{
    const products = req.body;

    productsCollection.insertMany(products)
    .then(result =>{
      console.log(result.insertedCount)
      res.send("send data");
    })
  })

  app.get('/products', (req, res)=>{
    productsCollection.find({})
    .toArray((err, documents)=>{
      
      res.send(documents);
       })
  })

  



  app.get('/product/:key', (req, res)=>{
    productsCollection.find({key : req.params.key})
    .toArray((err, documents)=>{
    
      res.send(documents[0]);
    })
  })

  app.post('/showSomeProducts', (req, res)=>{
    const productKey= req.body;
    productsCollection.find({key:{$in: productKey}})
    .toArray((ree, documents)=>{
      res.send(documents);
    })
  })

  app.post('/addOrders', (req, res)=>{
    const orders = req.body;

    orderCollection.insertOne(orders)
    .then(result =>{
      console.log(result.insertedCount)
      res.send(result.insertedCount>0)
    })
  })

  console.log("database connected");

});

app.get('/', (req, res) => {
  res.send('hello ema')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})