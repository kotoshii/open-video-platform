## Spike: Can several tusd instances share uploads

With the S3 backend, tusd keeps an upload's state in S3, so in principle any instance can continue any upload. Its
default locker only works inside one process, though. Find out, for the tusd version in use, how two instances can be
stopped from writing to the same upload at once — or whether tusd has to stay a single instance.

Write the answer into [scaling-to-multiple-instances.md](../../../../explainers/scaling-to-multiple-instances.md),
Part 9.

Why: the design treats this as unverified, and two instances writing one upload corrupt it rather than fail.
