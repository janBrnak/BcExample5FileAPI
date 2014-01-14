var FilesManager = function(fs, path, content) {
    this.fs = fs;
    this.path = path;
    this.content = content;
}

FilesManager.prototype = {
    // vytvori subor, ak je uz vytvoreny vrati error code 9
    createFile: function(name) {
        this.fs.root.getFile (
            this.path + name,                       // path with file name
            {create: true, exclusive: true},        // function settings
            function(file) {                        // function on success
                this.listFiles();
                console.log("SUCCESS: Create file");
            },
            this.errorHandler
        );
    },

    // nacita subor, ale nie obsah
    readFile: function (name) {
        this.fs.root.getFile (
            this.path + name,              // path with file name
            {create: false},               // function settings
            function(file) {               // function on success
                file.file (
                    function(file){
                        var read = new FileReader();

                        read.onloadend = function(response) {
                            var textarea = document.getElementById('log');
                            var text = "";

                            text += "Vypis suboru: \n"
                            text += this.result;

                            textarea.innerText = text
                        }
                        read.readAsText(file);
                    },
                    this.errorHandler);
            },
            this.errorHandler
        );
    },

    // nacita subor, ale nie obsah
    writeFile: function(name, text) {
        window.temp.text = text;

        this.fs.root.getFile (
            this.path + name,                  // path with file name
            {create: false},                   // function settings
            function(fileEntry) {              // function on success
                fileEntry.createWriter (
                    function(file){
                        file.onwriteend = function(response) {
                            console.log("SUCCESS: Write into file");
                        }

                        file.onerror = function(response) {
                            console.log("ERROR: Write into file");
                        }

                        // Create a new Blob and write it to log.txt.
                        var blob = new Blob([window.temp.text], {type: 'text/plain'});

                        file.seek(file.length);
                        file.write(blob);

                        window.temp.text = null;
                    },
                    this.errorHandler);
            },
            this.errorHandler
        );
    },

    // nacita subor, ale nie obsah
    uploadFile: function(file) {
        window.temp.file = file;

        this.fs.root.getFile (
            this.path + window.temp.file.name, // path with file name
            {create: true, exclusive: true},                   // function settings
            function(fileEntry) {              // function on success
                fileEntry.createWriter (
                    function(file){
                        file.onwriteend = function(response) {
                            console.log("SUCCESS: Upload file");
                        }

                        file.onerror = function(response) {
                            console.log("ERROR: Upload file");
                        }

                        file.write(window.temp.file);
                        window.temp.file = null;
                    },
                    this.errorHandler);
            },
            this.errorHandler
        );
    },

    removeFile: function(name) {
        // zmazat subor
        this.fs.root.getFile (
            this.path + name,                   // path with file name
            {create: false},                    // function settings
            function(file) {                    // function on success
                file.remove (
                    function() {
                        console.log("SUCCESS: Remove file");
                    },
                    this.errorHandler);
            },
            this.errorHandler
        );
    },

    // list directories
    listFiles: function() {
        var reader = this.fs.root.createReader();
        var files = [];

        window.temp.file = this;

        reader.readEntries (
            function(entries) {
                if (window.temp.file) {
                    window.temp.file.parseToHtml(entries);
                    window.temp.file = null;
                }
            },
            this.errorHandler
        );
    },

    // check if exist file
    fileExist: function() {

    }

    parseToHtml: function(entries) {
        var ul = document.getElementById(this.content);
        var button = "";
        var html = "";
        var i = 0;

        if (entries.length) {
            for (i in entries) {
                if (entries[i].isFile) {
                    button = "";
                    button += '<a href="JavaScript:void(0);" title="zmazat" onclick="removeFile(\'' + entries[i].name + '\')">zmazat</a>';
                    button += ', <a href="JavaScript:void(0);" title="nacitat" onclick="loadFile(\'' + entries[i].name + '\')">nacitat</a>';
                    html += '<li class="file">' + entries[i].name + ' ' + button + '</li>';
                }
            }
        }

        ul.innerHTML = html;
    },

    errorHandler: function(error) {
        var msg = 'ERROR File: ';

        switch (error.code) {
            case FileError.NOT_FOUND_ERR:
                msg += 'File or directory not found';
                break;
            case FileError.SECURITY_ERR:
                msg += 'Insecure or disallowed operation';
                break;
            case FileError.ABORT_ERR:
                msg += 'Operation aborted';
                break;
            case FileError.NOT_READABLE_ERR:
                msg += 'File or directory not readable';
                break;
            case FileError.ENCODING_ERR:
                msg += 'Invalid encoding';
                break;
            case FileError.NO_MODIFICATION_ALLOWED_ERR:
                msg += 'Cannot modify file or directory';
                break;
            case FileError.INVALID_STATE_ERR:
                msg += 'Invalid state';
                break;
            case FileError.SYNTAX_ERR:
                msg += 'Invalid line-ending specifier';
                break;
            case FileError.INVALID_MODIFICATION_ERR:
                msg += 'Invalid modification';
                break;
            case FileError.QUOTA_EXCEEDED_ERR:
                msg += 'Storage quota exceeded';
                break;
            case FileError.TYPE_MISMATCH_ERR:
                msg += 'Invalid filetype';
                break;
            case FileError.PATH_EXISTS_ERR:
                msg += 'File or directory already exists at specified path';
                break;
            default:
                msg += 'Unknown Error';
                break;
        };

        console.log(error);
        alert(msg);
    }
}