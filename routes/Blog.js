const router = require("express").Router();
const Data = require("../models/Data");

router.post("/blog/addblog", async (req, res) => {
  // console.log(req.body)
  try {
    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category;
    // console.log(title,body,category)
    const data = new Data({ title, body, category });
    data.save();
    res.json({
      status: "success",
      data: data,
      message: "Blog added Successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

router.get("/blogs", async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    let data = await Data.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      status: "sucess",
      data: await data,
    });
  } catch (err) { 
    res.status(500).json({
      error: err,
    });
  }
});
router.get("/blog/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Data.findOne({ _id: id });

    let body = data.body;
    var inputArray = body.split(" ");

    let result = inputArray.filter(
      (n) => n.charAt(0) === "a" || n.charAt(0) === "A"
    );
    // console.log(result)

    // just for if we need unique words array
    // let unique=[...new Set(result)];
    // console.log(unique)

    let updatedbody = await inputArray.map((n) => {
      if (n.charAt(0) === "a" || n.charAt(0) === "A") {
        let stararr;
        let rem;
        let strt;
        if (n.length == 2) {
          rem = n.split("").splice(n.length - 2);
          stararr = new Array(rem.length).fill("*");
          strt = [];
        } else {
          rem = n.split("").splice(n.length - 3);
          stararr = new Array(rem.length).fill("*");
          strt = n.split("").slice(0, n.length - 3);
        }
        let updatearr = [...strt, ...stararr];
        return updatearr.join("");
      }
      return n;
    });

    const data1 = await Data.findByIdAndUpdate(id, {
      body: updatedbody.join(" "),
    });
    // console.log(data1)

    res.json({
      status:
        "success, it updated in mongodb for checking the update go to GET- /blogs route of pagination",
      result: result,
      message: "data updated check blog in pagination ",
    });
  } catch (error) {
    res.status(400).json({
      error: error,
    });
  }
});

module.exports = router;
