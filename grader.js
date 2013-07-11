#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var DOWNLOAD_TO_FILE = "tmp.html";
var CHECKSFILE_DEFAULT = "checks.json";
var restler = require('restler');

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var downloadHtmlAndCheck = function(url) {
//console.log('checkHtmlURL->url: %s', url);
    if(fs.existsSync(DOWNLOAD_TO_FILE)) {
      // truncate it if it exists
      fs.unlinkSync(DOWNLOAD_TO_FILE);
//console.log("Removed %s",DOWNLOAD_TO_FILE);
    }
    if(!fs.existsSync(DOWNLOAD_TO_FILE)) {
      // create it if it does not exist
      fs.createWriteStream(DOWNLOAD_TO_FILE);
//console.log("Created %s",DOWNLOAD_TO_FILE);

    } 

    restler.get(url).on('complete', function(body) {
//console.log(body);
      fs.writeFile(DOWNLOAD_TO_FILE, body, 'utf-8', function (err) {
        if (err) {
          console.error("failed to save");
	  process.exit(-2);
        } else {
//console.log("successfuly saved");
          myCheckHtmlFile(DOWNLOAD_TO_FILE);
          return;
        }
      });
    });
}

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists))
        .option('-u, --url <url>', 'URL to index.html')
        .parse(process.argv);

   if (process.argv.length > 6) { // we dont want to get both -f and -u
	console.log("\n\terror: invalid invocation");
	process.exit(-1);
   }

var myCheckHtmlFile = function(name) {
    checkJson = checkHtmlFile(name, program.checks);
    outJson = JSON.stringify(checkJson, null, 4);
    console.log( outJson);
    return;
};
    var checkJson, outJson ;

   if (program.file) {
//console.log('file: %s', program.file);
    myCheckHtmlFile(program.file);
   } 
   if (program.url) {
//console.log('url: %s', program.url);
    downloadHtmlAndCheck(program.url);
   }
} else {
    exports.checkHtmlFile = checkHtmlFile;
    exports.checkHtmlURL = checkHtmlURL;
}
