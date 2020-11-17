/*
* === GOAL ===
* Create a command line interface to create and list and remove contacts from folders
* Every contact folder should be a container
* Selected a folder
* Now you can create list and remove contacts from that folder
* */

const inquirer = require('inquirer');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/contacts";

const client = new MongoClient(url, {useUnifiedTopology: true});
client.connect();

const options = async function () {

    const database = client.db("contacts");

    const collections = await database.listCollections().toArray();
    const collectionsName = [];
    for (let i in collections) {
        collectionsName.push(collections[i].name);
    }

    inquirer
        .prompt([
            {
                type: 'rawlist',
                name: 'name',
                message: "Select folder",
                choices: collectionsName
            },
            {
                type: 'rawlist',
                name: 'action',
                message: 'Action',
                choices: ['List', 'Create', 'Remove'],
            }
        ]).then(async function (answers) {

        const folderName = answers["name"];

        switch (answers['action']) {
            case "List":
                list(folderName);
                break;
            case "Create":
                create(folderName);
                break;
            case "Remove":
                remove(folderName);
                break;
            default:
                options();
        }
    })
        .catch(error => {
            console.log(error);
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
            } else {
                // Something else when wrong
            }
        });
};

const create = async function (folder) {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: "Contact name"
            }
        ])
        .then(async function (answers) {
            // await client.connect();

            const database = client.db("contacts");
            const collection = database.collection(folder);
            const name = answers["name"];
            const output = await collection.insertOne({name});

            console.log(`Contact create successfully with name ${name}`);
            options();
        })
        .catch(error => {
            console.log(error);
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
            } else {
                // Something else when wrong
            }
        });
};

const list = async function (folder) {
    // await client.connect();

    const database = client.db("contacts");
    const collection = database.collection(folder);

    const output = await collection.find().toArray({});
    for (let i in output) {
        console.log(output[i]);
    }

    options();
};

const remove = async function (folder) {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: "Contact Name"
            }
        ])
        .then(async function (answers) {

            const database = client.db("contacts");
            const collection = database.collection(folder);
            const name = answers["name"];
            const output = await collection.removeOne({name});

            console.log(`Contact removed successfully`);
            options();
        })
        .catch(error => {
            console.log(error);
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
            } else {
                // Something else when wrong
            }
        });
};

options();
