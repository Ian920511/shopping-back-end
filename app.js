if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const passport = require("./config/passport")
const cors = require('cors')
const { apis } = require('./routes')


const app = express();

const PORT = process.env.PORT || 3000;

const db = require("./models");


app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

app.use('/api', apis)

app.get('/', (req, res) => {
  return res.send('hello world')
})

app.listen(PORT, () => {
  console.log(`Sever is running on http://localhost:${PORT}`);
});
