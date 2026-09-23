## search-api: Implement GET /search/videos/{videoId}/similar

Needs: [US-Search-01 Task-05 — search-api: Implement GET /search/videos](../../../search/US-Search-01/backend/Task-05-search-api-Implement-GET-search-videos.md)

`GET /search/videos/{videoId}/similar` — up to 20 videos, no paging

Main flow:

1. Run `more_like_this` pointed at the watched video by id — `like: [{ "_index": ..., "_id": ... }]` — over the title,
   the description, their `.en` and `.uk` fields, and the tags. The watched video itself is left out by default.
2. Set `min_term_freq` and `min_doc_freq` to 1. The defaults, 2 and 5, ignore most title words and every word found in
   fewer than five videos, so the list comes back empty with no error.
3. Put the age filters — the `Birthdate` header and the acting channel's setting — into a `bool` filter around that
   clause, and take the first 20.
4. Ask `video-api` which of them this viewer may still see, drop the rest, and take the view count and thumbnail version
   from its answer.

Branch — the watched video is not in the index (accessible by link, private, or published a moment ago):

1. Return an empty list; the section shows its empty state.

Why: pointing at the stored document means no text is sent, and Elasticsearch picks the terms most specific to this
video by itself. The filters sit inside the query, so the 20 results are 20 the viewer can see rather than 20 trimmed
afterwards — step 4 only catches the index lagging behind.
