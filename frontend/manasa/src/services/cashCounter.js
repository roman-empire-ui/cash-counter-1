const localhost = 4001





export const cashCount = async (notes , coins) => {

    try {
        const res = await fetch(`http://localhost:${localhost}/api/v1/counter/initialCount`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({notes , coins})
        })

        const data = await res.json() 
        console.log(data) 
        return data
    } catch (e) {
        console.log('error' , e)
        return{success : false , message : e}
    }
}



export const getInitialCount = async () => {
    try {
        const response = await fetch(`http://localhost:${localhost}/api/v1/counter/getInitial`, {
            method : 'GET',
            headers : {
                "Content-Type" : "application/json"
            }

        })

        const data = await response.json()
        return {success : true , data}
    } catch (e) {
        console.log('error' , e)
        return { success: false, message: e };
    }
}