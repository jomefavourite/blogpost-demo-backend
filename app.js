"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const Airtable = require("airtable");
const path = require("path");
const serverless = require("serverless-http");
require("dotenv").config();

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

const app = express();
const base = Airtable.base("app85TLAmh2QmZ9Ml");

router.get("/another", (req, res) => res.json({ route: req.originalUrl }));
router.post("/", (req, res) => res.json({ postBody: req.body }));

// app.use(bodyParser.json());

module.exports = app;
module.exports.handler = serverless(app);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/.netlify/functions/server", router); // path must route to lambda

app.get("/", function (req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello from Express.js!</h1>");
  res.end();
});

app.get("/blogs", (req, res) => {
  // Blog.find({}, (err, blog) => {
  //   if (err) {
  //     res.send(err);
  //   } else {
  //     res.send(blog);
  //   }
  // });
  base("posts")
    .select({
      view: "Grid view",
    })
    .eachPage(
      (records) => {
        records.forEach((record) => {
          console.log("Retrieved", record);
        });
        res.send(records);
        return;
      },
      function done(err) {
        if (err) {
          res.send(err);
          return;
        }
      }
    );
});

app.get("/blogs/:id", (req, res) => {
  // Blog.find({ title: req.params.id }, (err, blog) => {
  //   if (err) {
  //     res.send(err);
  //   } else {
  //     res.send(blog);
  //   }
  // });

  base("posts").find("recx8rVa0C0fDKrPP", function (err, record) {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Retrieved", record.id);
  });
});

app.post("/blogs", (req, res) => {
  const title = req.body.title;
  const body = req.body.body;

  const blog = new Blog({
    title: title,
    body: body,
  });

  // blog.save((err) => {
  //   if (err) {
  //     res.send(err);
  //   } else {
  //     res.send("blog added!");
  //   }
  // });

  base("posts").create(
    [
      {
        fields: {
          title,
          body,
        },
      },
    ],
    function (err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function (record) {
        console.log(record.getId());
      });
    }
  );
});

app.delete("/blogs", (req, res) => {
  const title = req.body.title;

  // Blog.deleteOne({ tilte: title }, (err, blog) => {
  //   if (err) {
  //     res.send(err);
  //   } else {
  //     res.send("blog deleted!");
  //   }
  // });
});

app.listen(3001, () => {
  console.log("listening on http://localhost:3001");
});

module.exports = app;
module.exports.handler = serverless(app);
