import './buffer';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import wakajs from 'wakajs';
// import Gun from 'gun/gun';
// import SEA from 'gun/sea';
// import timegraph from 'gun/lib/time';
import steem from 'steem';
import AskSteem from 'asksteem';
import sc2sdk from 'sc2-sdk';
steem.api.setOptions({ url: 'https://api.steemit.com' });

console.log('Starting Galaxii APP')

FlowRouter.wait();
Meteor.startup(function(){
  console.log('Galaxii APP Started')
  Session.set('remoteSettings', Meteor.settings.public.remote)
  window.steem = steem
  // window.Gun = Gun
  // https://galaxii.io
  Session.set('LIVE_SITE', "https://galaxii.io")
  Session.set('upldr', Session.get('remoteSettings').full_upldr)
  Session.set('lastHot', null)
  Session.set('lastTrending', null)
  Session.set('lastCreated', null)
  Session.set('lastBlogs', {})
  Session.set('tagDays', 7)
  Session.set('tagSortBy', 'net_votes')
  Session.set('tagDuration', 999999)

  // load language
  loadDefaultLang(function() {
    loadLangAuto(function() {
      console.log('Loaded languages')
      // start router
      FlowRouter.initialize({hashbang: true}, function() {
        console.log('Router initialized')
      });

      // handle manual fragment change
      $(window).on('hashchange', function() {
        FlowRouter.go(window.location.hash)
      });

    })

  })


  // init steem connect
  var cbUrl
  if (window.location.hostname == 'localhost' && window.location.port == '3000')
    cbUrl = 'http://localhost:3000/#!/sc2login'
  else
    cbUrl = Session.get("LIVE_SITE")+'/#!/sc2login'



  var sc2 = sc2sdk.Initialize({
    app: 'galaxii',
    callbackURL: cbUrl,
    accessToken: 'access_token',
    scope: ['login','vote','comment','delete_comment','claim_reward_balance','custom_json','comment_options']
  });
  window.sc2 = sc2

  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": true,
    "progressBar": true,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }

  if (Session.get('remoteSettings').warning)
    toastr.warning(Session.get('remoteSettings').warning, translate('WARNING_TITLE'))
  console.log('Loaded languages')
  steem.api.getDynamicGlobalProperties(function(err, result) {

    if (result)
    Session.set('steemGlobalProp', result)
  })

  Market.getSteemPrice()
  Market.getSteemDollarPrice()

})
