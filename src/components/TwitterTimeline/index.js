/***
 * Copyright (c) 2020 Andrew Suzuki
 * Released under the MIT license
 * https://github.com/andrewsuzuki/react-twitter-widgets
 */
import { Timeline } from 'react-twitter-widgets'
import { Component } from 'react'

class TwitterTimeline extends Component {
	constructor(props) {
		super(props);
		this.state = { error: null, errorInfo: null };
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
	
	componentDidCatch(error, errorInfo) {
		this.setState({
			error: error,
			errorInfo: errorInfo
		})
	}

	render() {
		if (this.state.errorInfo) {
			return (
			  <div>
				<h2>Something went wrong.</h2>
				{this.state.error && this.state.error.toString()}
				<details style={{ whiteSpace: 'pre-wrap' }}>
				  {this.state.error && this.state.error.toString()}
				  <br />
				  {this.state.errorInfo.componentStack}
				</details>
			  </div>
			);
		}
		
		const { screenName, timelineStyle, timelineOptions } = this.props;
		const chromeLists = this.getTimelineOptions(timelineOptions);
		
		return (
			<Timeline
			  dataSource={{
				sourceType: 'profile',
				screenName: screenName
			  }}
			  options={{
				chrome     : chromeLists,
				height     : timelineStyle.height == 0 ? null : timelineStyle.height,
				lang       : timelineOptions.lang,
				theme      : timelineStyle.theme,
				tweetLimit : timelineStyle.tweetLimit == 0 ? null : timelineStyle.tweetLimit,
			  }}
			renderError={(_err) => <p>Could not load timeline due to Error on Twitter side (Reason: {_err})</p>}
			/>
		)
	}
}

export default TwitterTimeline