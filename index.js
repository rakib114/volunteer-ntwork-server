const express = require('express')
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express()
// console.log(process.env.DB_USER);
const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.irvi8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    // console.log('connection error', err)
    const eventCollection = client.db("volunteer").collection("events");
    app.post('/addEvent', (req, res) => {
        const newEvent = req.body;
        console.log('New Event', newEvent);
        eventCollection.insertOne(newEvent)
            .then(result => {
                console.log(result.acknowledged)
                res.send(result.acknowledged === true);
            })
    })

    app.get('/events', (req, res) => {
        eventCollection.find()
            .toArray((error, iteams) => {
                res.send(iteams);
            })
    })
    app.delete('/deletEvent/:id', (req, res) => {
        const id = ObjectId(req.params.id)
        console.log('delet this', id);
        eventCollection.findOneAndDelete({ _id: id });
    })
    // client.close();
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port);