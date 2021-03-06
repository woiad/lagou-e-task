import { h } from 'snabbdom/build/package/h'
import { init } from 'snabbdom/build/package/init'
import { classModule } from 'snabbdom/src/package/modules/class'
import { eventListenersModule } from 'snabbdom/src/package/modules/eventlisteners'
import { propsModule } from 'snabbdom/src/package/modules/props'
import { styleModule } from 'snabbdom/build/package/modules/style'

var originalData = [
  { rank: 1, title: 'The Shawshank Redemption', desc: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', elmHeight: 0 },
  { rank: 2, title: 'The Godfather', desc: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', elmHeight: 0 },
  { rank: 3, title: 'The Godfather: Part II', desc: 'The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.', elmHeight: 0 },
  { rank: 4, title: 'The Dark Knight', desc: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, the caped crusader must come to terms with one of the greatest psychological tests of his ability to fight injustice.', elmHeight: 0 },
  { rank: 5, title: 'Pulp Fiction', desc: 'The lives of two mob hit men, a boxer, a gangster\'s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', elmHeight: 0 },
  { rank: 6, title: 'Schindler\'s List', desc: 'In Poland during World War II, Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.', elmHeight: 0 },
  { rank: 7, title: '12 Angry Men', desc: 'A dissenting juror in a murder trial slowly manages to convince the others that the case is not as obviously clear as it seemed in court.', elmHeight: 0 },
  { rank: 8, title: 'The Good, the Bad and the Ugly', desc: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.', elmHeight: 0 },
  { rank: 9, title: 'The Lord of the Rings: The Return of the King', desc: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.', elmHeight: 0 },
  { rank: 10, title: 'Fight Club', desc: 'An insomniac office worker looking for a way to change his life crosses paths with a devil-may-care soap maker and they form an underground fight club that evolves into something much, much more...', elmHeight: 0 },
]

const patch = init([
  classModule,
  eventListenersModule,
  styleModule,
  propsModule
])
let vnode = null
let nextKey = 11
const margin = 8
let totalHeight = 0
let activeName = 'rank'
let data = [...originalData]

const changeSort = (name) => {
  activeName = name
  data.sort((cur, per) => {
    if (cur[name] > per[name]) return 1
    else if (cur[name] < per[name]) return -1
    else return 0
  })
  render()
}

const moveView = (movie) => {
  return h('div.row', {
      key: movie.rank,
      style: {
        opacity: 0,
        transform: 'translate(-200px)',
        delayed: { transform: `translateY(${movie.offset}px)`, opacity: '1' },
        remove:  { opacity: 0, transform: 'translateX(200px)' }
      },
      hook: { insert: (vnode) => { movie.elmHeight = vnode.elm.offsetHeight } }
    },
    [
      h('div', { style: { fontWeight: 'bold' } }, movie['rank']),
      h('div', movie.title),
      h('div', movie.desc),
      h('div.btn.rm-btn', { on: { click: () => remove(movie) } }, 'x')
    ]
  )
}

const addItem = () => {
  const item = originalData[ Math.floor(Math.random() * 10) ]
  data.unshift({ ...item, rank: nextKey++ })
  render()
}

const remove = (movie) => {
  data = data.filter((item) => {
    return item !== movie
  })
  render()
}

function view(data) {
  return h('div', [
    h('h1', 'Top 10 movies'),
    h('div', [
      h('a.btn.add', {
        class: { active: activeName === 'Add' },
        on: { click: addItem }
      }, 'Add'),
      'Sort by: ',
      h('span.btn-group', [
        h('a.btn.rank', { class: { active: activeName === 'rank' }, on: { click: () => changeSort('rank') } }, 'Rank'),
        h('a.btn.title', { class: { active: activeName === 'title'}, on: { click: () => changeSort('title') } }, 'Title'),
        h('a.btn.desc', { class: { active: activeName === 'desc'}, on: { click: () => changeSort('desc')} }, 'Description')
      ])
    ]),
    h('div.list', { style: { height: `${totalHeight}px` } }, data.map(moveView))
  ])
}

function render() {
  data = data.reduce((acc, cur) => {
    const last = acc[acc.length - 1]
    cur.offset = last ? last.offset + last.elmHeight + margin : margin
    return acc.concat(cur)
  }, [])
  totalHeight = data.length ? data[data.length - 1].offset + data[data.length - 1].elmHeight : 0
  vnode = patch(vnode, view(data))
}

window.addEventListener('DOMContentLoaded', () => {
  var app = document.getElementById('app')
  vnode = patch(app, view(data))
  render()
})
