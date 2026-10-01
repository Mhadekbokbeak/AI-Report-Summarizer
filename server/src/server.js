import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reportRoutes from './routes/report.route.js';


dotenv.config();

const app = express();

// middleware 
app.use(cors());
app.use(express.json());

// Bind routes
app.use('/api/reports',reportRoutes)

const PORT = 5000;

app.listen(PORT,() => {
          console.log(`Server is running on PORT => ${PORT}`);
});