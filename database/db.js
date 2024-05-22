const mongoose = require("mongoose");
const Record = require("./models/record");
const dbURI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

const connect = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Mongodb connected!!");
    return true;
  } catch (err) {
    console.log("Failed to connect to Mongodb", err);
    return false;
  }
};

const saveRecordEntry = async (record) => {
  try {
    const entry = new Record({
      rut: record.rut,
      timeStamp: record.timeStamp,
    });
    await entry.save();
    console.log(`Record entry succesfully saved.`);
    return true;
  } catch (e) {
    console.log("Error guardando record en la base de datos", e);
    return false;
  }
};

const getRecordEntry = async (rut) => {
  try {
      const lastRecord = await Record.findOne({ rut: rut }).sort({createdAt: -1}); // -1 for descending order
      if(lastRecord == null){
        return false
      }
      console.log(`Obteniendo ultimo registro para rut: ${rut} ${lastRecord}`)
      return lastRecord;
  } catch (e) {
      console.log('Error obteniendo record desde la base de datos', e);
  }
}

module.exports = {
  connect,
  saveRecordEntry,
  getRecordEntry
};
