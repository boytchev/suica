CCapture.all.min.js is the original CCapture packege. When GIF is created, it requires a path to gif.worker.js, so this file must be included too; and the whole code must be run from HTTPS.

For Suica a modified version is CCapture.all.worker.min.js is made. It has gif.worker.js embedded in itself, so no additional file is needed and the code can run locally.

Embedding is done following: https://stackoverflow.com/a/61621269
