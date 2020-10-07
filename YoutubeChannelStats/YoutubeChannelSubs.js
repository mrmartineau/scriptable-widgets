// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: video;

/**
 * WIDGET CONFIGURATION
 */
const YOUTUBE_CHANNEL_ID = 'your_channel_id'
const YOUTUBE_API_KEY = 'your_API_key'
const SHOW_CHANNEL_TITLE = false
const LIGHT_BG_COLOUR = '#ff0000'
const DARK_BG_COLOUR = '#9E0000'

const items = await fetch()
const widget = await createWidget(items)

// Check if the script is running in
// a widget. If not, show a preview of
// the widget to easier debug it.
if (!config.runsInWidget) {
  await widget.presentSmall()
}
// Tell the system to show the widget.
Script.setWidget(widget)
Script.complete()

async function createWidget(items) {
  const item = items[0]
  const gradientBg = [
    new Color(`${LIGHT_BG_COLOUR}D9`),
    new Color(`${DARK_BG_COLOUR}D9`),
  ]
  const gradient = new LinearGradient()
  gradient.locations = [0, 1]
  gradient.colors = gradientBg
  const bg = new Color(LIGHT_BG_COLOUR)
  const imgReq = await new Request(item.snippet.thumbnails.high.url)
  const img = await imgReq.loadImage()
  const logoReq = await new Request('https://i.imgur.com/mRURHE5.png')
  const logoImg = await logoReq.loadImage()

  const title = item.snippet.title
  const statistics = item.statistics
  const { subscriberCount } = statistics

  const w = new ListWidget()
  w.useDefaultPadding()
  w.backgroundImage = img
  w.backgroundColor = bg
  w.backgroundGradient = gradient
  w.url = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`

  const titleFontSize = 12
  const detailFontSize = 50

  const row = w.addStack()
  row.layoutHorizontally()
  row.addSpacer()
  const wimg = row.addImage(logoImg)
  wimg.imageSize = new Size(30, 25)

  w.addSpacer()

  // Show subscriber count
  const subscribersCount = w.addText(formatNumber(subscriberCount))
  subscribersCount.font = Font.mediumRoundedSystemFont(detailFontSize)
  subscribersCount.textColor = Color.white()

  const subscribersText = w.addText(`SUBSCRIBERS`)
  subscribersText.font = Font.regularSystemFont(titleFontSize)
  subscribersText.textColor = Color.white()

  if (SHOW_CHANNEL_TITLE) {
    // Show channel name
    w.addSpacer(2)
    const titleTxt = w.addText(title)
    titleTxt.font = Font.heavySystemFont(titleFontSize)
    titleTxt.textColor = Color.white()
  }

  return w
}

async function fetch() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}&part=contentDetails&part=contentOwnerDetails&part=topicDetails&part=snippet`
  const req = new Request(url)
  const json = await req.loadJSON()
  return json.items
}

function formatNumber(value) {
  var length = (value + '').length,
    index = Math.ceil((length - 3) / 3),
    suffix = ['k', 'm', 'b', 't']

  if (length < 4) return value

  return (
    (value / Math.pow(1000, index)).toFixed(1).replace(/\.0$/, '') +
    suffix[index - 1]
  )
}
