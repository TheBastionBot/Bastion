#!/bin/bash

HASH=$(node -e "console.log(require(\"./monitors/sanity.js\").e)")
ACTUAL_HASH=$(sha256sum ./locales/constants.yaml | awk '{print $1}')

if [[ $HASH != ${ACTUAL_HASH: -13} ]]; then
    echo "[ERROR] MISMATCH"
    echo "[EXPECTED] ${ACTUAL_HASH: -13} [FOUND] $HASH"
    exit 13
fi
