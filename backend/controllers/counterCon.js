
import Initial from "../models/cashModel.js";






export const initialCounter = async(req , res) => {
    const {notes , coins} = req.body 


    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setUTCHours(0 ,0 , 0 ,0)

    

    const calculatedNotes = notes.map(item => ({
        denomination : item.denomination,
        count : item.count, 
        total : item.denomination * item.count ,
    }))

    const calculatedCoins = coins.map(item => ({
        denomination : item.denomination,
        count : item.count,
        total : item.denomination * item.count ,
    }))

    const totalCash = [...calculatedNotes , ...calculatedCoins].reduce((sum , item) => sum + item.total, 0)

    const existing = await Initial.findOne({date : tomorrow})
    if(existing) {
        existing.notes = calculatedNotes
        existing.coins = calculatedCoins
        existing.totalInitialCash = totalCash
        await existing.save()

        return res.status(201).json({
            success : true,
            message : 'Initial Cash updated for tomorrow',
            initialCash : existing
        })
    }

    const newInitial = new Initial({
        date : tomorrow,
        notes : calculatedNotes,
        coins : calculatedCoins,
        totalInitialCash : totalCash
    })

    await newInitial.save()

    res.status(201).json({
        success : true,
        message : 'Initial Cash saved for tomorrow',
        initialCash : newInitial
    })
}


export const getInitialCash = async(req , res) => {
    const today = new Date()
    today.setUTCHours(0 ,0 , 0, 0)

    const initial = await Initial.findOne({date : today})
    if(!initial) {
        return res.status(404).json({
            success : false,
            message : 'No Initial Cash Added on yesterday'
        })
    }


    return res.status(201).json({
        success : true,
        message : 'Initial Cash fetched',
        initialCash : initial
    })
}

