#!/bin/bash
set -e
cd "$(dirname "$0")"
echo "Cobra Pro Max - Android TWA Build Script (package: com.cobrapromax.game)"
echo "Building PWA first..."
npm run build
if [ ! -d "node_modules/@bubblewrap/cli" ]; then npm install --save-dev @bubblewrap/cli; fi
npx bubblewrap init --manifest=twa-manifest.json --no-checkout || true
echo "Running bubblewrap build..."
npx bubblewrap build --skipPwaValidation --manifest=twa-manifest.json || true
echo "If bubblewrap succeeds, the APK/AAB is in ./app-release-signed.apk"
echo "Alternative: upload contents of out/ to Google Play Console as TWA."
