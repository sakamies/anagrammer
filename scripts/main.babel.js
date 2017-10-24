window.addEventListener('DOMContentLoaded', event => {
  loadCanvas()
})

let zIndex = 0
let currentWord = ''
const wordForm = document.querySelector('#word-form')
const wordInput = document.querySelector('#word-input')
const wordCaption = document.querySelector('#word-caption')
const box = {
  width: 30,
  height: 50,
}

const dragOpts = {
  inertia: {
    resistance: 15,
    minSpeed: 200,
    endSpeed: 100
  },
  restrict: {
    restriction: 'parent',
    endOnly: true,
    elementRect: { top: 0, left: 0, bottom: .93, right: .93 }
  },
  // autoScroll: {
  //   container: document.body,
  //   margin: 50,
  //   distance: 5,
  //   interval: 10
  // },
  onmove: event => {
    const el = event.target
    const top = (parseFloat(el.style.top) || 0) + event.dy
    const left = (parseFloat(el.style.left) || 0) + event.dx
    // el.style.transform = `translate(${left}px,${top}px)`
    el.style.top = top + 'px'
    el.style.left = left + 'px'
    // el.dataset.top = top
    // el.dataset.left = left

    zIndex = zIndex + 1
    el.style.zIndex = zIndex
  },
  onend: event => {
    saveCanvas()
    renderCaption()
    //TODO: keep an index of letters, start at top left most letter and search its right center side with getElementFromPoint() and form words that way. Mark found strings of letters with a class and color
    //TODO: Add save button to save found words
  }
}


const handleSubmit = event => {
  event.preventDefault()
  if (!wordInput.value) return

  currentWord = wordInput.value
  wordCaption.innerText = currentWord
  wordInput.value = ''

  let html = ''
  let top = 100
  let left = box.width

  for (var i = 0; i < currentWord.length; i++) {
    const letter = currentWord[i].toUpperCase()
    if (letter !== ' ') {
      html += makeLetter({top, left, letter})
    }

    if (left > window.innerWidth - box.width * 2) {
      top = top + 60
      left = box.width
    } else {
      left = left + box.width
    }
  }

  renderLetters(html)
  renderCaption()
  saveCanvas()
}




function saveCanvas () {
  const letters = [...document.querySelectorAll('.letter')].map((el, i) => {
    return {
      letter: el.innerText,
      left: el.style.left,
      top: el.style.top,
    }
  })

  const data = {
    currentWord,
    letters,
  }

  localStorage.setItem('anagrammer-canvas', JSON.stringify(data))
}

function loadCanvas () {
  const data = JSON.parse(localStorage.getItem('anagrammer-canvas'))
  if (!data) return
  let html = data.letters.map((item, i) => {
    return makeLetter(item)
  })
  html = html.join('')

  wordCaption.innerText = currentWord = data.currentWord
  renderLetters(html)
  renderCaption()
}




function makeLetter ({left, top, letter}) {
  left = parseFloat(left)
  top = parseFloat(top)
  return `<button class="letter" style="left: ${left}px; top: ${top}px">${letter}</button>`
}

function renderLetters (html) {
  //Blank out the document first
  ;[...document.querySelectorAll('.letter')].forEach(el => el.remove())

  //Add letters
  wordForm.insertAdjacentHTML('afterend', html)
}

function renderCaption () {
  const coords = findTopLeft()
  wordCaption.style.left = coords.left + 'px'
  wordCaption.style.top = coords.top - 40 + 'px'
}


function findTopLeft () {
  let left = 999999
  let top = 999999

  ;[...document.querySelectorAll('.letter')].forEach(el => {
    const elleft = parseFloat(el.style.left)
    const eltop = parseFloat(el.style.top)
    if (elleft < left) left = elleft
    if (eltop < top) top = eltop
  })
  console.log('findTopLeft', left, top)

  return {left, top}
}


// target elements with the "draggable" class
interact('.letter').draggable(dragOpts);
wordForm.addEventListener('submit', handleSubmit)


