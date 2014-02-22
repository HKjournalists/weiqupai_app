#!/bin/bash
APP_NAME=vqupai.ipa
BUILD_DIR=../build
rm -rf $BUILD_DIR/*
sencha app build native
mv $BUILD_DIR/native-package-mobile/WeiQuPai/packager.json $BUILD_DIR/native-package-mobile/WeiQuPai/Payload
cd $BUILD_DIR/native-package-mobile/WeiQuPai/
zip -r -q $APP_NAME Payload
cd -
mv $BUILD_DIR/native-package-mobile/WeiQuPai/$APP_NAME $BUILD_DIR/
#clean the temp file
rm -rf ../build/{temp,native,native-package-mobile}
