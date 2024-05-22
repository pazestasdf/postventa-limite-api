require('dotenv').config();
const express = require('express');
const cors = require('cors')
const db = require('./database/db');
const PORT = 3009;
const app = express();


/**
 * Options
 */

const corsOptions = {
    origin: 'https://www.galilea.cl', 
    // origin: 'https://galilea2023.testingvao.cl',// reemplazar por dominio donde estará la aplicacion: ej. localhost:3001
    optionsSuccessStatus: 200
}

app.use(cors());
app.use(express.json());

/**
 * Main
 */

const init = async () => {

    const connection = await db.connect();

    if (!connection) {
        console.log('No db connection. Exiting.')
        return;
    }

    app.listen(PORT, () => {
        console.log(`Galilea Post Venta Registros está corriendo en puerto: ${PORT}`)
    })

    app.post("/saverecord", cors(corsOptions), async function (req, res) {

        var rut = req.body.rut;
        const timeStamp = req.body.timeStamp;

        if(rut.includes('.')){
            rut = rut.replaceAll('.', '');
        }

        // Guarda en bbdd
        const saved = await db.saveRecordEntry({ rut: rut, timeStamp: timeStamp })

        res.send(saved); // true or false

    });


    app.post("/validate", cors(corsOptions), async function (req, res) {

        var rut = req.body.rut;
        const timeStamp = req.body.timeStamp;

        
        if(rut.includes('.')){
            rut = rut.replaceAll('.', '');
        }

        //Obtiene el registro previo de la base de datos
        const record = await db.getRecordEntry(rut);
        if (record == false) {
            res.send(false)
            return
        }
        // Valida si pasaron 24 horas desde el ultimo registro
        const isMoreThanADay = validateRecordDate(record, timeStamp); // responde true or false
        res.send(isMoreThanADay);
    });
}

/**
 * Aux functions
 */

const validateRecordDate = (record, currentTimestamp) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const isMoreThanADay = (currentTimestamp - record.timeStamp) < oneDay;
    return isMoreThanADay;
}

/** 
 * Run the app 
*/
init();