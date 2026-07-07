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
port=4200
if [ "${port}" != "8080" ]
then
    export PORT=${port}
fi

npm install

if [ -d ${configDir} ]
then

    echo "Using config in : ${configDir}  "
    targetConfig="${configDir}/cluster_config.json"
    localConfig="${configDir}/cluster_config.local.json"
    defaultConfig="${configDir}/cluster_config.default.json"

    if [ -f "${targetConfig}" ]
    then
        echo "Found ${targetConfig}. Keeping existing config."
    elif [ -f "${localConfig}" ]
    then
        echo "Found ${localConfig}. Copying to ${targetConfig}."
        cp "${localConfig}" "${targetConfig}"
    elif [ -f "${defaultConfig}" ]
    then
        echo "No ${targetConfig} or ${localConfig} found."
        echo "Copying ${defaultConfig} to ${targetConfig}."
        cp "${defaultConfig}" "${targetConfig}"
    else
        echo "No usable cluster config found."
        echo "Expected one of:"
        echo "  - ${targetConfig}"
        echo "  - ${localConfig}"
        echo "  - ${defaultConfig}"
        exit 1
    fi

    echo "$(grep -n \"constants\" "${targetConfig}")"

    echo "${appName} starting up on : http://localhost:${port}/ "

    echo ng serve
    ng serve

else
    echo "no config found - punting ... check your files"
    
fi




