## Start every app with one command

Add a root `yarn dev` that starts every API, worker and the UI in watch mode, with `lib` and `proto` rebuilding in watch
mode as well. `yarn workspaces foreach --all --parallel --interlaced --verbose run dev` runs them together and prefixes
every line with its workspace name; each app gets a `dev` script.

Why: over twenty apps and a UI are too many to start in separate terminals.
