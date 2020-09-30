// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: video;

/**
 * WIDGET CONFIGURATION
 */
const YOUTUBE_CHANNEL_ID = 'your_channel_id'
const YOUTUBE_API_KEY = 'your_API_key'
const SHOW_CHANNEL_TITLE = true
const DARK_BG_COLOUR = '#000000'
const LIGHT_BG_COLOUR = '#b00a0f'

let items = await fetchStats()
let widget = await createWidget(items)

// Check if the script is running in
// a widget. If not, show a preview of
// the widget to easier debug it.
if (!config.runsInWidget) {
  await widget.presentMedium()
}
// Tell the system to show the widget.
Script.setWidget(widget)
Script.complete()

async function createWidget(items) {
  const isDarkMode = await isUsingDarkAppearance()
  const gradientBg = isDarkMode
    ? [new Color(`${DARK_BG_COLOUR}40`), new Color(`${DARK_BG_COLOUR}CC`)]
    : [new Color(`${LIGHT_BG_COLOUR}40`), new Color(`${LIGHT_BG_COLOUR}CC`)]
  const bg = isDarkMode ? new Color(DARK_BG_COLOUR) : new Color(LIGHT_BG_COLOUR)

  let item = items[0]
  const imgReq = await new Request(item.snippet.thumbnails.high.url)
  const img = await imgReq.loadImage()
  const title = item.snippet.title
  const statistics = item.statistics
  const { viewCount, subscriberCount } = statistics
  let gradient = new LinearGradient()
  gradient.locations = [0, 1]
  gradient.colors = gradientBg
  let w = new ListWidget()
  w.backgroundImage = img
  w.backgroundColor = bg
  w.backgroundGradient = gradient
  w.url = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`

  const titleFontSize = 12
  const detailFontSize = 25

  if (SHOW_CHANNEL_TITLE) {
    // Show channel name
    let titleTxt = w.addText(title)
    titleTxt.font = Font.heavySystemFont(16)
    titleTxt.textColor = Color.white()
    w.addSpacer(8)
  } else {
    w.addSpacer()
  }

  // Show subscriber count
  let subscribersText = w.addText(`SUBSCRIBERS`)
  subscribersText.font = Font.mediumSystemFont(titleFontSize)
  subscribersText.textColor = Color.white()
  subscribersText.textOpacity = 0.9
  w.addSpacer(2)

  let subscribersCount = w.addText(formatNumber(subscriberCount))
  subscribersCount.font = Font.heavySystemFont(detailFontSize)
  subscribersCount.textColor = Color.white()
  subscribersCount.textOpacity = 0.9
  w.addSpacer(8)

  // Show view count
  let viewsText = w.addText(`VIEWS`)
  viewsText.font = Font.mediumSystemFont(titleFontSize)
  viewsText.textColor = Color.white()
  viewsText.textOpacity = 0.9
  w.addSpacer(2)

  let viewsCount = w.addText(formatNumber(viewCount))
  viewsCount.font = Font.heavySystemFont(detailFontSize)
  viewsCount.textColor = Color.white()
  viewsCount.textOpacity = 0.9

  return w
}

async function fetchStats() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}&part=contentDetails&part=contentOwnerDetails&part=topicDetails&part=snippet`
  let req = new Request(url)
  let json = await req.loadJSON()
  return json.items
}

async function isUsingDarkAppearance() {
  const wv = new WebView()
  let js =
    "(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)"
  let r = await wv.evaluateJavaScript(js)
  return r
}

function formatNumber(number) {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(number)
}
