import { CheckSubscriptionRequest } from "@ovp-proto/types/subscriptions";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CheckSubscriptionGrpcRequestDto implements CheckSubscriptionRequest {
	@IsUUID()
	@IsString()
	@IsNotEmpty()
	subscriberId: string;

	@IsUUID()
	@IsString()
	@IsNotEmpty()
	channelId: string;
}
