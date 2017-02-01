import continentMap from './continents';

export function sanitizeLocalResult(result, ip) {
    return new Promise((resolve, reject) => {
        const correctedResult = {};

        try {
            if (!result) {
                reject('Failed to extract data from the lookup result');
            }

            correctedResult.country_code = result.country;
            correctedResult.continent_code = continentMap[correctedResult.country_code];
            correctedResult.region_code = result.region;
            correctedResult.city = result.city;
            correctedResult.latitude = result.ll && result.ll[0];
            correctedResult.longitude = result.ll && result.ll[1];
            correctedResult.ip = ip;
        } catch (e) {
            reject('Error performing lookup function', e);
        }

        resolve(correctedResult);
    });
}

export function sanitizeServiceResult(result) {
    return new Promise((resolve, reject) => {
        const correctedResult = {};

        try {
            correctedResult.country_code = result.country.iso_code;
            correctedResult.continent_code = result.continent.code;
            correctedResult.ip = result.traits.ip_address;
        } catch (e) {
            reject('Failed to extract data from the lookup result');
        }

        resolve(correctedResult);
    });
}
