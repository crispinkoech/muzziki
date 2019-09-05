const generateToken = require('./token');
const { search, recommend } = require('./recommender');

class Spotify {
    constructor(url, { clientId, secret }) {
        this.url = url;

        // Regenerate token after 58 minutes
        generateToken(clientId, secret, this);
        setInterval(generateToken, (58 * 60 * 60 * 1000), clientId, secret, this);
    }

    async generateTracks(params) {
        const {
            genres,
            // tracks,
            artists,
        } = params;

        const artistList = await search(artists, 'artist', this.url, this.token);
        // const trackList = await search(tracks, 'track', this.url, this.token);

        const recommendedTracks = await recommend({
            genres,
            artists: artistList,
        }, this.url, this.token);

        return recommendedTracks;
    }
}

module.exports = Spotify;
