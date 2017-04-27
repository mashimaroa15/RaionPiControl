#!/usr/bin/env bash
echo BEFORE
free -m
sudo sh -c "/bin/echo 3 > /proc/sys/vm/drop_caches"
sync
echo ------------------------------------------------------
echo AFTER
free -m
