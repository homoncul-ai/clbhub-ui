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
configDir="./src/assets/commonConfig"
#port=4200
#if [ "${port}" != "4200" ]
#then
#    export PORT=${port}
#fi

npm install

if [ -d ${configDir} ]
then

    echo "Using config in : ${configDir}  "
    echo cp  ${configDir}/cluster_config.yaml.local ${configDir}/cluster_config.yaml
    cp  ${configDir}/cluster_config.yaml.local ${configDir}/cluster_config.yaml
    echo `grep -C1:6 \"constants\" ${configDir}/cluster_config.yaml`

    echo "${appName} starting up on : http://localhost:4200/ "

    echo ng serve
    ng serve

else
    echo "no config found - punting ... check your files"
    
fi




