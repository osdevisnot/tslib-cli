#!/usr/bin/env bash

cd ~/temp

rm -rf my-lib

tslib init my-lib

cd my-lib

tslib build

tslib coverage

tslib setup

git status
