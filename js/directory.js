var DirectoriesManager = function(fs, path, content) {
    this.fs = fs;
    this.path = path;
    this.content = content;
}

DirectoriesManager.prototype = {
    // create new directory
    createDirectory: function(name) {
        window.temp.dir = this;

        this.fs.root.getDirectory (
            this.path + name,
            {create: true, exclusive: true},
            function(dir) {
                if (window.temp.dir) {
                    window.temp.dir.listDirectories();
                    window.temp.dir = null;
                }

                console.log("SUCCESS: Create folder");
            },
            this.errorHandler
        );
    },

    // read directory
    readDirectory: function(name) {
        console.log(this.fs);
    },

    // rename directory
    renameDirectory: function(oldName, newName) {
        window.temp.dir = this;

        this.fs.root.getDirectory (
            this.path + oldName,
            {exclusive: true},
            function(dir) {
                dir.moveTo (
                    window.temp.dir.fs.root,
                    newName,
                    function() {
                        if (window.temp.dir) {
                            window.temp.dir.listDirectories();
                            window.temp.dir = null;
                        }

                        console.log("SUCCESS: Rename folder form " + oldName + " to " + newName);
                    },
                    this.errorHandler
                );
            },
            this.errorHandler
        );
    },

    // delete directory
    removeDirectory: function(name) {
        window.temp.dir = this;

        this.fs.root.getDirectory (
            this.path + name,
            {},
            function(dir) {
                dir.remove (
                    function() {
                        if (window.temp.dir) {
                            window.temp.dir.listDirectories();
                            window.temp.dir = null;
                        }

                        console.log("SUCCESS: Remove folder " + name);
                    },
                    this.errorHandler
                );
            },
            this.errorHandler
        );
    },

    // delete recursively directory
    removeRecursively: function(name) {
        window.temp.dir = this;

        this.fs.root.getDirectory(
            this.path + name,
            {},
            function(dir) {
                dir.removeRecursively (
                    function() {
                        if (window.temp.dir) {
                            window.temp.dir.listDirectories();
                            window.temp.dir = null;
                        }

                        console.log("SUCCESS: Remove recursively folder " + name);
                    },
                    this.errorHandler
                );
            },
            this.errorHandler
        );
    },

    // list directories
    listDirectories: function() {
        var reader = this.fs.root.createReader();
        var directories = [];

        window.temp.dir = this;

        reader.readEntries (
            function(entries) {
                if (window.temp.dir) {
                    window.temp.dir.parseToHtml(entries);
                    window.temp.dir = null;
                }
            },
            this.errorHandler
        );
    },

    // parse html
    parseToHtml: function(entries) {
        var ul = document.getElementById(this.content);
        var button = "";
        var html = "";
        var i = 0;

        if (entries.length) {
            for (i in entries) {
                if (entries[i].isDirectory) {
                    button = '<a href="JavaScript:void(0);" title="zmazat" onclick="removeDirectory(\'' + entries[i].name + '\')">zmazat</a>';
                    html += '<li class="dir level1">' + entries[i].name + ' ' + button + '</li>';
                }
            }
        }

        ul.innerHTML = html;
    },

    // error handler
    errorHandler: function(error) {
         var msg = 'ERROR Directory: ';

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

        alert(msg);
        console.log(error);
    }
};