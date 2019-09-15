#!/usr/bin/env bash

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

