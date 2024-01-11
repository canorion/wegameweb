import Axios from 'axios';
import { API_PORT } from "../api/config/index.js";

export async function GetGamesList(req, res) {
    try {
        
        const token = req.cookies.access_token;
        
        //console.log("TOKEN: " + token);

        Axios.defaults.headers['Authorization'] = `Bearer ${token}`;
        
        let url = 'http://localhost:' + API_PORT + '/api/game';
        
        const response = await Axios.get(url);
        
        res.render("home", {
            gameList: response.data.data
          });
        
    } catch (error) {
        //res.redirect('/');
        //res.status(500).json({ error: 'An error occurred!' });
    }
}