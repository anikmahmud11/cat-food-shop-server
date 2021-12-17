const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eyzns.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {
    try {
        await client.connect()
        const database = client.db('cat-shop');
        const productCollection = database.collection('products')
        const orderCollection = database.collection('orders')

       //GET Products API
       app.get('/products', async (req, res) => {
        const cursor = productCollection.find({});
        const products = await cursor.toArray();
        res.send(products);

        //Add order
        app.post('/orders', async (req, res) => {

            const order = req.body;
            console.log('order', order);
            const result = await orderCollection.insertOne(order);
            res.json(result);

        });


    });

        console.log('connected to database');
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('cat server running')
})

app.listen(port, () => {
    console.log('cat Server running at port', port);
})