import axios from 'axios';
//import Cookies from 'universal-cookie';

export default async function Delete_Ticket(payload) {
	const env = process.env.NODE_ENV;
    console.log(env)
    if(env == "development"){
        const result = await axios.post("http://localhost:5001/api/delete_ticket",payload)
    	return result;
    }
    else if (env == "production"){
    	const result = await axios.post("https://prokemia-adminserver-production.up.railway.app/api/delete_ticket",payload)
    	return result;
    }
}