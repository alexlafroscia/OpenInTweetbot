// Copyright (c) 2013 Alex LaFroscia. All rights reserved.
"use strict";
var myWindow, link, tweetbot;

// This function checks whether or not the current
// page is Twitter
function checkForTwitter(tabId, changeInfo, tab) {
    if (tab.url.search("twitter.com") > -1) {
        chrome.pageAction.show(tabId);
    }
}

// Open link in Tweetbot
function tweetBot(goto) {
    myWindow = window.open(goto);
    window.setTimeout(function() {
        myWindow.close();
    }, 300);
}

// This function gets called when the pageAction button
// in the Omnibar gets clicked on.  It will only be showing
// if the current page is from Twitter, so it doesn't have to
// check for that itself
chrome.pageAction.onClicked.addListener(function (tab) {
    link = tab.url;
    // Strip out the http:// or https://
    if (link.search("https://") > -1) {
        link = link.replace("https://", "");
    } else {
        link = link.replace("http://", "");
    }

    // If the link is a specific status, get its ID and
    // open the page in Tweetbot
    if (link.search("/status/") > -1) {
        link = link.split("/");
        link = link.pop(3);
        tweetbot = 'tweetbot:///status/';
        link = tweetbot.concat(link);
        tweetBot(link);
    } else if (link.length > 12) {
        // If the link is not for a specific tweet, but is
        // longer than the base URL, then it must be
        // a user. So, open that in Tweetbot
        link = link.split("/");
        link = link.pop(1);
        tweetbot = "tweetbot:///user_profile/";
        link = tweetbot.concat(link);
        tweetBot(link);
    } else {
        // If the URL is not for a status or for a user, then it's
        // probably just the timeline.  In that case, let's open
        // that in Tweetbot
        tweetBot('tweetbot:///timeline/');
    }
});

// This function is run whenever a tab's URL changes,
// and runs the "checkForTwitter" function each time
chrome.tabs.onUpdated.addListener(checkForTwitter);
