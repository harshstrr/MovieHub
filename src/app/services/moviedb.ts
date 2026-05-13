import { apikey, baseurldb } from "../api/apiConfig";

export const fetchMovieDetails = async (query: string) => {
    const raw = await fetch(`${baseurldb}/search/multi?query=${query}&api_key=${apikey}`);
    const res = await raw.json();
    return res;
}   


export const ExternalId = async (id: string , type: string) => {
    const raw = await fetch(`${baseurldb}/${type}/${id}/external_ids?api_key=${apikey}`);
    const res = await raw.json();
    return res;
}   