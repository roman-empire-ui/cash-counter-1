import express from 'express'
import { deleteDistributor, getAllStocks, getRemAmt, getStockByDistrubutor, getStocks, remAmt, stockEntry, updateStock } from '../controllers/stockCon.js';

const app = express.Router() 




app.post('/stockEntry' , stockEntry)
app.get('/getStock' , getStockByDistrubutor)
app.get('/allStocks' , getAllStocks)
app.put('/updateStock/:stockId/:distributorId', updateStock)
app.delete('/deleteDist/:stockId/:distributorId' , deleteDistributor )
app.get('/getStocks', getStocks)
app.post('/remAmount' , remAmt)
app.get("/getRemAmount/:stockEntryId", getRemAmt);

export default app;