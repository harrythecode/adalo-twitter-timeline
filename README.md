# adalo-twitter-timeline
This is an adalo plugin which allows you to embed a Twitter timeline with customized settings.

## Getting Started
These instructions will get you a copy of the project up and running under your adalo account. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
You need to set up your own environment for adalo dev. See details in http://developers.adalo.com/

### Initialize

Once you clone this project and set up adalo env, then you only need to run the commands below:

```
$ yarn install
$ yarn start
```

# Troubleshooting

## I can't scroll twitter timeline on Android, why?

Quoted from [Some questions regarding the twitter timeline component](https://forum.adalo.com/t/some-questions-regarding-the-twitter-timeline-component/4676)

> Twitter Timeline uses WebView, which lots of people are/were struggling with such a scroll issue on Android for several years. There seems to be no ideal solution for that yet. WebView works fine on iOS. So, I’d like to say this is an issue on Android itself.
> 
> However, I’ve found a workaround to make scrolls work:
> 
> * Select all items on your screen and perform “Make Group”.
> * Apply “Edit Style - Fixed: Top”.
> 
> You can try out “Edit Style - Fixed: Bottom” as well.

## Feedbacks

You can create an issue here :) if you are not sure then contact me on Twitter!

## Authors

* **amezousan** [Twitter](https://twitter.com/amezousan)

## License

MIT
