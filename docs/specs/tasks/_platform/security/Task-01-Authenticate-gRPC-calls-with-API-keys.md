## Authenticate gRPC calls with API keys

Every gRPC call carries the calling service's API key in its metadata, and every gRPC server rejects a call without a
key it knows.

* A client interceptor in `lib` adds the caller's key, from its environment, as `x-api-key` metadata.
* A server interceptor in `lib` checks the key against the keys the service accepts — a map from key to caller name —
  and answers `UNAUTHENTICATED` otherwise. Log the caller's name with each call.
* Each service has its own key, so one can be replaced without touching the others. Add them to the environment files.

Why: gRPC ports are open to every container on the Docker network, so today anything running there can call any
service's methods.
