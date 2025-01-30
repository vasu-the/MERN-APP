require("./mongoose/db");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
require("dotenv").config();

const PORT = process.env.PORT;
const HOSTNAME = process.env.HOSTNAME;



app.use(morgan('dev'));
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors({
    origin:"*",
    methods:['GET','POST','PUT','DELETE','PATCH','OPTION'],
    allowedHeaders:['Authorization','Content-Type']
}));


const authRoutes = require('./routers/authRoutes');
const agentRoutes = require('./routers/agentRoutes');
const listRoutes = require('./routers/listRoutes');

app.use(cors());
app.use(bodyParser.json());

app.use('/', authRoutes);
app.use('/',agentRoutes);
app.use('/',listRoutes);


app.get('/',(req,res)=>{
  res.json({msg:"welcom to the app"});
})

app.listen(PORT,HOSTNAME,()=>{
  console.log(`Server listening at http://${HOSTNAME}:${PORT}`)
})
