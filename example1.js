const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/contacts";

const client = new MongoClient(url);

async function run() {
    try {
        await client.connect();

        const database = client.db("mydbs");
        const collection = database.collection('contacts');

        // const output1 = await collection.insert({"name":"My Contact1"});
        // console.log(output1);

        const output2 = await collection.insert([{"name":"My Contact2"}, {"name":"My Contact3"}, {"name":"My Contact4"}]);
        console.log(output2);

        // const output3 = await collection.insertOne([{"name":"My Contact1"}, {"name":"My Contact2"}, {"name":"My Contact3"}]);
        // console.log(output3);
        //
        // const output4 = await collection.insertMany([{"name":"My Contact1"}, {"name":"My Contact2"}, {"name":"My Contact3"}]);
        // console.log(output4);

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

run().catch(console.dir);
