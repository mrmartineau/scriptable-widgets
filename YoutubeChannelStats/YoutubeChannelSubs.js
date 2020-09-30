// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: video;

/**
 * WIDGET CONFIGURATION
 */
const YOUTUBE_CHANNEL_ID = 'your_channel_id'
const YOUTUBE_API_KEY = 'your_API_key'
const SHOW_CHANNEL_TITLE = false
const BG_COLOUR = '#ff0000'

let items = await fetchStats()
let widget = await createWidget(items)

// Check if the script is running in a widget. If not, show a preview of
// the widget to easier debug it.
if (!config.runsInWidget) {
  await widget.presentSmall()
}

// Tell the system to show the widget.
Script.setWidget(widget)
Script.complete()

async function createWidget(items) {
  const bg = new Color(BG_COLOUR)

  let item = items[0]
  const imgReq = await new Request(item.snippet.thumbnails.high.url)
  const img = await imgReq.loadImage()
  const title = item.snippet.title
  const statistics = item.statistics
  const { subscriberCount } = statistics

  let w = new ListWidget()
  w.useDefaultPadding()
  w.backgroundColor = bg
  w.url = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`

  const titleFontSize = 12
  const detailFontSize = 50

  let row = w.addStack()
  row.layoutHorizontally()
  row.addSpacer()
  let wimg = row.addImage(img)
  wimg.imageSize = new Size(40, 40)
  wimg.cornerRadius = 4

  w.addSpacer()

  // Show subscriber count
  let subscribersCount = w.addText(formatNumber(subscriberCount))
  subscribersCount.font = Font.ultraLightSystemFont(detailFontSize)
  subscribersCount.textColor = Color.white()
  subscribersCount.textOpacity = 0.9
  // w.addSpacer(-8)

  let subscribersText = w.addText(`SUBSCRIBERS`)
  subscribersText.font = Font.mediumSystemFont(titleFontSize)
  subscribersText.textColor = Color.white()
  subscribersText.textOpacity = 0.9

  if (SHOW_CHANNEL_TITLE) {
    // Show channel name
    w.addSpacer(2)
    let titleTxt = w.addText(title)
    titleTxt.font = Font.heavySystemFont(titleFontSize)
    titleTxt.textColor = Color.white()
  }

  return w
}

async function fetchStats() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}&part=contentDetails&part=contentOwnerDetails&part=topicDetails&part=snippet`
  let req = new Request(url)
  let json = await req.loadJSON()
  return json.items
}

function formatNumber(value) {
  var newValue = value
  if (value >= 1000) {
    var suffixes = ['', 'k', 'm', 'b', 't']
    var suffixNum = Math.floor(('' + value).length / 3)
    var shortValue = ''
    for (var precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat(
        (suffixNum != 0
          ? value / Math.pow(1000, suffixNum)
          : value
        ).toPrecision(precision)
      )
      var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '')
      if (dotLessShortValue.length <= 2) {
        break
      }
    }
    if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1)
    newValue = shortValue + suffixes[suffixNum]
  }
  return newValue
}
