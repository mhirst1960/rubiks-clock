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

installhttp='y'
runbrowser='y'
clockstyle=12
installsplash='y'
installwallpaper='y'
hidetrash='y'
hidemounts='y'

function usage()
{

   cat << HEREDOC

   Usage: $progname [--style 12|24] [--no-http] [--no-splash] [--no-wallpaper] [--keep-trash] [--keep-mounts]

   All arguments are optional here is a summary:
     -h, --help           show this help message
     --style              12 = 12-hour clock, 24 = 24-hour clock
     --no-screensaver     do not automatically show Rubik's Cube clock full screen
     --no-httpserver      do not install http server
     --no-splash          do not install custom boot splash screen
     --no-wallpaper       do not install rubik's cube wallpaper
     --keep-trash         do not hide the trashcan icon
     --keep-mounts        do not hide sdcard mount icons
     --no-extras          do not modify: splash screen, wallpaper, desktop icons

HEREDOC
} 

while [[ "$#" -gt 0 ]]; do
    case $1 in
        -h | --help ) usage; exit; ;;
        --style) clockstyle="$2"; shift ;;
        --no-httpserver) installhttp='n' ;;
        --no-screensaver) runbrowser='n' ;;
        --no-splash) installsplash='n' ;;
        --no-wallpaper) installwallpaper='n' ;;
        --keep-trash) hidetrash='n' ;;
        --keep-mounts) hidemounts='n' ;;
        --no-extras) installsplash='n'
                    installwallpaper='n'
                    hidetrash='n'
                    hidemounts='n' ;;
        *) echo "Unknown parameter: $1"; usage; exit 1 ;;
    esac
    shift
done

echo "install http server        = $installhttp"
echo "auto-start browser         = $runbrowser"
echo "clock style                = $clockstyle"
echo "cube splash screen on boot = $installsplash"
echo "cube desktop               = $installwallpaper"
echo "hide trashcan icon         = $hidetrash"
echo "hide sdcard mounts icons   = $hidemounts"
timedatectl show | grep Timezone
echo

if [ "$clockstyle" != 12 ] && [ "$clockstyle" != 24 ]; then
    echo "Illegal value --style must be either 12 or 24"
    exit 1
fi

while true; do
    read -p "Is configuration good? [Y or N] " yn
    case $yn in
        [Yy]* ) break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

if [ "$installhttp" == 'y' ]; then
## Web server
    echo installing http service...

    sudo cp $SCRIPT_DIR/rubiks-clock-http.service /lib/systemd/system/
    sudo systemctl daemon-reload
    sudo systemctl enable rubiks-clock-http.service
else
    sudo systemctl disable rubiks-clock-http.service
    sudo rm -f /lib/systemd/system/rubiks-clock-http.service
fi

if [ "$installsplash" == 'y' ]; then
    ## replace Raspberry Pi boot screen with a Rubik's Cube
    echo installing custom splashscreen that shows during boot
    sudo cp $SCRIPT_DIR/splash.png /usr/share/plymouth/themes/pix/
fi

if [ "$installwallpaper" == 'y' ]; then
    ## set the user's background to show a Rubik's Cube
    echo installing custom wallpaper..
    export DISPLAY=:0.0
    pcmanfm --set-wallpaper $SCRIPT_DIR/Rubiks-wallpaper.png
fi

## Hide desktop clutter
if [ "$hidetrash" == 'y' ]; then
    echo hide trashcan..
    sed -i s/show_trash=1/show_trash=0/ /home/pi/.config/pcmanfm/LXDE-pi/desktop-items-0.conf
fi

if [ "$hidemounts" == 'y' ]; then
    echo hide mounts..
    sed -i s/show_mounts=1/show_mounts=0/ /home/pi/.config/pcmanfm/LXDE-pi/desktop-items-0.conf
fi

if [ "$runbrowser" == 'y' ]; then
    ## Auto-start the Chrome browser and run the clock
    echo installing full-screen browser autostart...

    mkdir -p /home/pi/.config/autostart/
    if [ "$clockstyle" == '24' ]; then
        cp $SCRIPT_DIR/rubiksclock24.desktop /home/pi/.config/autostart/rubiks-clock.desktop
    else
        cp $SCRIPT_DIR/rubiksclock12.desktop /home/pi/.config/autostart/rubiks-clock.desktop
    fi
else
    rm -f /home/pi/.config/autostart/rubiks-clock.desktop 
fi

#echo
#echo 'If you want to hide the cursor, run this command:'
#echo 'echo point_at_menu=0 >> /home/pi/.config/lxpanel/LXDE-pi/panels/panel'
#echo

echo
echo "Please Reboot now."

if [ "$runbrowser" == 'y' ]; then
    echo "Rubik's Clock screensaver will automatically run when system boots"
fi

if [ "$installhttp" == 'y' ]; then
    echo "http server will run when system boots"
fi

