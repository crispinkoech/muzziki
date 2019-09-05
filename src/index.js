require('dotenv').config();
const Spotify = require('./spotify');

const spotify = new Spotify('https://api.spotify.com', {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    secret: process.env.SPOTIFY_SECRET,
});

setTimeout(() => {
    spotify.generateTracks({
        genres: 'hiphop, rock',
        // tracks: 'Hip hop Saved My Life, Big Fish',
        artists: 'SZA, Led Zeppelin, Lupe Fiasco',
    }).then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
}, 4000);
