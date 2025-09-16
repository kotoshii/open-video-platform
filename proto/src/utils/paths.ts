import path from "node:path";

export function getProtoPath(protoFileName: string): string {
	return path.join(__dirname, "../..", "schema", protoFileName);
}

export const ProtoPaths = {
	Users: getProtoPath("users.proto"),
	Channels: getProtoPath("channels.proto"),
	Subscriptions: getProtoPath("subscriptions.proto"),
	Videos: getProtoPath("videos.proto"),
	Comments: getProtoPath("comments.proto"),
} as const;
