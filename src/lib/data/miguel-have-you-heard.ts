/* Miguel, "Have You Heard": single rollout plan.
   Chartmetric pulled 22 Oct 2026 (artist 3853). Audio read from the working mix shared 14 Oct 2026. */

export const listenerSeries: { date: string; listeners: number; followers: number }[] = [{"date": "2025-09-02", "listeners": 25007704, "followers": 6022898}, {"date": "2025-09-17", "listeners": 25649936, "followers": 6047100}, {"date": "2025-09-28", "listeners": 26338750, "followers": 6066222}, {"date": "2025-10-08", "listeners": 26766612, "followers": 6085141}, {"date": "2025-10-18", "listeners": 27308412, "followers": 6104373}, {"date": "2025-10-28", "listeners": 27243448, "followers": 6123350}, {"date": "2025-11-07", "listeners": 28114508, "followers": 6141294}, {"date": "2025-11-17", "listeners": 28753880, "followers": 6160153}, {"date": "2025-11-27", "listeners": 29204176, "followers": 6181374}, {"date": "2025-12-07", "listeners": 28117460, "followers": 6212371}, {"date": "2025-12-17", "listeners": 27514106, "followers": 6240625}, {"date": "2026-01-02", "listeners": 26999862, "followers": 6283002}, {"date": "2026-01-12", "listeners": 27097454, "followers": 6307198}, {"date": "2026-01-22", "listeners": 27521378, "followers": 6331804}, {"date": "2026-02-01", "listeners": 28656290, "followers": 6355474}, {"date": "2026-02-11", "listeners": 28962364, "followers": 6380684}, {"date": "2026-02-22", "listeners": 29014162, "followers": 6409888}, {"date": "2026-03-05", "listeners": 28885564, "followers": 6442174}, {"date": "2026-03-15", "listeners": 29304654, "followers": 6470438}, {"date": "2026-03-25", "listeners": 29225584, "followers": 6499069}, {"date": "2026-04-05", "listeners": 29724968, "followers": 6534369}, {"date": "2026-04-16", "listeners": 29700604, "followers": 6562666}, {"date": "2026-04-26", "listeners": 29772508, "followers": 6594017}, {"date": "2026-05-06", "listeners": 29715132, "followers": 6621906}, {"date": "2026-05-16", "listeners": 30119552, "followers": 6655907}, {"date": "2026-05-27", "listeners": 30446756, "followers": 6689786}, {"date": "2026-06-07", "listeners": 30898464, "followers": 6726161}, {"date": "2026-06-17", "listeners": 31067264, "followers": 6754650}, {"date": "2026-06-28", "listeners": 30843982, "followers": 6789503}, {"date": "2026-07-09", "listeners": 30707650, "followers": 6822986}, {"date": "2026-07-19", "listeners": 30892728, "followers": 6856736}, {"date": "2026-07-30", "listeners": 30758212, "followers": 6887568}, {"date": "2026-08-10", "listeners": 30753616, "followers": 6923050}, {"date": "2026-08-20", "listeners": 30852248, "followers": 6958578}, {"date": "2026-08-30", "listeners": 31824636, "followers": 6992916}, {"date": "2026-09-09", "listeners": 33211832, "followers": 7027791}, {"date": "2026-09-19", "listeners": 34756816, "followers": 7066278}, {"date": "2026-09-29", "listeners": 35377196, "followers": 7104902}, {"date": "2026-10-09", "listeners": 36827830, "followers": 7140257}, {"date": "2026-10-19", "listeners": 36757124, "followers": 7179467}, {"date": "2026-10-22", "listeners": 36848450, "followers": 7189786}];

/* Full-mix RMS energy, 2-second windows, normalised to 100. Working mix, 3:52. */
export const energyCurve: { t: number; energy: number }[] = [{"t": 0, "energy": 0}, {"t": 2, "energy": 0}, {"t": 4, "energy": 17}, {"t": 6, "energy": 24}, {"t": 8, "energy": 25}, {"t": 10, "energy": 25}, {"t": 12, "energy": 22}, {"t": 14, "energy": 23}, {"t": 16, "energy": 24}, {"t": 18, "energy": 27}, {"t": 20, "energy": 35}, {"t": 22, "energy": 44}, {"t": 24, "energy": 46}, {"t": 26, "energy": 45}, {"t": 28, "energy": 53}, {"t": 30, "energy": 49}, {"t": 32, "energy": 50}, {"t": 34, "energy": 48}, {"t": 36, "energy": 47}, {"t": 38, "energy": 52}, {"t": 40, "energy": 51}, {"t": 42, "energy": 53}, {"t": 44, "energy": 49}, {"t": 46, "energy": 55}, {"t": 48, "energy": 52}, {"t": 50, "energy": 52}, {"t": 52, "energy": 49}, {"t": 54, "energy": 54}, {"t": 56, "energy": 70}, {"t": 58, "energy": 75}, {"t": 60, "energy": 85}, {"t": 62, "energy": 81}, {"t": 64, "energy": 100}, {"t": 66, "energy": 80}, {"t": 68, "energy": 81}, {"t": 70, "energy": 77}, {"t": 72, "energy": 83}, {"t": 74, "energy": 73}, {"t": 76, "energy": 75}, {"t": 78, "energy": 69}, {"t": 80, "energy": 71}, {"t": 82, "energy": 67}, {"t": 84, "energy": 70}, {"t": 86, "energy": 60}, {"t": 88, "energy": 72}, {"t": 90, "energy": 49}, {"t": 92, "energy": 54}, {"t": 94, "energy": 51}, {"t": 96, "energy": 49}, {"t": 98, "energy": 55}, {"t": 100, "energy": 53}, {"t": 102, "energy": 51}, {"t": 104, "energy": 49}, {"t": 106, "energy": 55}, {"t": 108, "energy": 56}, {"t": 110, "energy": 63}, {"t": 112, "energy": 57}, {"t": 114, "energy": 53}, {"t": 116, "energy": 58}, {"t": 118, "energy": 68}, {"t": 120, "energy": 75}, {"t": 122, "energy": 74}, {"t": 124, "energy": 71}, {"t": 126, "energy": 73}, {"t": 128, "energy": 70}, {"t": 130, "energy": 67}, {"t": 132, "energy": 77}, {"t": 134, "energy": 75}, {"t": 136, "energy": 71}, {"t": 138, "energy": 74}, {"t": 140, "energy": 70}, {"t": 142, "energy": 69}, {"t": 144, "energy": 72}, {"t": 146, "energy": 69}, {"t": 148, "energy": 75}, {"t": 150, "energy": 63}, {"t": 152, "energy": 15}, {"t": 154, "energy": 23}, {"t": 156, "energy": 18}, {"t": 158, "energy": 19}, {"t": 160, "energy": 12}, {"t": 162, "energy": 16}, {"t": 164, "energy": 18}, {"t": 166, "energy": 21}, {"t": 168, "energy": 18}, {"t": 170, "energy": 29}, {"t": 172, "energy": 29}, {"t": 174, "energy": 35}, {"t": 176, "energy": 21}, {"t": 178, "energy": 19}, {"t": 180, "energy": 25}, {"t": 182, "energy": 49}, {"t": 184, "energy": 64}, {"t": 186, "energy": 69}, {"t": 188, "energy": 58}, {"t": 190, "energy": 40}, {"t": 192, "energy": 49}, {"t": 194, "energy": 48}, {"t": 196, "energy": 55}, {"t": 198, "energy": 44}, {"t": 200, "energy": 85}, {"t": 202, "energy": 86}, {"t": 204, "energy": 79}, {"t": 206, "energy": 78}, {"t": 208, "energy": 75}, {"t": 210, "energy": 78}, {"t": 212, "energy": 74}, {"t": 214, "energy": 77}, {"t": 216, "energy": 85}, {"t": 218, "energy": 86}, {"t": 220, "energy": 80}, {"t": 222, "energy": 76}, {"t": 224, "energy": 79}, {"t": 226, "energy": 76}, {"t": 228, "energy": 81}, {"t": 230, "energy": 79}];

export const miguelHyh = {
  slug: 'miguel-have-you-heard',
  password: 'heard',
  artist: 'Miguel',
  release: 'Have You Heard',
  thesis:
    'The title is the mechanic. “Have you heard?” is how news moves between people, so the rollout spreads the song the way the song asks to be spread: from Miguel, through S1C, person to person, with paid only behind what people are already passing on.',

  dates: {
    recommended: 'Fri 13 Nov',
    shoots: [
      { k: 'Short-form shoot', v: 'Mon 26 to Tue 27 Oct' },
      { k: 'Music video shoot', v: 'Wed 4 to Thu 5 Nov' },
      { k: 'Single', v: 'Fri 13 Nov (recommended over 6 Nov)' },
      { k: 'Music video', v: 'Fri 20 Nov target, Tue 24 Nov fallback, otherwise Tue 8 Dec' },
    ],
  },

  brief: {
    heard: [
      { k: 'The release', v: '“Have You Heard”, Miguel’s first new music since CAOS. A single now, with the music video following as soon as it is finished.' },
      { k: 'Production', v: 'Short-form teaser content shoots 26 and 27 October. The music video shoots 4 and 5 November.' },
      { k: 'Date', v: 'Target release 6 or 13 November, to be confirmed. This plan recommends 13 November and shows why below.' },
      { k: 'The ask', v: 'Pre-release, release week and post-release: organic social, paid media, fan engagement, content rollout and creative ideas, plus a stagger for the teasers and the video that keeps the single moving well past launch.' },
      { k: 'Process', v: 'Align with Miguel on the approach, then share with RCA for input, additional opportunities and support. Nothing activates externally until everything is confirmed.' },
    ],
    principles: [
      { t: 'S1C is the source', d: 'Every first look lands on S1C before anywhere else: the announce, the first listen, the video. Socials and Reddit carry the news; S1C breaks it.' },
      { t: 'One song, a long tail', d: 'The R&B singles that won this year ran for months, not weeks. We plan three phases of life for one song instead of one big week.' },
      { t: 'Face first, hook first', d: 'Miguel on camera in the first second and the title line inside two. His intimate face-to-camera clips earn several times the engagement of polished teasers.' },
      { t: 'Real attention only', d: 'No purchased engagement. Paid media only ever amplifies posts that are already working with real people, and every dollar is reported against what it moved.' },
    ],
  },

  track: {
    hook: 'Have you heard? We’re all gonna die, so enjoy the ride.',
    hookNote: 'As heard on the working mix shared 14 October. To be checked against the final lyric sheet.',
    read:
      'The title is the first thing you hear. The record opens on the hook, filtered and close, and the phrase comes back nine times in under four minutes. That makes it a gift for short-form: almost any cut starts on the line people will repeat. The breakdown at 2:30 drops almost to silence and rebuilds on the hook, which is the most intimate 25 seconds on the record and the natural home for face-to-camera and live moments.',
    specs: [
      { value: '0:00', label: 'Title line lands on the first word' },
      { value: '9×', label: '“Have you heard” in 3:52' },
      { value: '117', label: 'BPM (reads as half-time, about 59)' },
      { value: '3:52', label: 'Length of the working mix' },
      { value: '0:56', label: 'First full chorus' },
      { value: '2:30', label: 'Breakdown: the quiet, close moment' },
    ],
    sections: [
      { from: 0, to: 20, label: 'Cold-open hook' },
      { from: 20, to: 56, label: 'Verse one' },
      { from: 56, to: 89, label: 'Chorus' },
      { from: 89, to: 117, label: 'Verse two' },
      { from: 117, to: 150, label: 'Chorus' },
      { from: 150, to: 180, label: 'Breakdown' },
      { from: 180, to: 232, label: 'Final choruses' },
    ],
    sounds: [
      { name: 'The cold open', window: '0:00 to 0:15', use: 'The title line alone over the filtered intro. Posted first, as Miguel’s own original sound, before the title or date exist anywhere. It becomes the official sound once the single is out.' },
      { name: 'The chorus', window: '0:56 to 1:12', use: 'The full-band hook. The release-week sound and the one paid media runs behind.' },
      { name: 'The breakdown', window: '2:30 to 2:50', use: 'Near silence, then the hook rebuilds. Face-to-camera, live vocal, Spotify Canvas and the stripped version all live here.' },
    ],
  },

  idea: {
    line: 'Treat the title as an instruction. Each phase answers a different version of the question: have you heard he’s back, have you heard the song, have you heard what he did with it.',
    pillars: [
      { name: 'Heard it here first', who: 'S1C', d: 'A notify list on S1C opens with the announce. Members get every first: the first listen on the Wednesday livestream, the video an hour early, the live version. Each member gets a personal share link, and the people who bring the most friends in are thanked with signed vinyl from the December reissues.' },
      { name: 'The phrase before the song', who: 'Miguel', d: '“Have you heard?” is already a format: on the S1C livestreams, Miguel’s stories that start with it hold the room. We make it a recurring series of 30 to 45 second stories, each one a true moment from his life that points at who he is now. The phrase is familiar before the song is public.' },
      { name: 'Face first, hook first', who: 'Short-form', d: 'Every teaser opens on Miguel and lands the title line inside two seconds. The 26 to 27 October shoot is cut into a ladder of pieces released one at a time, so each week has something new and the video still feels like a reveal.' },
      { name: 'Let it move you', who: 'Singers and fans', d: 'After release, invite singers to sing the hook their way and fans to show what “enjoy the ride” looks like in their life. Miguel answers the best ones within a day. If the covers take off, they become an official versions moment in the new year.' },
    ],
    why: [
      { n: '0:00', t: 'The hook is the intro', d: 'No intro to skip. Any clip cut from the first 15 seconds opens on the line people will sing back, which is the single biggest predictor of short-form pickup.' },
      { n: '6×', t: 'Intimate beats polished', d: 'On “damned”, face-to-camera lip-sync and confession clips earned 17 to 25% like rates. The polished “link in bio” teaser earned 2.6%.' },
      { n: '19.5%', t: 'Listeners rent, followers stay', d: '36.8M monthly listeners, 7.2M Spotify followers. The job of this single is to turn catalog listeners into people who hear about new music, which is what the S1C list is for.' },
    ],
  },

  dateCall: {
    intro: 'Both dates work on paper. Thirteen November is the one that gives the music room to be heard, and the trade-off is manageable.',
    rows: [
      { k: 'Days of teasing after the 26 to 27 Oct shoot', a: '9', b: '16' },
      { k: 'Spotify editorial pitch lead time', a: 'About one week, if the master is delivered by 30 Oct', b: 'Two weeks or more, with a fully approved master' },
      { k: 'Music video shoot', a: 'Two days before release: release week and shoot week collide', b: 'Done before release week: behind-the-scenes becomes release-week content' },
      { k: 'Same-day competition', a: 'Lil Baby, FRESH (rap album, heavy Urban radio)', b: 'Snoh Aalegra, Legendary Love (first R&B album in five years)' },
      { k: 'Video before Thanksgiving (26 Nov)', a: 'Easier', b: 'Fri 20 or Tue 24 Nov, tight but possible' },
      { k: 'Fridays before the holiday crowding', a: 'Three', b: 'Two' },
    ],
    verdict: 'Recommend Friday 13 November. Runway is the one thing we cannot buy back.',
    verdictBody: 'Nine days is not enough to announce, pitch, tease and shoot a video in the same breath. The Snoh Aalegra album shares the audience on 13 November, but an album spreads its editorial weight across many tracks and a single gets its own slot. If the master and DSP delivery lock by 27 October, 6 November becomes viable and everything below moves one week earlier.',
  },

  ladder: {
    intro: 'Seven drops from the October shoot before the video exists, then the video, then a second life in December. Each piece has one job and nothing is spent twice.',
    items: [
      { when: 'Sun 1 Nov', what: 'Cold-open teaser', d: '8 to 12 seconds. Miguel to camera, the title line over the filtered intro, cut before the next line. No title, no date, no link. Posted as his own original sound on TikTok and Instagram.', tag: 'Teaser 1' },
      { when: 'Tue 3 Nov', what: 'Announce', d: 'Art, title and date, on S1C first and socials an hour later. A 15-second chorus clip and the S1C notify link.', tag: 'Teaser 2' },
      { when: 'Fri 6 Nov', what: 'Second performance teaser', d: 'A second performance cut from the shoot with a different look. Instagram Trial Reels test five hook and caption variants to non-followers.', tag: 'Teaser 3' },
      { when: 'Mon 9 Nov', what: 'Lyric close-up', d: 'One lyric moment, tight on Miguel. The breakdown sound debuts here.', tag: 'Teaser 4' },
      { when: 'Wed 11 Nov', what: 'First listen on S1C', d: 'The weekly livestream becomes the first listen: Miguel tells the story of the song and plays it for members. Clips from the stream feed Thursday and Friday.', tag: 'Live' },
      { when: 'Thu 12 Nov', what: 'Day-before teaser', d: 'Seven seconds. The hook and the date. Nothing else.', tag: 'Teaser 5' },
      { when: 'Fri 13 Nov', what: 'Out now', d: 'The strongest teaser so far becomes the out-now post. Official audio on YouTube with shoot footage as the visual, Canvas and Clips on Spotify, SMS and email to the S1C list.', tag: 'Release' },
      { when: 'Sun 15 to Tue 17 Nov', what: 'Video set behind-the-scenes', d: 'Behind-the-scenes stills and a vertical from the 4 to 5 November shoot. The first look at the video world, without the video.', tag: 'Bridge' },
      { when: 'Wed 18 Nov', what: 'Video trailer', d: '15 seconds and the premiere time. The YouTube Premiere page goes live with a reminder button.', tag: 'Trailer' },
      { when: 'Fri 20 Nov', what: 'The video', d: 'YouTube Premiere, S1C members an hour early, Miguel live in the premiere chat. Shorts cut from the video post the same day. Fallback Tue 24 Nov; if it slips past that, Tue 8 Dec, clear of Thanksgiving and Wrapped.', tag: 'Video' },
      { when: 'Late Nov to Dec', what: 'Video cutdowns', d: 'One cutdown a week from the video, each a different moment, each tested in Trial Reels before it goes to the grid.', tag: 'Sustain' },
      { when: 'Week of 7 Dec', what: 'The live version', d: 'A one-take live vocal captured on the video set, released as a vertical and a YouTube performance, built around the breakdown.', tag: 'Second life' },
      { when: 'Mid Dec', what: 'Reserve teaser', d: 'One teaser from the October shoot is never used before release. It comes out in December as unseen footage and restarts the clock.', tag: 'Reserve' },
    ],
  },

  shootAsks: {
    october: [
      'Three cold-open takes: Miguel to camera, the title line only, three different settings. These become teasers one, five and the reserve.',
      'Two full chorus performances in different looks, framed 9:16 with room for captions at the bottom third.',
      'Two “Have you heard?” stories told straight to camera, unscripted, 30 to 45 seconds each.',
      'Two close lyric moments, including the breakdown section, shot tight and handheld.',
      'A 3 to 8 second loop with no text for Spotify Canvas, and stills for the cover and announce.',
      'A vertical B-camera running the whole time. The unplanned moments usually outperform the planned ones.',
    ],
    video: [
      'A vertical B-camera on set for behind-the-scenes, plus stills.',
      'One take of a live vocal over the breakdown and final chorus: the source for the live version in December.',
      'Ten seconds of Miguel saying the premiere date to camera, for the trailer.',
    ],
  },

  cadence: [
    { phase: 'Pre-release', miguel: '3 to 4 posts a week from the ladder, plus a “Have you heard?” story', s1c: 'Notify list open from the announce; first listen on Wed 11 Nov; one SMS and one email', youtube: 'Shorts of each teaser', paid: 'None. Trial Reels only, to learn which hook and caption to back.' },
    { phase: 'Release week', miguel: 'Daily for four days, then the video-set bridge', s1c: 'Out-now SMS and email; members-only clip from the first listen', youtube: 'Official audio, out-now Short, Premiere page live', paid: 'Five-day test on the posts already winning organically' },
    { phase: 'Video', miguel: 'Trailer, premiere, a Short the same day', s1c: 'Video one hour early for members', youtube: 'Premiere with Miguel in chat, Shorts from the video', paid: 'Scale the winner; YouTube in-feed behind the video' },
    { phase: 'Sustain', miguel: '2 to 3 a week: cutdowns, covers he responds to, stories', s1c: 'Live version first; signed-vinyl thank-yous to top sharers', youtube: 'Live performance video, cutdown Shorts', paid: 'Hold at the winning level, cut what stops working' },
  ],

  weeks: [
    {
      label: 'Week −3', dates: '26 Oct to 1 Nov', title: 'Confirm and shoot',
      objective: 'Confirm everything that has to be true before anything goes public, and capture the content the whole stagger depends on.',
      actions: [
        'Lock the date, the final master and the lyric sheet. Deliver to DSPs by Fri 30 Oct so the Spotify editorial pitch has two full weeks.',
        'Shoot 26 and 27 Oct against the shot list below. First edits of teasers one and two by Fri 30 Oct for Miguel’s approval.',
        'Build the S1C notify page: countdown, SMS and email capture, personal share links. Test end to end.',
        'Agree with RCA who owns the pre-save and notify links, the DSP pitch and the radio plan.',
        'Wed 28 Oct livestream: a “Have you heard?” story segment, no music. The phrase starts doing its work.',
        'Sequence the 1800 episodes and the catalog vinyl pre-order (30 Oct) so neither lands on announce day.',
      ],
      signals: 'Master delivered, notify page tested, teasers one and two approved by Fri 30 Oct.',
    },
    {
      label: 'Week −2', dates: '2 to 8 Nov', title: 'Announce and video shoot',
      objective: 'Plant the hook as Miguel’s own sound, announce on S1C, and get the video shot.',
      actions: [
        'Sun 1 Nov: the cold open on TikTok and Instagram as an original sound. No title, no date.',
        'Tue 3 Nov: the announce. S1C first, socials an hour later, notify link everywhere. One SMS and one email to the existing list.',
        'Wed 4 and Thu 5 Nov: music video shoot, with a vertical B-camera and the live vocal take. The weekly livestream moves or becomes a short message from set.',
        'Fri 6 Nov: teaser three. Start Instagram Trial Reels: five hook and caption variants to non-followers.',
        'Spotify Canvas, Clips and the artist pick queued for release day.',
      ],
      signals: 'The cold open being used as a sound by fans, notify sign-ups in the first 48 hours, Trial Reels with clear winners by Sunday.',
    },
    {
      label: 'Release week', dates: '9 to 15 Nov', title: 'Release',
      objective: 'Peak the anticipation midweek on S1C, release on Friday, and find the post worth paying behind.',
      actions: [
        'Mon 9 Nov: teaser four, the breakdown sound.',
        'Wed 11 Nov: first listen on the S1C livestream. Story of the song, playback for members, clips for Thursday and Friday.',
        'Thu 12 Nov: “Tomorrow.”',
        'Fri 13 Nov: out now across every channel, official audio on YouTube, SMS and email to S1C. Release-day Reddit thread with a fan moderator and an out-now note from Miguel.',
        'Fri to Sun: Miguel answers fan posts and the first covers. Paid test starts on the two posts with the best organic hold.',
        'Sat 14 Nov (optional): the unannounced performance, if approved. See creative ideas.',
      ],
      signals: 'Saves and follows, not just streams. First-weekend saves above 10% of streams; first covers appearing without being asked.',
    },
    {
      label: 'Week +1', dates: '16 to 22 Nov', title: 'Paid read and video premiere',
      objective: 'Read the five-day test, move money to what worked, and premiere the video while the single is still fresh.',
      actions: [
        'Mon 16 Nov: five-day read of the paid test. Scale the winner, cut the rest, report where the money moved.',
        'Sun 15 to Tue 17 Nov: behind-the-scenes from the video set.',
        'Wed 18 Nov: video trailer and Premiere page. Spotify music video pitch submitted before the premiere.',
        'Fri 20 Nov: the video. S1C members an hour early, YouTube Premiere with Miguel in chat, Shorts the same day.',
        'Start the singers’ invitation: 10 to 15 vocalists across sizes, each asked to sing the hook their way and cross-post to Reels and Shorts.',
      ],
      signals: 'Premiere concurrents, the share of video viewers who are new to the channel, and streams holding or rising through week two.',
    },
    {
      label: 'Week +2', dates: '23 to 29 Nov', title: 'Thanksgiving week',
      objective: 'Keep presence through a quiet week without wasting the good material.',
      actions: [
        'If the video missed 20 Nov: premiere Tue 24 Nov. If it is not ready by then, hold to Tue 8 Dec.',
        'Video cutdown one, tested in Trial Reels first.',
        'A “Have you heard?” story with a gratitude angle: “enjoy the ride” fits the week without forcing it.',
        'Paid holds at the winning level; holiday inventory gets more expensive late in the week.',
      ],
      signals: 'Streams holding within 20% of release week. Cutdown completion rates.',
    },
    {
      label: 'Week +3', dates: '30 Nov to 6 Dec', title: 'Wrapped week',
      objective: 'Hold attention through Wrapped week, when every feed fills with year-end recaps.',
      actions: [
        'Do not launch anything major on Wrapped day. Post a cutdown and let fans’ Wrapped shares carry the catalog.',
        'Fri 4 Dec: monthly Reddit AMA on the fan-moderated thread, built around the song and the video.',
        'Miguel duets or stitches the best covers. Pull the strongest into paid as creative.',
        'Apple in-studio session pitched with “Have You Heard” leading the set.',
      ],
      signals: 'Covers count and quality. AMA participation. Follower growth on Spotify and the S1C list.',
    },
    {
      label: 'Week +4', dates: '7 to 13 Dec', title: 'Live version and vinyl',
      objective: 'Give the song a second reason to be talked about before the holidays take over.',
      actions: [
        'The live version from the video set: vertical first, then the YouTube performance.',
        'Signed vinyl from the 11 Dec reissues thanks the top S1C sharers. The giveaway captures new emails for the next release.',
        'Pin a “Have You Heard” playlist to his Spotify profile: the new single on top, catalog below that points to who he is now.',
        'Release the held teaser from the October shoot as unseen footage.',
      ],
      signals: 'The live version adding listeners rather than splitting them. List growth from the vinyl thank-you.',
    },
    {
      label: 'January', dates: 'After the holidays', title: 'Radio and what comes next',
      objective: 'Pick the song back up when holiday programming clears.',
      actions: [
        'Urban AC and Adult R&B radio impact once holiday programming clears, timed with RCA.',
        'If covers caught on, an official versions moment with the singers who made the best ones.',
        'Bridge into what comes next. The S1C list built here is the launch list for it.',
      ],
      signals: 'Radio adds, a second wave of streams, and a bigger S1C list than the one we started with.',
    },
  ],

  paid: {
    intro: 'Paid media follows the audience, it does not lead it. Nothing runs before release. From release day, money only goes behind posts that are already holding real attention, and every week we report what we tested, what won and where the money moved.',
    tiers: [
      {
        name: 'Floor', range: '$2.5K / month', window: 'From 13 Nov',
        d: 'Amplifies the organic winners only. Enough to read a signal on one platform at a time.',
        lines: [
          { item: 'Instagram and Facebook, to Spotify and Apple', pct: 60 },
          { item: 'TikTok Spark Ads on the best posts', pct: 25 },
          { item: 'Singers and creators', pct: 15 },
        ],
        gate: 'Scales only when a five-day read shows streams moving in the paid markets.',
      },
      {
        name: 'Recommended', range: '$15–20K', window: '13 Nov to 13 Dec',
        d: 'A real test on three platforms in week one, then scale behind the winner and the video. This is where label support makes the difference.',
        lines: [
          { item: 'Instagram and Facebook, to Spotify and Apple', pct: 45 },
          { item: 'YouTube in-feed and Shorts, behind the video', pct: 30 },
          { item: 'TikTok Spark Ads on Miguel and creator posts', pct: 15 },
          { item: 'Singers and creators', pct: 10 },
        ],
        gate: 'Week one is a $3K test. Scale only behind the creative that wins it. Below about $2.5K per platform, a test cannot tell you anything.',
      },
    ],
    markets: 'United States first. Then the markets where Miguel already over-delivers and attention is cheaper: the Philippines (6.5M monthly listeners, his number two country), the United Kingdom, Australia, South Africa and Canada.',
  },

  ideas: [
    { t: 'The “Have you heard?” stories', d: 'A weekly 30 to 45 second story from Miguel, sourced from the S1C livestreams. Each one is a true moment from his past that foreshadows who he is now. It runs before, during and after the single and outlives it.', ask: 'Miguel' },
    { t: 'First listen on S1C', d: 'The Wednesday before release, members hear the song first on the livestream, with Miguel telling the story of it. It makes the list matter and gives us release-week clips no one else has.', ask: 'Label sign-off on pre-release playback' },
    { t: 'Who told you?', d: 'Every S1C member gets a personal share link. The people who bring the most friends to the list are thanked with signed vinyl from the 11 December reissues. Word of mouth, counted.', ask: 'Sony Legacy for the signed copies' },
    { t: 'The unannounced performance', d: 'Release weekend in Los Angeles, two hours’ notice by S1C text only: Miguel performs the song from a box truck or a rooftop, filmed by fans. Small crowd, big footage.', ask: 'Budget, permits, label support' },
    { t: 'The singers’ chain', d: 'Invite singers of every size, from peers to bedroom vocalists, to sing the hook their way. Miguel answers the best within a day. If it catches, an official versions release in January.', ask: 'Miguel' },
    { t: 'The live version', d: 'One take of the breakdown and final chorus, captured on the video set. Released in December as a vertical and a YouTube performance, and the centrepiece of the Apple in-studio session.', ask: 'Video director, Apple' },
    { t: 'A playlist that tells the story', d: 'A pinned “Have You Heard” playlist on his Spotify profile: the single on top, then the catalog songs that point at where he is now, with a note from Miguel on each.', ask: 'Sony Legacy, RCA' },
    { t: '1800 with the song', d: 'An 1800 episode cut with “Have You Heard” underneath it, timed after the announce so the partnership carries the song instead of the song waiting for the partnership.', ask: '1800, Brand New' },
  ],

  measurement: {
    body: 'We agree on the scoreboard before release, not after. One weekly report: what we tested, what won, where money moved and what it moved. These matter more than raw streams.',
    methods: [
      { t: 'Save and follow rate', d: 'Saves per stream and new Spotify followers tell us whether people want to hear the song again and hear what Miguel does next. This is the number paid is judged on.' },
      { t: 'S1C list growth', d: 'New notify sign-ups, SMS opt-ins and share-link referrals. The list built on this single is the launch list for everything after it.' },
      { t: 'Organic pickup', d: 'Fan uses of the official sounds, unprompted covers, and Reddit and comment conversation about the song itself. If people pass it on without being paid to, the plan is working.' },
      { t: 'The paid read', d: 'Each paid flight gets a five-day before-and-after read in Spotify for Artists for the markets it ran in, against markets it did not. Money moves on that read, every week.' },
    ],
  },

  kpis: [
    { phase: 'Pre-release', items: ['10K+ new S1C notify sign-ups by release day', 'Fans using the cold-open sound before the title is announced', 'A clear Trial Reels winner to back on release day'] },
    { phase: 'Release and video', items: ['Spotify editorial support on release week', 'Saves above 10% of streams in the first week', 'Video premiere in the channel’s top quartile for first-day views'] },
    { phase: 'Sustain', items: ['Streams in week four within 30% of week one', '25+ unprompted covers and versions', 'Spotify followers and the S1C list both up month on month'] },
  ],

  risks: [
    { r: 'Master or date slips', level: 'High', m: 'Nothing goes public until both are locked. If 13 Nov is not locked by 30 Oct, everything shifts a week; the ladder is built to slide without losing pieces.' },
    { r: 'Video runs late', level: 'Medium', m: 'The single stands on its own with the official audio visual and the video-set footage. If the video misses 24 Nov, premiere 8 Dec rather than into Thanksgiving or Wrapped.' },
    { r: 'Same-day competition', level: 'Medium', m: 'Snoh Aalegra shares the audience on 13 Nov. We lean on Miguel’s own channels and S1C on release day and save paid for the following week, when the album noise has passed.' },
    { r: 'Short-form does not catch', level: 'Medium', m: 'Back the posts with the best hold rather than adding volume; bring the singers’ chain forward a week; lean on the live version and the story series.' },
    { r: 'Leak before release', level: 'Low', m: 'Pre-release playback happens only on the S1C livestream, never as a file. Creators get the song on release day, not before.' },
  ],

  questions: [
    'Can we lock Friday 13 November, with the final master and DSP delivery by Friday 30 October?',
    'Who at RCA owns the Spotify pitch, the pre-save and notify links, and the radio plan and impact date?',
    'What support can RCA put behind paid media in the four weeks after release?',
    'Who is directing the video, and what is the realistic delivery date? That decides 20 November, 24 November or 8 December.',
    'Can we brief the vertical captures on the 26 to 27 October shoot against the shot list above?',
    'Where do the 1800 episodes now land relative to the 3 November announce?',
    'Is pre-release playback on the S1C livestream approved for Wednesday 11 November?',
    'An older fan upload online carries the same title. Can the DSP metadata be checked so search lands on the new single?',
    'Which of these ideas does Miguel want to own, and what formats of his own does he want in the mix?',
  ],

  /* ── research page ── */
  baseline: {
    stats: [
      { value: '36.8M', label: 'Spotify monthly listeners, up from 25.0M in September 2025' },
      { value: '7.19M', label: 'Spotify followers' },
      { value: '19.5%', label: 'Followers per monthly listener' },
      { value: '#192', label: 'Chartmetric artist rank' },
    ],
    listenerBody: 'Miguel goes into this release with more people listening than at any point in the last twelve months: up 47% since September 2025, with the sharpest climb from August to October 2026. Almost all of that is catalog. It is the best possible starting point for new music, if the new song can turn some of those listeners into people who follow what he does next.',
    listenerNote: 'Chartmetric, 22 Oct 2026. Only directly observed data points are plotted; Chartmetric’s interpolated days are excluded.',
    social: [
      { platform: 'Instagram', followers: '4.80M', note: '1.25% engagement rate, about 60K likes per post' },
      { platform: 'TikTok', followers: '815K', note: 'Up from 656K in January 2026' },
      { platform: 'YouTube', followers: '2.40M', note: '2.58B lifetime views' },
      { platform: 'Spotify', followers: '7.19M', note: '36.8M monthly listeners' },
    ],
    audience: {
      source: 'Instagram audience, Chartmetric',
      take: 'The core is women aged 25 to 34, and the people who actually like his posts skew even further that way. They are the audience the intimate, face-to-camera formats speak to, and they are the audience who share.',
      figs: [
        { v: '61%', l: 'Of Instagram followers are women' },
        { v: '80%', l: 'Of the people who like his posts are women' },
        { v: '50%', l: 'Of followers are aged 25 to 34' },
        { v: '56%', l: 'Of followers are in the United States' },
      ],
    },
  },

  markets: [
    { country: 'United States', listeners: 12597719 },
    { country: 'Philippines', listeners: 6499553 },
    { country: 'Germany', listeners: 2838159 },
    { country: 'United Kingdom', listeners: 2263221 },
    { country: 'Australia', listeners: 1789188 },
    { country: 'Malaysia', listeners: 1254860 },
    { country: 'Brazil', listeners: 1105516 },
    { country: 'South Africa', listeners: 1086000 },
    { country: 'Indonesia', listeners: 989914 },
    { country: 'Canada', listeners: 946497 },
  ],
  cities: [
    { city: 'London', listeners: 615291 },
    { city: 'Los Angeles', listeners: 494455 },
    { city: 'Sydney', listeners: 473576 },
    { city: 'Quezon City', listeners: 463362 },
    { city: 'Chicago', listeners: 409089 },
    { city: 'New York', listeners: 398935 },
    { city: 'Melbourne', listeners: 383438 },
    { city: 'Dallas', listeners: 370614 },
    { city: 'Toronto', listeners: 359811 },
  ],
  marketsBody: 'The United States is half the audience, but the Philippines is a clear second with 6.5M monthly listeners, and four of his top nine cities are outside North America. Those markets are cheaper to reach with paid media and over-index on sharing, which is why they sit right behind the US in the paid plan.',
  marketsNote: 'Country and city figures are Chartmetric estimates of Spotify monthly listeners, 22 Oct 2026.',

  comps: [
    { name: 'Kehlani, “Folded”', meta: 'June 2025', tag: 'The template', what: 'A cryptic teaser, a countdown and an off-cycle release. Then a stripped “(Un)folded” version in August and an official remix pack in October that turned viral covers by Toni Braxton, Brandy, Ne-Yo and others into official versions.', take: 'An R&B single lives for months. Plan the stripped version and the covers as phases two and three, not afterthoughts. It reached the Hot 100 top 10 about 20 weeks in.' },
    { name: 'Chris Brown, “Residuals”', meta: '2024 to 2025', tag: 'Covers chain', what: 'A deluxe track that fans built through tour clips. In early 2025 Tank challenged singers to record their own versions; Chloe Bailey, Mario and others answered. It logged 100 weeks at number one on R&B/Hip-Hop Airplay.', take: 'For grown R&B, singers covering the song is what a dance trend is for pop. It is the model for the singers’ chain.' },
    { name: 'Daniel Caesar, Son of Spergy', meta: 'October 2025', tag: 'IRL moments', what: 'Free park shows announced on TikTok with two hours’ notice, and a release-day scavenger hunt in Prospect Park. Debuted at number four, his first top 10 album.', take: 'Small, unannounced live moments produce footage fans film for you. The model for the unannounced performance.' },
    { name: 'Leon Thomas, MUTT', meta: '2025', tag: 'Live versions', what: 'His Tiny Desk went viral and was released as a live EP; the single went to number one at Urban and Adult R&B radio and spent 30 weeks atop Hot R&B Songs.', take: 'Live, musician-first versions are proven R&B fuel. Miguel’s own Tiny Desk opened 2026; the live version of this single follows that lead.' },
    { name: 'Jhené Aiko, Westside Whimsy', meta: 'September 2026', tag: 'Legacy return', what: 'A return after about six years, carried by features in the gap years. Her first number one album, on 74K units, 70K of them from streaming.', take: 'A returning R&B artist wins on streaming depth. Saves and repeat listens matter more than the first-day spike.' },
    { name: 'Brent Faiyaz, Icon', meta: '2025 to 2026', tag: 'Watch-out', what: 'An album pulled the night before release and a single scrapped, then a lead single with a video explaining the delay. It still debuted at number six, but the date changes cost goodwill.', take: 'Lock the date before the first public tease. Nothing announces until the master is approved.' },
    { name: 'Bruno Mars, The Romantic', meta: 'January 2026', tag: 'The ceiling', what: 'Title, cover, tour and single revealed on four consecutive days; the single debuted at number one. Listening parties in 200 record stores and a TikTok livestream the night before.', take: 'Compressing announcements creates noise, but it needs a hit-ready song and a huge base. The livestream-the-night-before idea transfers; the four-day blitz does not.' },
  ],

  calendar: [
    { when: 'Fri 23 Oct', who: 'John Legend, Anderson .Paak and Cordae, LISA, Michael Kiwanuka', level: 'Low', note: 'Before our window.' },
    { when: 'Fri 30 Oct', who: 'Dominic Fike, Daddy Yankee; Miguel catalog vinyl pre-order opens', level: 'Low', note: 'Keep the announce off this day so the vinyl and the single do not split attention.' },
    { when: 'Fri 6 Nov', who: 'Lil Baby, FRESH; Skepta; Louis York', level: 'Medium', note: 'A major rap album with an Urban number one already. Fights for Urban radio and hip-hop playlists more than R&B ones.' },
    { when: 'Fri 13 Nov', who: 'Snoh Aalegra, Legendary Love; Westside Gunn; U2', level: 'High', note: 'Same alt-R&B audience and the same editorial playlists. Manageable for a single against an album; paid holds to the following week.' },
    { when: 'November, date TBC', who: 'B2K, Eclipse', level: 'Medium', note: 'Nostalgia R&B; watch for a date.' },
    { when: 'Thu 26 Nov', who: 'Thanksgiving', level: 'Medium', note: 'Unofficial start of holiday streaming. Avoid premieres that week after Tuesday.' },
    { when: 'Early Dec', who: 'Spotify Wrapped', level: 'Medium', note: 'Feeds fill with year-end recaps. Keep the video out of Wrapped week.' },
    { when: 'Mid to late Dec', who: 'Holiday music', level: 'High', note: 'Holiday songs took 8 of the Hot 100 top 10 in December 2025. New music should be out and settled before then.' },
  ],

  landscape: [
    { t: 'Covers, not dances', d: 'In R&B since 2025, what has moved songs is singers covering them and fans posting vibe and storytime clips. Dance challenges have not been the driver.' },
    { t: 'Countdown Pages are for albums', d: 'Spotify’s Countdown Pages and the Upcoming Releases hub are open to albums and EPs only, so a single needs its own notify path. That is why S1C carries the pre-release list.' },
    { t: 'Pitch early', d: 'Spotify needs the pitch at least seven days out to guarantee Release Radar, and editors see it best with two weeks or more. Music videos are now a separate pitch, made before release.' },
    { t: 'Premiere on a traction moment', d: 'YouTube’s own guidance is to premiere the video on release day or on a later moment of traction, go live first and redirect, and post a Short the same day.' },
    { t: 'Trial Reels test for free', d: 'Instagram Trial Reels show to non-followers first and report results in about a day. The right way to choose a hook and caption before putting money behind one.' },
    { t: 'Radio after the holidays', d: 'Radio impact dates run independently of release dates. Fall servicing is crowded and December programming turns to holiday music, so January is the cleaner window.' },
  ],

  sources: [
    'Chartmetric API, artist 3853, pulled 22 October 2026: Spotify monthly listeners and followers, where people listen, Instagram, TikTok and YouTube stats, Instagram audience.',
    'Audio read of the working mix shared 14 October 2026: tempo, energy map and section timings measured from the file. Lyric as heard, to be confirmed against the lyric sheet.',
    '“damned” engagement figures: Crowd Control Digital teardown of 77 fan and artist posts, July 2026.',
    'Kehlani: Revolt, Complex, Rollout Roundup. Chris Brown: Billboard chart data via Wikipedia. Daniel Caesar: CP24, Torch, Ratings Game Music. Leon Thomas: Universal Music, The Source. Jhené Aiko: Hypebeast. Brent Faiyaz: Ratings Game Music. Bruno Mars: Billboard via Wikipedia.',
    'Release calendar: Wikipedia list of 2026 albums, Rated R&B, BroadwayWorld, That Eric Alper. Holiday streaming: Luminate, Billboard Hot 100 of 20 December 2025.',
    'Platform guidance: Spotify for Artists support, YouTube for Artists release-day strategy, Instagram Trial Reels coverage, Hypebot on radio impact dates.',
  ],
};
