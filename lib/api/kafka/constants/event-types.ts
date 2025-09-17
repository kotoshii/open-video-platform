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
	CommentRates: {
		CommentRateCreated: "COMMENT_RATE_CREATED",
		CommentRateDeleted: "COMMENT_RATE_DELETED",
		CommentRateUpdated: "COMMENT_RATE_UPDATED",
	},
} as const;
