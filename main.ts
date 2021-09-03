// serial.writeValue("numberOfCommandsAfter", numberOfCommands)
function executeCommands () {
    // serial.writeLine("EXECUTE")
    isExecuting = true
    numberOfCommands = commands.length
    // serial.writeValue("numberOfCommands", numberOfCommands)
    for (let index = 0; index < numberOfCommands; index++) {
        thisCommand = commands.shift()
        // serial.writeLine(thisCommand)
        for (let y = 0; y <= thisCommand.length - 1; y++) {
            thisSubCommand = thisCommand.substr(y, 1)
            switch (thisSubCommand) {
                case "K": {
                    radio.sendString("K")
                    cut(true)
                    cutState = true
                    KN()
                    radio.sendString("K")
                    break;
                }
                case "I": {
                    radio.sendString("I")
                    cut(false)
                    cutState = false
                    KO()
                    radio.sendString("I")
                    break;
                }
                case "8": {
                    N(cutState)
                    break;
                }
                case "9": {
                    if (xCounter < 2000) {
                        NE(cutState)
                        //xCounter += gridSize
                        //yCounter -= gridSize
                    }
                    break;
                }
                case "6": {
                    if (xCounter < 2000) {
                        E(cutState)
                        //xCounter += gridSize
                    }
                    break;
                }
                case "3": {
                    if ((xCounter < 2000) && (yCounter < 2000)) {
                        SE(cutState)
                        //xCounter += gridSize
                    }
                    break;
                }
                case "2": {
                    if (yCounter < 2000) {
                        S(cutState)
                        //yCounter += gridSize
                    }

                    break;
                }
                case "1": {
                    if (yCounter < 2000) {
                        SW(cutState)
                        //yCounter += gridSize
                        //yCounter -= gridSize
                    }
                    break;
                } case "4": {
                    //yCounter -= gridSize
                    W(cutState)
                    break;
                }
                case "7": {
                    //yCounter -= gridSize
                    //xCounter -= gridSize
                    NW(cutState)
                    break;
                }
                case "H": {
                    home()
                    break;
                }
                default: {
                    //statements; 
                    break;
                }
            }
        }
    }
    isExecuting = false
}
// pins.digitalWritePin(laserPin, 0)
function KO () {
    cutState = false
    // knife off
    pins.servoWritePin(AnalogPin.P0, 150)
}
function cut (cut2: boolean) {
    handleCut(cut2)
}
function home () {
    pins.servoWritePin(AnalogPin.P0, 150)
    basic.pause(200)
    homing = true
    KO()
    basic.pause(300)
    pins.digitalWritePin(YDirPin, 0)
pins.digitalWritePin(XDirPin, 0)
while (!(detectXstop() && detectYstop())) {
        control.waitMicros(speed)
        if (!(detectXstop())) {
            pins.digitalWritePin(XstepPin, 1)
        }
        if (!(detectYstop())) {
            pins.digitalWritePin(YstepPin, 1)
        }
        control.waitMicros(speed)
        pins.digitalWritePin(XstepPin, 0)
pins.digitalWritePin(YstepPin, 0)
    }
    pins.digitalWritePin(YDirPin, 1)
pins.digitalWritePin(XDirPin, 1)
for (let index = 0; index < 100; index++) {
        pins.digitalWritePin(XstepPin, 1)
pins.digitalWritePin(YstepPin, 1)
control.waitMicros(speed * 2)
        pins.digitalWritePin(XstepPin, 0)
pins.digitalWritePin(YstepPin, 0)
    }
    homing = false
    pins.digitalWritePin(leds[0], 0)
pins.digitalWritePin(leds[1], 0)
pins.digitalWritePin(leds[2], 0)
xCounter = 0
    yCounter = 0
}
function handleCut (cut2: boolean) {
    if (cut2 != oldCut) {
        oldCut = cut2
        // pins.digitalWritePin(laserPin,1)
        // pins.digitalWritePin(laserPin, 0)
        if (cut2) {
            pins.servoWritePin(AnalogPin.P0, 50)
        } else {
            pins.servoWritePin(AnalogPin.P0, 150)
        }
        basic.pause(300)
    }
}
function detectXstop () {
    pins.setPull(Xstop, PinPullMode.PullUp)
if (pins.digitalReadPin(Xstop) == 0) {
        if (!(homing)) {
            alarm("X")
        }
        return true
    } else {
        return false
    }
}
function E (cut2: boolean) {
    cutState = cut2
    handleCut(cut2)
    pins.digitalWritePin(XDirPin, 1)
if (xCounter < gridXLimit) {
        for (let index = 0; index < gridSize; index++) {
            control.waitMicros(speed)
            pins.digitalWritePin(XstepPin, 1)
control.waitMicros(speed)
            pins.digitalWritePin(XstepPin, 0)
        }
        xCounter += gridSize
    }
    checkCuts()
}
function SW (cut2: boolean) {
    cutState = cut2
    handleCut(cut2)
    // alarm()
    if (!(detectXstop()) && yCounter < gridYLimit) {
        pins.digitalWritePin(YDirPin, 1)
pins.digitalWritePin(XDirPin, 0)
for (let index = 0; index < gridSize; index++) {
            control.waitMicros(speed)
            pins.digitalWritePin(YstepPin, 1)
pins.digitalWritePin(XstepPin, 1)
control.waitMicros(speed)
            pins.digitalWritePin(YstepPin, 0)
pins.digitalWritePin(XstepPin, 0)
if (detectXstop()) {
                xCounter = 0
                // alarm()
                break;
            }
        }
        xCounter += 0 - gridSize
        yCounter += gridSize
        if (xCounter < 0) {
            xCounter = 0
        }
    } else {
    	
    }
    checkCuts()
}
function KN () {
    cutState = true
    // knife now
    pins.servoWritePin(AnalogPin.P0, 50)
    // pins.digitalWritePin(laserPin, 1)
    checkCuts()
}
function detectYstop () {
    pins.setPull(Ystop, PinPullMode.PullUp)
if (pins.digitalReadPin(Ystop) == 0) {
        if (!(homing)) {
            alarm("Y")
        }
        return true
    } else {
        return false
    }
}
function NW (cut2: boolean) {
    cutState = cut2
    handleCut(cut2)
    // alarm()
    if (!(detectXstop()) || !(detectYstop())) {
        pins.digitalWritePin(XDirPin, 0)
pins.digitalWritePin(YDirPin, 0)
for (let index = 0; index < gridSize; index++) {
            control.waitMicros(speed)
            pins.digitalWritePin(XstepPin, 1)
pins.digitalWritePin(YstepPin, 1)
control.waitMicros(speed)
            pins.digitalWritePin(XstepPin, 0)
pins.digitalWritePin(YstepPin, 0)
if (detectXstop()) {
                xCounter = 0
                // alarm()
                break;
            }
            if (detectYstop()) {
                yCounter = 0
                // alarm()
                break;
            }
        }
        xCounter += 0 - gridSize
        yCounter += 0 - gridSize
        if (xCounter < 0) {
            xCounter = 0
        }
        if (yCounter < 0) {
            yCounter = 0
        }
    } else {
    	
    }
    checkCuts()
}
input.onButtonPressed(Button.A, function () {
    S(false)
    S(false)
    S(false)
    S(false)
    S(false)
    S(false)
    S(false)
    S(false)
    E(false)
    E(false)
    E(false)
    E(false)
    E(false)
    E(false)
    E(false)
    E(false)
    E(false)
    E(false)
    cutState = true
    E(true)
    N(true)
    E(true)
    S(true)
    S(true)
    E(true)
    N(true)
    cutState = false
})
function alarm (axis: string) {
    music.playMelody("C5 C - - - - - - ", 1800)
    basic.showString(axis, 0)
}
function NE (cut2: boolean) {
    cutState = cut2
    handleCut(cut2)
    // alarm()
    if (!(detectYstop()) && yCounter < gridXLimit) {
        pins.digitalWritePin(YDirPin, 0)
pins.digitalWritePin(XDirPin, 1)
for (let index = 0; index < gridSize; index++) {
            control.waitMicros(speed)
            pins.digitalWritePin(YstepPin, 1)
pins.digitalWritePin(XstepPin, 1)
control.waitMicros(speed)
            pins.digitalWritePin(YstepPin, 0)
pins.digitalWritePin(XstepPin, 0)
if (detectYstop()) {
                yCounter = 0
                // alarm()
                break;
            }
        }
        xCounter += gridSize
        yCounter += 0 - gridSize
        if (xCounter < 0) {
            xCounter = 0
        }
    } else {
    	
    }
    checkCuts()
}
function winState () {
    soundExpression.soaring.play()
    radio.sendString("I")
    basic.showIcon(IconNames.Heart, 2000)
basic.clearScreen()
    control.reset()
}
function N (cut2: boolean) {
    cutState = cut2
    handleCut(cut2)
    // //alarm()
    if (!(detectYstop())) {
        pins.digitalWritePin(YDirPin, 0)
for (let index = 0; index < gridSize; index++) {
            control.waitMicros(speed)
            pins.digitalWritePin(YstepPin, 1)
control.waitMicros(speed)
            pins.digitalWritePin(YstepPin, 0)
if (detectYstop()) {
                yCounter = 0
                home()
                break;
            }
        }
        yCounter += 0 - gridSize
        serial.writeValue("pre set yCounter to", yCounter)
        if (yCounter < 0) {
            serial.writeLine("was less than 0")
            yCounter = 0
        }
        serial.writeValue("post set yCounter to", yCounter)
    } else {
    	
    }
    checkCuts()
}
input.onButtonPressed(Button.B, function () {
    led.toggleAll()
home()
})
function SE (cut2: boolean) {
    cutState = cut2
    handleCut(cut2)
    pins.digitalWritePin(XDirPin, 1)
pins.digitalWritePin(YDirPin, 1)
if (xCounter < gridXLimit && yCounter < gridYLimit) {
        for (let index = 0; index < gridSize; index++) {
            control.waitMicros(speed)
            pins.digitalWritePin(XstepPin, 1)
pins.digitalWritePin(YstepPin, 1)
control.waitMicros(speed)
            pins.digitalWritePin(XstepPin, 0)
pins.digitalWritePin(YstepPin, 0)
        }
        yCounter += gridSize
        xCounter += gridSize
    }
    checkCuts()
}
function S (cut2: boolean) {
    cutState = cut2
    handleCut(cut2)
    pins.digitalWritePin(YDirPin, 1)
if (yCounter < gridYLimit) {
        for (let index = 0; index < gridSize; index++) {
            control.waitMicros(speed)
            pins.digitalWritePin(YstepPin, 1)
control.waitMicros(speed)
            pins.digitalWritePin(YstepPin, 0)
        }
        yCounter += gridSize
    }
    checkCuts()
}
function checkCuts () {
    serial.writeValue("yCounter = ", yCounter)
    if (yCounter == 8 * gridSize) {
        // we are on correct Y coordinate
        if (cutState) {
            // we are cutting
            for (let i = 0; i <= 2; i++) {
                if (xCounter == ledLocs[i]) {
                    hasBeenCut[i] = true
                    pins.digitalWritePin(leds[i], 1)
music.playTone(440 * (i + 1), 100)
                }
            }
        }
    }
    if (hasBeenCut[0] && hasBeenCut[1] && hasBeenCut[2]) {
        hasBeenCut[0] = false
        hasBeenCut[1] = false
        hasBeenCut[2] = false
        winState()
    }
}
radio.onReceivedString(function (name) {
    if (!(isExecuting)) {
        // serial.writeLine("pushing")
        receiveTime = input.runningTime()
        commands.push(name)
    }
})
function W (cut2: boolean) {
    cutState = cut2
    handleCut(cut2)
    // alarm()
    if (!(detectXstop())) {
        pins.digitalWritePin(XDirPin, 0)
for (let index = 0; index < gridSize; index++) {
            control.waitMicros(speed)
            pins.digitalWritePin(XstepPin, 1)
control.waitMicros(speed)
            pins.digitalWritePin(XstepPin, 0)
if (detectXstop()) {
                xCounter = 0
                // alarm()
                break;
            }
        }
        xCounter += 0 - gridSize
        if (xCounter < 0) {
            xCounter = 0
        }
    } else {
    	
    }
    checkCuts()
}
let receiveTime = 0
let oldCut = false
let homing = false
let thisSubCommand = ""
let thisCommand = ""
let commands: string[] = []
let numberOfCommands = 0
let isExecuting = false
let gridYLimit = 0
let gridXLimit = 0
let ledLocs: number[] = []
let hasBeenCut: boolean[] = []
let gridSize = 0
let speed = 0
let yCounter = 0
let xCounter = 0
let cutState = false
// music.playMelody(music.builtInMelody., 120)
radio.setGroup(5)
basic.showLeds(`
    . . . . .
    . . . . .
    . . # . .
    . . . . .
    . . . . .
    `)
serial.writeLine("Begin")
let bufferTimer = 100
let XstepPin = DigitalPin.P1
let YstepPin = DigitalPin.P2
let XDirPin = DigitalPin.P8
let YDirPin = DigitalPin.P9
let Xstop = DigitalPin.P13
let Ystop = DigitalPin.P14
let servoPin = AnalogPin.P0
pins.servoWritePin(servoPin, 150)
pins.setPull(Xstop, PinPullMode.PullUp)
pins.setPull(Ystop, PinPullMode.PullUp)
speed = 2000
gridSize = 100
pins.digitalWritePin(XstepPin, 0)
pins.digitalWritePin(YstepPin, 0)
pins.digitalWritePin(XDirPin, 0)
pins.digitalWritePin(YDirPin, 0)
let led1 = DigitalPin.P15
let led2 = DigitalPin.P16
let led3 = DigitalPin.P12
let leds = [led1, led2, led3]
hasBeenCut = [false, false, false]
ledLocs = [11 * gridSize, 12 * gridSize, 13 * gridSize]
home()
gridXLimit = 19 * gridSize
gridYLimit = 15 * gridSize
// detectXstop()
// detectYstop()
basic.forever(function () {
    if (input.runningTime() > receiveTime + bufferTimer && commands.length > 0 && !(isExecuting)) {
        executeCommands()
    }
})
