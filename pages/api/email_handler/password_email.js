import axios from 'axios';

export default async function Send_Password_Otp(payload) {
	const env = process.env.NODE_ENV
    //console.log(env)
    if(env == "development"){
        const result = await axios.post(" http://localhost:8080/api/otp_password_email",payload)
    	return result
    }
    else if (env == "production"){
    	const result = await axios.post(`https://prokemiaemailsmsserver-production.up.railway.app/api/otp_password_email`,payload)
    	return result
    }
}