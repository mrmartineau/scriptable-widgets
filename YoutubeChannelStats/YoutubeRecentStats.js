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

const stats = await fetchRecentVideoStats()
const widget = await createWidget(stats)

// Check if the script is running in
// a widget. If not, show a preview of
// the widget to easier debug it.
if (!config.runsInWidget) {
  await widget.presentLarge()
}
// Tell the system to show the widget.
Script.setWidget(widget)
Script.complete()

async function createWidget(stats) {
  const gradientBg = [
    new Color(`${LIGHT_BG_COLOUR}D9`),
    new Color(`${DARK_BG_COLOUR}D9`),
  ]
  const gradient = new LinearGradient()
  gradient.locations = [0, 1]
  gradient.colors = gradientBg
  const bg = new Color(LIGHT_BG_COLOUR)
  const imgReq = await new Request(stats.channelImage)
  const img = await imgReq.loadImage()
  const logoReq = await new Request('https://i.imgur.com/mRURHE5.png')
  const logoImg = await logoReq.loadImage()

  const title = stats.channelName
  const statistics = stats.channelStats
  const { subscriberCount, viewCount } = statistics

  const w = new ListWidget()
  w.useDefaultPadding()
  w.backgroundImage = img
  w.backgroundColor = bg
  w.backgroundGradient = gradient

  w.url = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`

  const titleFontSize = 15
  const detailFontSize = 20
  const emojiFontSize = 14

  const row = w.addStack()
  row.layoutHorizontally()
  row.addSpacer()
  const wimg = row.addImage(logoImg)
  wimg.imageSize = new Size(30, 25)

  w.addSpacer()

  stats.videos.forEach(({ title, statistics }) => {
    const vidRow = w.addStack()
    vidRow.layoutHorizontally()

    const vidViewEmoji = vidRow.addText('👀')
    vidViewEmoji.font = new Font('AppleColorEmoji', emojiFontSize)
    vidViewEmoji.textOpacity = 0.9
    vidRow.addSpacer(5)
    w.addSpacer(2)

    const vidViewCount = vidRow.addText(formatNumber(statistics.viewCount))
    vidViewCount.font = Font.mediumRoundedSystemFont(detailFontSize)
    vidViewCount.textColor = Color.white()
    vidViewCount.textOpacity = 0.9
    vidRow.addSpacer(12)

    const vidLikeEmoji = vidRow.addText('👍')
    vidLikeEmoji.font = new Font('AppleColorEmoji', emojiFontSize)
    vidLikeEmoji.textOpacity = 0.9
    vidRow.addSpacer(5)

    const vidLikeCount = vidRow.addText(formatNumber(statistics.likeCount))
    vidLikeCount.font = Font.mediumRoundedSystemFont(detailFontSize)
    vidLikeCount.textColor = Color.white()
    vidLikeCount.textOpacity = 0.9

    w.addSpacer(2)
    const videoTitle = w.addText(title)
    videoTitle.font = Font.mediumSystemFont(titleFontSize)
    videoTitle.textColor = Color.white()
    videoTitle.textOpacity = 0.9

    w.addSpacer(20)
  })
  // await table.present()

  if (SHOW_CHANNEL_TITLE) {
    // Show channel name
    w.addSpacer(2)
    const titleTxt = w.addText(title)
    titleTxt.font = Font.heavySystemFont(titleFontSize)
    titleTxt.textColor = Color.white()
  }

  return w
}

async function fetch(url) {
  const req = new Request(url)
  const json = await req.loadJSON()
  return json.items
}

async function fetchRecentVideoStats() {
  const channelStats = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}&part=snippet&part=statistics&part=contentDetails`
  )
  const uploadsPlaylist =
    channelStats[0].contentDetails.relatedPlaylists.uploads
  const playlistInfo = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${uploadsPlaylist}&key=${YOUTUBE_API_KEY}&part=contentDetails&maxResults=5`
  )
  const videosIds = playlistInfo.map((item) => {
    return item.contentDetails.videoId
  })
  const video1Info = await fetchVideoInfo(videosIds[0])
  const video2Info = await fetchVideoInfo(videosIds[1])
  const video3Info = await fetchVideoInfo(videosIds[2])

  return {
    channelName: channelStats[0].snippet.title,
    channelImage: channelStats[0].snippet.thumbnails.high.url,
    channelStats: channelStats[0].statistics,
    videos: [
      {
        title: video1Info[0].snippet.title,
        statistics: video1Info[0].statistics,
      },
      {
        title: video2Info[0].snippet.title,
        statistics: video2Info[0].statistics,
      },
      {
        title: video3Info[0].snippet.title,
        statistics: video3Info[0].statistics,
      },
    ],
  }
}

async function fetchVideoInfo(videoId) {
  return fetch(
    `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoId}&part=snippet&part=statistics`
  )
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
