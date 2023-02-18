#! /bin/bash

# This script configures the raspberry pi to boot
# automatically into full screen display (aka kiosk)
# of a rubiks-clock.
# - It modifies the startup splash screen to show
#   Rubik's cube instead of the Raspberry Pi logo.
# - It configures the Chrome browser to automtaically
#   start in full screen mode running the rubiks-clock javascript
# - It automatically hides clutter such as the trash can.
#
# It also automatically starts a webserver so people
# on your networks can run the rubiks-clock on their
# laptop or smart-phone.
#
# If you don't like any one of these modifications
# you can comment out the line or line you don't like

## Web server
echo installing http service...

sudo cp rubiks-clock-http.service /lib/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable rubiks-clock-http.service

## replace Raspberry Pi boot screen with a Rubik's Cube
echo installing custom splashscreen that shows during boot
sudo cp splash.png /usr/share/plymouth/themes/pix/

## set the user's background to show a Rubik's Cube
echo installing custom wallpaper..
export DISPLAY=:0.0
pcmanfm --set-wallpaper `pwd`/Rubiks-wallpaper.png

## Hide desktop clutter
echo hide trashcan and mounts..
sed -i s/show_trash=1/show_trash=0/ .config/pcmanfm/LXDE-pi/desktop-items-0.conf
sed -i s/show_mounts=1/show_mounts=0/ .config/pcmanfm/LXDE-pi/desktop-items-0.conf

## Auto-start the Chrome browser and run the clock
echo installing full-screen browser autostart...

mkdir -p /home/pi/.config/autostart/
cp rubiks-clock.desktop /home/pi/.config/autostart/

echo
echo 'If you want to hide the cursor, run this command:'
echo 'echo point_at_menu=0 >> /home/pi/.config/lxpanel/LXDE-pi/panels/panel'
echo
echo Please Reboot now.  http server and screensaver should run when system boots
