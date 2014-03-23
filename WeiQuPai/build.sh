#!/bin/bash
BUILD_ENV=test
BUILD_TYPE=all
SERVER=root@115.28.134.105
APP_NAME=vqupai.ipa
BUILD_DIR=../build
REMOTE_DIR="/alidata/www/m.vqupai.com/webroot/m/"
PACKAGE_DIR="/alidata/www/vqupai/adhoc/"
if [ "$1" != "" ];then
	BUILD_ENV=$1
fi
if [ "$2" != "" ];then
	BIULD_TYPE=$2
fi
echo "starting build $BUILD_ENV $BUILD_TYPE"
rm -rf $BUILD_DIR/*
mv app/Config.js app/Config.js.bak
if [ "$BUILD_ENV" == "test" ];then
	cp Config.js.test app/Config.js
	REMOTE_DIR="/alidata/www/t.vqupai.com/webroot/m/"
else
	cp Config.js.production app/Config.js
	REMOTE_DIR="/alidata/www/m.vqupai.com/webroot/m/"
fi
sencha app build native
if [ "$BUILD_TYPE" == "all" ] || [ "$BUILD_TYPE" == "pkg" ];then
	mv $BUILD_DIR/native-package-mobile/WeiQuPai/packager.json $BUILD_DIR/native-package-mobile/WeiQuPai/Payload
	cd $BUILD_DIR/native-package-mobile/WeiQuPai/
	zip -r -q $APP_NAME Payload
	cd -
	mv $BUILD_DIR/native-package-mobile/WeiQuPai/$APP_NAME $BUILD_DIR/
	echo "publish package => $PACKAGE_DIR"
	scp $BUILD_DIR/vqupai.ipa $SERVER:$PACKAGE_DIR
fi

if [ "$BUILD_TYPE" == "all" ] || [ "$BUILD_TYPE" == "web" ];then
	echo "scp to remote => $SERVER:$REMOTE_DIR"
	scp -r $BUILD_DIR/native/WeiQuPai/* $SERVER:$REMOTE_DIR
fi

#clean the temp file
rm -rf ../build/{temp,native,native-package-mobile}
#restore the working copy Config.js
mv app/Config.js.bak app/Config.js
