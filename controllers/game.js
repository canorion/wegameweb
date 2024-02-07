import Axios from 'axios';
import { FE_PORT } from "../api/config/index.js";
import { decode } from 'html-entities';
import QRCode from 'qrcode';

export async function GetGameList(req, res) {
    try {
        
        const token = req.cookies.access_token;
        
        //console.log("TOKEN: " + token);

        Axios.defaults.headers['Authorization'] = `Bearer ${token}`;
        
        let url = 'http://localhost:' + FE_PORT + '/api/game';

        const response = await Axios.get(url);
        
        res.render("home", {
            gameList: response.data.data
          });
        
    } catch (error) {
        //res.redirect('/');
        //res.status(500).json({ error: 'An error occurred!' });
    }
}

export async function GetGameById(req, res) {
    try {
        
        const token = req.cookies.access_token;
        
        //console.log("REQ: " + req.params.id);

        Axios.defaults.headers['Authorization'] = `Bearer ${token}`;
        
        let url = 'http://localhost:' + FE_PORT + '/api/game';
        
        let url2 = 'http://localhost:' + FE_PORT + '/api/team';
        
        const response = await Axios.get(url);
        
        const response2 = await Axios.get(url2);
        
        var game = response.data.data.filter(data => data._id == req.params.id); 
        
        //console.log(game); 
        
        let teams = response2.data.data;
        
        teams = teams.map(team => {
            team.name = decode(team.name);
            return team;
        });
        
        //console.log(teams);
        
        const qrurl = 'https://9451-78-183-108-232.ngrok-free.app/games/game2'; // Bu URL QR kod içeriği olacak
        const qrImage = await QRCode.toDataURL(qrurl);
        
        res.render("game", {
            game: game[0],
            teamList:teams,
            qrImage: qrImage
          });
        
    } catch (error) {
        //res.redirect('/');
        //console.log(error);
        res.status(500).json({ error: 'An error occurred!' });
    }
}