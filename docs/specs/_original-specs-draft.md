# General information

# **Open Video Platform**

## Product Specification Document

*An open-source video hosting platform.*  
*Fully open and community-driven — free as in speech, and free as in beer.*

***Version:*** 1.0.0  
***License:*** MIT \- *subject to change*

## Links

Jira: [https://peepee-poopoo.atlassian.net/jira/software/projects/OVP/boards/1](https://peepee-poopoo.atlassian.net/jira/software/projects/OVP/boards/1)  
GitHub: [https://github.com/kotoshii/open-video-platform](https://github.com/kotoshii/open-video-platform)

## Tech Stack

* Next.js \+ shadcn/ui  
* Nest.js  
* PostgreSQL  
* Redis  
* TypeScript  
* Kysely  
* Dbmate  
* Docker  
* Nginx  
* Kafka  
* Tus

# Conventions

## API Responses

* **Successful Responses**:  
  All successful API calls return the appropriate payload, typically as a JSON object or a primitive value (e.g., `string`, `number`, `boolean`).

* **Error Responses**:  
  All failed API calls return the default NestJS error response object, which includes:  
  * `statusCode`: HTTP status code  
  * `message`: Error description  
  * `error`: Error type (e.g., `"Bad Request"`)

## Git Commit Conventions

* Follow the [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) specification for all Git commit messages.  
  * Example: `feat(auth): add login endpoint`

## Error Handling (Frontend)

* **General Behavior**:  
  All failed API requests trigger a toast notification at the bottom of the screen, regardless of the page or context, except 404 Not Found response \- there should be a dedicated page designed specifically for this type of error (see below \- Page-Level errors).

* **Page-Level Errors**:  
  When fetching data for a specific page (e.g., by ID) fails, display a prominent full-screen error message centered on the page.  
  * Example: A `404` error should display a message like:  
     **`404 Not Found`**

* If a dedicated 404 page exists for a specific page according to the specs then use it. If not \- fallback to a generic 404 page.

## Internationalization (i18n)

* All API responses should include **localized error messages** in addition to their English versions. This enables the frontend to display user-facing error messages in the user's preferred language.

## Authorization

* All API apps should have an authorization layer based on JSON Web Tokens and standard token refreshing mechanisms.

* All API apps should follow the same authorization flow.

# Architecture

API services:

1. Auth API  
2. User API  
3. Channel API  
4. Subscription API  
5. Recommendation API  
6. Video Upload API  
7. Video API  
8. Video Rate API  
9. Comment API  
10. Comment Rate API  
11. Search API

Workers:

1. Subscription Count Worker  
2. Video View Count Worker  
3. Video Rate Count Worker  
4. Comment Rate Count Worker  
5. Video Comment Count Worker

Notifications:

1. Email Notification Service

Planned (not in MVP scope):

* History API \- watch history  
* Notification API \- in-app notifications  
* Recommendation API \- implement actual feed/recommendations logic

# Development plan

**Labels:**  
API, UI, DB, Worker, Infra, Lib, Bug.

**Epics:**  
Auth, Users, Channels, Subscriptions, Recommendations, Videos, Video Uploading, Video Rates, Comments, Comment Rates, Search, Notifications, My Activity, Emails, I18n.

**The Plan (MVP):**  
Set up monorepo

Set up and configure Nginx  
Set up and configure Kafka  
Set up and configure gRPC

Users  
Channels  
Auth  
Subscriptions  
Videos  
Video rates  
Comments  
Comment rates  
Video uploading  
Recommendations (MVP ver.)  
Search (MVP ver.)

**Non-MVP:**  
*\+ tasks not included in MVP from other features*  
*(e.g. channel avatars, password changing, account deletion etc)*

Recommendations (full ver.)  
Search (full ver.)  
Notifications  
Emails  
My Activity  
I18n

Add logs, monitoring (Prometheus, Grafana, ELK).  
Put everything in Kubernetes.

**Possible improvements:**

1. Add more caching.  
2. Untangle gRPC calls between services.

# Specifications

Contains a detailed description of each feature.  
Includes all required explanations, provides images where needed.

Serves as a specifications reference for all functionalities that exist in the project.

# UI and Layout

There are 3 main page types in the app:

1. Content pages (e.g. video page, home page, channel page etc) \- these pages contain actual content and allow interactions with this content.  
2. Service pages (e.g. auth page, reset password, email verification etc) \- does not contain any content, but rather  exist to provide some kind of *service* interaction for the user that does not affect the actual site content.  
3. Error pages (video not found, channel not found etc) \- contain only the info about an error that just occurred and possibly some buttons to go back or do actions that should help a user to resolve the error.

At the top of the app should always appear the Navigation Bar.  
The Navigation Bar should contain a set of buttons to change the language of the app and to toggle the dark mode (default \- system preferred).  
If authenticated, the Navigation Bar should also contain a Search Bar.  
If not authenticated \- only the control buttons (language \+ dark mode).

At the left of the app there should be the Menu Sidebar.  
The Menu Sidebar contains a set of links to different app locations \- My Channel, Subscriptions, Like videos, Account Settings etc.  
The Menu Sidebar should be collapsible. When collapsed only icons should be shown with a tooltip on hover.

Content and Error pages should always have the Menu Sidebar on the left.  
Service pages should not have it by default. Show it only for the Service pages that expect a user being authenticated when using them.

All sections / components that load and render some data should have an error / exception boundary / filter, so that if the request fails the component should render a retry button along with error message so the user is able to load the data again.  
The error in such components should not make the whole app crash.  
We need 2 types of such components:

1. The ones which allow retrying  
2. The ones which won’t have the retry button and will say to reload the page.

# Internationalization

The app should support internationalization out of the box.  
This means there should be a possibility to change the language of the UI and all server response messages.

On the pages where it’s not expected for a user to be authenticated (e.g. login page, password reset page), there should be a button to change the language and persist the value only on the client side.

Once the user logs in, their preferred language should be pulled out from their profile settings.  
In this case the language switcher should be available only on the account settings page.  
The preferred language value in this case should be stored both on client and server.

So if pulling the language from the database is not available \- fallback to the client side value. But try to keep them in sync.

When a user registers, set their preferred language to the one from the sign-up request headers, or fallback to English.

# Authentication

## UI

Use the following shadcn template: [https://ui.shadcn.com/blocks/authentication\#login-03](https://ui.shadcn.com/blocks/authentication#login-03)  
Brief mockups: [Open Video Platform Mockups](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=0-1&p=f&t=l5ZFKtGndcHeRTvt-0)

The page should contain a simple form to allow users to create a new account / log in to an existing one.  
In the top there should be 2 buttons: a language selector and dark/light theme toggle.

## Account creation

To create a new account a user should provide the following info:

* Email address  
* Channel name / Nickname \- will be used as a channel name; can be changed later.  
* Date of birth \- to filter age restricted content; the input should have a corresponding tooltip with explanations why we gather this info.  
* Password  
* Password confirmation

During the account creation Auth service sends a gRPC request to create a channel in Channel service and a user in User service.  
Once it’s done, issue a set of tokens (see [Authorization]()) and send it back to the user.

## Email verification

After the account is created the email address needs to be verified:

* After successful registration:  
  * send an email with a verification link and one-time verification code, in case a user cannot open a link.  
  * redirect the user to the email verification page.  
* On the email verification page users should be able to enter the code manually or resend the verification email every 5 mins (initially sent one also counts).  
* If a user enters the code manually, redirect to the homepage.  
* If a user opens the link from the email (which is basically the same verification page just with code query param) \- pre-enter the code and submit. On success, redirect to homepage.  
* The code should be short-lived \- 5 mins max.  
* Users should not be able to access the site without email verification.  
* If a user tries to reload the page to reset the form and send email again before it’s allowed, the server should respond with an error and the UI should update accordingly \- show the actual remaining time to the next attempt.

## Logging in

To log in to an existing account a user just needs to enter their email and password.  
After a successful login redirect to the homepage.

## Password reset

On the auth screen under the login tab there should be a button to reset a user’s password.

* The button should say “Forgot password?”.  
* After clicking it a user should be redirected to another screen designed for this action.  
* The screen should contain a form with a single input \- email, as well as a button to send a password reset link.  
* Once clicked, the password reset link should be sent to the provided email.  
* Once clicked, the email input should become disabled and the confirmation button should show a timer (5 mins) until the next attempt to send an email becomes available.The button should also be disabled during waiting.  
* The password reset link should be a link to the same password reset page, but contain a query param for the confirmation code.  
* If code param has been provided when opening the page, instead of email input show a form to enter a new password and password confirmation.  
* After submission show a message saying the password was updated successfully with option to redirect to log in page.  
* The code should be short-lived \- 5 mins max.  
* If a user tries to reload the page to reset the form and send email again before it’s allowed, the server should respond with an error and the UI should update accordingly \- show the actual remaining time to the next attempt.

## Endpoints

POST /auth/create-account  
POST /auth/login  
POST /auth/refresh  
POST /auth/logout

**Important\!**  
In MVP we contain only basic auth functionalities:

* Account creation  
* Logging in  
* Managing tokens (issuing, using, refreshing)  
* Logging out

Other functionalities, like email verification, password reset and password changing (Users API) \- require setting up Email notifications, so they won’t be included in MVP.

# Authorization

Authorization flow is performed using JWTs:

Issuing tokens:

1. User signs in  
2. Server issues a set of tokens \- access and refresh  
3. Server saves the refresh token in Postgres \- along with user id, channel id, country (from ip), ip, log in date, user agent.  
4. Refresh token value should be hashed.  
5. Refresh token expiration time \- 30 days  
6. Access token exp time \- 60 mins.  
7. Primary key of the session record in db should be added to access token payload as session\_id.  
8. Server sends a set of tokens back to user.

Using tokens:

1. User sends a request with Bearer Authorization header containing a JWT.  
2. Nginx gateway verifies and validates the token  
3. If valid, Nginx decodes the token, adds User-ID and Channel-ID (if present) headers to the request and sends it further to the requested service.  
4. If not valid, respond with 401 status code.  
5. Nginx also removes the Authorization header from the request;

Refreshing tokens:

1. User receives a 401 code response  
2. Client send a refresh request with refresh token in the body AND access token in Authorization header  
3. Nginx decodes the access token without expiration checks but with signature validation to extract user id and channel id  
4. Server looks for a refresh token record in the db that matches the user id, channel, refresh token value, user agent and country.  
5. If not found, responds with 401 and client redirects the user to the login page.  
6. If found, issue a new pair of tokens  
7. Update the existing session record \- token value, ip, update date, expiration date  
8. Send the new pair to the user (refresh token in  httpOnly cookie, access token is response body).

Logout:

1. User sends a request to /auth/logout endpoint.  
2. The request contains valid access token  
3. Nginx validates and along other fields (channel id and user id) extracts also session id and sets it into Auth-Session-ID header.  
4. Server takes the session id, finds it in the database.  
5. If exists \- deletes it  
6. If not \- responds with 200 OK.

# Users

User (account) removal flow \- TODO  
Email changing flow \- TODO  
Password changing flow \- TODO

Users service exposes a gRPC function to create a user record while account creation.

Endpoints

GET /users/current

# Channels

Channel removal flow \- TODO  
Channel avatars \- TODO

Channels service exposes a gRPC function to create a channel record while account creation.

Once a channel is created, send a Kafka event to be consumed by the Search service so it can index the channel.

Endpoints

GET /channels/current  
PUT /channels/current  
GET /channels/{id}

When channel (name, description or avatar) is updated:

1. Update it in local channels service db  
2. Create a Kafka event to update it in:   
   1. Comments service  
   2. Subscriptions service  
   3. Search service (when it’s implemented properly with ElasticSearch)  
   4. Video service

# Account settings

UI:  
[Open Video Platform Mockups](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=48-6&t=kJY8VNHhSWLLIz3t-0)

Account settings page contain the following controls:

1. Avatar uploading section for the current channel \- TODO  
2. Current channel info \- name and description  
3. Email changing input \- TODO  
4. Password changing input \- TODO

There will be **no** dedicated service or endpoints for the page itself (like Settings service or whatever).

The following items are out of MVP scope:

* Avatars require adding the set up for storing them in S3.  
* Email and password changing requires confirmation via an email notification, so it needs implementing Email service first.

# Subscriptions

Subscription creation flow

1. User clicks the subscribe button  
2. Request sent to the subscription api  
3. Api creates a record in its local db  
4. Api sends event to Kafka \- SubscriptionCreated  
5. Subscription count worker consumes the event   
6. Worker increments subscription counter for the channel in Redis  
7. Every 10 seconds a repeatable bullmq task runs  
8. The task takes all data in redis (deltas)  
9. The task adds subscriptions counts in channel service  
10. The task resets delta values in Redis.

Subscription removal flow

11. User clicks the unsubscribe button  
12. Request sent to the subscription api  
13. Api removes the record in its local db  
14. Api sends event to Kafka \- SubscriptionRemoved  
15. Subscription count worker consumes the event   
16. Worker decrements subscription counter for the channel in Redis  
17. Every 10 seconds a repeatable bullmq task runs  
18. The task takes all data in redis (deltas)  
19. The task adds subscriptions counts in channel service  
20. The task resets delta values in Redis.

Endpoints:  
POST /subscriptions  
DELETE /subscriptions/{channelId}  
GET /subscriptions/current

The repeatable task flow (by chatgpt \- [https://chatgpt.com/c/687e86ec-48f0-8005-9c36-455de2fc09b0](https://chatgpt.com/c/687e86ec-48f0-8005-9c36-455de2fc09b0)):   
\[Flush Job\] repeatable BullMQ task every 10s:  
   \- Check if \`subs:pending\` is non-empty  
     \- If yes → retry flushing it to DB  
     \- If no → atomic move subs:deltas → subs:pending (Lua)  
   \- Send \`subs:pending\` to SubscriptionService (e.g. via gRPC or HTTP)  
   \- On success → delete subs:pending  
   \- On failure → leave subs:pending for next retry

The Lua script:

\-- keys\[1\] \= deltas key  
\-- keys\[2\] \= pending key

local deltas \= redis.call("HGETALL", KEYS\[1\])  
if next(deltas) \== nil then  
  return {} \-- nothing to flush  
end

\-- Move to pending  
for i \= 1, \#deltas, 2 do  
  redis.call("HSET", KEYS\[2\], deltas\[i\], deltas\[i+1\])  
end

\-- Clear original deltas  
redis.call("DEL", KEYS\[1\])

return deltas

The repeatable (flusher) task code example:

const redis \= new Redis();

const LOCK\_KEY \= "subs:lock";  
const DELTAS\_KEY \= "subs:deltas";  
const PENDING\_KEY \= "subs:pending";

export async function flushSubCounts() {  
  const lock \= await redis.set(LOCK\_KEY, "flush-instance", "NX", "EX", 60);  
  if (\!lock) return; // someone else is flushing

  try {  
    let deltas \= await redis.hgetall(PENDING\_KEY);

    // Nothing pending? Move fresh deltas to pending  
    if (Object.keys(deltas).length \=== 0\) {  
      deltas \= await redis.eval(luaScript, {  
        keys: \[DELTAS\_KEY, PENDING\_KEY\],  
      });  
    }

    if (Object.keys(deltas).length \=== 0\) return;

    // Call subscription service (batch update)  
    await subscriptionService.flushCounts(deltas);

    // Success → clear pending  
    await redis.del(PENDING\_KEY);  
  } catch (err) {  
    console.error("Flushing failed, will retry:", err);  
    // Do not clear pending\!  
  } finally {  
    await redis.del(LOCK\_KEY);  
  }  
}

# Homepage

## UI

Figma: [Open Video Platform Mockups](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=4-84&t=yXpH0Q7KWFS0ktSZ-0)

## Content

On the Homepage there should be just a list of recommended videos.  
Each video component should contain:

* Thumbnail (preview image)  
* Small uploader avatar pic  
* Uploader’s channel name  
* Video title  
* Number of views  
* Upload date (relative \- show precise on hover)

The video grid should be responsive and take a full width of the screen.

Try to fit 3 videos on the big screen, 2 on medium and 1 on mobile in one row.  
When loading new videos, show skeletons in 2 rows.  
Pagination: 24 videos per page max. \+ infinite scrolling.

# Feed and recommendations

To form the recommendations for each user we gather the following info:

* Liked videos  
* Disliked videos  
* Watch history

***// TODO:***   
**The recommendations system can be *really* complex to implement, so let’s leave it for later \- as a last part.**

*In this doc it would be good to also include technical specs of the recommendations system.*  
*For now, the main idea is to have 2 endpoints:*

1. *to get the recommendations for the homepage \- based on user general preferences;*  
2. *and to get a list of similar videos to the one a user is currently watching \- so to show on the right section on the video page.*

*The whole system will most likely live inside a separate microservice. Likely implemented with Python using ML. Or maybe not, idk. Will see.*  
*It should react in real-time to the user's actions \- likes, dislikes, views, repetitive views etc…*

**For MVP, just return random videos.**

# Similar videos

TODO

Basically, it’s related to the recommendations system.  
We need to return a list of similar videos to the one a user is watching.

**For MVP, just return random videos.**

# Video uploading

## UI

Mockups: [Open Video Platform Mockups](https://www.figma.com/design/VGVNL768fIPaiAKDH5bYNU/Open-Video-Platform-Mockups?node-id=100-1016&t=r5pVrhWI4IzELpTs-0)

## Specs

Supported video formats:  
`.mp4`, `.mov`, `.mkv`, `.webm`, `.avi`, `.flv`, `.wmv`, `.mpeg`, `.3gp`, `.m4v`

Max supported video file size: 10 GB.

## User flow

In the Navbar there should be the  “Upload” button.  
User clicks it and gets redirected to the video file selection page.  
On the video file selection page there is a drag-n-drop section (on Desktop) or an “Upload“ button.  
Users can either drag a file or click the button to select a video file to upload.  
Once selected the uploading process starts immediately and the user gets redirected to the video uploading page.  
On the video uploading page users can see the uploading and processing progress and edit video details.  
Users can edit:

- title  
- description  
- tags  
- available interactions (comments, rates)  
- choose from one of suggested or upload their own thumbnail  
- visibility (public, private and accessible by link)  
- audience (whether video should be age restricted)

Users can change any of these settings and save them in any time without interrupting the video uploading / processing and without publishing the video.  
Until the uploading is finished the users should see a warning saying that closing this tab will interrupt the uploading.  
Once a video file has been uploaded, the user should see the corresponding update in the UI \- the warning should change into a green label (alert) saying the uploading has been completed and users can either wait here and publish or close the tab and publish later.  
After that processing phase starts.  
Once thumbnails become available they should appear in the UI for the user to select.  
Once the lowest (240p) quality becomes available users should be notified about this in the green alert. The Publish button should then become available.  
Each time a new quality becomes available it should be resembled in the alert.

If a user leaves the page before the uploading was completed, the video should appear in their channel with the corresponding status.  
Clicking this video should open the same uploading page, but with a drag-n-drop / file select button, to allow the user select and upload the file again.  
In this case the uploading should be resumed from the place where it ended.  
The video should be available to resume for 1 day. After that time passes the user will need to upload the whole file from the beginning.  
The video item should not disappear from the user’s channel even after 1 day.

If a user leaves the page after the video was uploaded but before it was fully processed, they can still see the video item in their channel.  
Clicking this item will open the same uploading page where they can continue tracking the processing progress.

Once the video has been published the uploading page should now become unavailable for it (even when opening via a saved link) and should instead redirect to the video watching page.

## Endpoints

POST /video-upload/initialize

## Uploading flow in details (technical)

***file types:***  
*1\. videos*  
	*1\. master mp4 files in different resolutions \- accessible only on demand to download.*  
	*2\. HLS playlists \- accessible  by everyone at any point directly.*  
*2\. video thumbnails \- accessible only the one that was set; thumbnail variants are accessible only in /edit endpoint and only for the video owner.*  
*3\. avatars \- accessible by everyone at any point directly.*

OLD:  
Videos and thumbnails (and other files too) are stored on the dedicated file-server service (name is subject to change);  
File-server has its own nginx instance that serves the files;  
Some files are accessible by anyone, while some are only accessible with special signed URL; these URLs are generated by video service \- just a path to a file with token (JWT) query param; the JWT is then validated by the file-server's nginx.

NEW:  
file-server approach is deprecated as it’s totally possible to use MinIO for the same purposes. And then just map the user-facing URLs (e.g. /videos/download/xxx-random-video-id-123-720p.mp4, /avatars/user-id.jpg /videos/hls/xxx-random-video-id-123 etc) to MinIO private bucket access URLs with signed requests (via [https://github.com/nginxinc/nginx-s3-gateway](https://github.com/nginxinc/nginx-s3-gateway), AWS SigV4 available).

\- User clicks the uploading button in the navbar;  
\- Gets redirected to the uploading page (/upload);  
\- Drops a file into the drag-n-drop area (or selects if it's on mobile);  
\- Client makes requests to /video-upload/initialize; the request contains video metadata;  
\- Server verifies the file is a video (via MIME type, not reliable, but at least it will decrease the amount of invalid files before proceeding further); creates a new video record in video service database via gRPC; creates a record in local video-upload database with status \= "upload\_pending"; responds with video ID;  
\- User gets redirected to /upload/{videoId};

\- Client retrieves the video info (title, description, tags etc) available for editing (GET /videos/{videoId}/edit);  
\- Client subscribes to the video uploading status updates via SSE;

/\* The requests to /tus/ routes are made by the tus-js-client library under the hood \*/

\- Client makes a request to POST /tus/files; the request contains the Authorization header and Upload-Metadata header with videoId (base64 encoded);  
\- API Gateway (Nginx) validates the Authorization token, adds User-ID and Channel-ID headers, removes the Authorization header (does this for all secured routes, not only for tus); adds Tus-Webhook-Secret header; validates Upload-Metadata header (400 if not valid);  
\- Tus (configured to forward all headers to hooks) triggers the pre-create hook; sends an HTTP request to the webhook endpoint set up in video-upload service;  
\- Video-upload service's webhook validates the Tus-Webhook-Secret header; checks if video with the provided videoId exists and belongs to the user with User-ID; checks if video size is not bigger than max allowed;  
\- If all checks are valid, video-upload service sets the uploading path to "{videoId}/original.{ext}" via the webhook response; if not, rejects the upload and responds with appropriate message;  
\- Tus receives the response from the webhook and responds to user with upload URL;

\- Client makes a request to PATCH /tus/files/{uploadId}; the request contains the Authorization header and Upload-Metadata header with videoId (base64 encoded);  
\- API Gateway (Nginx) validates the Authorization token, adds User-ID and Channel-ID headers, removes the Authorization header (does this for all secured routes, not only for tus); adds Tus-Webhook-Secret header; validates Upload-Metadata header (400 if not valid);  
\- Tus (configured to forward all headers to hooks) triggers the post-receive hook; sends an HTTP request to the webhook endpoint set up in video-upload service;  
\- Video-upload service's webhook validates the Tus-Webhook-Secret header; checks if video with the provided videoId exists and belongs to the user with User-ID; if possible, checks if the file is indeed a video (using ffprobe or other approach); checks if video size is not bigger than max allowed;  
\- If all checks are valid, video-upload service sends an empty response ({}) back to tus; if not, stops the upload (files get deleted automatically by tusd) and responds with appropriate message;

\- Once file uploaded, tus triggers the post-finish hook; sends an HTTP request to the webhook endpoint set up in video-upload service;  
\- Video-upload service's webhook validates the Tus-Webhook-Secret header; checks if video with the provided videoId exists and belongs to the user with User-ID; if possible, checks if the file is indeed a video (using ffprobe or other approach);  
\- If all checks are valid, video-upload service updates the status in the local database to "processing"; sends event about this to the client via SSE; posts event VideoUploadCompleted in Kafka; sends an empty response ({}) back to tus; if not, deletes the uploaded file and responds with appropriate message;

\- Video-processing-worker consumes the VideoUploadCompleted event;  
\- Video-processing-worker schedules a BullMQ task to generate video thumbnails;  
\- Video-processing-worker schedules several BullMQ tasks to generate master files (in mp4 format) for each resolution;  
\- Once the thumbnails are generated, the video-processing-worker posts a VideoThumbnailsGenerated event to Kafka;  
\- Video-upload service consumes the VideoThumbnailsGenerated event and updates the info in the local database; sends an update via SSE too;  
\- Client, once received an update about thumbnails being ready, makes a request to GET /videos/{videoId}/thumbnails;  
\- Server checks if the user requesting the thumbnails is the author of the video and responds accordingly (if not author \- 403);  
\- Every time a task to generate master files finished, video-processing-worker schedules another task \- to generate HLS playlists and segments for that master file;  
\- Every time an HLS-generation task finishes, it posts an event to Kafka VideoQualityReady;  
\- Video-upload service consumes every VideoQualityReady event and updates the info in the database; also sends an update to client via SSE; note: events don't come in order, so 1080p may be ready before 480p \- need to handle that;  
\- Video-processing-worker tracks the status of all tasks per each video in its local database (or redis); once all tasks for a video have been completed, the worker posts an event in Kafka VideoProcessingCompleted;  
\- Video-upload service consumes the VideoProcessingCompleted event; updates the status in its local database and updates the client via SSE;

\- User clicks the Publish button in the UI;  
\- Client makes a request to POST /videos/{videoId}/publish;  
\- Server does all needed security checks (e.g. if the user is author of the video) and sets is\_published \= true in its local database for that video; posts an event VideoPublished to Kafka;  
\- Video-upload consumes the VideoPublished event and deletes the status record from its database as it's not needed anymore;  
\- Client shows the appropriate UI to let the user know the video has been successfully published;  
\- After reloading the page the client receives 404 response and redirects the user to the homepage; the same happens if a user tries to open the uploading page for someone else's video;

**FIlesystem folder structure for videos.**

video-id-123/  
├── original.mkv  
├── master/  
│   ├── master\_2160.mp4  
│   ├── master\_1440.mp4  
│   ├── master\_1080.mp4  
│   ├── master\_720.mp4  
│   ├── master\_480.mp4  
│   ├── master\_360.mp4  
│   └── master\_240.mp4  
├── thumbnails/  
│   ├── 1.jpg  
│   ├── 2.jpg  
│   └── 3.jpg  
└── hls/  
    ├── master.m3u8  
    └── 2160/  
        ├── index.m3u8  
        ├── segment0.ts  
        └── [segment1.ts](http://segment1.ts)

the selected thumbnail for a video should be stored as a separate file with no access restrictions; thus, we need somehow store which thumbnail was selected to show the selection in the UI when editing the video;

TODO \- custom thumbnail uploading.

TODO \- check if tusd rejects POST/PATCH requests that don't have needed headers; if not \- add this to the nginx config;

TODO \- add checks in pre-create webhook handler to prevent upload session creation for videos that are already being uploaded/processed.

TODO \- implement uploads expiration.

# Managing videos

On a user’s own channel page the user can hover their video and see a 3 dot menu appear over the video component.  
On click a dropdown menu appears with these options:

* Edit  
* Change visibility  
* Delete

**Edit:**  
On click the video info editing modal appears. It basically contains the same info and controls as on video uploading page, except visibility options \- these are accessible via a distinct modal.  
![][image1]

**Change visibility:**  
On click the visibility options modal shows up. Controls there work the same way as in Video Uploading page.

![][image2]

**Delete:**  
On click a confirmation modal appears to confirm the video deletion.

Endpoints:  
Only the video's owner can access these endpoints. Otherwise \- throw 403\.

GET /videos/{id}/edit  
PUT /videos/{id}/edit  
DELETE /videos/{id}

(probably wont be needed, just send thumbnails in edit response and via SSE when uploading)  
GET /videos/{id}/thumbnails

# Watching videos

TODO  \- add ability to download videos.

On the video page there should be the following sections (parts):

* Video player itself  
* Video info (title, views, upload date, rates \- likes/dislikes)  
* Channel info along with the subscribe button.  
* Video description  
* Comments section  
* Similar videos section.

Video info part should be server side rendered. This means when a user opens a video page, after some loading time they will see the video player ready to play the video; title, description, channel name, video rates.  
Similar videos will start loading separately on the client once the page is rendered.  
Comments section will start loading once the user scrolled into it to avoid unnecessary requests.  
Similar videos section should be toggleable (remember state on page reaload)

Endpoints:  
GET /videos/{id}/watch

To load comments the client makes requests to the comments api.  
To load author info the [Next.js](http://Next.js) server makes request to channels api.

# Video views

1. Once a user opens a video page (i.e. request to GET /videos/{id} is made) server sends an event to Kafka \- VideoViewed.  
2. Video view count worker consumes the event.  
3. The worker Increments the counter in its local Redis instance.  
4. Every 2-5 minutes a repeatable bullmq tasks starts and flushes the data from redis to video service via grpc.  
5. The flow is literally the same as in subscription count worker \- see [Subscriptions]() specs for more details.

# Video rates

User added a video rate:

1. User clicks like / dislike button  
2. Request to video rate api is made with a body indicating we need to add a new rate  
3. The API creates a rate record in its local db for that channel and video.  
4. the API sends an event to Kafka \- VideoRateCreated  
5. Video rate count worker consumes the event  
6. the worker increments the corresponding rate count (depending on the type \- like, dislike) in its local redis instance.  
7. every 2-5 mins the worker flushes the rate counts to video service db.  
8. The flow is literally the same as in subscription count worker \- see [Subscriptions]() specs for more details.

User removes the existing video rate:

1. User clicks like / dislike button  
2. Request to video rate api is made with a body indicating we need to remove the rate.  
3. The API removes the existing  rate record in its local db for that channel and video.  
4. the API sends an event to Kafka \- VideoRateRemoved  
5. Video rate count worker consumes the event  
6. the worker decrements the corresponding rate count (depending on the type \- like, dislike) in its local redis instance.  
7. every 2-5 mins the worker flushes the rate counts to video service db.  
8. The flow is literally the same as in subscription count worker \- see [Subscriptions]() specs for more details.

User changes the existing video rate:

1. User clicks like / dislike button  
2. Request to video rate api is made with a body indicating we need to add a new rate \- same as in case 1\.  
3. The API checks if the rate from this channel and for this videos already exists  
   1. if not, just create a new rate \- case 1  
   2. if exists, and it’s the same as requested by the user \- do nothing, just return successful response.  
   3. if exists and it differs from the one user requests to create, consider this as a request to change the rate to the opposite one. In this case change the type of the existing rate in the local video rate api db.  
4. the API sends an event to Kafka \- VideoRateCreated / VideoRateUpdated.  
5. Video rate count worker consumes the event  
6. the worker either creates (case 1\) or updates the counts \- decrements the count for the previous rate type and increments for the new one.  
7. every 2-5 mins the worker flushes the rate counts to video service db.  
8. The flow is literally the same as in subscription count worker \- see [Subscriptions]() specs for more details.

Endpoints:  
POST /video-rates/  
DELETE /video-rates/{videoRateId}

# Comments

TODO \- mentions in comments.

Endpoints:  
POST /comments  
PUT /comments/{commentId}  
DELETE /comments/{commentId}  
GET /comments?videoId=342434\&page=1\&limit=30  
GET /comments/{commentId}/replies?page=1\&limit=30

Consumes ChannelUpdated event to update author name and/or profile pic.

Comments support 1-level replies:  
You can reply to any comment and it will be posted as a reply. But you cannot reply to a reply \- it will be posted as a reply to the parent comment.

Comments are loaded only when a user scrolls into the comment section.  
Comments are paginated. Max page size is 30\.

If a comment has replies, show a corresponding button under it.  
Comment replies are paginated. Max page size is 30\.  
Replies for a specific comment are only loaded when explicitly requested. i.e. when a user clicks the “Show replies” button.  
Once clicked and comment replies are loaded, if there are more replies, show another button under the replies \- “Show more replies”.  
When clicked, the same process starts again \- load paginated comment replies, just for the next “page”.

Comments and their replies are stored in separate database tables.

Comments made by the current user should appear on top of the comment section.

There should be an ability to sort comments:

* Newest first  
* Oldest first  
* Most likes  
* Most dislikes

# Comment rates

Literally same thing as for video rates but for comments:

User added a comment rate:

1. User clicks like / dislike button  
2. Request to comment rate api is made with a body indicating we need to add a new rate  
3. The API creates a rate record in its local db for that channel and comment.  
4. the API sends an event to Kafka \- CommentRateCreated  
5. Comment rate count worker consumes the event  
6. the worker increments the corresponding rate count (depending on the type \- like, dislike) in its local redis instance.  
7. every 2-5 mins the worker flushes the rate counts to comment service db.  
8. The flow is literally the same as in video rate and subscription count worker \- see [Subscriptions]() specs for more details.

User removes the existing comment rate:

1. User clicks like / dislike button  
2. Request to comment rate api is made with a body indicating we need to remove the rate.  
3. The API removes the existing  rate record in its local db for that channel and comment.  
4. the API sends an event to Kafka \- CommentRateDeleted  
5. Comment rate count worker consumes the event  
6. the worker decrements the corresponding rate count (depending on the type \- like, dislike) in its local redis instance.  
7. every 2-5 mins the worker flushes the rate counts to comment service db.  
8. The flow is literally the same as in video rate and subscription count worker \- see [Subscriptions]() specs for more details.

User changes the existing comment rate:

1. User clicks like / dislike button  
2. Request to comment rate api is made with a body indicating we need to add a new rate \- same as in case 1\.  
3. The API checks if the rate from this channel and for this comment already exists  
   1. if not, just create a new rate \- case 1  
   2. if exists, and it’s the same as requested by the user \- do nothing, just return successful response.  
   3. if exists and it differs from the one user requests to create, consider this as a request to change the rate to the opposite one. In this case change the type of the existing rate in the local comment rate api db.  
4. the API sends an event to Kafka \- CommentRateCreated / CommentRateUpdated.  
5. Comment rate count worker consumes the event  
6. the worker either creates (case 1\) or updates the counts \- decrements the count for the previous rate type and increments for the new one.  
7. every 2-5 mins the worker flushes the rate counts to comment service db.  
8. The flow is literally the same as in video and subscription count worker \- see [Subscriptions]() specs for more details.

Endpoints:  
POST /comment-rates  
DELETE /comment-rates/{commentId}

# Search

1. Search for videos  
2. Search for channels

TODO \- Integrate ElasticSearch

Users can search videos or channels. 

* Available filters:  
* Upload date \- last hour, today, this week, this month, this year.  
* Duration \- shorter than 5 mins, 5-15, 16-30, 30+

Order:

* relevancy  
* recently uploaded  
* most popular

Filters and sorting order available only for videos.  
For channels just sort by subscribers count.

For MVP implement simple search endpoints in the corresponding services \- Videos and Channels.  
Later I will integrate ElasticSearch.

MVP Endpoints:  
GET /videos/search?q=\&upload\_date=\&duration=\&sortBy=  
GET /channels/search?q=

UPDATE:  
Search service should just have an interface (gRPC) to perform a search in ElasticSearch and return a list of IDs. Then the corresponding API service will return the results.  
So basically the MVP endpoints will stay, just will use search-api with ElasticSearch instead of internal database search.

# Notifications (TODO)

# Activity \- Watch history (TODO)

# Activity \- Liked videos (TODO)

# Activity \- My comments (TODO)

# Email notifications (TODO)

[image1]: <data:image/png;base64,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APkjlUBUKhY0QhRUik23lp3+UIhRa1CxdZKmiWLbBgAAgHxR00BULSwQAQAAAAyEhghENt4IAAAAYCA0RCACAAAAqAQCEQAAAOSe1APR3r17/RVbCxYscE899RQiIiJiVVTWeOGFF1IZNpNqINJYnnnz5rl169a5ffv2ISIiIlbVnTt3uueff77n9jkDJbVApJYhpbW4ooiIiIjVdvHixW7JkiVxPCmZ1ALRiy++6N5///2CCiIiIiLWwmeeecY30AyE1AKRusriiiEiIiLWSrUSDfSGy6kEoh07drjXX3+9oGKIiIiItVI9VW+++WYcU0qCQISIiIgN4ZYtWwhEiIiImG8zFYh27drl3n33Xe97771X9Uv0V69e7TZt2lQwvZjr16/368TTERERsb7NVCDatm2bW7RokQ8d8q233vLGy6WlwtCHH35YMD1UwWz79u3+serX3/KIiIhYf2YuEMUB6LXXXvMtM3qsFqR33nnHL2PTpB5rmuZpmXhZa9VRALKgpb9aTwFH29VztUyFy2u+7nJpddD6SXUJW43suf4qTMWvEREREWtv5gORBRU9VuuRQolabPTYwowCiwJK2KWlIGPLWqDRPN2HQNOte07TVMZzzz3Xq2wtb6HHlg/rklS+pusWA3E58etERETE2towgUghQ/N02ZxUUNF0BRWFGY03sq4tTVMYicsPA40MA1G4vG3LlrFybf14eQtFehzec8nGQ8X1QERExNqa+UCk4KOuJ4URhQ79NW08j9ZT8FCrzYoVK3wgisuRfQWicPnweVIgisu3UKbHBCJERMT6M9OBSC1BFjSkAo89tvE/MhzXY8uraywMMtZlViwQKcjY+KNly5b1jP/RMvazI+H6Kt+W13RbvlggsjK0jl09p8cM0kZERKy+mQpECggKPeqOssHMYWBQV5am2zI2XY9tHVveltV0685SKAoHOlvLkwUxKyMMZVaOhSpbP6yLlS/DAKdlbXktp9enbSlMaZrKVAuYLY+IiIjVMVOBaLCMW6YQERGxsSQQlSCBCBERsbElECEiImLuJRAh9uHevXsHZFwOIiLWtwQixMA42Jh79uwpyXg9AhIiYjYkEGHujcNLHIB2795dlv0FpHj7iIg4+BKIMLfGQSUOQLoNgtQxaureVRpkH6ppNn/nzp1+naSAFG8vrg8iIg6eBCLMpcWCUBiA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>

[image2]: <data:image/png;base64,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>