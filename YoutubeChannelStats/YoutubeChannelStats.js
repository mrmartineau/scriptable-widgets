// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: video;

const YOUTUBE_CHANNEL_ID = 'UCaeTwbBs3tezU9MUi25z5MQ'
const YOUTUBE_API_KEY = args.widgetParameter

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
  const isDarkMode = Device.isUsingDarkAppearance()
  const gradientBg = isDarkMode
    ? [new Color('#000000e6'), new Color('#000000b3')]
    : [new Color('#b00a0fe6'), new Color('#b00a0fb3')]
  const bg = isDarkMode ? new Color('#000000') : new Color('#b00a0f')

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
  // Show channel name
  let titleTxt = w.addText(title)
  titleTxt.font = Font.heavySystemFont(16)
  titleTxt.textColor = Color.white()
  w.addSpacer(8)

  // Show subscriber count
  let subscribersText = w.addText(`SUBSCRIBERS`)
  subscribersText.font = Font.mediumSystemFont(titleFontSize)
  subscribersText.textColor = Color.white()
  subscribersText.textOpacity = 0.9
  w.addSpacer(2)

  let subscribersCount = w.addText(subscriberCount)
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

  let viewsCount = w.addText(viewCount)
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
