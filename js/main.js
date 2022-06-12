// Variable
let audio = new Audio();
let isReverse = false
let isSpaced = false
let increase = 1
let pos = 0
let count = 0
let countToIncreaseLevel = 0
let score = 0
let level = 1
let listKeyRandom = []
let listKeyPress = []
const boxElement = document.getElementById("box")
let picElement = document.getElementById("pic")
let scoreElement = document.getElementById("score")
let intervalID = setInterval(move, 0)

function show(id) {
    document.getElementById(id).style.display = 'block'
}

function hide(id) {
    document.getElementById(id).style.display = 'none'
}

function setKey(key, id) {
    document.getElementById(id).src = "images/" + key + ".png"
}

function compareKeyPressAndRandom(key) {
    if (listKeyPress.length === listKeyRandom.length) {
        return
    }

    if (MAP_KEY.get(listKeyRandom[listKeyPress.length]) === key && !isReverse) {
        listKeyPress.push(key + "-success")
        setKey(key + "-success", listKeyPress.length)
    } else if (MAP_KEY.get(listKeyRandom[listKeyPress.length]) === key && isReverse) {
        listKeyPress.push(key + "-success")
        setKey(key + "-success", listKeyPress.length)
    } else {
        listKeyPress = []
        for (let i = 0; i < listKeyRandom.length; i++) {
            setKey(listKeyRandom[i], i + 1)
        }
    }
}

function getListKey(level, listRandom) {
    let list = []
    Array.prototype.random = function () {
        return this[Math.floor((Math.random() * this.length))];
    }
    for (let i = 0; i < level; i++) {
        list.push(listRandom.random())
    }
    return list
}

function resetKeyRandom() {
    for (let i = 1; i <= 11; i++) {
        document.getElementById(i.toString()).src = ""
    }
}

function resetListKeyPress() {
    listKeyPress = []
}

function setScore(pos) {
    if (listKeyPress.length !== listKeyRandom.length) {
        picElement.src = "images/Miss.png"
        return
    }
    if (840 <= pos && pos <= 860) {
        picElement.src = "images/Perfect.png"
        score += isReverse ? 1200 : 800
    } else if ((790 <= pos && pos < 840) || (860 < pos && pos <= 910)) {
        picElement.src = "images/Great.png"
        score += isReverse ? 600 : 350
    } else if ((760 <= pos && pos < 790) || (910 < pos && pos <= 940)) {
        picElement.src = "images/Cool.png"
        score += isReverse ? 350 : 150
    } else if ((750 <= pos && pos < 760) || (940 < pos && pos <= 950)) {
        picElement.src = "images/Bad.png"
        score += isReverse ? 200 : 50
    } else {
        picElement.src = "images/Miss.png"
    }
    scoreElement.textContent = score
}

function move() {
    if (pos > 1150) {
        pos = 0
        count++
        if (count >= MIN_COUNT_TO_PLAY) {
            resetKeyRandom()
            setTimeout(function () {
                listKeyRandom = isReverse ? getListKey(level, LIST_KEY_HAS_REVERSE) : getListKey(level, LIST_KEY)
                console.log(listKeyRandom)
                for (let i = 0; i < listKeyRandom.length; i++) {
                    setKey(listKeyRandom[i], i + 1)
                }
            }, 1000)
        }
        if (count >= MIN_COUNT_TO_PLAY && countToIncreaseLevel % 1 === 0) {
            level++
        }
        if (level > MAX_LEVEL) {
            level = 1;
        }
        if (count > MIN_COUNT_TO_PLAY && !isSpaced) {
            countToIncreaseLevel++
            picElement.src = "images/Miss.png"
            resetListKeyPress()
            hide("box")
            setTimeout(function () {
                show("box")
                pos = 0
            }, 3000)
        }
    }

    pos += increase
    boxElement.style.left = pos + "px"
}

// Event press key
document.body.onkeyup = function (e) {
    if (e.code === "Space" && count >= MIN_COUNT_TO_PLAY) {
        isSpaced = true
        setScore(pos)
        hide("box")
        resetListKeyPress()
        setTimeout(function () {
            show("box")
            pos = 0
            isSpaced = false
        }, 3000)
        countToIncreaseLevel++
    }

    // Key dance
    if (e.code === "ArrowUp") {
        compareKeyPressAndRandom("up")
    }
    if (e.code === "ArrowDown") {
        compareKeyPressAndRandom("down")
    }
    if (e.code === "ArrowRight") {
        compareKeyPressAndRandom("right")
    }
    if (e.code === "ArrowLeft") {
        compareKeyPressAndRandom("left")
    }

    // Key turn on, turn off reverse
    if (e.code === "NumpadDecimal") {
        isReverse = !isReverse
        if (isReverse) {
            document.getElementById("reverse").textContent = "Reverse"
            show("reverse")
        } else {
            hide("reverse")
        }
    }
}

function initVariable() {
    isReverse = false
    isSpaced = false
    increase = 1
    pos = 0
    count = 0
    countToIncreaseLevel = 0
    score = 0
    level = 0
    listKeyRandom = []
    listKeyPress = []
    picElement = document.getElementById("pic")
    scoreElement = document.getElementById("score")
}

audio.onended = function () {
    clearInterval(intervalID)
    alert("Chúc mừng bạn đã đạt: " + score + " điểm")
    initVariable()
    scoreElement.textContent = "0"
}

function initAudio() {
    clearInterval(intervalID)
    let ext, plist
    ext = ".mp3"

    plist = document.getElementById("list-music")
    plist.addEventListener("change", changeTrack)

    function changeTrack(event) {
        audio.src = "musics/" + event.target.value + ext
        audio.play()
        intervalID = setInterval(move, 0)
        initVariable()
    }
}

window.addEventListener("load", initAudio)