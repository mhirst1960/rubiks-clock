Rubik's Clock
==============================================================================

Rubiks'c clock presents a webpage of a Rubik's cube that automatically updates every minute showing the current time of day.

![alt Rubik's Clock on the desk](media/623-624-kiosk-2.gif "Rubik's Clock!")

The implementation is based on the javascript/HTML code of Cuber found at https://github.com/stewdio/Cuber-DEMO. Cuber is a Rubik’s Cube simulator.  Rubik's Clock adds the concept of a photo cube to
Cuber.  The 6 PNG images are carefully crafted with a set of numbers on all sides.  It implements a solver that moves the pieces every minute so the numbers of the current hour and minute show on the front of the cube.


## Running Rubik's Clock

### From the desktop
There are two versions.  A 12-hour clock and a 24-hour clock.  The 12-hour clock rolls over at noon so the next hour is 1:00 (pm).  The 24-hour clock keeps counting up after noon so the next hour is 13:00.

From your Chrome browser (or Safari, or Edge, or a multitude of others) enter your choice:

- `index.html` for a 12-hour "am/pm" Rubick's clock (default)
- `index.html#clock12` for a 12-hour "am/pm" Rubick's clock

- `index.html#clock24` for a 24-hour "European" or "Military Time" clock

#### 12-hour
![alt Rubik's 12-hour Clock](media/clock12/clock12Screenshot.png "index.html#clock12")
![alt Rubik's Clock](media/856.png "index.html")
#### 24-hour
![alt Rubik's 24-hour Clock](media/clock24/clock24screenshot.png "index.html#clock24")

## Run as a Server
If you want to share the clock with your friends at home, it is very easy to
make this webpage available to any computer or smart phone in the house.

Install python3 if you don't already have it.  Then run this command from the same directory that contains index.html:

`python3 -m http.server 80`

If you prefer the older python2 you could also do this:

`python2 -m SimpleHTTPServer 80`

The URL your friends will need is based on your computer name where you ran the previous command.  Often you need to append `.local` to the end of you computer's name to access it.  For instance, if your computer is named `mycomputer` then this is the URL you want to tell your friends to go to:

- `http://mycomputer.local`
- `http://mycomputer.local/#clock12`
- `http://mycomputer.local/#clock24`

I put this on a dedicated Raspberry Pi that is continuously running at my house.  I named my Raspberry Pi `rubiks-clock`.  So this is what I tell my guests to go to from their smart phone:

- `http://rubiks-clock.local`



Note: when typing in the URL on your browser, be careful which field to put it.  don't type it into the Google search bar.  Google will never find it if it is just local inside your house.  Instead make sure to type it into the field for entering webpage URL addresses.  If one box does not work, try the other.

Also, if you make changes locally, then you may need to clear cache to see the changes on a remote computer.

# Raspberry Pi Installation

You will need a fairly powerful computer to run the javascript.

- The Raspberry Pi 4b is a great choice for this.  It is a fast processor.  I have a 8GB model and it runs great.  The 1GB model should also be fine unless you plan to run a couple  more applications that use lots of memory.

- The Raspberry Pi 3b works fine but can slow down a bit during moves so if you use this, you probably will want to minimize any extra applications running in the background. Maybe consider disabling VNC and other applications.
- The Raspberry Pi Zero V1 is not at all powerful enough.  The graphics grind to a halt. It looks terrible.
- I don't have a Raspberry Pi Zero V2.  I hear good things.  It might be fast enough.  Definitely worth a try.

## Raspberry Pi - 4 inch display

I used these instructions to install the 4 inch display from the command line from ssh login on the Raspberry Pi:


  cd ~/Downloads
  sudo rm -rf LCD-show
  git clone https://github.com/goodtft/LCD-show.git
  chmod -R 755 LCD-show
  cd LCD-show/
  sudo ./MPI4008-show

Then from the command line I run this (and hit F11 to exit full screen mode):

`/usr/bin/chromium-browser --start-fullscreen --app='file:///home/pi/rubiks-clock/index.html#clock12'`


## Install
If you put the top directory rubiks-clock directly under /home/pi, you can run these commands to install so it will automatically start every time you plug in your Raspberry.

  `cd /home/pi/pi-init`
  `./install.sh`

- It installs the http server as a service so other computers can run the by webpage remotely.
- It starts the Chrome browser automatically in full screen mode showing the clock.

#### Hide the Cursor
If you would like to hide the mouse cursor run this command:

  `echo point_at_menu=0 >> /home/pi/.config/lxpanel/LXDE-pi/panels/panel`

### Uninstall
To undo these changes, you can run these command:

  `cd /home/pi/pi-init`
   `./uninstall.sh`

  `rm /home/pi/.config/lxpanel/LXDE-pi/panels/panel`



============================================================================
# Raspberry Pi

These are instructions that show how to set this up on a Raspberry Pi with a 4 inch display

## Supplies

You will need:

- Raspberry Pi 4b
- 8GB (or larger) micro SDcard
- Miuzei 4-inch display https://www.amazon.com/dp/B07XBVF1C9?psc=1
  - https://geekdiywiki.com/4inchscreen
  - 

Install Raspberry Imager onto your PC (https://www.raspberrypi.com/software/)
)

Run the Raspberry Pi Imager on your PC

- Insert 8GB (or larger) SDCard into an sdcard reader and plug into a USB port
- Operating System: Raspberry Pi OS (32 bit)
- Storage:
  - Probably just one option
  - But it is very important to make sure you a pick the SDCard that you recently inserted
    - Verify the size matches the size of your SDCard.  E.g. 32 GB

It will take 5-10 minutes or more to write the Raspberry Pi image onto the SDCard.  Be patient.
- Writing... xx%
- Verifying... xx%

Insert SDCard into your Raspberry Pi 4b

The Miuzei display comes with 4 heat sinks. Stick on all of the heat sinks onto the Raspberry Pi board in the correct places.

Connect keyboard, mouse, and HDMI monitor to Raspberry Pi
Power on

ssh pi@rubiks-clock.local


## Installing Display Driver
The Miuzei 4-inch display requires special driver to run on a Raspberry Pi.
Download the package from the website and install based on the instructions.



==================================================
# Original CuberDemo Documentation

If you would like some deeper understanding on the cube software design and other non-Rubiks type information, I have copied much of the original documentation to README-cuber.md.  Check it out, it is interesting.

As mentioned previously my project is based on the Cuber demo posted here: https://github.com/stewdio/Cuber-DEMO




