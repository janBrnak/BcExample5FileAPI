const DEVICE_TYPE = 'mobile';  // browser or mobile
const SIZE = 20*1024*1024;
const TYPE = window.PERSISTENT;

var loader = null;
var iDirectories = null;
var iFiles = null;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        switch (DEVICE_TYPE) {
            case 'mobile':
                document.addEventListener('deviceready', this.onDeviceReady, false);
                break;
            case 'browser':
                this.onDeviceReady();
                break;
            default:
                this.onDeviceReady();
                break;
        }
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        onLoad();
        console.log("SUCCESS: Load device");
    }
};

var onError = function(error) {
    console.log(error);
}

var onSuccess = function(fs) {
    var date = new Date();
    var text = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " " + date.getDate() + ". " + date.getMonth() + ". " + date.getFullYear() + "\n";

    iDirectories = new DirectoriesManager(fs, "/", "listDirectories");
    iFiles = new FilesManager(fs, "/", "listFiles");

    iDirectories.listDirectories();
    iFiles.listFiles();
    iFiles.writeFile('log.txt', text);
};

onLoad();

// on load
function onLoad() {
    loader = $(".loader");

    window.temp = {}
    window.storageInfo  = window.storageInfo || window.webkitStorageInfo;
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem || window.mozRequestFileSystem;
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

    // alokacia pamate
    window.storageInfo.requestQuota(TYPE, SIZE,
        // poziadam o pristup do sendbox uloziska
        function(bytes) {
            window.requestFileSystem(TYPE, SIZE, onSuccess, onError);
        },
        function(error) {
            console.log('ERROR', error);
        }
    );
};

function addDirectory(id) {
    var name = document.getElementById(id).value;

    if (name)
        iDirectories.createDirectory(name);
}

function removeDirectory(name) {
    if (name)
        iDirectories.removeDirectory(name);
}

function addFile(id) {
    var name = document.getElementById(id).value;

    if (name)
        iFiles.createFile(name);
}

function uploadFile(id) {
    var files = document.getElementById(id).files;
    var i = 0;

    if (files.length) {
        iFiles.uploadFile(files[0]);
    }
}

function removeFile(name) {
    if (name)
        iFiles.removeFile(name);
}

function loadFile(name) {
    if (name)
        iFiles.readFile(name);
}