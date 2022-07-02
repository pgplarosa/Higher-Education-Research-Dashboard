import axios from 'axios';

export const post = (
    url: string,
    body: Record<string, string> = {},
): Promise<any> => {
    return axios.post(url, body).then((response) => response.data);
};
