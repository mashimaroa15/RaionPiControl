# RaionPiControl

Build for Raion 3D printing machine.

# Steps to install:
## 1. Burn Raspbian into SD card
Download the lastest image of Raspbian (lite version) and burn it into the SD card
## 2. Prepare the card
### 2.1. Install card reader
This step can be passed if you're using Linux to read the SD card because it's the same file system (EXT4)
If you're using Windows, you must install a software that can help you read/write to the SD card

#### Windows 7 and superior
Download and install [EXT2FSD v0.53](https://sourceforge.net/projects/ext2fsd/files/Ext2fsd/0.53/)
Superior version of this software is buggy on Windows 10

### 2.2. (Optional) Add infos for Wifi connection
If you're using Wifi to setup your Pi, you must enter you home Wifi information on order to connect to it.
Editing the file /etc/wpa_spplicant/wpa_supplicant.conf and add these lines:
```
network={
  ssid="network_name"
  psk="netword_password"
}
```
See also [Raspberry Docs about Wifi](https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md)

### 2.3. Activate SSH
Because this image is headless, you must enable SSH so that you can access the Raspberry Pi via SSH,
by adding a blank file named **ssh** in **boot** partition

See also [Raspberry Docs about SSH](https://www.raspberrypi.org/documentation/remote-access/ssh/)

## 3. Install required softwares
### 3.1. First thing first: Update your Pi, use all the space if needed
When you're connected via SSH, run this command to update your Pi:
```
sudo apt update && sudo apt upgrade -y
```
