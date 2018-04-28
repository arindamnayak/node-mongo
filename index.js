const express = require('express');
const app = express();
const bodyParser= require('body-parser')
const sample_user = { name: "Test User1", email: "test@user1.com", dob: "1/1/2017", address: [{ add_line1: "4, soc", city: "pnq", state: "MH"}]}


const customer_schema = {
  bsonType: "object",
  required: ["name", "email", "dob"],
  additionalProperties: false,
  properties:
    {
      _id: {},
      name: {
        bsonType: "string",
        description: "'name' is required and is a string"
      },
      email: {
        bsonType: "string",
        description: "'email' is required and is a string"
      },
      dob: {
        bsonType: "string",
        description: "'dob' is required and is a string"
      },
      address: 
      {
        bsonType: ["array"],
        minItems: 1,
        maxItems: 50,
        items: {
          bsonType: ["object"],     
          required: ["add_line1", "city", "state"],
          additionalProperties: false,
          description: "'address' must contain the stated fields.",
          properties: 
          {
            add_line1: {
              bsonType: "string",
              description: "'add_line1' is required and is of string type"
                    },
            city: {
              enum: ["pnq", "hyd", "blr", "del", "mum", "kol"],
              description: "'city' is required and can only be one of the given enum values"
                    },
            state: {
              enum: ["MH", "KA", "TN", "DL", "KL"],
              description: "'state' is required and is a string"
                  }
          }
      }
   }
  }
}
app.use(bodyParser.urlencoded({extended: true}))
const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
  if (err) return console.log(err)
  db = client.db('dev_v1') // whatever your database name is
  db.createCollection( "customer",  {
    validator:{
      $jsonSchema: customer_schema
    }
  })
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

app.get('/', (req, res) => {
  db.collection('customer').find().toArray(function(err, results) {
    res.send(results)
  })
})

app.post('/customer', (req, res) => {
  console.log(req.body)
  db.collection('customer').save(req.body, (err, result) => {
      if (err) {
        console.log(err)
        res.send(err)
      }
      else{
        console.log('saved to database')
        res.send(result)  
      }
    })
})

app.get('/customer-static', (req, res) => {
  db.collection('customer').save(sample_user, (err, result) => {
      if (err) {
        console.log(err)
      }

      console.log('saved to database')
      res.send(result)
    })
})

app.post('/data', function(req, res) {
  // get posts
  res.json(JSON.stringify(req.body))
});