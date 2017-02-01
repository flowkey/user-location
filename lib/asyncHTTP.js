import { HTTP } from 'meteor/http';

function asyncHTTP(url, method = 'GET', options = {}) {
    return new Promise((resolve, reject) => {
        HTTP.call(method, url, options, (error, result) => {
            if (error) reject(error);
            resolve(result);
        });
    });
}

export default asyncHTTP;
