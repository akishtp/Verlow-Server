require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");

// route imports
const userRoutes = require("./routes/user");
const recordRoutes = require("./routes/record");
const accountRoutes = require("./routes/account");

const cors = require("cors");
app.use(cors());
app.options("*", cors());

// middleware
app.use(express.json());

app.use("/api/records", recordRoutes);
app.use("/api/user", userRoutes);
app.use("/api/accounts", accountRoutes);

// DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7.
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
