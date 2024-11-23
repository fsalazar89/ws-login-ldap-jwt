const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(express.json());
dotenv.config({path: '.env'});
app.set('port', process.env.PORT_APP);

app.use('/api/v1', require('./api/routes'));

app.listen(app.get('port'), ()=>{
    console.log(`Servidor corriendo en el puerto ${app.get('port')}`);
});