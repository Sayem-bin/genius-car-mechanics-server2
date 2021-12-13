const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const cors = require('cors')
require('dotenv').config()


const app = express();
const port = 5000;

// MidleWare
app.use(cors())
app.use(express.json())


//User Name
// Genius2
// Pass Wi8daWiv2GXgOm26 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uv3sk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("Mechanic");
        const servicesCollection = database.collection("services2");

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET SINGLE Service

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('specific service', id)
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            res.json(service);
        })
        // Delete API

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query);
            res.json(result);

        })

        //POST API

        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the API', service)
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });

        // console.log('connected to database')
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('hi there')
})

app.listen(port, () => {
    console.log('this is port', port)
})