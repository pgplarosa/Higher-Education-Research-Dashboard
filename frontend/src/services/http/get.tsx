import axios from 'axios';

export const get = (
    url: string,
    query_parameters: Record<string, string> = {},
): Promise<any> => {
    return axios.get(url).then((response) => response.data);
};
