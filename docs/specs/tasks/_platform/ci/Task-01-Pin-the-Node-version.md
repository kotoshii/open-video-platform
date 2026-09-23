## Pin the Node version

Add a `.nvmrc` at the root with the Node version used locally. The CI workflows read it from there.

Why: without it, CI runs on whatever Node the runner happens to have.
