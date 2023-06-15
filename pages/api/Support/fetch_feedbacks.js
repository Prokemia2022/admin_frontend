import axios from 'axios';
//import Cookies from 'universal-cookie';

export default async function Get_FeedBacks() {
	const env = process.env.NODE_ENV
    console.log(env)
    if(env == "development"){
        const result = await axios.get("http://localhost:5001/api/get_feedbacks")
    	return result
    }
    else if (env == "production"){
    	const result = await axios.get("https://prokemia-adminserver-production.up.railway.app/api/get_feedbacks")
    	return result
    }
}