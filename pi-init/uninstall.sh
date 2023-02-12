#! /bin/bash

echo removing http service...

sudo systemctl disable rubiks-clock-http.service
sudo rm -f /lib/systemd/system/rubiks-clock-http.service


echo diabling full-screen browser autostart...

rm -f /home/pi/.config/autostart/rubiks-clock.desktop 

echo Please Reboot now.  http server and screensaver should no longer run automatically when system boots
