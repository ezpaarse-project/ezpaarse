export default function () {
  if (typeof navigator !== 'undefined') {
    const browsers = [
      { nav: 'aol', rule: /AOLShield\/([0-9\._]+)/i },
      { nav: 'edge', rule: /Edge\/([0-9\._]+)/i },
      { nav: 'yandexbrowser', rule: /YaBrowser\/([0-9\._]+)/i },
      { nav: 'vivaldi', rule: /Vivaldi\/([0-9\.]+)/i },
      { nav: 'kakaotalk', rule: /KAKAOTALK\s([0-9\.]+)/i },
      { nav: 'samsung', rule: /SamsungBrowser\/([0-9\.]+)/i },
      { nav: 'chrome', rule: /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/i },
      { nav: 'phantomjs', rule: /PhantomJS\/([0-9\.]+)(:?\s|$)/i },
      { nav: 'crios', rule: /CriOS\/([0-9\.]+)(:?\s|$)/i },
      { nav: 'firefox', rule: /Firefox\/([0-9\.]+)(?:\s|$)/i },
      { nav: 'fxios', rule: /FxiOS\/([0-9\.]+)/i },
      { nav: 'opera', rule: /Opera\/([0-9\.]+)(?:\s|$)/i },
      { nav: 'opera', rule: /OPR\/([0-9\.]+)(:?\s|$)$/i },
      { nav: 'ie', rule: /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/i },
      { nav: 'ie', rule: /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/i },
      { nav: 'ie', rule: /MSIE\s(7\.0)/i },
      { nav: 'bb10', rule: /BB10;\sTouch.*Version\/([0-9\.]+)/i },
      { nav: 'android', rule: /Android\s([0-9\.]+)/i },
      { nav: 'ios', rule: /Version\/([0-9\._]+).*Mobile.*Safari.*/i },
      { nav: 'safari', rule: /Version\/([0-9\._]+).*Safari/i },
      { nav: 'facebook', rule: /FBAV\/([0-9\.]+)/i },
      { nav: 'instagram', rule: /Instagram\s([0-9\.]+)/i },
      { nav: 'ios-webview',rule:  /AppleWebKit\/([0-9\.]+).*Mobile/i }
    ]

    const ua = navigator.userAgent

    if (ua) {
      const browser = browsers.map(function (browser) {
        const match = browser.rule.exec(ua)
        if (match) console.log(match)
      })
    }
  }
}