const axios = require('axios');
const qs = require('querystring');

const generateToken = async (clientId, secret, classObj) => {
    const encodeString = `${clientId}:${secret}`;
    const toBase64 = Buffer.from(encodeString).toString('base64');

    const options = {
        url: 'https://accounts.spotify.com/api/token',
        method: 'POST',
        headers: {
            Authorization: `Basic ${toBase64}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: qs.stringify({
            grant_type: 'client_credentials',
        }),
    };

    const result = await axios(options).catch((err) => { throw err; });

    // eslint-disable-next-line no-param-reassign
    classObj.token = result.data.access_token;
};

module.exports = generateToken;
