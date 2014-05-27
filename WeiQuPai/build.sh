#!/bin/bash
BUILD_ENV=test
BUILD_TYPE=local
SERVER=root@115.28.134.105
APP_NAME=vqupai.ipa
BUILD_DIR=cordova/
REMOTE_DIR="/alidata/www/m.vqupai.com/webroot/m/"
PACKAGE_DIR="/alidata/www/vqupai/adhoc/"
ANDROID_DIR="cordova/platforms/android/ant-build"
MARKET=all
if [ "$1" != "" ];then
	BUILD_ENV=$1
fi
if [ "$2" != "" ];then
	BUILD_TYPE=$2
fi
if [ "$3" != "" ]; then
	MARKET=$3
fi
if [ "$1" == "pub" ];then
	scp ../build/vqupai.ipa $SERVER:$PACKAGE_DIR
	scp ../build/vqupai.apk $SERVER:$PACKAGE_DIR
	scp adhoc/* $SERVER:$PACKAGE_DIR/
	exit 0
fi
echo "starting build $BUILD_ENV $BUILD_TYPE"
mv app/Config.js app/Config.js.bak
if [ "$BUILD_ENV" == "test" ];then
	cp Config.js.test app/Config.js
	REMOTE_DIR="/alidata/www/t.vqupai.com/webroot/m/"
else
	cp Config.js.production app/Config.js
	REMOTE_DIR="/alidata/www/m.vqupai.com/webroot/m/"
fi
if [ "$BUILD_TYPE" != "market" ];then
	sed -i '' "s/#MARKET#/appstore/" app/Config.js
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
#android市场打包
if [ "$BUILD_TYPE" == "market" ];then
	cd cordova
	cp www/app.js app.js
	if [ "$MARKET" == "all" ];then
		while read market; do
			echo "build apk for market $market"
			sed  "s/#MARKET#/$market/" app.js > www/app.js
			cordova build android --release
			mv platforms/android/ant-build/android-release.apk ../../build/$market.apk
		done < ../market.conf
	else 
		echo "build apk for market $MARKET"
		sed  "s/#MARKET#/$MARKET/" app.js > www/app.js
		cordova build android --release
		mv platforms/android/ant-build/android-release.apk ../../build/$MARKET.apk
	fi
	rm app.js
	cd -
fi

if [ "$BUILD_TYPE" == "all" ] || [ "$BUILD_TYPE" == "web" ];then
	echo "scp to remote => $SERVER:$REMOTE_DIR"
	scp -r $BUILD_DIR/www/* $SERVER:$REMOTE_DIR
fi

#clean the temp file
rm -rf ../build/{temp,native,native-package-mobile}
#restore the working copy Config.js
mv app/Config.js.bak app/Config.js
