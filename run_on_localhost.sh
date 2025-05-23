#!/bin/bash

#
# Change your ./app/appConfig/apiservices.json for your installation
#

#
#Anthonys-Mac-mini:intk-epf-docs-ui aadevoe$ ./run_on_localhost.sh
#up to date in 3.123s
#Using config in : ./app/appConfig
# src/assets/appConfig/apiservices.json
#6:        "sprigEndPoint"               : "http://localhost:8071/sprig/",
#7:        "appliances"                  : "http://localhost:8071/sprig/admin/",
#8:        "notifications"               : "http://localhost:8071/sprig/documents/",
#21:        "sprigDeviceTimeout"          : 4000,
#TruDelivery starting up on : http://0.0.0.0:9000/
#grunt server
#

appName="TrutestaDevops"
configDir="./src/assets/appConfig"
#port=4200
#if [ "${port}" != "4200" ]
#then
#    export PORT=${port}
#fi

npm install

if [ -d ${configDir} ]
then

    echo "Using config in : ${configDir}  "

else

    mkdir -p  ${configDir}
    cp ./tooling/config_for_dev/* ${configDir}
    echo "Created and Using config in : ${configDir} "

fi

echo "${configDir}/apiservices.json using SPRIG Services "
cat ${configDir}/apiservices.json | grep -ni sprig

echo "${appName} starting up on : http://localhost:4200/ "

echo ng serve
ng serve


