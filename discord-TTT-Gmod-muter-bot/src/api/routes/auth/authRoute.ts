//import packages
import express from 'express';
import fetch from 'node-fetch';
//create a route
const router = express.Router();

router.get('/steam', (req, res) => {
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fsteam%2Fredirect&response_type=code&scope=identify%20connections`);
});

router.get('/steam/redirect', (req, res) => {
    //test if a code is attached
    if (!req.query.code) return res.redirect('/api/auth/steam');
    var userdID: string;
    var steamID: string;
    //try fetching the token out of the code
    fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: `${req.query.code}`,
            redirect_uri: process.env.URI + process.env.URI_AUTH_STEAM_DISCORD
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(res => res.json()).then(async json => {
        const access_token = json.access_token;
        let scopes = json.scope;
        const token_type = json.token_type;
        //check if the values are valid
        if (!access_token || !scopes || !token_type) throw new Error('Invalid token or scopes');
        if (!scopes.includes('identify') || !scopes.includes('connections') || token_type != 'Bearer') throw new Error('Invalid token or scopes');
        scopes = scopes.split(' ');
        //fetch the users discord id
        await fetch('https://discord.com/api/users/@me', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${access_token}` }
        }).then(res => res.json()).then(json => {
            //check if the user is valid
            if (json.id) userdID = json.id;
        });
        //fetches the users steam id
        await fetch('https://discord.com/api/users/@me/connections', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${access_token}` }
        }).then(res => res.json()).then(json => {
            //check if a steam id is attached
            const steam = json.find(x => x.type === 'steam');
            if (steam.id) steamID = steam.id;
        });
    }).then(() => {
        //check if we got both ids
        if (!userdID) return res.redirect('/api/auth/steam');
        console.log(`User ${userdID} has connected his steam account ${steamID}`);
        res.redirect('/api');
        //todo: do stuff with the ids (test if no steam id and send user a message)
    }).catch(error => {
        if (error.message == 'Invalid token or scopes') return res.redirect('/api/auth/steam');
        else return res.redirect('/error/500');
    });
});

export default router;