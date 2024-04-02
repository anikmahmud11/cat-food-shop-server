const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const res = require("express/lib/response");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eyzns.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("cat-shop");
    const productCollection = database.collection("products");
    const orderCollection = database.collection("orders");
    const reviewCollection = database.collection("review");
    const userCollection = database.collection("users");

    //GET Products API
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    //Add order
    app.post("/orders", async (req, res) => {
      const order = req.body;
      console.log("order", order);
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });
    //Delete order Api
    app.delete("/orders/:id", async (req, res) => {
      var ObjectId = require("mongodb").ObjectID;
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      console.log("deleted", result);

      res.json(result);
    });

    //GET order API
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });
    //Add review
    app.post("/review", async (req, res) => {
      const review = req.body;
      console.log("review", review);
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });
    //GET review API
    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find({});
      const review = await cursor.toArray();
      res.send(review);
    });
    //add user API
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });
    // //upsert
    // app.put('/users', async (req, res) => {
    //     const user = req.body;
    //     console.log('put',user);
    //     const filter = { email: user.email };
    //     const option = { upsert: true };
    //     const updateDoc = { $set: user };
    //     const result = await userCollection.updateOne(filter,updateDoc,option);
    //     res.json(result);
    // })
    //add Products API
    app.post("/products", async (req, res) => {
      const product = req.body;
      console.log("product", product);
      const result = await productCollection.insertOne(product);
      res.json(result);
    });

    //Add form
    app.post("/submit-form", async (req, res) => {
      const formData = req.body;
      console.log("Form Data:", formData);
      const result = await reviewCollection.insertOne(formData);
      res.json(result);
    });

    console.log("connected to database");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("cat server running");
});

app.listen(port, () => {
  console.log("cat Server running at port", port);
});
