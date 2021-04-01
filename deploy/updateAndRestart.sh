#!/bin/bash

# any future command that fails will exit the script
set -e

# Delete the old repo
rm -rf /home/ec2-user/feedposter/

# clone the repo again
git clone git@gitlab.com:talapbekov/feedposter.git

#source the nvm file. In an non
#If you are not using nvm, add the actual path like
# PATH=/home/ubuntu/node/bin:$PATH
source /home/ec2-user/.nvm/nvm.sh

#pm2 needs to be installed globally as we would be deleting the repo folder.
npm i -g pm2
# stop the previous pm2
pm2 kill


# starting pm2 daemon
pm2 status

cd /home/ec2-user/feedposter
cp /home/ec2-user/.env ./.env

mkdir dist
cp -r /home/ec2-user/dist/. dist/

#install npm packages
echo "Running npm install"
npm install

#Restart the node server
pm2 start dist/src/main.js
