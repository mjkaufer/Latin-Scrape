if (Meteor.isClient) {

  Template.main.events({
    'click button': function () {
      var q = $('#q').val();
      if(q)
        Meteor.call('makeRequest', q, function(e, r){
          var x = jQuery.parseHTML(r.content);
          console.log(x);
          console.log(x[3]);//the response body. Break it down however you want from here
          if(x[3].innerHTML.indexOf('[') == -1)//something whitakers does
            console.log('Stuff is broken');

          $('#results').html(x[3].innerHTML.split('\n').join('<br>'));//so it's formatted nice and pretty-like
        });
      else
        console.log('fail; ' + q + ' is not a good search term');     //should really never happen ever   
    }
  });
}

if (Meteor.isServer) {
  Future = Npm.require('fibers/future');
  Meteor.methods({
    'makeRequest': function(word){
      var fut = new Future();//async shit

      var url = "http://www.archives.nd.edu/cgi-bin/wordz.pl?keyword=" + encodeURI(word);
      HTTP.get(url, function(e, r){
        fut['return'](r);
      });

      return fut.wait();//so it returns what comes from the get request
    }
  });
}
