/***
 * Copyright (c) 2020 Andrew Suzuki
 * Released under the MIT license
 * https://github.com/andrewsuzuki/react-twitter-widgets
 */
import { Timeline } from "react-twitter-widgets";
import React, { Component } from "react";
import { StyleSheet, Platform, Text, View, ScrollView } from "react-native";
import { WebView } from "react-native-webview";
import logo from "./preview-thumbnail.png";

class TwitterTimeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorType: "",
      width: null,
      height: null,
      previousScreenName: "",
    };
  }
  static defaultProps = {
    actionType: 10,
  };

  static getDerivedStateFromError(error) {
    const regex = new RegExp("ensure%20the%20screenName%2FtweetId%20exists");
    let errorType = "";
    if (regex.exec(error)) {
      errorType = "screenNameNotFound";
    } else {
      errorType = "unknown";
    }
    return { hasError: true, errorType };
  }

  getTimelineOptions(options) {
    let chromeLists = ["noscrollbar"];
    if (!options.showHeader) chromeLists.push("noheader");
    if (!options.showFooter) chromeLists.push("nofooter");
    if (!options.showBorders) chromeLists.push("noborders");
    if (options.enableTransparent) chromeLists.push("transparent");

    return chromeLists.join(" ");
  }

  handleLayout = ({ nativeEvent }) => {
    const { editor } = this.props;

    if (editor) return;

    const { width, height } = (nativeEvent && nativeEvent.layout) || {};
    const { width: prevWidth, height: prevHeight } = this.state;

    if (width !== prevWidth || height !== prevHeight) {
      this.setState({ width, height });
    }
  };

  render() {
    const {
      screenName,
      timelineOptions,
      editor,
      actionType,
      listOfDataSource,
    } = this.props;
    const defaultTwitterName = "TwiterDev";
    let targetTwitterName = "";
    if (actionType === 20) {
      // screenNameFromCollection
      if (listOfDataSource && listOfDataSource.length > 0) {
        targetTwitterName =
          listOfDataSource[0].screenNameFromCollection || defaultTwitterName;
      }
    } else {
      // Static Text
      targetTwitterName = screenName || defaultTwitterName;
    }

    const chromeLists = this.getTimelineOptions(timelineOptions);
    const timelineLimit = timelineOptions.enableTweetLimit
      ? timelineOptions.tweetLimit
      : null;
    const htmlContent = `
        <div id="twitter-container-for-webview-20200915" style="height: 100%; width: 100%;">
        <a class="twitter-timeline"
            href="https://twitter.com/${targetTwitterName}?ref_src=twsrc%5Etfw"
            data-chrome="${chromeLists}"
            data-lang="${timelineOptions.lang}"
            data-theme="${timelineOptions.theme}"
            data-tweet-limit="${timelineLimit}"
        >Tweets by ${targetTwitterName}</a>
        </div>
        <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        `;

    const styles = StyleSheet.create({
      twContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#333333",
        color: "#eeeeee",
        fontWeight: "bold",
        padding: 10,
        width: "100%",
        height: "100%",
      },
      titleBody: {
        fontSize: 14,
      },
    });

    // If it's editor, don't trigger twitter widget
    if (editor) {
      return (
        <View style={styles.twContainer} onLayout={this.nativeEvent}>
          <img src={logo} style={{ width: "100%" }} />
        </View>
      );
    }

    // Check if timeline has any error
    if (this.state.hasError) {
      let errorMessage = "Something went wrong";
      if (this.state.errorType == "screenNameNotFound") {
        errorMessage = targetTwitterName + " does not exist";
      }
      if (this.state.previousScreenName !== targetTwitterName) {
        this.state = {
          hasError: false,
          previousScreenName: targetTwitterName,
        };
      }
      return (
        <View style={styles.twContainer}>
          <Text style={styles.titleBody}>Error: {errorMessage}</Text>
        </View>
      );
    }

    // Workaround:
    // - When widget.js gets an error, it will add "twitter-timeline-error" class name to the a tag
    //   so I just set a trigger if it has a specific class name or not.
    // - Added setTimeout since it takes a few mili-seconds to render DOM
    const INJECTED_JAVASCRIPT = `setTimeout(function() {
            var content    = document.getElementById("twitter-container-for-webview-20200915");
            var contentFlg = content.getElementsByClassName("twitter-timeline-error");

            if(contentFlg.length > 0) {
                contentFlg[0].outerHTML="<h1 style='font-size:72; padding:50;'>Error: ${targetTwitterName} does not exist</h1>"
                content.style.backgroundColor="#333333"
                content.style.justifyContent="center"
                content.style.alignItems="center"
                content.style.display="flex"
                content.style.color="#eeeeee"
            }
        }, 50);`;

    return Platform.OS === "web" ? (
      <ScrollView onLayout={this.handleLayout}>
        <Timeline
          dataSource={{
            sourceType: "profile",
            screenName: targetTwitterName,
          }}
          options={{
            chrome: chromeLists,
            lang: timelineOptions.lang,
            theme: timelineOptions.theme,
            tweetLimit: timelineLimit,
          }}
          renderError={(_err) => (
            <p>
              Could not load timeline due to Error on Twitter side (Reason:{" "}
              {_err})
            </p>
          )}
        />
      </ScrollView>
    ) : (
      <WebView
        originWhitelist={["*"]}
        startInLoadingState={true}
        source={{ html: htmlContent }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
      />
    );
  }
}

export default TwitterTimeline;
