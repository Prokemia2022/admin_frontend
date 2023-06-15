import axios from 'axios';

export default async function Get_request_demo_tickets() {
	const env = process.env.NODE_ENV
    console.log(env)
    if(env == "development"){
        const result = await axios.get("http://localhost:5001/api/get_request_demo_tickets")
    	return result;
    }
    else if (env == "production"){
    	const result = await axios.get("https://prokemia-adminserver-production.up.railway.app/api/get_request_demo_tickets")
    	return result;
    }
}