#!/bin/bash
export AWS_ACCESS_KEY_ID=AKIAXTHP632YIPZ7TNGZ
export AWS_SECRET_ACCESS_KEY=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
export S3_BUCKET=nfluence-assets

export REACT_APP_AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
export REACT_APP_AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
export REACT_APP_S3_BUCKET=${S3_BUCKET}

node index.js