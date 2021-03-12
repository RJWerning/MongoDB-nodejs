# MongoDB

## Using MongoDB with Node.js - Jonathan Mills

    https://app.pluralsight.com/course-player?courseId=c026f1ed-8078-4b78-9064-1a2626d8e8a5

### Chapter 2: Getting MongoDB Running

-   Setting the stage
    Scenario > updates for Globomantics
    https://www.pluralsight.com/teach/author-tools/globomantics/index
    Add a newspaper repository for articles

-   Installing MongoDB
    https://www.mongodb.com/try/download/community
    Used all default settings during install

    Once it's installed, should be able to execute from the command line

    > mongod

    If it doesn't work, likely need to add the path to environment variables
    Also needed to create a data folder > c:\data\db

-   Created new project for VSCode
    created > C:\development\mongoDB-nodejs
    Created new project on GitHub

    > git clone https://github.com/RJWerning/MongoDB-nodejs.git

    > npm init
    > npm install mongodb
    > For the course he installs 3.4.0, I installed latest at 3.6.4

    Add new file app.js - this will be used to test connection and populate data

    // admin object allows us to do introspection on our server
    const admin = client.db(dbName).admin();
    console.log(await admin.serverStatus());
    console.log(await admin.listDatabases());

-   Loading Data
    // A function that creates an object (ie circulationRepo) is known as Revealing Module pattern in Javascript
    function circulationRepo() {
    function loadData(data) {
    ...
    }

    return { loadData };
    }
