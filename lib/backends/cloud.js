var fs = require('fs')

exports.vars = ["cloud"]; //just a dummy variable

//if these 'vars' are present, 'init' will be called on module load
exports.init = function(config) {
    // console.log(config)
};

//upload will be called to upload a downloading torrent file
exports.upload = function(torrentFile, callback) {
    //torrentFile is an object, with properties:
    //	path - string
    //	length - length of file (IMPORTANT: when zipping all files,
    // 			we don't know exact length, so always try to use multipart uploads where length
    //			is not required, else buffer the file)
    //	createReadStream - function() begins to download file, returns a stream object
    //						you must handle the "error" event!
    //				(note: stream staggered to prevent backlog from slow uploads)

    //callback when stream has been fully uploaded
    console.log(torrentFile)
    callback(null);
};

//list will be called to list all stored files
exports.list = function(callback) {
    var files = fs.readdirSync(__dirname + '/../../static/uploads')
    console.log(files)
    var filesList = {};
    files.forEach(function(file) {
        var stats = fs.statSync(__dirname + '/../../static/uploads/' + file)
        filesList[file] = {
            length: stats.size,
            url: 'uploads/' + file
        }
    })
    callback(null, filesList)
};

//removes a file at the given path (will be torrentFile.path)
exports.remove = function(path, callback) {
    fs.unlink(__dirname + '/../../static/uploads/' + path, callback);
};
