const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const circulationRepo = require('./repos/circulationRepo');
const data = require('./circulation.json');

const url = 'mongodb://localhost:27017';
const dbName = 'circulation';

async function main() {
    const client = new MongoClient(url);
    await client.connect();

    // Wrap the tests in a try/finally, asserts toss errors so the cleanup won't occur
    //  without the finally block
    try {
        // Wire up our app.js so it's more of a test harness for our repository, so we'll use
        //  assert to test that everything worked correctly.
        // Note: course uses assert.equal, but this gives a warning as it's been deprecated.
        //  So I chose to go with the new way of strictEqual which may cause me issues later
        const results = await circulationRepo.loadData(data);
        assert.strictEqual(data.length, results.insertedCount);

        // Get all records
        const getData = await circulationRepo.get();
        assert.strictEqual(data.length, getData.length);

        // Get 1 record
        const filterData = await circulationRepo.get({ Newspaper: getData[4].Newspaper });
        // need to do deepStringEqual here, otherwise get an error. Need to compare object contents
        // AssertionError [ERR_ASSERTION]: Values have same structure but are not reference-equal:
        assert.deepStrictEqual(filterData[0], getData[4]);

        // Get with a limit of 3 records
        const limitData = await circulationRepo.get({}, 3);
        assert.strictEqual(limitData.length, 3);

        // GetById
        const id = getData[4]._id.toString();
        const byId = await circulationRepo.getById(id);
        assert.deepStrictEqual(byId, getData[4], 'GetById');

        // Add an item
        const newItem = {
            Newspaper: 'My Paper',
            'Daily Circulation, 2004': 1,
            'Daily Circulation, 2013': 200,
            'Change in Daily Circulation, 2004-2013': 200,
            'Pulitzer Prize Winners and Finalists, 1990-2003': 0,
            'Pulitzer Prize Winners and Finalists, 2004-2014': 0,
            'Pulitzer Prize Winners and Finalists, 1990-2014': 0,
        };
        const addedItem = await circulationRepo.add(newItem);
        // if it has an _id it was added, otherwise it failed
        assert.strict(addedItem._id);
        const addedItemQuery = await circulationRepo.getById(addedItem._id);
        assert.deepStrictEqual(addedItemQuery, addedItem);

        const updatedItem = await circulationRepo.update(addedItem._id, {
            ...addedItem,
            Newspaper: 'Richs Newspaper',
        });
        // This assert fails, even though it's looking at the updatedItem that was returned
        assert.deepStrictEqual(updatedItem.Newspaper, 'Richs Newspaper');

        const updatedItemQuery = await circulationRepo.getById(updatedItem._id);
        console.log('updatedItemQuery', updatedItemQuery);
        assert.deepStrictEqual(updatedItemQuery.Newspaper, 'Richs Newspaper');

        const removed = await circulationRepo.remove(addedItem._id);
        assert.strict(removed);

        const removedQuery = await circulationRepo.getById(addedItem._id);
        assert.strictEqual(removedQuery, null);
    } catch (error) {
        console.log(error);
    } finally {
        // admin object allows us to do introspection on our server
        const admin = client.db(dbName).admin();

        // For the sake of testing, we're going to drop the database after we load it.
        // Otherwise we'll keep adding & updating records every time.
        await client.db(dbName).dropDatabase();
        console.log(await admin.listDatabases());

        client.close();
    }
}

main();
