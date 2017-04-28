#!/usr/bin/env bash
# version 0.1.1
BRANCH_DEFAULT="develop"
BRANCH_MASTER="master"
DIR="/home/pi/RaionPiControl/"
WWW="/var/www/html"
RAIONPICONTROL="https://github.com/mashimaroa15/RaionPiControl.git"

if [ "$1" == "${BRANCH_MASTER}" ]; then
  BRANCH_DEFAULT=${BRANCH_MASTER}
fi &&
echo Check out branch ${BRANCH_DEFAULT} ... &&

if [ -d "${DIR}" ]; then
  echo ${DIR} exists &&
  cd ${DIR} &&
  git checkout -b ${BRANCH_DEFAULT} || true &&
  git pull origin ${BRANCH_DEFAULT} &&
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
