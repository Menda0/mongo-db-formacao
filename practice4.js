const inquirer = require('inquirer');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/mycontacts";

const client = new MongoClient(url, {useUnifiedTopology: true});
client.connect();
const database = client.db("mycontacts");

const getCollections = async () => {
    const collections = await database.listCollections().toArray();
    const collectionsName = [];
    for (let i in collections) {
        collectionsName.push(collections[i].name);
    }
    return collectionsName
};

const complexSearch = (collection) => {
    inquirer
        .prompt([
            {
                type: 'number',
                name: 'age',
                message: "Contact age",
            },
            {
                type: 'input',
                name: 'city',
                message: "Contact city",
            }
        ]).then(async (answers) => {
            const docs = await collection.find({
                "$or": [
                    {city: answers.city},
                    {age: {"$eq": answers.age}}
                ]
            }).toArray();
            console.table(docs);
            options()
        }
    ).catch(error => console.log(error))
};

const simpleSearch = (collection) => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: "Type contact name",
            }
        ]).then(async (answers) => {
            const docs = await collection.find({name: answers.name}).toArray();
            console.table(docs);
            options()
        }
    ).catch(error => console.log(error))
};

const list = async (collection) => {
    const docs = await collection.find().toArray();
    console.table(docs);
    options();
};

const options = async () => {
    const collections = await getCollections();

    inquirer
        .prompt([
            {
                type: 'rawlist',
                name: 'collection',
                message: "Select folder",
                choices: collections
            },
            {
                type: 'rawlist',
                name: 'action',
                message: 'Action',
                choices: ['List all', 'Simple Search', 'Complex Search'],
            }
        ]).then(async (answers) => {

            const collection = database.collection(answers.collection);

            switch (answers.action) {
                case "List all":
                    list(collection);
                    break;
                case "Simple Search":
                    simpleSearch(collection);
                    break;
                case "Complex Search":
                    complexSearch(collection);
                    break;
                default:
                    options();
            }
        }
    ).catch(error => console.log(error))
};

options();
