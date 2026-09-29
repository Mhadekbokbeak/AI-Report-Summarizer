const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// middleware 
app.use(cors());
app.use(express.json());


app.get("/", (req,res) => {
          res.status(200).json({
                    status:"OK",
                    message:"Server is running!!"

          });
});

const PORT = 5000;

app.listen(PORT,() => {
          console.log(`Server is running on PORT => ${PORT}`);
});