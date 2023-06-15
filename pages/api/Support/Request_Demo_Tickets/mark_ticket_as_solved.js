import axios from 'axios';
//import Cookies from 'universal-cookie';

export default async function Mark_Ticket_As_Solved(payload) {
	const env = process.env.NODE_ENV
    console.log(env)
    if(env == "development"){
        const result = await axios.post("http://localhost:5001/api/mark_request_demo_ticket_as_solved",payload)
    	return result;
    }
    else if (env == "production"){
    	const result = await axios.post("https://prokemia-adminserver-production.up.railway.app/api/mark_request_demo_ticket_as_solved",payload)
    	return result;
    }
}