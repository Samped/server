const express = require("express");
const app = express();
const routes = require("./routes/authRoutes");


//accept json
app.use(express.json());
//accept body
app.use(express.urlencoded ({ extended: true }));
//use the html
app.use(express.static("public"));

const PORT = 1337;

app.use("/api/v1", routes);
app.listen(PORT, () => {
    console.log("App is running at port =", PORT);
});