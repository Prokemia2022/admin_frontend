import axios from 'axios';

export default async function Un_Verify_Client_Email(payload){
	const env = process.env.NODE_ENV
    console.log(env)
    if(env == "development"){
        const result = await axios.post("http://localhost:5001/api/un_verify_client_email",payload)
    	return result
    }
    else if (env == "production"){
    	const result = await axios.post("https://prokemia-adminserver-production.up.railway.app/api/un_verify_client_email",payload)
    	return result
    }
}