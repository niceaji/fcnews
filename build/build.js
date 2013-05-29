// https://github.com/jed/crx

var fs = require("fs")
  , ChromeExtension = require("crx")
  , crx = new ChromeExtension({
      codebase: "http://niceaji.github.io/fcnews/dist/fcnews.crx",
      privateKey: fs.readFileSync("../key.pem"),
      rootDirectory: "../chrome-extension"
    })

crx.load(function(err) {
  if (err) throw err
  this.pack(function(err, data){
    if (err) throw err

    var updateXML = this.generateUpdateXML()

    fs.writeFile("../dist/update.xml", updateXML)
    fs.writeFile("../dist/fcnews.crx", data)

    this.destroy();
    console.log("done!")
  })
})