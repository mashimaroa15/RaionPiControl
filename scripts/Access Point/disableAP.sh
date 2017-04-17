update-rc.d hostapd disable
update-rc.d dnsmasq disable

cp disable_wlan_ipstatic /etc/dhcpcd.conf
cp enable_wpa_supplicant /etc/network/interfaces

echo "System will now reboot to change settings...."

reboot

