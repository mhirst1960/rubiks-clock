#! /bin/bash

echo installing http service...

sudo cp rubiks-clock-http.service /lib/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable rubiks-clock-http.service


echo installing full-screen browser autostart...

mkdir -p /home/pi/.config/autostart/
cp rubiks-clock.desktop /home/pi/.config/autostart/

echo Please Reboot now.  http server and screensaver should run when system boots
