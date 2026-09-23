# Development plan

The order the stories are built in. There are three stages: everything in **Preparation** is groundwork the rest leans
on, **MVP** is the platform being usable end to end, and **V1** is what follows once it is.

Work that belongs to no story — the local environment, shared code in `lib/`, logs and monitoring, CI, the READMEs,
seed data — is placed around the stories in the [platform plan](specs/tasks/_platform/README.md): most of it comes
before the first story, and the rest right before or after the story that needs it.

Inside a story, the tasks are done in their numbered order, back end and front end together.

## 0. Preparation

Before any story: the groundwork and the logs and monitoring stack from the
[platform plan](specs/tasks/_platform/README.md), sections 1 and 2 — the repository, the local environment,
service-to-service security, identity at the gateway, the shared code, the empty frontend app, and Grafana, Alloy,
Loki, Prometheus, Tempo and OpenTelemetry ([observability-plan.md](specs/observability-plan.md)).

Then the Preparation stories. UI/UX is mostly front-end work, but worth keeping in mind while building the back end
too. UI/UX and I18n lean on each other — every UI/UX string goes through the i18n library, while the language selector
sits in the sidebar UI/UX builds — so they interleave:

1. [I18n] [Language selector](specs/user-stories/i18n/US-I18n-01-Language-selector.md), the library only: its
   [Spike](specs/tasks/i18n/US-I18n-01/frontend/Task-01-Spike-Choose-the-i18n-library.md) and
   [setup](specs/tasks/i18n/US-I18n-01/frontend/Task-02-Set-up-the-i18n-library.md)
2. [UI/UX] [Dark theme support](specs/user-stories/ui-ux/US-UI-UX-01-Dark-theme-support.md)
3. [UI/UX] [User-friendly readable error messages](specs/user-stories/ui-ux/US-UI-UX-02-User-friendly-errors.md)
4. [UI/UX] [Global layout](specs/user-stories/ui-ux/US-UI-UX-03-Global-layout.md)
5. [I18n] [Language selector](specs/user-stories/i18n/US-I18n-01-Language-selector.md), the rest: the selector itself,
   and dates, counts and plurals
6. [I18n] [Localized error messages](specs/user-stories/i18n/US-I18n-02-Localized-error-messages.md)
7. [I18n] [Localized emails](specs/user-stories/i18n/US-I18n-03-Localized-emails.md) — its back end here, since sign-up
   and the email module need the email language; its front-end task, the setting on the Account tab, waits for the
   settings page (MVP 9)

## 1. MVP

1. [Auth] [Account creation and authentication](specs/user-stories/auth/US-Auth-01-Account-creation-and-login.md)
2. [Auth] [Account confirmation](specs/user-stories/auth/US-Auth-02-Account-confirmation.md)
3. [Auth] [Session persistence](specs/user-stories/auth/US-Auth-04-Session-persistence.md)
4. [Auth] [Ability to reset password](specs/user-stories/auth/US-Auth-03-Password-reset.md)
5. [Auth] [Ability to log out](specs/user-stories/auth/US-Auth-06-Logging-out.md)

6. [Channels] [Ability to create multiple channels on one account](specs/user-stories/channels/US-Channels-01-create-multiple-channels.md)
7. [Channels] [Ability to switch between channels freely](specs/user-stories/channels/US-Channels-02-freely-switch-between-channels.md)
8. [Channels] [Channel selection page](specs/user-stories/channels/US-Channels-07-channel-selection-page.md)

9. [Settings] [Manage own channel info/content preferences](specs/user-stories/channels/US-Channels-03-current-channel-settings.md)
   — the email language setting from I18n joins the Account tab here
10. [Settings] [Upload user pic](specs/user-stories/channels/US-Channels-05-upload-user-pic.md)
11. [Settings] [Change email](specs/user-stories/account/US-Account-02-Change-email.md)
12. [Settings] [Change password](specs/user-stories/account/US-Account-03-Change-password.md)

13. [Videos] [Upload videos](specs/user-stories/videos/US-Videos-05-Upload-videos.md)

14. [Channels] [Ability to see own channel and other users' channels](specs/user-stories/channels/US-Channels-04-see-own-and-other-channels.md)

15. [Videos] [Manage own videos](specs/user-stories/videos/US-Videos-03-Manage-own-videos.md)
16. [Videos] [Watch videos](specs/user-stories/videos/US-Videos-01-Watch-videos.md)
17. [Videos] [Like/dislike videos](specs/user-stories/videos/US-Videos-04-Like-dislike-videos.md)
18. [Videos] [Download videos](specs/user-stories/videos/US-Videos-02-Download-videos.md)

19. [Comments] [See other users' comments](specs/user-stories/comments/US-Comments-01-See-comments.md)
20. [Comments] [Post comments](specs/user-stories/comments/US-Comments-03-Post-comment.md)
21. [Comments] [Load replies](specs/user-stories/comments/US-Comments-02-Load-replies.md)
22. [Comments] [Reply to comments/replies](specs/user-stories/comments/US-Comments-04-Reply-to-comments.md)
23. [Comments] [Manage own comments/replies](specs/user-stories/comments/US-Comments-05-Manage-own-comments.md)
24. [Comments] [Like/dislike comments/replies](specs/user-stories/comments/US-Comments-06-Like-dislike-comments.md)

25. [Subscriptions] [Subscribe to other channels](specs/user-stories/subscriptions/US-Subscriptions-01-Subscribe-to-other-channels.md)
    — before search, because channel search orders by the subscriber counts this story starts publishing

26. [Search] [Search videos](specs/user-stories/search/US-Search-01-Search-videos.md)
27. [Search] [Search channels](specs/user-stories/search/US-Search-02-Search-channels.md)
28. [Search] [Search videos on a specific channel](specs/user-stories/search/US-Search-03-Search-videos-on-channel-page.md)

29. [Subscriptions] [See content from subscriptions in one place](specs/user-stories/subscriptions/US-Subscriptions-03-Subscription-content-page.md)
    — after search, because it reuses the channel page's video search
30. [Subscriptions] [Manage own subscriptions](specs/user-stories/subscriptions/US-Subscriptions-02-Manage-own-subscriptions.md)

31. [Recommendations] [Similar videos on the video page](specs/user-stories/recommendations/US-Recommendations-02-Similar-videos.md)
32. [Recommendations] [Feed](specs/user-stories/recommendations/US-Recommendations-01-Feed.md)

## 2. V1 (after MVP)

Alongside V1 comes section 4 of the platform plan — the work that needs the MVP to exist first: the alerts, the
observability stack split into separate containers with its retention, the root README, and the tusd Spike.

1. [Auth] [Session management](specs/user-stories/auth/US-Auth-05-Session-management.md)

2. [My activity] [See watch history](specs/user-stories/my-activity/US-My-activity-01-Watch-history.md)
3. [My activity] [See rated videos in one place](specs/user-stories/my-activity/US-My-activity-02-Rated-videos.md)
4. [My activity] [See own comments in one place](specs/user-stories/my-activity/US-My-activity-03-My-comments.md)

5. [Notifications] [Configure notifications](specs/user-stories/notifications/US-Notifications-01-Notifications-config.md)
6. [Notifications] [In-app notifications](specs/user-stories/notifications/US-Notifications-02-In-app-channel.md)
7. [Notifications] [Email notifications](specs/user-stories/notifications/US-Notifications-03-Email-channel.md)

8. [Settings] [Delete own channel](specs/user-stories/channels/US-Channels-06-delete-own-channel.md) (GDPR)
9. [Settings] [Delete account](specs/user-stories/account/US-Account-01-Delete-own-account.md) (GDPR)
10. [Settings] [Download own user data](specs/user-stories/account/US-Account-04-Download-own-user-data.md) (GDPR)
