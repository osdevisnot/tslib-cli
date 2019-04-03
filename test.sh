#!/usr/bin/env bash

cd ~/temp

rm -rf my-lib

tslib init my-lib --verbose

cd my-lib

tslib build --verbose

tslib coverage --verbose

tslib setup --verbose

git status
