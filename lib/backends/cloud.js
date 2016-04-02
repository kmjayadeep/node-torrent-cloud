var fs = require('fs')
var mkdirp = require('mkdirp');

exports.vars = ["cloud"]; //just a dummy variable

//if these 'vars' are present, 'init' will be called on module load
exports.init = function(config) {
    // console.log(config)
};

var baseDir = __dirname + '/../../static/uploads/';

//upload will be called to upload a downloading torrent file
exports.upload = function(torrentFile, callback) {
    console.log(torrentFile)

    var dirs = torrentFile.path.split("/");
    var name = dirs.pop();
    console.log(dirs)
    console.log(name)

    mkdirp(baseDir + dirs.join('/'), function(err) {
        if (err) {
            console.log(err)
            return callback(err)
        }
        var stream = torrentFile.createReadStream();
        var file = fs.createWriteStream(baseDir + dirs.join('/') + '/' + name);
        stream.pipe(file)

        var had_error = false;

        stream.on('error', function(err) {
            console.log(err)
            callback(err)
        });
        stream.on('complete', function() {
            console.log('complete')
            callback(null)
        });
    })

};

//list will be called to list all stored files
exports.list = function(callback) {
    var files = fs.readdirSync(baseDir)
    console.log(files)
    var filesList = {};
    files.forEach(function(file) {
        var stats = fs.statSync(baseDir + file)
        filesList[file] = {
            length: stats.size,
            url: 'uploads/' + file
        }
    })
    callback(null, filesList)
};

//removes a file at the given path (will be torrentFile.path)
exports.remove = function(path, callback) {
    fs.unlink(baseDir + path, callback);
};
