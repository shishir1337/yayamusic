require('dotenv').config();

module.exports = {
    WAIFU_TOKEN: process.env.WAIFU_TOKEN, // bot token
    OWNER_ID: "713390802021122231", // your id
    OWNER_TAG: "Shishir Plays YT#3667", // your user tag
    OWNER_LINK: "https://discord.com/users/713390802021122231", // https://discord.com/users/paste-ur-id-here
    DEV_GUILD:"939385283626037319", // dev guild
    MONGO_DB: process.env.MONGO_DB, // database mongodb

    // spotify for distube
    // If spotify_tracks is true then you can play song from spotify more than 100+ the default is *false*
    // You can get these secret and client_id from here: https://developer.spotify.com/dashboard/applications
    WAIFU_TRACKS: parseBoolean(process.env.WAIFU_TRACKS || true),
    SPOTIFY_SECRET: process.env.SPOTIFY_SECRET,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    YOUTUBE_COOKIE: process.env.YOUTUBE_COOKIE, // youtube cookie to make less lag
    
    MAIN_COLOR: "#2F3136",
    ERR_COLOR: "#ED2828",
    WAIFU_PREFIX: "/",
    CHANNEL: "947699738571055144"
}

function parseBoolean(ask) {
    if (typeof (ask) === 'string') {
        ask = ask.trim().toLowerCase();
    }
    switch (ask) {
        case true:
        case "true":
            return true;
        default:
            return false;
    }
}