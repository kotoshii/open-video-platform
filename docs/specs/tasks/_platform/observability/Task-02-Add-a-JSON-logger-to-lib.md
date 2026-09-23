## Add a JSON logger to lib

Add a JSON logger to `lib`, configured once, and use it in every service and worker in place of Nest's default logger.
`nestjs-pino` is the usual choice — check its current state first.

* Every line has `time`, `level`, `service`, `msg`, and context as separate fields (`videoId`, `channelId`) rather than
  inside the message text.
* `service` is the container name.
* Redact cookies, the `Authorization` header, tokens, passwords, and email confirmation and reset tokens — in the shared
  config, so no service can forget one.
* Write to standard output.

Why: a field can be filtered on, while text inside a message can only be searched. The redaction list lives in one
place because one forgotten service is enough to put a token in the logs.
