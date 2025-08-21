import { DeleteChannelResponse } from "@ovp-proto/types/channels";

export class DeleteChannelGrpcResponseDto implements DeleteChannelResponse {
	constructor(deleted: boolean) {
		this.deleted = deleted;
	}

	deleted: boolean;
}
