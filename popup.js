'use strict';

var tmpFldrId = -1;

function swapBookmarks() {
	createTmpFldr(function(){
		processToTmp(function(){
			processToBar(function() {
				processToOther(function() {
					removeTmpFldr(function() {
						closeWindow();
					})
				})
			})
		})
	});
}

function closeWindow() {
	chrome.extension.getBackgroundPage().console.log("Closing window");
	window.close();
}

function processToTmp(callback) {
	processBookmark('1',tmpFldrId,function() {
		callback()
	});
}

function processToBar(callback) {
	processBookmark('2',1,function() {
		callback()
	});
}

function processToOther(callback) {
	processBookmark(tmpFldrId,2,function() {
		callback()
	});
}

function createTmpFldr(callback) {
	//Create folder name with current timestamp
	var d = new Date();
	var tmpFldrName = "tmpfldr_" + d.getFullYear() + d.getMonth() + d.getDay() + d.getHours() + d.getMinutes() + d.getSeconds();
	
	//Create the folder and remember the ID (needed later)
	chrome.bookmarks.create({'parentId': '2',
                               'title': tmpFldrName},
                              function(newFolder) {
        chrome.extension.getBackgroundPage().console.log("added folder: " + newFolder.title + ", id: " + newFolder.id);
		tmpFldrId =  newFolder.id;
		callback();
	});
}

function removeTmpFldr(callback) {
	//Remove the tmp folder
	chrome.bookmarks.removeTree(String(tmpFldrId), function () {
		//chrome.extension.getBackgroundPage().console.log("Tmp folder removed with ID " + String(tmpFldrId));
		callback();
	});
}

function processBookmark(fromId, toId, callback) {
	//chrome.extension.getBackgroundPage().console.log("Start moving nodes");
	chrome.bookmarks.getSubTree(String(fromId), function (bmTree) {
		if (bmTree[0].children && bmTree[0].children.length > 0) {
			chrome.extension.getBackgroundPage().console.log("Processing node " + bmTree[0].title + " passed ID was " + fromId);
			var i;
			for (i = 0; i < bmTree[0].children.length; i++) {
				if(bmTree[0].children[i].id != tmpFldrId) {
					processNode(bmTree[0].children[i], String(toId));
				}
			}
		}
		callback();
	});
}

function processNode(node, moveToFolderId) {
	//chrome.extension.getBackgroundPage().console.log("Processing node " + node.id + " from node " + node.parentId + " to node " + String(moveToFolderId));
	chrome.bookmarks.move(node.id,{'parentId':String(moveToFolderId)});
}

document.addEventListener("DOMContentLoaded", function() {
	swapBookmarks();
});