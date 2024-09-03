#!/bin/bash

#give permission for everything in the express-app directory
sudo chmod -R 755 /home/ec2-user/ev3-frontend/

#navigate into our working directory where we have all our github files
rm -r /home/ec2-user/ev3-frontend/*

cd /home/ec2-user/ev3-frontend-temp
mv build/* /home/ec2-user/ev3-frontend/
mv .htaccess /home/ec2-user/ev3-frontend/

cd /home/ec2-user
rm -r /home/ec2-user/ev3-frontend-temp
