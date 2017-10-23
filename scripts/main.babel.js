//TODO: index elements by their x position
//TODO: serialize & save data so reload doesn't wite everything out

let G = {
  // preventClick: false, //Prevent click while dragging
  zIndex: 0
}

const dragOpts = {
  inertia: {
    resistance: 20,
    minSpeed: 200,
    endSpeed: 100
  },
  restrict: {
    // restriction: 'parent',
    // endOnly: true,
    // elementRect: { top: 0, left: 0, bottom: .93, right: .93 }
  },
  autoScroll: {
    container: document.body,
    margin: 50,
    distance: 5,
    interval: 10
  },
  onmove: event => {
    // G.preventClick = true
    G.zIndex = G.zIndex + 1
    const el = event.target
    const top = (parseFloat(el.style.top) || 0) + event.dy
    const left = (parseFloat(el.style.left) || 0) + event.dx
    el.style.top = top + 'px'
    el.style.left = left + 'px'
    el.style.zIndex = G.zIndex
  },
  onend: event => {
    // setTimeout(() => G.preventClick = false, 50)
    //TODO: if it's close to the right edge of the viewport, extend all rows a bit, or somehow determine a suitable width for all rows
  }
}

const trashOpts = {
  accept: '.letter',
  overlap: 0.1,
  ondropactivate: event => {
    event.target.classList.add('drop-active')
  },
  ondragenter: event => {
    const draggable = event.relatedTarget
    const dropzone = event.target
    dropzone.classList.add('drop-target')
    draggable.classList.add('delete')
  },
  ondragleave: event => {
    const draggable = event.relatedTarget
    const dropzone = event.target
    event.target.classList.remove('drop-target');
    event.relatedTarget.classList.remove('can-drop');
  },
  ondrop: event => {
    const draggable = event.relatedTarget
    const dropzone = event.target
  },
  ondropdeactivate: function (event) {
    const draggable = event.relatedTarget
    const dropzone = event.target
    dropzone.classList.remove('drop-active');
    dropzone.classList.remove('drop-target');
  }
}

// target elements with the "draggable" class
interact('.letter').draggable(dragOpts);
interact('.word').draggable(dragOpts);
interact('.trash').draggable(trashOpts);


const wordForm = document.querySelector('#word-form')
wordForm.addEventListener('submit', event => {
  event.preventDefault()
  const wordInput = document.querySelector('#word-input')
  const word = wordInput.value
  const id = (new Date).getTime()

  const letters = [...document.querySelectorAll('.letter')]
  let wordTop = 50
  if (letters.length) {
    const lowestLetter = letters.sort((a, b) => {
      return a.getBoundingClientRect().bottom - b.getBoundingClientRect().bottom
    }).pop()
    wordTop =  lowestLetter.getBoundingClientRect().bottom + 20
  }

  let html = `<section data-word="${id}" style="left:0;top:${wordTop}px;" class="word"><small class="word-caption">${word}</small>`

  for (var i = 0; i < word.length; i++) {
    const letter = word[i].toUpperCase()
    if (letter !== ' ') {
      const left = (i * 30) + 'px'
      html += `<button data-word="${id}" class="letter" style="top:50px;left:${left}">${letter}</button>`
    }
  }

  html += `</section>`

  wordInput.value = '';

  wordForm.insertAdjacentHTML('beforebegin', html)
  wordForm.previousElementSibling.scrollIntoView()
})



//TODO: use tap event from interact.js instead of native click event
interact('.letter').on('tap', event => {
  const el = event.target
  select(el, !el.classList.contains('selected'))
});
// interact('.word-caption').on('tap', event => {
//   const el = event.currentTarget
//   deselect();
//   select(el, true);
//   [...el.parentElement.querySelectorAll('.letter')].forEach(el => select(el, true))
// });


document.addEventListener('click', event => {
  const el = event.target
  if (el.matches('.trash-button')) {
    let selection = [...document.querySelectorAll('.word-caption.selected')]
    selection.forEach(el => el.parentElement.remove())
    selection = [...document.querySelectorAll('.letter.selected')]
    selection.forEach(el => el.remove())
  } else {
    deselect()
  }
})


function select (el, yep) {
  console.log('select', el, yep)
  el.setAttribute('aria-selected', String(yep));
  const cls = el.classList
  yep ? cls.add('selected') : cls.remove('selected')
}
function deselect() {
  [...document.querySelectorAll('.selected')].forEach(el => select(el, false))
}

function getOffsetTop (el) {
  var offsetTop = 0;
  do {
    if (!isNaN(el.offsetTop)) {
      offsetTop += el.offsetTop;
    }
  } while(elem = el.offsetParent);
  return offsetTop;
}
