import moment from 'moment'
import xss from 'xss'
import Autolinker from 'autolinker'

var autolinkerOptions = {
  urls : {
    schemeMatches : true,
    wwwMatches    : true,
    tldMatches    : true
  },
  email       : false,
  phone       : false,
  mention     : 'dtube',
  hashtag     : false,
  stripPrefix : true,
  stripTrailingSlash : true,
  newWindow   : true,
  truncate : {
      length   : 0,
      location : 'end'
  },
  className : ''
}

Template.registerHelper('equals', function (one, two) {
  if (one == two) return true;
  return false;
});

Template.registerHelper('count', function (array) {
  if (!array) return 0;
  return array.length;
});

Template.registerHelper('upvotes', function (active_votes) {
  if (!active_votes) return -1;
  var count = 0;
  for (var i = 0; i < active_votes.length; i++) {
    if (active_votes[i].percent > 0) count++
  }
  return count;
});

Template.registerHelper('downvotes', function (active_votes) {
  if (!active_votes) return -1;
  var count = 0;
  for (var i = 0; i < active_votes.length; i++) {
    if (active_votes[i].percent < 0) count++
  }
  return count;
});

Template.registerHelper('userPic', function (username) {
  var user = ChainUsers.findOne({name: username})
  if (user && user.json_metadata && user.json_metadata.profile && user.json_metadata.profile.profile_image)
    return user.json_metadata.profile.profile_image
  return 'https://kontak.me/slpw/plugin_blab/noprofileimage.png'
});

Template.registerHelper('isReplying', function (content) {
  if (!Session.get('replyingTo')) return false
  if (!content) return false
  if (content.info) {
    if (Session.get('replyingTo').author == content.info.author && Session.get('replyingTo').permlink == content.info.permlink)
      return true
  } else {
    if (!content.author) return false
    if (Session.get('replyingTo').author == content.author && Session.get('replyingTo').permlink == content.permlink)
      return true
  }
  return false
});

Template.registerHelper('displayCurrency', function(string) {
  if (!string) return
  var amount = string.split(' ')[0]
  var currency = string.split(' ')[1]
  if (currency == 'SBD') return '$'+amount
  return amount;
})

Template.registerHelper('displayPayout', function(active, total) {
  if (!active || !total) return
  var payout = active
  if (total.split(' ')[0] > 0) payout = total
  if (!payout) return
  var amount = payout.split(' ')[0]
  var currency = payout.split(' ')[1]
  if (currency == 'SBD') return '$'+amount
  return amount;
})

Template.registerHelper('timeAgo', function(created) {
  if (!created) return
  return moment(created).fromNow()
})

Template.registerHelper('timeDisplay', function(created) {
  if (!created) return
  return moment(created).format("MMM Do YY")
})

Template.registerHelper('hasUpvoted', function(video) {
  if (!video || !video.active_votes) return
  for (var i = 0; i < video.active_votes.length; i++) {
    if (video.active_votes[i].voter == Session.get('activeUsername')
      && parseInt(video.active_votes[i].percent) > 0)
      return true
  }
  return false
})

Template.registerHelper('hasDownvoted', function(video) {
  if (!video || !video.active_votes) return
  for (var i = 0; i < video.active_votes.length; i++) {
    if (video.active_votes[i].voter == Session.get('activeUsername')
      && parseInt(video.active_votes[i].percent) < 0)
      return true
  }
  return false
})

Template.registerHelper('lengthOf', function(array) {
  if (!array) return
  return array.length
})

Template.registerHelper('isPlural', function(array) {
  if (!array) return
  if (array.length == 1) return false
  return true
})

Template.registerHelper('isNSFW', function(video) {
  if (Session.get('nsfwSetting') == 'Show') return false
  if (!video || !video.content || !video.content.tags) return false
  if (video.content.tags.indexOf('nsfw') > -1) return true
  return false
})

Template.registerHelper('isNSFWsearch', function(video) {
  if (Session.get('nsfwSetting') == 'Show') return false
  if (!video || !video.tags) return false
  if (video.tags.indexOf('nsfw') > -1) return true
  return false
})

Template.registerHelper('isNSFWFullyHidden', function(video) {
  if (Session.get('nsfwSetting') != 'Fully Hidden') return false
  if (!video || !video.content || !video.content.tags) return false
  if (video.content.tags.indexOf('nsfw') > -1) return true
  return false
})

Template.registerHelper('isNSFWFullyHiddensearch', function(video) {
  if (Session.get('nsfwSetting') != 'Fully Hidden') return false
  if (!video || !video.tags) return false
  if (video.tags.indexOf('nsfw') > -1) return true
  return false
})

Template.registerHelper('syntaxed', function(text) {
  if (!text) return
  // escape the string for security
  text = xss(text)

  // replace line breaks to html
  text = text.replace(/(?:\r\n|\r|\n)/g, '<br />');

  // time travelling stuff
  var re = /(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)/g
  text.replace(re, function(match, p1, p2, p3) {
    var seconds = parseInt(p3)+60*parseInt(p2)
    if (p1) seconds += 3600*parseInt(p1)
    if (p1) text = text.replace(match, '<a href=\'#\' onclick=\'Template.video.setTime('+seconds+')\'>'+p1+':'+p2+':'+p3+'</a>')
    else {
      if (!p2) return
      text = text.replace(match, '<a href=\'#\' onclick=\'Template.video.setTime('+seconds+')\'>'+p2+':'+p3+'</a>')
    }
  })

  // use autolinker for links and mentions
  text = Autolinker.link(text, autolinkerOptions)

  return text
})
