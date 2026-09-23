## video-api: Export channels' videos over gRPC

Add the gRPC method that takes a list of channel ids and returns their videos as metadata: the title, the
description, the tags, the visibility, the audience, whether comments and rates are allowed, the counts, the dates,
the duration and the URL of the video's page.

Why: the files are not part of the export, and a presigned link per rendition would expire long before anyone opened
the archive — the page URL is what stays valid, and each video is downloaded from there
([US-Videos-02](../../../../user-stories/videos/US-Videos-02-Download-videos.md)).
