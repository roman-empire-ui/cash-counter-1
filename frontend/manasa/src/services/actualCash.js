const localhost = 4001






export const saveRemCash = async({date , notes , coins , remarks}) => {


    try {
        const res = await fetch(`http://localhost:${localhost}/api/v1/counter/remCash`,{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                date , notes , coins , remarks
            })
        })

        const data = await res.json()
        return { success: true, message: data };
    } catch(e){
        console.log('error' , e)
        return{success : false , message : e}
    }
}