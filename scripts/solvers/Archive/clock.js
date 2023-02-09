


clockIsSolved = false
clockIndex = 1
window.solver = new Solver()
solver.logic = function( cube ){

    tmwClock = false
    robotClock = true

    clockIsSolved = false
    // Sticker images (photos) are in media/RobotClock
    var moves = rubikRobot1Moves

    var date = new Date();

    var minutes = date.getMinutes();
    var hours = date.getHours();
    var minutesSinceMidnight = (60 * hours) + minutes;
    var catchUp = false


    if (minutesSinceMidnight - clockIndex > 1) {
        catchup = true
        cube.twistDuration = SECOND / 100
        cube.show()
        cube.hidePlastics()
        cube.hideStickers()
        cube.hidePhotos()
        cube.hideIds()
        cube.hideIntroverts()
        cube.hideTexts()
        cube.showWireframes()
        cube.setOpacity()
    } else {
        cube.twistDuration = SECOND / 2
        cube.showIntroverts()
        cube.showPlastics()
        cube.showStickers()
        cube.showPhotos()
        cube.hideTexts()
        cube.hideWireframes()
        cube.hideIds()
        cube.setOpacity()
        cube.setRadius()
    }

    for( i = clockIndex; i <= minutesSinceMidnight; i ++ ){
        move = moves[i]
        cube.twistQueue.add( move )
        clockIndex += 1
        //break // debug
    }


    clockIsSolved = true

    if (catchUp) {
        // should show the cube after solving
        // setTimeout( function(){ show stuff }, SECOND * 60 )
    }
    // execute next sequence in 15 seconds
    setTimeout( function(){ clockIsSolved = false
        cube.isSolving = true}, SECOND * 60 )

    return true

}
