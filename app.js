const express = require("express");
const bodyParser = require("body-parser");
const Airtable = require("airtable");
require("dotenv").config();

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

const app = express();
const base = Airtable.base("app85TLAmh2QmZ9Ml");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// mongoose.connect("mongodb://localhost:27017/blogApi", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const blogSchema = {
//   title: String,
//   content: String,
// };

// const Blog = mongoose.model("Blog", blogSchema);

app.get("/", function (req, res) {
  res.send("Hello World!");
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
