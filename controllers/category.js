import Axios from 'axios';
import { FE_PORT } from "../api/config/index.js";

export async function GetCategoryList(req, res) {
    try {
        
        const token = req.cookies.access_token;
        
        Axios.defaults.headers['Authorization'] = `Bearer ${token}`;
        
        let url = 'http://localhost:' + FE_PORT + '/api/category';
        
        const response = await Axios.get(url);
        
        let url2 = 'http://localhost:' + FE_PORT + '/api/game';
        
        const response2 = await Axios.get(url2);
        
        res.render("home", {
            categoryList: response.data.data,
            gameList: response2.data.data
          });
        
    } catch (error) {
        //res.redirect('/');
        //res.status(500).json({ error: 'An error occurred!' });
    }
}