const localhost = 4001




export const stockEntry = async({date , distributors}) => {

    try {
        const res = await fetch(`http://localhost:${localhost}/api/v1/stock/stockEntry`,{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },

            body : JSON.stringify({ date, distributors})
        })

      

        const data = await res.json()
        console.log( 'data', data)
        return data

    } catch (e) {
        console.log('Error Occured' , e)
    }
}


export const getStocks = async() => {
    try {
        const res = await fetch(`http://localhost:${localhost}/api/v1/stock/allStocks`, {
            method: 'GET',
            headers : {
                'Content-Type' : 'application/json'
            },

        })

        const data = await res.json() 
        console.log(data)
        return data

    } catch (e) {
        console.log('error Occured' , e)
    }
}

export const updateStock = async({stockId , distributorId , name , totalPaid}) => {

    try {
        const res = await fetch(`http://localhost:${localhost}/api/v1/stock/updateStock/${stockId}/${distributorId}`, {
            method: 'PUT',
            headers : {
                'Content-Type' : 'application/json'
            },

            body : JSON.stringify({name , totalPaid})
        })

        const data = await res.json() 
        console.log('data' , data)
        return data
    } catch (e) {
        console.log('error' , e)
        return {success : false , message : 'Error Occured while editing'}

    }
}


export const deleteStock = async({stockId , distributorId}) => {

    try {
        const res = await fetch(`http://localhost:${localhost}/api/v1/stock/deleteDist/${stockId}/${distributorId}`, {
            method: 'DELETE',
        })
        const data = await res.json()
        return data
    } catch (e) {
        console.log('error' , e)
        return {success : false , message : 'Error Occured while deleting'}
    }
}
        
export const calRem = async({date , amountHave , stockEntryId}) => {

    try {
        const res = await fetch(`http://localhost:${localhost}/api/v1/stock/remAmount`, {
            method: 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({date , amountHave , stockEntryId})
        })
        const data = await res.json()
        return data

    } catch (e) {
        console.log('error' , e)
        return { success: false, message: "Error Occured while calculating" };
    }
}


export const getRemAmt = async(stockEntryId) => {

    try {
        const res = await fetch(`http://localhost:${localhost}/api/v1/stock/getRemAmount/${stockEntryId}`, {
            method: 'GET',
            headers:{
                'Content-Type' : 'application/json'
            }
        })
        const data = await res.json()
        return data
    } catch(e) {
        console.log('error' , e)
        return { success: false, message: "Error Occured while getting the amount" };
    }
}


