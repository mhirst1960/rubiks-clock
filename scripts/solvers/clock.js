
// Cycle through canned sequence of moves that show the time of day on the
// front of the Rubik's cube

useFakeTime = false // set to true for debugging startup

startDate = new Date()
startMinutes = startDate.getMinutes()
startHours = startDate.getHours()
startMinutesSinceMidnight = (60 * startHours) + startMinutes
catchUp = false
catchupBlackAndWhite = false
clockType = null
clockDataPrevious = null
newClockData = true

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

        cube.show()
        cube.hidePlastics()
        cube.hideStickers()
        cube.hideIntroverts()

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
        clockData = rubiksClockData
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

    minutes = date.getMinutes();
    hours = date.getHours();
    minutesSinceMidnight = (60 * hours) + minutes;

    if (useFakeTime) {
        minutesSinceMidnight -= startMinutesSinceMidnight
    }

    // TODO probably want to just continue with the sequence
    //      if we are behind by just a few minutes.  Just do
    //      it a few times and we wil be caught up

    if (newClockData || Math.abs(minutesSinceMidnight - clockIndex) > 10) {
        catchUp = true
        cube.twistDuration = 0
        if (catchupBlackAndWhite) {
            showCatchup(cube)
        }
    } else if (catchUp) {
        catchUp = false
        cube.twistDuration = SECOND / 2
        showNormal(cube)
    }

    if (catchUp || newClockData) {


        if (clockIndex <= 1) {
            move = ""
        } else {
            move = clockDataPrevious[clockIndex-1][1]
        }
        move += reverseMoves(clockData[minutesSinceMidnight][1])
        // TODO fix rotation of centers
        cube.twistQueue.add( move )
        clockIndex = minutesSinceMidnight + 1
    } else {
        for( i = clockIndex; i <= minutesSinceMidnight; i ++ ){

            move = clockData[i][0]
            cube.twistQueue.add( move )
            clockIndex += 1
        }
    }

    clockDataPrevious = clockData
    newClockData = false

    clockIsSolved = true

    if (catchUp) {
        // should show the cube after solving
        // setTimeout( function(){ show stuff }, SECOND * 60 )
    }

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
