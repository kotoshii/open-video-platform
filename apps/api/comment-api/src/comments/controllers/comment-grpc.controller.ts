import { Payload } from "@nestjs/microservices";
import { GrpcController } from "@ovp-lib/api/grpc/decorators/grpc-controller.decorator";
import { CommentServiceController, CommentServiceControllerMethods } from "@ovp-proto/types/comments";

import { CommentExistsGrpcRequestDto } from "~src/comments/dto/grpc/comment-exists-grpc-request.dto";
import { CommentExistsGrpcResponseDto } from "~src/comments/dto/grpc/comment-exists-grpc-response.dto";
import { CommentService } from "~src/comments/services/comment.service";

@GrpcController()
@CommentServiceControllerMethods()
export class CommentGrpcController implements CommentServiceController {
	constructor(private readonly commentService: CommentService) {}

	async commentExists(@Payload() body: CommentExistsGrpcRequestDto): Promise<CommentExistsGrpcResponseDto> {
		const { commentId } = body;

		const comment = await this.commentService.getCommentById(commentId);
		return new CommentExistsGrpcResponseDto(Boolean(comment));
	}
}
