/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import fetch from "node-fetch";

import Anime from "./Anime";
import Manga from "./Manga";
import User from "./User";

class Kitsu {
  public _userAgent: string;
  public _options: {
    headers: { "User-Agent": string; Accept: string; "Content-Type": string };
  };
  constructor() {
    this._userAgent =
      "kitsu.js, a npm module for the kitsu.io API. v2.0.0 (https://github.com/iCrawl/kitsu.js)";
    this._options = {
      headers: {
        "User-Agent": this._userAgent,
        Accept: "application/vnd.api+json",
        "Content-Type": "application/vnd.api+json",
      },
    };
  }

  public async searchAnime(search, offset = 0): Promise<Anime> {
    return new Promise((resolve, reject) => {
      const searchTerm = encodeURIComponent(search);
      return fetch(
        `https://kitsu.io/api/edge/anime?filter[text]="${searchTerm}"&page[offset]=${offset}`,
        this._options
      )
        .then((res) => res.json())
        .then((json) =>
          resolve(json.data.map((moreData) => new Anime(moreData)))
        )
        .catch((err) => reject(new Error(`Couldn't fetch the api: ${err}`)));
    });
  }

  public async getAnime(id): Promise<Anime> {
    return new Promise((resolve, reject) =>
      fetch(`https://kitsu.io/api/edge/anime/${id}`, this._options)
        .then((res) => res.json())
        .then((json) => resolve(new Anime(json.data)))
        .catch((err) => reject(new Error(`Couldn't fetch the api: ${err}`)))
    );
  }

  public async searchManga(search, offset = 0): Promise<Manga> {
    return new Promise((resolve, reject) => {
      const searchTerm = encodeURIComponent(search);
      return fetch(
        `https://kitsu.io/api/edge/manga?filter[text]="${searchTerm}"&page[offset]=${offset}`,
        this._options
      )
        .then((res) => res.json())
        .then((json) =>
          resolve(json.data.map((moreData) => new Manga(moreData)))
        )
        .catch((err) => reject(new Error(`Couldn't fetch the api: ${err}`)));
    });
  }

  public async getManga(id): Promise<Manga> {
    return new Promise((resolve, reject) =>
      fetch(`https://kitsu.io/api/edge/manga/${id}`, this._options)
        .then((res) => res.json())
        .then((json) => resolve(new Manga(json.data)))
        .catch((err) => reject(new Error(`Couldn't fetch the api: ${err}`)))
    );
  }

  public async getUser(id): Promise<User> {
    return new Promise((resolve, reject) =>
      fetch(`https://kitsu.io/api/edge/users/${id}`, this._options)
        .then((res) => res.json())
        .then((json) => resolve(new User(json.data)))
        .catch((err) => reject(new Error(`Couldn't fetch the api: ${err}`)))
    );
  }
}

export default Kitsu;
