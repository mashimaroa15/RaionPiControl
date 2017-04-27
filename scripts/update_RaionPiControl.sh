#!/usr/bin/env bash
# version 0.1
DIR="/home/pi/RaionPiControl/"
WWW="/var/www/html"
RAIONPICONTROL="https://github.com/mashimaroa15/RaionPiControl.git"

if [ -d "$DIR" ]; then
  echo ${DIR} exists &&
  cd ${DIR} &&
  git pull &&
  cd ~
else
  echo ${DIR} doesn\'t exist &&
  echo Clone new Git... &&
  git clone ${RAIONPICONTROL} ${DIR}
fi &&

#echo Remove all files... &&
#cd ${WWW} && rm -rf * && ls -A1 | xargs rm -rf &&

echo Sync files with WWW directory... &&
rsync -a --partial --delete ${DIR} ${WWW} &&

echo Change ownership... &&
chown -R pi:web ${WWW} &&

echo Change permissions... &&
chmod -R 775 ${WWW} &&
cd ~