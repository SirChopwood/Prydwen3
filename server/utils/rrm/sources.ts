import {default as YTSearch} from "yt-search"

export const Sources: Record<string, (request: string) => Promise<{
    text: string,
    code: string,
    metadata: Record<string, string>
} | undefined>> = {
    "PyPy": PyPy,
    "PlainText": PlainText,
    "YouTube": YouTube
}

export async function PyPy(request: string) {
    let requestData = {text: "", code: "", metadata: {} as Record<string, string>}
    let res = await fetch('https://jd.pypy.moe/api/v2/songs')
    if (res.status === 200) {
        let data = await res.json() as {
            updatedAt: number,
            songs: Array<{
                "id": number,
                "group": number,
                "volume": number,
                "name": string,
                "flip": boolean,
                "start": number,
                "end": number,
                "skipRandom": boolean,
                "originalUrl": Array<string>,
                "tags": Array<string>
            }>,
            localization: Array<any>,
            groups: Array<string>,
        }
        const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi
        let ytRequest = ytRegex.exec(request)
        for (let song of data.songs) {
            // If Request matches ID or YT URL
            if (String(song.id) === String(request) || (ytRequest && String(song.originalUrl[0]) === String(ytRequest[0]))) {
                requestData.code = String(song.id)
                requestData.text = song.name
                requestData.metadata["Source"] = "PyPy"
                requestData.metadata["Group"] = data.groups[song.group]
                requestData.metadata["Duration"] = String(song.end - song.start)
                try {
                    let video = await YTSearch({videoId: song.originalUrl[0]})

                    if (video) {
                        requestData.metadata["Thumbnail"] = video.thumbnail
                    }
                } catch (e) {
                    console.log("Could not find thumbnail")
                }

                console.log(`Processed ${request} as PyPy.`)
                return requestData
            }
        }
    }
    console.log(`Failed to process ${request} as PyPy.`)
    return undefined
}

export async function PlainText(request: string) {
    let requestData = {text: "", code: "", metadata: {} as Record<string, string>}
    requestData.text = request
    requestData.code = request
    requestData.metadata["Source"] = "PlainText"
    console.log(`Processed ${request} as Plain Text.`)
    return requestData
}

export async function YouTube(request: string) {
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi
    let ytRequest = ytRegex.exec(request)
    if (!ytRequest) {return undefined}
    let video = await YTSearch({videoId: ytRequest[0]})
    if (!video) {return undefined}


    let requestData = {
        text: video.title,
        code: `https://www.youtube.com/watch?v=${video.videoId}`,
        metadata: {
            "Source": "YouTube",
            "Duration": String(video.duration.seconds),
            "Thumbnail": video.thumbnail,
            "Channel": video.author.name
        }
    }
    console.log(`Processed ${request} as YouTube.`)
    return requestData
}