// TODO: site logics

$(($) => {
  const $body = $('html, body')
  const a = 1

  $('#scroll_top').on('click', () => {
    $body.animate({ scrollTop: 0 }, 600)
    return false
  })
})
