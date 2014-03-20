#!/bin/bash
BUILD_ENV=test
BUILD_TYPE=all
SERVER=root@115.28.134.105
APP_NAME=vqupai.ipa
BUILD_DIR=../build
REMOVE_DIR="/alidata/www/m.vqupai.com/webroot/m/"
if [ "$1" != "" ];then
	BUILD_ENV=$1
fi
if [ "$2" != "" ];then
	BIULD_TYPE=$2
fi

rm -rf $BUILD_DIR/*
mv app/Config.js app/Config.js.bak
if [ "$BUILD_ENV" == "test" ];then
	mv Config.js.test app/Config.js
	REMOVE_DIR="/alidata/www/t.vqupai.com/webroot/m/"
else
	mv Config.js.production app/Config.js
	REMOVE_DIR="/alidata/www/m.vqupai.com/webroot/m/"
fi
sencha app build native
if [ "$BUILD_TYPE" == "all" ] || [ "$BUILD_TYPE" == "pkg" ];then
	mv $BUILD_DIR/native-package-mobile/WeiQuPai/packager.json $BUILD_DIR/native-package-mobile/WeiQuPai/Payload
	cd $BUILD_DIR/native-package-mobile/WeiQuPai/
	zip -r -q $APP_NAME Payload
	cd -
	mv $BUILD_DIR/native-package-mobile/WeiQuPai/$APP_NAME $BUILD_DIR/
	scp $BUILD_DIR/vqupai.ipa $SERVER:$REMOVE_DIR
fi

if [ "$BUILD_TYPE" == "all" ] || [ "$BUILD_TYPE" == "web" ];then
	scp -r $BUILD_DIR/native/WeiQuPai/* $SERVER:/alidata/www/m.vqupai.com/webroot/m/
fi

#clean the temp file
rm -rf ../build/{temp,native,native-package-mobile}
#restore the working copy Config.js
mv app/Config.js.bak app/Config.js
