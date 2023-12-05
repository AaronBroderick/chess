const gameBoard = document.querySelector("#gameboard")
const playerDisplay = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")
const width = 8
let playerGo = 'white'
playerDisplay.textContent = 'white'

const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
]

function createBoard(){
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div')
        square.classList.add('square')
        square.innerHTML = startPiece
        square.firstChild?.setAttribute('draggable', true)
        square.setAttribute('square-id', 63-i)
        const row = Math.floor((63-i)/8) + 1
        if(row%2 === 0){
            square.classList.add(i%2 === 0 ? "beige" : "brown")
        }
        else{
            square.classList.add(i%2 === 0 ? "brown" : "beige")
        }
        if(i<=15){
            square.firstChild.firstChild.classList.add('black')
        }
        if(i>=48){
            square.firstChild.firstChild.classList.add('white')
        }

        gameBoard.append(square)
    });
}
createBoard()

const allSquares = document.querySelectorAll(".square")

allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})

let startPositionId
let draggedElement
let endPositionId
//castling
let whiteKHasMoved = false
let whiteRKHasMoved = false
let whiteRQHasMoved = false
let blackKHasMoved = false
let blackRKHasMoved = false
let blackRQHasMoved = false
const squareKw = document.querySelector(`[square-id="${3}"]`)
const squareKb = document.querySelector(`[square-id="${59}"]`)
const squareRQw = document.querySelector(`[square-id="${7}"]`)
const squareRKw = document.querySelector(`[square-id="${0}"]`)
const squareRKb = document.querySelector(`[square-id="${56}"]`)
const squareRQb = document.querySelector(`[square-id="${63}"]`)

function dragStart (e) {
    startPositionId = e.target.parentNode.getAttribute('square-id')
    draggedElement = e.target
}

function dragOver (e) {
    e.preventDefault()
}

function dragDrop (e) {
    e.stopPropagation()
    const correctGo = draggedElement.firstChild.classList.contains(playerGo)
    const taken = e.target.classList.contains('piece')
    const valid = checkIfValid(e.target)
    const opponentGo = playerGo === 'white' ? 'black' : 'white'
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo)
    if(takenByOpponent){
        endPositionId = e.target.parentNode.getAttribute('square-id')
    }
    else{
        endPositionId = e.target.getAttribute('square-id')
    }
    
    if(correctGo){
        if(takenByOpponent && valid){
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            if(!checkForPromotion(draggedElement)){
                checkForWin()
                changePlayer()
            }
            else{
                allSquares.forEach(square => {
                    square.firstChild?.setAttribute('draggable', false)
                })
            }
        }
        else if(taken && !takenByOpponent){
            infoDisplay.textContent = "You can't go here!"
            setTimeout(() => infoDisplay.textContent = "", 3000)
        }
        else if(valid){
            e.target.append(draggedElement)
            if(draggedElement.id === 'king' && startPositionId-2 == endPositionId){
                document.querySelector(`[square-id="${startPositionId-1}"]`).append(playerGo === 'white' ? squareRKw.firstChild : squareRQb.firstChild)
            }
            if(draggedElement.id === 'king' && Number(startPositionId)+2 == endPositionId){
                document.querySelector(`[square-id="${Number(startPositionId)+1}"]`).append(playerGo === 'white' ? squareRQw.firstChild : squareRKb.firstChild)
            }
            if(!checkForPromotion(draggedElement)){
                checkForWin()
                changePlayer()
            }
            else{
                allSquares.forEach(square => {
                    square.firstChild?.setAttribute('draggable', false)
                })
            }
        }
    }
    if(playerGo === 'black'){
        if(squareKw.firstChild?.id !== 'king' || squareKw.firstChild?.firstChild.classList.contains('black')){
            whiteKHasMoved = true
        }
        if(squareRKw.firstChild?.id !== 'rook' || squareRKw.firstChild?.firstChild.classList.contains('black')){
            whiteRKHasMoved = true
        }
        if(squareRQw.firstChild?.id !== 'rook' || squareRQw.firstChild?.firstChild.classList.contains('black')){
            whiteRQHasMoved = true
        }
    }
    else{
        if(squareKb.firstChild?.id !== 'king' || squareKb.firstChild?.firstChild.classList.contains('white')){
            blackKHasMoved = true
        }
        if(squareRKb.firstChild?.id !== 'rook' || squareRKb.firstChild?.firstChild.classList.contains('white')){
            blackRKHasMoved = true
        }
        if(squareRQb.firstChild?.id !== 'rook' || squareRQb.firstChild?.firstChild.classList.contains('white')){
            blackRQHasMoved = true
        }
    }
}

function checkForPromotion(target){
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))
    const endRow = [56,57,58,59,60,61,62,63]

    if(draggedElement.id === 'pawn' && endRow.includes(targetId)){
        buttons.style.display = "block"
        return true
    }
    return false
}

function checkIfValid(target){
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))
    const startId = Number(startPositionId)
    const piece = draggedElement.id
    /*console.log('targetId', targetId)
    console.log('startId', startId)
    console.log('piece', piece)*/
    const starterRow = [8,9,10,11,12,13,14,15]
    const rightColp = [8,16,24,32,40,48]
    const leftColp = [15,23,31,39,47,55]
    const fileA = [7,15,23,31,39,47,55,63]
    const fileB = [6,14,22,30,38,46,54,62]
    const fileC = [5,13,21,29,37,45,53,61]
    const fileD = [4,12,20,28,36,44,52,60]
    const fileE = [3,11,19,27,35,43,51,59]
    const fileF = [2,10,18,26,34,42,50,58]
    const fileG = [1,9,17,25,33,41,49,57]
    const fileH = [0,8,16,24,32,40,48,56]

    switch(piece){
        case 'pawn':
            if(
                starterRow.includes(startId) && startId + width*2 === targetId && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width}"]`).firstChild ||
                startId + width === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild ||
                startId + width - 1 === targetId && document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !rightColp.includes(startId) ||
                startId + width + 1 === targetId && document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !leftColp.includes(startId)
                ){
                    return true
            }
            break;
        case 'knight':
            if(
                startId + width*2 - 1 === targetId && !fileH.includes(startId) ||
                startId + width*2 + 1 === targetId && !fileA.includes(startId) ||
                startId + width + 2 === targetId && !fileA.includes(startId) && !fileB.includes(startId)  ||
                startId + width - 2 === targetId && !fileH.includes(startId) && !fileG.includes(startId) ||
                startId - width*2 - 1 === targetId && !fileH.includes(startId) ||
                startId - width*2 + 1 === targetId && !fileA.includes(startId)  ||
                startId - width + 2 === targetId && !fileA.includes(startId) && !fileB.includes(startId) ||
                startId - width - 2 === targetId && !fileH.includes(startId) && !fileG.includes(startId)
            ){
                return true
            }
            break;
        case 'bishop':
            if(
                //-+
                startId + width + 1 === targetId && !fileA.includes(startId) ||
                startId + width*2 + 2 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) ||
                startId + width*3 + 3 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) ||
                startId + width*4 + 4 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) ||
                startId + width*5 + 5 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*4 + 4}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) && !fileE.includes(startId) ||
                startId + width*6 + 6 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*5 + 5}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) && !fileE.includes(startId) && !fileF.includes(startId) ||
                startId + width*7 + 7 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*6 + 6}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) && !fileE.includes(startId) && !fileF.includes(startId) && !fileG.includes(startId) ||
                //+-
                startId - width - 1 === targetId && !fileH.includes(startId) ||
                startId - width*2 - 2 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) ||
                startId - width*3 - 3 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) ||
                startId - width*4 - 4 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) ||
                startId - width*5 - 5 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*4 - 4}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) && !fileD.includes(startId) ||
                startId - width*6 - 6 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*5 - 5}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) && !fileD.includes(startId) && !fileC.includes(startId) ||
                startId - width*7 - 7 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*6 - 6}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) && !fileD.includes(startId) && !fileC.includes(startId) && !fileB.includes(startId) ||
                //--
                startId - width + 1 === targetId && !fileA.includes(startId) ||
                startId - width*2 + 2 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) ||
                startId - width*3 + 3 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) ||
                startId - width*4 + 4 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) ||
                startId - width*5 + 5 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*4 + 4}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) && !fileE.includes(startId) ||
                startId - width*6 + 6 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*5 + 5}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) && !fileE.includes(startId) && !fileF.includes(startId) ||
                startId - width*7 + 7 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*6 + 6}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) && !fileE.includes(startId) && !fileF.includes(startId) && !fileG.includes(startId) ||
                //++
                startId + width - 1 === targetId && !fileH.includes(startId) ||
                startId + width*2 - 2 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) ||
                startId + width*3 - 3 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) ||
                startId + width*4 - 4 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) ||
                startId + width*5 - 5 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*4 - 4}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) && !fileD.includes(startId) ||
                startId + width*6 - 6 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*5 - 5}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) && !fileD.includes(startId) && !fileC.includes(startId) ||
                startId + width*7 - 7 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*6 - 6}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) && !fileD.includes(startId) && !fileC.includes(startId) && !fileB.includes(startId)
            ){
                return true
            }
            break;
        case 'rook':
            if(
                //up
                startId + width === targetId ||
                startId + width*2 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild ||
                startId + width*3 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild ||
                startId + width*4 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3}"]`).firstChild ||
                startId + width*5 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*4}"]`).firstChild ||
                startId + width*6 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*5}"]`).firstChild ||
                startId + width*7 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*6}"]`).firstChild ||
                //down
                startId - width === targetId ||
                startId - width*2 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild ||
                startId - width*3 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild ||
                startId - width*4 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3}"]`).firstChild ||
                startId - width*5 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*4}"]`).firstChild ||
                startId - width*6 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*5}"]`).firstChild ||
                startId - width*7 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*6}"]`).firstChild ||
                //left
                startId + 1 === targetId && !fileA.includes(startId) ||
                startId + 2 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) ||
                startId + 3 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) ||
                startId + 4 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) ||
                startId + 5 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) && !fileE.includes(startId) ||
                startId + 6 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + 5}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) && !fileE.includes(startId) && !fileF.includes(startId) ||
                startId + 7 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + 6}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) && !fileE.includes(startId) && !fileF.includes(startId) && !fileG.includes(startId) ||
                //right
                startId - 1 === targetId && !fileH.includes(startId) ||
                startId - 2 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) ||
                startId - 3 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) ||
                startId - 4 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) ||
                startId - 5 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) && !fileD.includes(startId) ||
                startId - 6 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - 5}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) && !fileD.includes(startId) && !fileC.includes(startId) ||
                startId - 7 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - 6}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) && !fileD.includes(startId) && !fileC.includes(startId) && !fileB.includes(startId)
            ){
                return true
            }
            break;
        case 'queen':
            if(
                //-+
                startId + width + 1 === targetId && !fileA.includes(startId) ||
                startId + width*2 + 2 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) ||
                startId + width*3 + 3 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) ||
                startId + width*4 + 4 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) ||
                startId + width*5 + 5 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*4 + 4}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) && !fileE.includes(startId) ||
                startId + width*6 + 6 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*5 + 5}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) && !fileE.includes(startId) && !fileF.includes(startId) ||
                startId + width*7 + 7 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*6 + 6}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) && !fileE.includes(startId) && !fileF.includes(startId) && !fileG.includes(startId) ||
                //+-
                startId - width - 1 === targetId && !fileH.includes(startId) ||
                startId - width*2 - 2 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) ||
                startId - width*3 - 3 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) ||
                startId - width*4 - 4 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) ||
                startId - width*5 - 5 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*4 - 4}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) && !fileD.includes(startId) ||
                startId - width*6 - 6 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*5 - 5}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) && !fileD.includes(startId) && !fileC.includes(startId) ||
                startId - width*7 - 7 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*6 - 6}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) && !fileD.includes(startId) && !fileC.includes(startId) && !fileB.includes(startId) ||
                //--
                startId - width + 1 === targetId && !fileA.includes(startId) ||
                startId - width*2 + 2 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) ||
                startId - width*3 + 3 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) ||
                startId - width*4 + 4 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) ||
                startId - width*5 + 5 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*4 + 4}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) && !fileE.includes(startId) ||
                startId - width*6 + 6 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*5 + 5}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) && !fileE.includes(startId) && !fileF.includes(startId) ||
                startId - width*7 + 7 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*4 + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*5 + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*6 + 6}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) && !fileE.includes(startId) && !fileF.includes(startId) && !fileG.includes(startId) ||
                //++
                startId + width - 1 === targetId && !fileH.includes(startId) ||
                startId + width*2 - 2 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) ||
                startId + width*3 - 3 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) ||
                startId + width*4 - 4 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) ||
                startId + width*5 - 5 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*4 - 4}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) && !fileD.includes(startId) ||
                startId + width*6 - 6 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*5 - 5}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) && !fileD.includes(startId) && !fileC.includes(startId) ||
                startId + width*7 - 7 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*4 - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*5 - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*6 - 6}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) && !fileD.includes(startId) && !fileC.includes(startId) && !fileB.includes(startId) ||

                //up
                startId + width === targetId ||
                startId + width*2 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild ||
                startId + width*3 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild ||
                startId + width*4 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3}"]`).firstChild ||
                startId + width*5 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*4}"]`).firstChild ||
                startId + width*6 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*5}"]`).firstChild ||
                startId + width*7 === targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*4}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*5}"]`).firstChild && !document.querySelector(`[square-id="${startId + width*6}"]`).firstChild ||
                //down
                startId - width === targetId ||
                startId - width*2 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild ||
                startId - width*3 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild ||
                startId - width*4 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3}"]`).firstChild ||
                startId - width*5 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*4}"]`).firstChild ||
                startId - width*6 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*5}"]`).firstChild ||
                startId - width*7 === targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*4}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*5}"]`).firstChild && !document.querySelector(`[square-id="${startId - width*6}"]`).firstChild ||
                //left
                startId + 1 === targetId && !fileA.includes(startId) ||
                startId + 2 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) ||
                startId + 3 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) ||
                startId + 4 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) ||
                startId + 5 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) && !fileE.includes(startId) ||
                startId + 6 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + 5}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) && !fileE.includes(startId) && !fileF.includes(startId) ||
                startId + 7 === targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild && !document.querySelector(`[square-id="${startId + 5}"]`).firstChild && !document.querySelector(`[square-id="${startId + 6}"]`).firstChild && !fileA.includes(startId) && !fileB.includes(startId) && !fileC.includes(startId) && !fileD.includes(startId) && !fileE.includes(startId) && !fileF.includes(startId) && !fileG.includes(startId) ||
                //right
                startId - 1 === targetId && !fileH.includes(startId) ||
                startId - 2 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) ||
                startId - 3 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) ||
                startId - 4 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) ||
                startId - 5 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) && !fileD.includes(startId) ||
                startId - 6 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - 5}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) && !fileD.includes(startId) && !fileC.includes(startId) ||
                startId - 7 === targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild && !document.querySelector(`[square-id="${startId - 5}"]`).firstChild && !document.querySelector(`[square-id="${startId - 6}"]`).firstChild && !fileH.includes(startId) && !fileG.includes(startId) && !fileF.includes(startId) && !fileE.includes(startId) && !fileD.includes(startId) && !fileC.includes(startId) && !fileB.includes(startId)
            ){
                return true
            }
            break;
        case 'king':
            if(
                startId + 1 === targetId && !fileA.includes(startId) ||
                startId - 1 === targetId && !fileH.includes(startId) ||
                startId + width === targetId ||
                startId - width === targetId ||
                startId + width + 1 === targetId && !fileA.includes(startId) ||
                startId + width - 1 === targetId && !fileH.includes(startId) ||
                startId - width + 1 === targetId && !fileA.includes(startId) ||
                startId - width - 1 === targetId && !fileH.includes(startId) ||
                startId + 2 === targetId && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild && (playerGo === 'white' ? !document.querySelector(`[square-id="${startId + 3}"]`).firstChild : true) && (playerGo === 'white' ? !whiteKHasMoved : !blackKHasMoved) && (playerGo === 'white' ? !whiteRQHasMoved : !blackRKHasMoved) ||
                startId - 2 === targetId && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild && (playerGo === 'black' ? !document.querySelector(`[square-id="${startId - 3}"]`).firstChild : true) && (playerGo === 'white' ? !whiteKHasMoved : !blackKHasMoved) && (playerGo === 'white' ? !whiteRKHasMoved : !blackRQHasMoved)
            ){
                return true
            }
            break;
    }
}

function changePlayer(){
    if(playerGo === 'white'){
        playerGo = 'black'
        playerDisplay.textContent = 'black'
        reverseIds()
    }
    else{
        playerGo = 'white'
        playerDisplay.textContent = 'white'
        revertIds()
    }
}

function reverseIds(){
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) =>
        square.setAttribute('square-id', i))
}

function revertIds(){
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) =>
        square.setAttribute('square-id', (width*width-1)-i))
}

function checkForWin(){
    const kings = Array.from(document.querySelectorAll('#king'))
    if(!kings.some(king => king.firstChild.classList.contains('white'))){
        infoDisplay.innerHTML = "Black Player Wins!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
    if(!kings.some(king => king.firstChild.classList.contains('black'))){
        infoDisplay.innerHTML = "White Player Wins!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
}

const nButton = document.querySelector("#n")
const bButton = document.querySelector("#b")
const rButton = document.querySelector("#r")
const qButton = document.querySelector("#q")

nButton.addEventListener("click", function(){
    let square = document.querySelector(`[square-id="${endPositionId}"]`)
    square.innerHTML = knight
    square.firstChild?.setAttribute('draggable', true)
    if(playerGo === 'white'){
        square.firstChild.firstChild.classList.add('white')
    }
    else{
        square.firstChild.firstChild.classList.add('black')
    }
    draggedElement.remove()
    buttons.style.display = "none"
    allSquares.forEach(square => square.firstChild?.setAttribute('draggable', true))
    checkForWin()
    changePlayer()
})
bButton.addEventListener("click", function(){
    let square = document.querySelector(`[square-id="${endPositionId}"]`)
    square.innerHTML = bishop
    square.firstChild?.setAttribute('draggable', true)
    if(playerGo === 'white'){
        square.firstChild.firstChild.classList.add('white')
    }
    else{
        square.firstChild.firstChild.classList.add('black')
    }
    draggedElement.remove()
    buttons.style.display = "none"
    allSquares.forEach(square => square.firstChild?.setAttribute('draggable', true))
    checkForWin()
    changePlayer()
})
rButton.addEventListener("click", function(){
    let square = document.querySelector(`[square-id="${endPositionId}"]`)
    square.innerHTML = rook
    square.firstChild?.setAttribute('draggable', true)
    if(playerGo === 'white'){
        square.firstChild.firstChild.classList.add('white')
    }
    else{
        square.firstChild.firstChild.classList.add('black')
    }
    draggedElement.remove()
    buttons.style.display = "none"
    allSquares.forEach(square => square.firstChild?.setAttribute('draggable', true))
    checkForWin()
    changePlayer()
})
qButton.addEventListener("click", function(){
    let square = document.querySelector(`[square-id="${endPositionId}"]`)
    square.innerHTML = queen
    square.firstChild?.setAttribute('draggable', true)
    if(playerGo === 'white'){
        square.firstChild.firstChild.classList.add('white')
    }
    else{
        square.firstChild.firstChild.classList.add('black')
    }
    draggedElement.remove()
    buttons.style.display = "none"
    allSquares.forEach(square => square.firstChild?.setAttribute('draggable', true))
    checkForWin()
    changePlayer()
})