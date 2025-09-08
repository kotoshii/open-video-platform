import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Selectable } from "kysely";

import { Video, VideoSelectedThumbnail, VideoVisibility } from "~db/schema";

export class GetVideoDto {
  constructor(video: Selectable<Video>) {
    const {
      id,
      channelId,
      channelName,
      title,
      description,
      tags,
      allowComments,
      allowRates,
      selectedThumbnail,
      visibility,
      isPublished,
      isNsfw,
      viewCount,
      likes,
      dislikes,
      createdDate,
      updatedDate,
    } = video;

    this.id = id;
    this.channelId = channelId;
    this.channelName = channelName;
    this.title = title;
    this.description = description;
    this.tags = tags;
    this.allowComments = allowComments;
    this.allowRates = allowRates;
    this.selectedThumbnail = selectedThumbnail;
    this.visibility = visibility;
    this.isPublished = isPublished;
    this.isNsfw = isNsfw;
    this.viewCount = viewCount;
    this.likes = likes;
    this.dislikes = dislikes;
    this.createdDate = createdDate;
    this.updatedDate = updatedDate;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  channelId: string;

  @ApiProperty()
  channelName: string;

  @ApiProperty()
  title: string;

  @ApiProperty({type: "string", nullable: true})
  description: string | null;

  @Exclude()
  @ApiProperty()
  tags: string[];

  @ApiProperty()
  allowComments: boolean;

  @ApiProperty()
  allowRates: boolean;

  @Exclude()
  @ApiProperty({enum: VideoSelectedThumbnail})
  selectedThumbnail: VideoSelectedThumbnail;

  @Exclude()
  @ApiProperty({enum: VideoVisibility})
  visibility: VideoVisibility;

  @Exclude()
  @ApiProperty()
  isPublished: boolean;

  @ApiProperty()
  isNsfw: boolean;

  @ApiProperty()
  viewCount: string;

  @ApiProperty()
  likes: string;

  @ApiProperty()
  dislikes: string;

  @ApiProperty()
  createdDate: Date;

  @Exclude()
  @ApiProperty()
  updatedDate: Date;

  toPlain(): Selectable<Video> {
    return {
      id: this.id,
      channelId: this.channelId,
      channelName: this.channelName,
      title: this.title,
      description: this.description,
      tags: this.tags,
      allowComments: this.allowComments,
      allowRates: this.allowRates,
      selectedThumbnail: this.selectedThumbnail,
      visibility: this.visibility,
      isPublished: this.isPublished,
      isNsfw: this.isNsfw,
      viewCount: this.viewCount,
      likes: this.likes,
      dislikes: this.dislikes,
      createdDate: this.createdDate,
      updatedDate: this.updatedDate,
    }
  }
}
