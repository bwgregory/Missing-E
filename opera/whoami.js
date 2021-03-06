/*
 * 'Missing e' Extension
 *
 * Copyright 2012, Jeremy Cutler
 * Released under the GPL version 3 licence.
 * SEE: license/GPL-LICENSE.txt
 *
 * This file is part of 'Missing e'.
 *
 * 'Missing e' is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * 'Missing e' is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with 'Missing e'. If not, see <http://www.gnu.org/licenses/>.
 */

/*global chrome,MissingE.getLocale */

(function(){

if ((window.top === window &&
    !(/http:\/\/www\.tumblr\.com\/customize/.test(location.href))) ||
    /http:\/\/www\.tumblr\.com\/dashboard\/iframe/.test(location.href) ||
    /http:\/\/www\.tumblr\.com\/ask_form\//.test(location.href)) {
   var fr = /http:\/\/www\.tumblr\.com\/dashboard\/iframe/
               .test(location.href) ||
            /http:\/\/www\.tumblr\.com\/ask_form\//.test(location.href);

   extension.addListener("startup", function(response) {
      var active = response;
      var i;
      if (MissingE.isTumblrURL(location.href, ["messages"])) {
         document.domain = "tumblr.com";
      }
      var info = "'Missing e' (v" + active.version + ") Startup on ";
      info += active.url + "\n";
      for (i in active) {
         if (active.hasOwnProperty(i)) {
            if (i !== 'url' && i !== 'version' && i !== "files" &&
                i !== "greeting" && i !== "isFrame") {
               info += i + ": " + (active[i] ? "active" : "inactive") + "\n";
            }
         }
      }
      if (response.files) {
         extension.injectFiles(response.files);
      }
      MissingE.log(info);
   });

   extension.addListener("update", function(response) {
      var up = document.getElementById('missinge_updatenotice');
      if (up && response.update) {
         var html = document.getElementsByTagName('html');
         var lang = 'en';
         if (html && html[0]) { lang = html[0].getAttribute('lang'); }
         up.setAttribute('title', MissingE.getLocale(lang).update);
         var post = '';
         if (response.link !== '') {
            post = 'post/' + response.link;
         }
         up.onclick = function() {
            window.open('http://missing-e.com/update');
         };
         up.style.display = 'block';
      }
   });

   extension.sendRequest("start", {isFrame: fr, url: location.href,
                                   bodyId: document.body.id});
}

}());
