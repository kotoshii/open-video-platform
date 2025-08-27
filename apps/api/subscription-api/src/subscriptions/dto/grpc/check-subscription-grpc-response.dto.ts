import { CheckSubscriptionResponse } from "@ovp-proto/types/subscriptions";

export class CheckSubscriptionGrpcResponseDto implements CheckSubscriptionResponse {
	constructor(isSubscribed: boolean) {
		this.isSubscribed = isSubscribed;
	}

	isSubscribed: boolean;
}
