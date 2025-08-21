import { lookup } from "ip-location-api";

/**
 * Abstracts the country lookup logic in case we need to change it later in the future
 * */
export class IpGeoLocator {
	lookup(ip: string) {
		return lookup(ip);
	}
}
