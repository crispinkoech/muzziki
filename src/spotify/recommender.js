const axios = require('axios');
const fuzzysort = require('fuzzysort');
const constants = require('./constants');

const search = (query, type, url, token) => {
    const results = query
        .split(',')
        .map(async (str) => {
            const q = str.replace(/ /g, '%20').replace(/%20(%20)+/g, '%20');

            const request = {
                method: 'GET',
                url: `${url}/v1/search?q=${q}&type=${type}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const { name, id } = (await axios(request)).data[`${type}s`].items[0];
            return { name, id };
        });

    return Promise.all(results);
};

const recommend = async ({ genres, artists }, url, token) => {
    const genreList = genres
        .replace(/ /g, '')
        .split(',')
        .map((genre) => {
            const result = fuzzysort.go(genre, constants.genres);

            let match;
            if (result.length === 0) {
                match = '';
            } else {
                match = result[0].target;
            }

            return match;
        });

    let seedGenres = genreList.filter((genre) => genre !== '');
    let seedArtists = artists.map((artist) => artist.id);
    // let seedTracks = tracks.map((track) => track.id);

    // Spotify only limits total seed items to 5
    // Select first 3 genres and 2 artist Ids
    if (seedGenres >= 3 && seedArtists >= 3) {
        seedGenres = seedGenres.slice(0, 3);
        seedArtists = seedArtists.slice(0, 2);
    }

    const request = {
        method: 'GET',
        url: `${url}/v1/recommendations`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            limit: 50,
            seed_genres: seedGenres.toString(),
            seed_artists: seedArtists.toString(),
        },
    };

    const response = await axios(request);
    const tracks = response.data.tracks.map((trackObj) => ({
        name: trackObj.name,
        artists: trackObj.artists.map((artist) => artist.name).toString(),
    }));

    return tracks;
};

module.exports = {
    search,
    recommend,
};
