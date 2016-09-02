#!/bin/bash

choice=$1
case $choice in
    1 ) echo "Syncing raion $choice ..." 
		rsync -e "ssh -i C:/Users/kennysang/.ssh/key_raion1" -avz --delete-after ./* pi@10.8.0.3:/var/www/html/
		echo Sync completed !
		date
        ;;
    2 ) echo "Syncing raion $choice ..."
		rsync -e "ssh -i C:/Users/kennysang/.ssh/key_raion2" -avz --delete-after ./* pi@10.8.0.4:/var/www/html/
		echo Sync completed !
		date
        ;;
    3 ) echo "Syncing raion $choice ..."
		rsync -e "ssh -i C:/Users/kennysang/.ssh/key_raionpi3" -avz --delete-after ./* pi@192.168.1.69:/var/www/html/
		echo Sync completed !
		date
        ;;
    * ) echo "Usage : "
        echo "./update.sh [number of raionpi]"
esac


#rsync -e "ssh -i C:/Users/kennysang/.ssh/key_raion1" -avz --delete-after ./* pi@10.8.0.3:/var/www/html/ &&
#rsync -e "ssh -i C:/Users/kennysang/.ssh/key_raion2" -avz --delete-after ./* pi@10.8.0.4:/var/www/html/
#rsync -e "ssh -i C:/Users/kennysang/.ssh/key_raionpi3" -avz --delete-after ./* pi@192.168.1.69:/var/www/html/
