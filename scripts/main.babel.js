//TODO: index elements by their x position

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
    restriction: 'parent',
    endOnly: true,
    elementRect: { top: .07, left: .07, bottom: .93, right: .93 }
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
    var el = event.target
    var x = (parseFloat(el.dataset.x) || 0) + event.dx
    var y = (parseFloat(el.dataset.y) || 0) + event.dy
    el.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    el.style.zIndex = G.zIndex
    el.dataset.x = x
    el.dataset.y = y
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
    console.log(event)
    const draggable = event.relatedTarget
    const dropzone = event.target
    dropzone.classList.add('drop-target')
    draggable.classList.add('can-drop')
  },
  // ondragleave: event => {
  //   const draggable = event.relatedTarget
  //   const dropzone = event.target
  //   event.target.classList.remove('drop-target');
  //   event.relatedTarget.classList.remove('can-drop');
  // },
  // ondrop: event => {
  //   const draggable = event.relatedTarget
  //   const dropzone = event.target
  // },
  // ondropdeactivate: function (event) {
  //   const draggable = event.relatedTarget
  //   const dropzone = event.target
  //   dropzone.classList.remove('drop-active');
  //   dropzone.classList.remove('drop-target');
  // }
}

// target elements with the "draggable" class
interact('.letter').draggable(dragOpts);
interact('.trash').draggable(trashOpts);


const wordForm = document.querySelector('#word-form')
wordForm.addEventListener('submit', event => {
  event.preventDefault()
  const wordInput = document.querySelector('#word-input')
  const word = wordInput.value

  let html = `<section class="selectable word"><small class="">${word}</small>`

  for (var i = 0; i < word.length; i++) {
    const letter = word[i].toUpperCase()
    if (letter != ' ') { //TODO: better check, or filter value before looping
      html += `<button class="selectable letter">${letter}</button>`
    }
  }
  html += '</section>'
  wordInput.value = '';

  wordForm.insertAdjacentHTML('beforebegin', html)
  wordForm.previousElementSibling.scrollIntoView()
})


document.addEventListener('click', event => {
  const el = event.target

  if (el.matches('.selectable')/* && !G.preventClick*/) {
    select(el)
  }

  else if (el.matches('.trash-button')) {
    console.log('trash')
    const selection = [...document.querySelectorAll('.selected')]
    console.log(selection)
    selection.forEach(el => el.remove())
  }
})


function select (el) {
  const isSelected = el.getAttribute('aria-selected') === 'true';
  el.setAttribute('aria-selected', String(!isSelected));
  const cls = el.classList
  isSelected ? cls.remove('selected') : cls.add('selected')
}
