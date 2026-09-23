## Generate test videos with FFmpeg

Needs: [Task-01 — Create the seed script](Task-01-Create-the-seed-script.md)

Generate about 60 short video files with FFmpeg's built-in sources — `testsrc`, `testsrc2` or `smptebars`, with a
`sine` tone — in varied lengths (a few seconds to a minute), sizes (240p to 1080p, a few in portrait) and containers
(`.mp4`, `.webm`, `.mov`). Write them to a git-ignored folder, and reuse the files already there.

Why: nothing binary is committed, and the varied sizes exercise the encoding ladder, which never encodes above the
source ([ffmpeg-processing-parameters.md](../../../../explainers/ffmpeg-processing-parameters.md), Part 3).
