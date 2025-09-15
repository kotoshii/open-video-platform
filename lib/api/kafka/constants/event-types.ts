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
	VideoRates: {
		VideoRateCreated: "VIDEO_RATE_CREATED",
		VideoRateDeleted: "VIDEO_RATE_DELETED",
		VideoRateUpdated: "VIDEO_RATE_UPDATED",
	},
	Comments: {
		CommentCreated: "COMMENT_CREATED",
		CommentDeleted: "COMMENT_DELETED",
	},
} as const;
