// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let page = document.getElementById('buttonDiv');
const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
function constructCombo() {
  
	var combo = document.getElementById("combo");
  var option = document.createElement("option");

  /*
  chrome.bookmarks.getSubTree('0', function (bmTree) {
		bmTree.forEach( function (node) {
			node.children.forEach(function(child){
        //process(child, '0');
        option.text = child.title;
        option.value = child.title;
        try {
          combo.add(option, null); //Standard 
        }catch(error) {
          combo.add(option); // IE only
        }
			});
		});
  });
  */

  
 var result = chrome.bookmarks.getSubTree('2', function (bmTree) {
  var i;
  for (i = 0; i < bmTree.length; i++) {
		chrome.extension.getBackgroundPage().console.log("Index: " + i);
    option.text = bmTree[i].title;
    option.value = bmTree[i].title;
    try {
      combo.add(option, null); //Standard 
    }catch(error) {
      combo.add(option); // IE only
    }
  }
});

  /*
  for (let item of kButtonColors) {
    let button = document.createElement('button');
    button.style.backgroundColor = item;
    button.addEventListener('click', function() {
      chrome.storage.sync.set({color: item}, function() {
        console.log('color is ' + item);
      })
    });
    page.appendChild(button);
  }
*/

}





constructCombo();
