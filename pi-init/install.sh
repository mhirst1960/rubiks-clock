#! /bin/bash

echo installing http service...

sudo cp rubiks-clock-http.service /lib/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable rubiks-clock-http.service

echo installing custom splashscreen that shows during boot
sudo cp splash.png /usr/share/plymouth/themes/pix/

echo installing custom wallpaper..
export DISPLAY=:0.0
pcmanfm --set-wallpaper `pwd`/Rubiks-wallpaper.png

echo installing full-screen browser autostart...

mkdir -p /home/pi/.config/autostart/
cp rubiks-clock.desktop /home/pi/.config/autostart/

echo
echo 'If you want to hide the cursor, run this command:'
echo 'echo point_at_menu=0 >> /home/pi/.config/lxpanel/LXDE-pi/panels/panel'
echo
echo Please Reboot now.  http server and screensaver should run when system boots
