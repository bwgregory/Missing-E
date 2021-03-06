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

(function(){

MissingE.packages.postCrushes = {

   missingeServer: 'http://crush.missing-e.com',

   run: function() {
      var crushdiv = document.getElementById("crushes");
      var infodiv = crushdiv.nextSibling;
      while (infodiv !== undefined && infodiv !== null &&
             infodiv.tagName !== 'DIV') {
         infodiv = infodiv.nextSibling;
      }

      var lang = document.getElementsByTagName("html")[0].getAttribute("lang");
      var newdiv = document.createElement('div');
      newdiv.style.position="relative";
      newdiv.style.verticalAlign="middle";
      newdiv.style.marginTop="15px";
      newdiv.id = "tcp_outerdiv";
      var btn = document.createElement('button');
      btn.className = "chrome blue";
      btn.innerHTML = "&#x2764; " +
         MissingE.escapeHTML(MissingE.getLocale(lang).postCrushes);
      btn.style.minHeight = "25px";
      btn.style.cssHeight = "auto";
      btn.addEventListener('click', function() {
         var i,j;
         var from = [/:/g, /\//g, /\?/g, /\=/g, / /g,
                     /</g, />/g, /\=/g, /"/g];
         var to = ['%3A', '%2F', '%3F', '%3D', '%20',
                   '%3C', '%3E', '%3D', '%22'];
         var crushes = document.getElementById("crushes")
                           .getElementsByTagName("a");
         var crushimg = new Array(9);
         var crushurl = new Array(9);
         var crushper = new Array(9);
         var crushtitle = new Array(9);
         var crushname = new Array(9);
         for (i=0; i<crushes.length; i++) {
            crushimg[i] = crushes[i].style.backgroundImage
                           .replace(/^url\(["']*/,"").replace(/['"]*\)$/,"")
                           .replace(/^http:\/\/[^\/]*\//,"").replace(from,to);
            crushurl[i] = crushes[i].href.replace(from,to);
            crushtitle[i] = crushes[i].getAttribute('title')
                              .match(/^([\w\-]+|\d+%)?,?\s(?:[^\s]+\s+)*([\w\-]+)?/);
            crushper[i] = crushes[i].getElementsByTagName("span")[0].innerHTML
                           .replace(/%/,"").replace(from,to);
         }

         var nameIdx = 1;
         if (crushtitle[0][1] === crushtitle[1][1] &&
             crushtitle[0][1] === crushtitle[2][1]) {
            nameIdx = 2;
         }

         for (i=0; i<crushes.length; i++) {
            for (j=0; j<from.length; j++) {
               crushimg[i] = crushimg[i].replace(from[j],to[j]);
               crushurl[i] = crushurl[i].replace(from[j],to[j]);
            }
            crushname[i] = crushtitle[i][nameIdx];
         }

         var get = "";
         for (i=0; i<crushes.length; i++) {
            if (i>0) { get += "&"; }
            get += "img" + i + "=" + crushimg[i] + "&per" + i + "=" +
                     crushper[i];
         }

         var prefix = MissingE.packages.postCrushes.settings.prefix;
         var txt = '';
         if (prefix.length > 0) {
            txt += '<p><strong>' + prefix + '</strong></p>';
         }
         txt += '<ul>';
         for (i=0; i<crushes.length; i++) {
            txt += '<li><a href="' + crushurl[i] + '">' + crushname[i] +
                     '</a></li>';
         }
         txt += '</ul><p></p>';

         for (j=0; j<from.length; j++) {
            txt = txt.replace(from[j],to[j]);
         }

         extension.sendRequest("sendCrushes",
                               {url: 'http://www.tumblr.com/new/photo?' +
                                     'post%5Bone%5D=&post%5Btwo%5D=' + txt +
                                     '&post%5Bthree%5D=',
                                img: MissingE.packages.postCrushes
                                       .missingeServer + '/?' + get,
                                tags:crushname});
      }, true);
      newdiv.appendChild(btn);
      infodiv.appendChild(newdiv);
   },

   init: function() {
      extension.sendRequest("settings", {component: "postCrushes"},
                            function(response) {
         if (response.component === "postCrushes") {
            var i;
            MissingE.packages.postCrushes.settings = {};
            for (i in response) {
               if (response.hasOwnProperty(i) &&
                   i !== "component") {
                  MissingE.packages.postCrushes.settings[i] = response[i];
               }
            }
            MissingE.packages.postCrushes.run();
         }
      });
   }
};

if (extension.isChrome ||
    extension.isFirefox) {
   MissingE.packages.postCrushes.init();
}

}());
