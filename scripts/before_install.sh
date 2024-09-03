#!/bin/bash
#create our working directory if it doesnt exist
DIR="/home/ec2-user/ev3-frontend"
if [ -d "$DIR" ]; then
  echo "${DIR} exists"
else
  echo "Creating ${DIR} directory"
  sudo mkdir ${DIR}
fi
