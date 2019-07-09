Template.trendingvideos.helpers({
  trendingVideos: function () {
    // return Videos.find({ source: 'chainByTrending' }).fetch()
    videos =  Videos.find({ source: 'chainByTrending' }).fetch()
    legalVideos = legalFilter(videos)
    return legalVideos
  }
})

Template.trendingvideos.rendered = function () {
  $('.ui.infinite')
    .visibility({
      once: false,
      observeChanges: true,
      onBottomVisible: function() {
        $('.ui.infinite .loader').show()
        Videos.getVideosBy('trending', 50, function(err){
          if (err) console.log(err)
          $('.ui.infinite .loader').hide()
        })
      }
    });
}
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
