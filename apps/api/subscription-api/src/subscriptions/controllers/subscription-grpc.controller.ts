import { Payload } from "@nestjs/microservices";
import { GrpcController } from "@ovp-lib/api/grpc/decorators/grpc-controller.decorator";
import { SubscriptionServiceController, SubscriptionServiceControllerMethods } from "@ovp-proto/types/subscriptions";

import { CheckSubscriptionGrpcRequestDto } from "~src/subscriptions/dto/grpc/check-subscription-grpc-request.dto";
import { CheckSubscriptionGrpcResponseDto } from "~src/subscriptions/dto/grpc/check-subscription-grpc-response.dto";
import { SubscriptionService } from "~src/subscriptions/services/subscription.service";

@GrpcController()
@SubscriptionServiceControllerMethods()
export class SubscriptionGrpcController implements SubscriptionServiceController {
	constructor(private readonly subscriptionService: SubscriptionService) {}

	async checkSubscription(@Payload() body: CheckSubscriptionGrpcRequestDto): Promise<CheckSubscriptionGrpcResponseDto> {
		const { subscriberChannelId, subscribedChannelId } = body;
		const subscription = await this.subscriptionService.getSubscription(subscriberChannelId, subscribedChannelId);

		return new CheckSubscriptionGrpcResponseDto(Boolean(subscription));
	}
}
