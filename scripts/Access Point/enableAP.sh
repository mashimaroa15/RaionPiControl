update-rc.d hostapd enable
update-rc.d dnsmasq enable

cp enable_wlan_ipstatic /etc/dhcpcd.conf
cp disable_wpa_supplicant /etc/network/interfaces

echo "System will now reboot to change settings...."

reboot
