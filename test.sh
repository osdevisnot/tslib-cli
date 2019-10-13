#!/usr/bin/env bash

set -x

npm cache clean --force

npm run setup

yarn cache clean

cd ~/temp

rm -rf store

tslib init store link

cd store
yarn build
yarn coverage
yarn format
yarn lint

npm run build
npm run coverage
npm run format
npm run lint

