
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();

const invoiceRoutes = require('./routes/invoices.js');
const clientRoutes = require('./routes/clients.js');
const userRoutes = require('./routes/userRoutes.js');
const profile = require('./routes/profile.js');


const app = express();


app.use((express.json({ limit: "30mb", extended: true })))
app.use((express.urlencoded({ limit: "30mb", extended: true })))
app.use((cors()))

app.use('/invoices', invoiceRoutes)
app.use('/clients', clientRoutes)
app.use('/users', userRoutes)
app.use('/profiles', profile)


app.get('/', (req, res) => {
    res.send('SERVER IS RUNNING')
})



mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


app.use(express.json());



app.get('/', (req, res) => {
    res.send('SERVER IS RUNNING');
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


