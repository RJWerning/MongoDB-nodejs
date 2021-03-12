const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'circulation';

// A function that creates an object is known as Revealing Module pattern in Javascript
function circulationRepo() {
    function loadData(data) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);
                results = await db.collection('newspapers').insertMany(data);
                resolve(results);
                client.close();
            } catch (error) {
                reject(error);
            }
        });
    }

    function get() {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);

                // Find is simply a cursor, doesn't actually return items.
                const items = db.collection('newspapers').find();

                // This must be await as this is where the work is done, not at the find()
                resolve(await items.toArray());
                client.close();
            } catch (error) {
                reject(error);
            }
        });
    }

    // function get() {
    //     return new Promise(async (resolve, reject) => {
    //         const client = new MongoClient(url);
    //         try {
    //             await client.connect();
    //             const db = client.db(dbName);
    //             ...
    //             client.close();
    //         } catch (error) {
    //             reject(error);
    //         }
    //     });
    // }

    return { loadData, get };
}

module.exports = circulationRepo();
