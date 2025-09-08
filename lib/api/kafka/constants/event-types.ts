export const KafkaEventTypes = {
	Subscriptions: {
		SubscriptionCreated: "SUBSCRIPTION_CREATED",
		SubscriptionDeleted: "SUBSCRIPTION_DELETED",
	},
	Channels: {
		ChannelCreated: "CHANNEL_CREATED",
		ChannelUpdated: "CHANNEL_UPDATED",
	},
	Videos: {
		VideoViewed: "VIDEO_VIEWED",
	},
} as const;
