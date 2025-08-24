import { lookup } from "ip-location-api";

export interface IpLocationData {
	countryCode: string | null;
	countryName: string | null;
	cityName: string | null;
}

/**
 * Abstracts the country lookup logic in case we need to change it later in the future
 * */
export class IpGeoLocator {
	async lookup(ip: string | null): Promise<IpLocationData> {
		const locationData = ip ? await lookup(ip) : null;
		return {
			countryCode: locationData?.country || null,
			countryName: locationData?.country_name || null,
			cityName: locationData?.city || null,
		};
	}
}
