/*
* === GOAL ===
* Create a command line interface to create and list and remove contact folders
* Every contact folder should be a container
* Create a command to create
* Create a command to list
* Create a command to remove
* */

const inquirer = require('inquirer');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/contacts";

const client = new MongoClient(url, {useUnifiedTopology: true});
client.connect();

const options = () => {
    inquirer
        .prompt([
            {
                type: 'rawlist',
                name: 'action',
                message: 'Action',
                choices: ['List', 'Create', 'Remove'],
            },
        ])
        .then(function (answers) {
            switch (answers['action']) {
                case "List":
                    listFolder();
                    break;
                case "Create":
                    createContactFolder();
                    break;
                case "Remove":
                    removeFolder();
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

const removeFolder = async function() {
    const database = client.db("contacts");

    const collections = await database.listCollections().toArray();
    const collectionsName = [];
    for(let i in collections){
        collectionsName.push(collections[i].name);
    }

    inquirer
        .prompt([
            {
                type: 'rawlist',
                name: 'name',
                message: "Select folder to be deleted",
                choices: collectionsName
            }
        ])
        .then(async function (answers) {

            const folderName = answers["name"];
            const output = await database.dropCollection(folderName);

            console.log(`Contact folder dropped successfully with name ${folderName}`);
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

const listFolder = async function () {
    const database = client.db("contacts");

    const collections = await database.listCollections().toArray();
    for(let i in collections){
        console.log(collections[i].name)
    }

    options();
};

const createContactFolder = function () {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: "Contact folder name"
            }
        ])
        .then(async function (answers) {

            const database = client.db("contacts");
            const folderName = answers["name"];
            const output = await database.createCollection(folderName);

            console.log(`Contact folder create successfully with name ${folderName}`);
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
