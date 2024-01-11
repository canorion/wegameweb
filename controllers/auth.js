import Axios from 'axios';
import { API_PORT } from "../api/config/index.js";

export async function LoginUser(req, res) {
    try {

        const { email, password } = req.body;
        
        let payload = { email: email, pass: password };
        let url = 'http://localhost:' + API_PORT + '/api/auth/login';

        let response = await Axios.post(url, payload);

        let data = response.data;

        res.cookie("access_token", data.token, {
            httpOnly: true
        }).status(200);

        res.redirect('/');

    } catch (error) {
        res.redirect('/');
        //res.status(500).json({ error: 'Authentication failed!' });
    }
}

export async function LogoutUser(req, res) {
    try {

        const token = req.cookies.access_token;

        let url = 'http://localhost:' + API_PORT + '/api/auth/logout';

        Axios.defaults.headers['Authorization'] = `Bearer ${token}`;
        
        let response = await Axios.get(url);
        
        console.log(response.data.message);

        res.cookie("access_token", "", {
            httpOnly: true
        }).status(200);

        res.redirect('/');

    } catch (error) {
        //console.log(error);
        //res.status(500).json({ error: 'Authentication failed!' });
    }
}