
// Cycle through canned sequence of moves that show the time of day on the
// front of the Rubik's cube

useFakeTime = false // set to true for debugging a given time of day
fakeStartHour = 23
fakeStartMinute = 58

fakeOffsetMilliseconds = (fakeStartHour*60 + fakeStartMinute)*60000

startDate = new Date()
startMilliseconds = startDate.getTime()
startMinutes = startDate.getMinutes()
startHours = startDate.getHours()

startMinutesSinceMidnight = (60 * startHours) + startMinutes
fakeOffsetMilliseconds -= startMinutesSinceMidnight * 60000

if (useFakeTime) {
    startDate.setTime(startMilliseconds+fakeOffsetMilliseconds)
}

catchUp = false

// first time we boot we want to show long sequence of moves at .25 seconds as part of "bling"
// forever after (aka when browser wakes from sleep) if we need to catchup then do it fast and hidden
lightningCatchup = false

// normally we just hide the cube but set this to true to show a black&white version while it solves
catchupBlackAndWhite = false

clockType = null
clockDataPrevious = null
newClockData = true
rolloverToNewDay = false

clockIsSolved = false
clockIndex = 1


window.solver = new Solver()

solver.consider = function( cube ){

	//  Was our solver passed a valid Cube?
	//  Kind of important, eh?

	if( cube === undefined ){

		console.warn( 'A cube [Cube] argument must be specified for Solver.consider().' )
		return false
	}
	else if( cube instanceof Cube === false ){

		console.warn( 'The cube argument provided is not a valid Cube.' )
		return false
	}


	//  If we're solving we should really make certain we aren't shuffling!
	//  Otherwise our logic will never actually run.
	//  The hook for this is in Cube.loop() so look there to see what's up.

	cube.isShuffling = false


	//  If the cube is already solved then our job is done before it started.
	//  If not, we need to try solving it using our current solve method.

    // Note: in this case a "solved" cube does not have solid colors on all sides
    // so we will ignore the cube's internal notion of "solved"
    // Do not call cube.isSolved() here.

    return this.logic( cube )
}

solver.logic = function( cube ){

    var reverseMoves = function(moves){
        var newMoves = "";
        for(var i = moves.length-1 ; i>=0; i--){
            if(moves[i] === moves[i].toLowerCase()){
                newMoves += moves[i].toUpperCase();
            }else {
                newMoves += moves[i].toLowerCase();
            }
        }
        // console.log(newLetters);
        return newMoves;
    }

    function showCatchup( cube ){

        if (!catchupBlackAndWhite) {
            cube.hide() 
        }
  
        cube.hidePlastics()
        cube.hideStickers()
        cube.hideIntroverts()
        cube.hideClock12()
        cube.hideClock24()

        cube.hideLogo()
        cube.hideClockLogo()
        cube.hideArrows()
        cube.hidePhotos()

        if (cube.clockType ==12) {
            cube.showClock12()
            cube.hideClock24()
        } else {
            cube.hideClock12()
            cube.showClock24()
        }


        cube.hideIds()
        cube.hideTexts()
        cube.showWireframes()
        cube.setOpacity()
	}

    function showNormal( cube) {
        cube.show()
        cube.showIntroverts()
        cube.showPlastics()
        cube.showStickers()

        cube.hideLogo()
        cube.hideClockLogo()
        cube.hideArrows()
        cube.hidePhotos()

        if (cube.clockType ==12) {
            cube.showClock12()
            cube.hideClock24()
        } else {
            cube.hideClock12()
            cube.showClock24()
        }

        cube.hideTexts()
        cube.hideWireframes()
        cube.hideIds()
        cube.setOpacity()
        cube.setRadius()
    }

    tmwClock = false
    robotClock = true

    clockIsSolved = false
    // Sticker images (photos) are in media/TMWClock
    // var moves = rubikRobot1Moves

    if (clockType != null && cube.clockType != clockType) {
        clockDataPrevious = clockData
        newClockData = true
    }

    clockType = cube.clockType

    if (cube.clockType == 12) {
        clockData = rubiksClockData12
    } else {
        clockData = rubiksClock24Data
    }

    if (clockDataPrevious == null) {
        clockDataPrevious = clockData
    }

    if (clockIndex > 60*24) {
        clockIndex -= 60*24
    }

    var minutesSinceMidnight

    var date = new Date()

    if (useFakeTime) {
        realMilliseconds = date. getTime()
        date.setTime(realMilliseconds+fakeOffsetMilliseconds)
    }

    minutes = date.getMinutes();
    hours = date.getHours();
    minutesSinceMidnight = (60 * hours) + minutes;

    if (rolloverToNewDay || clockIndex == 11*60+59 || clockIndex == 12*60 || clockIndex == 0) {
        lightningCatchup = false
        catchup = true
    }

    // Faster cube solving if
    // - not 11:59 to 12:00 (aka normal slow speed even thought the sequence is long)
    // - we are switching clocks types from 12hr to 24hr or 24hr to 12hr
    // - current time if pretty far from previous time: more than 4 minutes away

    // TODO: should fade in or something.  It is kind of startling to have the clock hidden for a second or two
    //       maybe clone and show the old clock then switch it out when ready.

    if (newClockData || Math.abs(minutesSinceMidnight - clockIndex) > 4) {
        catchUp = true
        if (lightningCatchup) {
            cube.twistDuration = 0
            showCatchup(cube)
            //cube.zoomInFromFar()
        } else {
            cube.twistDuration = SECOND / 4
        }

    } else if (catchUp) {
        catchUp = false
        cube.twistDuration = SECOND / 2
        showNormal(cube)
    }

    if (catchUp || newClockData) {


        if (clockIndex <= 1) {
            if (rolloverToNewDay) {
                if (clockIndex == 0) {
                    move = clockDataPrevious[60*24][1]
                } else {
                    move = clockDataPrevious[1][1]
                }
            } else {
                move = " "
            }
        } else {
            move = clockDataPrevious[clockIndex-1][1]
        }
        move += reverseMoves(clockData[minutesSinceMidnight][1])
        cube.twistQueue.add( move )
        clockIndex = minutesSinceMidnight + 1
    } else {
        for( i = clockIndex; i <= minutesSinceMidnight; i ++ ){

            move = clockData[i][0]
            cube.twistQueue.add( move )
            clockIndex += 1
        }
    }

    if (clockIndex == 24*60 || clockIndex == 0) {
        rolloverToNewDay = true
    } else {
        rolloverToNewDay = false
    }

    clockDataPrevious = clockData
    newClockData = false

    clockIsSolved = true

    if (catchUp) {
        // should show the cube after solving
        // setTimeout( function(){ show stuff }, SECOND * 60 )
    }

    // We have now initialized the clock.  All catchup should be done quickly
    lightningCatchup = true

    // execute next sequence in 15 seconds
    setTimeout(
        function(){
        clockIsSolved = false
        cube.isSolving = true
        }, SECOND * 60 )

    // return true sets cube.isSolving = true
    // But in 60 seconds we will trigger it to start solving again. (see above)
    return true

}
