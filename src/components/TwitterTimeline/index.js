import React, { Component } from 'react'
import { WebView } from 'react-native-webview'
import PropTypes from 'prop-types';

class TwitterTimeline extends Component {

    static get propTypes() { 
        return {
            screenName: PropTypes.string,
            timelineStyle: PropTypes.object,
            timelineOptions: PropTypes.object
        }; 
    }

    getTimelineOptions(options) {
        let chromeLists = [];
        if (options.noheader) chromeLists.push("noheader");
        if (options.nofooter) chromeLists.push("nofooter");
        if (options.noborders) chromeLists.push("noborders");
        if (options.transparent) chromeLists.push("transparent");
        if (options.noscrollbar) chromeLists.push("noscrollbar");

        return chromeLists.join(" ");
    }

    render() {
        const { screenName, timelineStyle, timelineOptions } = this.props;
        const chromeLists    = this.getTimelineOptions(timelineOptions);
        const timelineHeight = timelineStyle.height == 0 ? null : timelineStyle.height;
        const timelineLimit  = timelineStyle.tweetLimit == 0 ? null : timelineStyle.tweetLimit;
        const htmlContent    = `
        <a class="twitter-timeline"
            href="https://twitter.com/${screenName}?ref_src=twsrc%5Etfw"
            data-chrome="${chromeLists}"
            data-height="${timelineHeight}"
            data-lang="${timelineOptions.lang}"
            data-theme="${timelineStyle.theme}"
            data-tweetLimit="${timelineLimit}"
        >Tweets by ${screenName}</a>
        <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        `;
        console.log("render")
        return (
            <WebView
                source={{html: htmlContent}}
            />
        )
    }
}

export default TwitterTimeline