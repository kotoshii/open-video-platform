import { CheckSubscriptionRequest } from "@ovp-proto/types/subscriptions";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CheckSubscriptionGrpcRequestDto implements CheckSubscriptionRequest {
	@IsUUID()
	@IsString()
	@IsNotEmpty()
	subscriberChannelId: string;

	@IsUUID()
	@IsString()
	@IsNotEmpty()
	subscribedChannelId: string;
}
