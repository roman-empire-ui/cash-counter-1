const localhost = 4001

// const userFromStorage = localStorage.getItem('user');
// const genToken = () => {
//   const user = JSON.parse(userFromStorage);
//   console.log("Parsed user object:", user);
//   return user?.token;
// }

// console.log("Generated token:", genToken());

//   console.log(genToken())
  const authHeaders = () => ({

    headers: {
        'Content-Type': 'application/json',
        
    },


  })



export const cashCount = async (notes , coins) => {

    try {
        const res = await fetch(`http://localhost:${localhost}/api/v1/counter/initialCount`, {
            method : "POST",
            ...authHeaders(),
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
            ... authHeaders()

        })

        const data = await response.json()
        return data
    } catch (e) {
        console.log('error' , e)
        return { success: false, message: e };
    }
}