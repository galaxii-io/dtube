Template.watchlater.helpers({
  watchLater: function () {
      videos = WatchLater.find().fetch()
      legalVideos = legalFilter(videos)
      return legalVideos
  }
})
function legalFilter(videos){
  var flag = 0
  var legalVideos = []
  videos.forEach(function(e){
    flag = 0
    e.active_votes.forEach(function(voter){
      if(voter.voter == "galaxii" && voter.percent < 0){
        flag = 1
      }
    })
    if (flag == 0){
      legalVideos.push(e)
    }
  })
  return legalVideos
}
