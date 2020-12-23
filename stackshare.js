const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios')
// const fs = require('fs');
const Airtable = require('airtable')
require('dotenv').config()
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

let airtableRecords = []



const getAirtableTechRecords = async () => {
  base('Technologies').select({
    // maxRecords: 3,
    view: "NoDesc"
}).eachPage(function page(records, fetchNextPage) {

    records.forEach(function(record) {
      airtableRecords.push(
        {
          id: record.id,
          technology: record.get('Technology'),
          description: ""
        }
      );
    })
  fetchNextPage();
}, function done(err) {
    if (err) { console.error(err); return; }
    console.log({airtableRecords})
    updateTechDescriptionsInArray()
});

}


const updateTechDescriptionsInArray = async () => {
  airtableRecords.forEach(record => {
    console.log(record)
    let technology = record.technology
    // console.log(technology)
    getTechnologyData(record.id, technology)
  })
}

const getTechnologyData = async (id, service) => {
  console.log("getting technology Data")
  let description = ""
  service = service.toLowerCase()
    .split(" ").join("-")
    .split(".net").join("dot-net")
    .split(".js").join("-js")
  let url = `https://stackshare.io/${service}`
  await axios.get(url, { validateStatus: (status) => status === 200 })
  // let description = fs.readFileSync(`./technologies/${service}`)
  .then(async (res) => {
    console.log(res.data)
    let resp = await res.data
    try {
      description = await resp.split('What is')[1].replace(`">`, `|||`).split('|||')[1].split('</div>')[0]
      console.log(description)
      // fs.writeFileSync(`./technologies/${service}.txt`, description);
        airtableRecords.forEach(record => {
      if (record.id == id) {
        record.description = description
      }
    })
    } catch {
      description = ""
    }
  }).then(() => {
    updateAirtableRecords()
  }).catch(async (err) => {
    console.error(await err); 
    description = ""
  })
}

const updateAirtableRecords = async () => {
  airtableRecords.forEach(record => {
    if (record.description) {

      console.log(`updating ${record.technology} in Airtable`)
      base('Technologies').update([
        {
          "id": record.id,
          "fields": {
            "Description": record.description
      }
    },
  ], function(err, records) {
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function(record) {
      console.log('updated',record.id);
    });
  });
    } else {
      console.log(`NOT updating ${record.technology} in Airtable`)
}
})
}


const start = () => {
  console.log('Getting records from Airtable')
  getAirtableTechRecords()
}

start()


app.get('/', (req, res) => {
  res.send("Hello World")
})


app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})