import express from 'express';
import mongoose, { connect } from 'mongoose';
import path from 'path'
import { fileURLToPath } from 'url';
import cors from 'cors';
import { createServer } from 'http'; 
import { Server } from 'socket.io'; 
import webPush from 'web-push';
import vehiclerouter from './routes/vehicletype_routes.js';
import countryrouter from './routes/country_routes.js';
import cityrouter from './routes/city_route.js';
import pricingrouter from './routes/pricing_route.js';
import settingrouter from './routes/setting_route.js';
import userrouter from './routes/user_route.js';
import driverrouter from './routes/driver_route.js';
import loginrouter from './routes/login_route.js';
import { authmiddleware } from './Middleware/authmiddleware.js';
import createriderouter from './routes/createride_route.js';
import confirmriderouter from './routes/confirmride_route.js';
import { statuschange } from './controllers/runningreqcontroller.js';


const app = express();

export const httpServer = createServer(app); 

// const publicKey = 'BIaGOdir59RS1gskDxgPY5AstT7ygIHll3KjoQtW9la5rJyKOEbZ7Y5iod9cl65d_QY4V6DntLmpGdwyjn8JwQE';
// const privateKey = 'DasJ6sXsiiVUAgaYVa1HsRqfeUNwbKb3xxpwIfwkBqw';

// webPush.setVapidDetails('mailto:ayadav.elluminati@gmail.com', publicKey, privateKey);

const io = new Server(httpServer, {
cors: {
    origin: '*',
},
});

io.on('connection', (socket) => {


    socket.on('rideUpdate', (data) => {
        io.emit('rideUpdate', data);
        statuschange(data)
    });


    socket.on('disconnect', () => {
    });
});

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/vehicletype',authmiddleware , vehiclerouter);
app.use('/country',authmiddleware , countryrouter);
app.use('/city',authmiddleware ,cityrouter);
app.use('/pricing',authmiddleware ,pricingrouter);
app.use('/setting',authmiddleware ,settingrouter);
app.use('/user',authmiddleware ,userrouter);
app.use('/driver',authmiddleware ,driverrouter);
app.use('/createride',authmiddleware ,createriderouter);
app.use('/confirm-ride',authmiddleware ,confirmriderouter);
app.use('/login',loginrouter);

const MONGO_URI = 'mongodb+srv://yaryan832:aryan125@cluster0.y1h5n.mongodb.net/Eber?retryWrites=true&w=majority&appName=Cluster0';


mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
    
    httpServer.listen(8000, () => {
        console.log('Server running on port 8000');
    });
})
.catch(error => console.log('Error connecting to MongoDB:', error));


export  {io}