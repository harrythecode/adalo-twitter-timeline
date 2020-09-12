/***
 * Copyright (c) 2020 Andrew Suzuki
 * Released under the MIT license
 * https://github.com/andrewsuzuki/react-twitter-widgets
 */
import { Timeline } from 'react-twitter-widgets'
import React, { Component } from 'react'
import { StyleSheet, Platform, Text, View, Image } from 'react-native'
import { WebView } from 'react-native-webview'
import logo from './preview-thumbnail.png';

class TwitterTimeline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError           : false,
            width              : null,
            height             : null,
            previousScreenName : '',
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
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

    handleLayout = ({ nativeEvent }) => {
        const { editor } = this.props
    
        if (editor) return
    
        const { width, height } = (nativeEvent && nativeEvent.layout) || {}
        const { width: prevWidth, height: prevHeight } = this.state
    
        if (width !== prevWidth || height !== prevHeight) {
          this.setState({ width, height })
        }
    }

    render() {
        const { screenName, timelineOptions, _height, editor } = this.props;
        const chromeLists    = this.getTimelineOptions(timelineOptions);
        const timelineHeight = timelineOptions.nomaxheight ? null : _height;
        const timelineLimit  = timelineOptions.tweetLimit == 0 ? null : timelineOptions.tweetLimit;
        const htmlContent    = `
        <a class="twitter-timeline"
            href="https://twitter.com/${screenName}?ref_src=twsrc%5Etfw"
            data-chrome="${chromeLists}"
            data-height="${timelineHeight}"
            data-lang="${timelineOptions.lang}"
            data-theme="${timelineOptions.theme}"
            data-tweetLimit="${timelineLimit}"
        >Tweets by ${screenName}</a>
        <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        `;

        console.log(_height, this.state.height, this.props)
        
        const styles = StyleSheet.create({
            twContainer: {
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#333333",
                color: "#eeeeee",
                fontWeight: "bold",
                padding: 10,
                width: "100%",
                height: "100%"
            },
            titleHeader: {
                fontSize: 19,
                fontWeight: "bold"
            },
            titleBody: {
                fontSize: 14
            },
            customMargin: {
                marginBottom : timelineOptions.nomaxheight ? timelineOptions.tweetMarginBottom : 0
            }
        });

        // If it's editor, don't trigger twitter widget
        if(editor) {
            return(
            <View style={styles.twContainer} onLayout={this.nativeEvent}>
                <img src={logo} style={{width: "100%"}} />
            </View>
            )
        }

        // Check if timeline has any error
        if (this.state.hasError) {
            if(this.state.previousScreenName !== screenName) {
                this.state = {
                    hasError: false,
                    previousScreenName: screenName
                }
            }
            return (
                <View style={styles.twContainer}>
                    <Text style={styles.titleHeader}>{screenName} Not Found.</Text>
                    <Text style={styles.titleBody}>Try searching for another.</Text>
                </View>
            )
        }

        return (
            Platform.OS === 'web'
            ?  <View style={styles.customMargin} onLayout={this.handleLayout}>
                <Timeline
                    dataSource={{
                        sourceType: 'profile',
                        screenName: screenName
                    }}
                    options={{
                        chrome     : chromeLists,
                        height     : timelineHeight,
                        lang       : timelineOptions.lang,
                        theme      : timelineOptions.theme,
                        tweetLimit : timelineOptions.tweetLimit == 0 ? null : timelineOptions.tweetLimit,
                    }}
                    renderError={(_err) => <p>Could not load timeline due to Error on Twitter side (Reason: {_err})</p>}
                />
                </View>
            :   <WebView style={styles.customMargin} source={{html: htmlContent}} />
        )
    }
}

export default TwitterTimeline