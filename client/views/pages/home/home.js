var moment = require('moment');

Template.home.helpers({
  watchAgain: function () {
    videos =  Videos.find({ source: 'wakaArticles' }, { limit: Session.get('remoteSettings').loadLimit }).fetch()
    legalVideos = legalFilter(videos)
    return legalVideos
  },
  neighborhood: function () {
    videos =  Videos.find({ source: 'wakaPeers' }).fetch()
    legalVideos = legalFilter(videos)
    return legalVideos
  },
  newVideos: function () {
    videos =  Videos.find({ source: 'chainByCreated' }, {limit: 25}).fetch()
    legalVideos = legalFilter(videos)
    return legalVideos
  },
  hotVideos: function () {
    videos =  Videos.find({ source: 'chainByHot' }, {limit: 25}).fetch()
    legalVideos = legalFilter(videos)
    return legalVideos
  },
  trendingVideos: function () {
    videos =  Videos.find({ source: 'chainByTrending' }, {limit: 25}).fetch()
    legalVideos = legalFilter(videos)
    return legalVideos
  },
  feedVideos: function () {

    videos = Videos.find({ source: 'chainByFeed-' + Session.get('activeUsername') }).fetch()
    legalVideos = legalFilter(videos)
    return legalVideos
  }
})

Template.home.events({
  'click .addwatchlater': function () {
    WatchLater.upsert({_id: this._id},this)
    event.preventDefault()
  },
  'click .watchlater': function () {
    WatchLater.remove(this._id)
    event.preventDefault()
  },
  'click #remove': function () {
    var removeId = this._id
    Waka.db.Articles.remove(removeId.substring(0, removeId.length - 1), function (r) {
      Videos.remove({ _id: removeId }, function (r) {
        Videos.refreshWaka()
        Template.videoslider.refreshSlider()
      })
    })
    event.preventDefault()

  }
})

Template.home.rendered = function () {
  Template.settingsdropdown.nightMode();
  Session.set('isOnWatchAgain', false);
  if (/Mobi/.test(navigator.userAgent)) {
    Template.sidebar.empty()
  }
  else {
    Template.sidebar.half()
  }
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
