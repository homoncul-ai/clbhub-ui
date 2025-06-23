#!/bin/bash

curl  localhost:8099/trutesta-hccl-services/hccl/swagger.json | jq |  tee  hccl.swagger.json



