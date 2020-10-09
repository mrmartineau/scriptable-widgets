// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: chalkboard-teacher;

/**
 * WIDGET CONFIGURATION
 */
const API_URL = 'https://api.github.com/repos/'
const LIGHT_BG_COLOUR = '#2a2a2a'
const DARK_BG_COLOUR = '#111111'

const repoData = await fetch()
const widget = await createWidget(repoData)

// Check if the script is running in
// a widget. If not, show a preview of
// the widget to easier debug it.
if (!config.runsInWidget) {
  await widget.presentSmall()
}
// Tell the system to show the widget.
Script.setWidget(widget)
Script.complete()

async function createWidget({ name, stars, url }) {
  const gradientBg = [
    new Color(`${LIGHT_BG_COLOUR}`),
    new Color(`${DARK_BG_COLOUR}`),
  ]
  const gradient = new LinearGradient()
  gradient.locations = [0, 1]
  gradient.colors = gradientBg
  const bg = new Color(DARK_BG_COLOUR)
  const logoReq = await new Request('https://i.imgur.com/MJzROGa.padding: ')
  const logoImg = await logoReq.loadImage()

  const w = new ListWidget()
  w.useDefaultPadding()
  w.backgroundColor = bg
  w.backgroundGradient = gradient
  w.url = url

  const titleFontSize = 12
  const detailFontSize = 36

  const row = w.addStack()
  row.layoutHorizontally()
  row.addSpacer()
  const wimg = row.addImage(logoImg)
  wimg.imageSize = new Size(30, 30)
  w.addSpacer()

  // Show stars count
  const starsCount = w.addText(formatNumber(`${stars}`))
  starsCount.font = Font.mediumRoundedSystemFont(detailFontSize)
  starsCount.textColor = Color.white()

  const repoName = w.addText(name)
  repoName.font = Font.regularSystemFont(titleFontSize)
  repoName.textColor = Color.white()

  return w
}

async function fetch() {
  const url = `${API_URL}${args.widgetParameter}`
  const req = new Request(url)
  const json = await req.loadJSON()
  return {
    name: json.name,
    stars: json.stargazers_count,
    url: json.html_url,
  }
}

function formatNumber(value) {
  console.log(value)
  var length = (value + '').length,
    index = Math.ceil((length - 3) / 3),
    suffix = ['k', 'm', 'b', 't']

  if (length < 4) return value

  return (
    (value / Math.pow(1000, index)).toFixed(1).replace(/\.0$/, '') +
    suffix[index - 1]
  )
}
