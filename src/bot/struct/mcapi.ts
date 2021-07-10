// Imports
/**
 * This is taken from (https://github.com/Moudoux/mcapi) so Please leave a star in the repo
 */
import fetch from 'node-fetch';
// Variables
const api = "https://api.mojang.com/";
const sessionServer = "https://sessionserver.mojang.com/";

/**
 * Translates a UUID to the corresponding username
 * @param {String} uuid 
 */
function uuidToUsername(uuid: string): Promise<string> {
    return fetch(`${sessionServer}session/minecraft/profile/${uuid}`, {
        method: "GET"
    }).then((response) => {
        return response.json();
    }).then(json => {
        return json.name as string;
    });
}

/**
 * Translates a username to the corresponding UUID
 * @param {String} username 
 */
function usernameToUUID(username: string): Promise<string> {
    return fetch(`${api}users/profiles/minecraft/${username}`, {
        method: "GET"
    }).then((response) => {
        return response.json();
    }).then(json => {
        return json.id;
    });
}

/**
 * 
 * @param {Number} token 
 */
function oAuthToUUID(token: string): Promise<string> {
    return fetch(`https://mc-oauth.net/api/api?token`, {
        method: "GET",
        headers: {
            "token": token
        }
    }).then((response) => {
        return response.json();
    }).then(json => {
        return json.status === "success" ? json.uuid : "fail";
    });
}

export {
    uuidToUsername,
    usernameToUUID,
    oAuthToUUID
};