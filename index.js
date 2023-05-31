const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();


// middlewate
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('server is running')
});



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@simple-crud-server.g8zjk15.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const chocolateCollection = client.db('chocolateDB').collection('chocolates')

        app.get('/chocolates', async (req, res) => {
            const cursor = chocolateCollection.find();
            const chocolates = await cursor.toArray();
            res.send(chocolates);
        })

        app.get('/chocolates/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await chocolateCollection.findOne(query);
            res.send(result);

        })

        app.post('/chocolates', async (req, res) => {
            const chocolate = req.body;
            const result = await chocolateCollection.insertOne(chocolate);
            res.send(result);
        });

        app.put('/chocolates/:id', async (req, res) => {
            const id = req.params.id;
            const loadedData = req.body;

            const query = { _id: new ObjectId(id) }
            const chocolate = {
                $set: {
                    name: loadedData.name,
                    counrty: loadedData.counrty,
                    category: loadedData.category,
                    photo: loadedData.photo,

                }
            }
            const options = { upsert: true };
            const result = await chocolateCollection.updateOne(query, chocolate, options)
            res.send(result);

        });

        app.delete('/chocolates/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await chocolateCollection.deleteOne(query);

            res.send(result);
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log('server is running on ', port)
});

