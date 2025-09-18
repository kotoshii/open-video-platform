import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class GetCommentsQuery {
	@IsUUID()
	@IsNotEmpty()
	@ApiProperty()
	videoId: string;
}
