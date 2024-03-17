// profile.js

const express = require("express")
const path = require("path")
const fs = require("fs")

const app = express()
const PORT = 3000

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))
app.use(express.static(__dirname + "/public"))
app.get("/profile", function (req, res) {
  let id = req.query.id

  const titleData = fs.readFileSync(
    path.join(__dirname, "private", id, "title.txt"),
    "utf8"
  )
  const titleDataLines = titleData.split("\n")
  const title = titleDataLines[0]

  titleDataLines.shift()
  const titleDescription = titleDataLines.join(" ")

  const bioData = fs.readFileSync(
    path.join(__dirname, "private", id, "bio.txt"),
    "utf8"
  )

  const bioDataArray = bioData.split("\n")

  const folderPath = path.join(__dirname, "private", id, "reviews")

  // Create an array of promises for reading files
  const filePromises = []

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading folder:", err)
      return res.status(500).send("Error reading folder")
    }

    files.forEach((file) => {
      const filePath = path.join(folderPath, file)
      const promise = new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            console.error("File read error:", err)
            reject(err)
          } else {
            resolve(data)
          }
        })
      })
      filePromises.push(promise)
    })

    // Waiting for all the promises to be finalized
    Promise.all(filePromises)
      .then((reviewsData) => {
        // Send data to EJS template after reading all files
        res.render("profile", {
          id: id,
          title: title,
          titleData: titleDescription,
          bioDataArray: bioDataArray,
          reviewsData: reviewsData,
        })
      })
      .catch((error) => {
        console.error("Error reading files:", error)
        res.status(500).send("Error reading files")
      })
  })
})

// http://localhost:3000/profile?id=jessy

// Start the server
app.listen(PORT, () => {
  console.log(`The server is running on http://localhost:${PORT}`)
})
