import axios from 'axios';

export default async function Delete_Client(payload){
	const env = process.env.NODE_ENV
    //console.log(env)
    if(env == "development"){
        const result = await axios.post("http://localhost:5001/api/delete_client_account",payload)
    	return result
    }
    else if (env == "production"){
    	const result = await axios.post("https://prokemia-adminserver-production.up.railway.app/api/delete_client_account",payload)
    	return result
    }
}