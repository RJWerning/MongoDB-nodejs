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
            } catch (error) {
                reject(error);
            }
        });
    }

    return { loadData };
}

module.exports = circulationRepo();
