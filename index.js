const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const Airtable = require("airtable");
require("dotenv").config();
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

let techItems = [];

let tech = fs.readdirSync("./technologies/");
tech.forEach((item) => {
  techItems.push(item.split(".")[0]);
});

const getAirtableTechRecords = async () => {
  base("Technologies")
    .select({
      // Selecting the first 3 records in All:
      // maxRecords: 3,
      view: "NoDesc",
    })
    .eachPage(
      function page(records, fetchNextPage) {
        records.forEach((record) => {
          try {
            let technology = record
              .get("Technology")
              .toLowerCase()
              .split(" ")
              .join("-")
              .split(".net")
              .join("dot-net")
              .split(".js")
              .join("-js");
            if (techItems.includes(technology)) {
              console.log("MATCH", technology);
              // let techDescription = fs.readFileSync(`./technologies/${service}.txt`)
              let description = fs.readFileSync(
                `./technologies/${technology}.txt`,
                "utf8"
              );
              console.log(description);
              base("Technologies").update(
                [
                  {
                    id: record.id,
                    fields: {
                      Description: description,
                    },
                  },
                ],
                function (err, records) {
                  if (err) {
                    console.error(err);
                    return;
                  }
                  records.forEach(function (record) {
                    console.log("updated", record.id);
                  });
                }
              );
            } else {
              console.log('')
            }
          } catch (error) {
            console.log(error)
          }
        });
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
};

const start = () => {
  console.log("Getting records from Airtable");
  getAirtableTechRecords();
};

// start();

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
