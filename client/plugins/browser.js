import { detect } from 'detect-browser'
const browser = detect()
 
if (browser) {
  console.log(browser.name)
  console.log(browser.version)
  console.log(browser.os)
}