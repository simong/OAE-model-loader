var general = require("./general.js");

////////////////////////
// CONTENT PARAMETERS //
////////////////////////

var DISTRIBUTIONS = {
    "files": {
        "TITLE": [2, 1, 1, 15],
        "HAS_METADATA": [[0.5, true], [0.5, false]],
        "HAS_DESCRIPTION": [[0.6, true], [0.4, false]],
        "DESCRIPTION": [2, 2, 1, 25],
        "HAS_TAGS": [[0.8, true], [0.2, false]],
        "TAGS": [3, 1, 1, 20],
        "COPYRIGHT": [[0.2, "Creative Commons License"], [0.2, "Copyrighted"], [0.2, "No copyright"], [0.2, "Licensed"], [0.2, "Waive copyright"]],
        "HAS_CATEGORY": [[0.6, true], [0.4, false]],
        "CATEGORY": [2, 2, 1, 10],
        "HAS_PICTURE": [[0.6, true], [0.4, false]],
        "VISIBILITY": [[0.3, "public"], [0.3, "everyone"], [0.4, "private"]],
        "HAS_COMMENTS": [[0.3, true], [0.7, false]],
        "COMMENTS": [3, 1, 1, 25],
        "TYPES": [[0.25, "image"], [0.05, "video"], [0.20, "pdf"], [0.15, "doc"], [0.15, "other-office"], [0.20, "other"]],
        "SIZE": {
            "image": [[0.25, "small"], [0.50, "medium"], [0.25, "large"]],
            "video": [[0.05, "small"], [0.20, "medium"], [0.75, "large"]],
            "pdf": [[0.20, "small"], [0.60, "medium"], [0.20, "large"]],
            "doc": [[0.20, "small"], [0.60, "medium"], [0.20, "large"]],
            "other-office": [[0.20, "small"], [0.60, "medium"], [0.20, "large"]],
            "other": [[0.40, "small"], [0.20, "medium"], [0.40, "large"]]
        }
    },
    "sakai-docs": {
        "TITLE": [2, 1, 1, 15],
        "HAS_METADATA": [[0.5, true], [0.5, false]],
        "HAS_DESCRIPTION": [[0.6, true], [0.4, false]],
        "DESCRIPTION": [2, 2, 1, 25],
        "HAS_TAGS": [[0.8, true], [0.2, false]],
        "TAGS": [3, 1, 1, 20],
        "COPYRIGHT": [[0.2, "Creative Commons License"], [0.2, "Copyrighted"], [0.2, "No copyright"], [0.2, "Licensed"], [0.2, "Waive copyright"]],
        "HAS_CATEGORY": [[0.6, true], [0.4, false]],
        "CATEGORY": [2, 2, 1, 10],
        "HAS_PICTURE": [[0.6, true], [0.4, false]],
        "VISIBILITY": [[0.3, "public"], [0.3, "everyone"], [0.4, "private"]],
        "HAS_COMMENTS": [[0.5, true], [0.5, false]],
        "COMMENTS": [4, 2, 1, 50],
        "TYPE": [[0.25, "image"], [0.05, "video"], [0.20, "pdf"], [0.15, "doc"], [0.15, "other-office"], [0.20, "other-files"]],
        "HAS_MULTIPLE_PAGES": [[0.5, true], [0.5, false]],
        "MULTIPLE_PAGES": [3, 2, 2, 25],
        "PAGE_COMPOSITION": {
            "NUMBER_OF_ROWS": [2, 1, 1, 10],
            "NUMBER_OF_COLUMNS": [2, 1, 1, 3],
            "WIDGETS_PER_CELL": [3, 1, 1, 10]
        },
        "WIDGETS": {
            "TYPE": [[0.50, "text"], [0.50, "title"], [0.50, "content"], [0.50, "discussion"], [0.50, "comment"], [0.50, "googlemaps"], [0.50, "rss"], [0.50, "basiclti"], [0.50, "googlegadget"]],
            "text": [15, 5, 1000],
            "title": [3, 1, 25],
            "content": [2, 1, 25],
            "discussion": [2, 1, 10],
            "comments": [6, 3, 25]
        }
    },
    "links": {
        "TITLE": [2, 1, 1, 15],
        "HAS_METADATA": [[0.5, true], [0.5, false]],
        "HAS_DESCRIPTION": [[0.6, true], [0.4, false]],
        "DESCRIPTION": [2, 2, 1, 25],
        "HAS_TAGS": [[0.8, true], [0.2, false]],
        "TAGS": [3, 1, 1, 20],
        "COPYRIGHT": [[0.2, "Creative Commons License"], [0.2, "Copyrighted"], [0.2, "No copyright"], [0.2, "Licensed"], [0.2, "Waive copyright"]],
        "HAS_CATEGORY": [[0.6, true], [0.4, false]],
        "CATEGORY": [2, 2, 1, 10],
        "HAS_PICTURE": [[0.6, true], [0.4, false]],
        "VISIBILITY": [[0.7, "public"], [0.2, "everyone"], [0.1, "private"]],
        "HAS_COMMENTS": [[0.25, true], [0.75, false]],
        "COMMENTS": [2, 1, 1, 20],
        "TYPE": [[0.30, "youtube"], [0.10, "vimeo"], [0.05, "flickr"], [0.05, "googlemaps"], [0.50, "other"]]
    }
};

/////////////////////////
// PooledContent Model //
/////////////////////////

exports.PooledContent = function(batchid, users) {
    var that = {};
    that.batchid = batchid;

    //that.template = general.randomize([[0.45, "files"], [0.4, "sakai-docs"], [0.15, "links"]]);
    that.template = "sakai-docs";

    that.title = general.generateKeywords(general.ASM(DISTRIBUTIONS[that.template].TITLE)).join(" ");
    that.title = that.title[0].toUpperCase() + that.title.substring(1);
    that.id = general.generateId(batchid, [that.title.toLowerCase().split(" ")]).replace(/[^a-zA-Z 0-9]+/g,'-');
    that.hasDescription = general.randomize(DISTRIBUTIONS[that.template].HAS_DESCRIPTION);
    that.description = general.generateSentence(general.ASM(DISTRIBUTIONS[that.template].DESCRIPTION));
    that.hasTags = general.randomize(DISTRIBUTIONS[that.template].HAS_TAGS);
    that.tags = general.generateKeywords(general.ASM(DISTRIBUTIONS[that.template].TAGS));
    that.copyright = general.randomize(DISTRIBUTIONS[that.template].COPYRIGHT);
    that.hasCategory = general.randomize(DISTRIBUTIONS[that.template].HAS_CATEGORY);
    that.category = general.generateDirectory(general.ASM(DISTRIBUTIONS[that.template].CATEGORY));
    //that.visibility = general.randomize(DISTRIBUTIONS[that.template].VISIBILITY);
    that.visibility = 'public';
    that.hasComments = general.randomize(DISTRIBUTIONS[that.template].HAS_COMMENTS);
    
    if (that.template === "files") {
        that.type = general.randomize(DISTRIBUTIONS[that.template].TYPES);
        that.size = general.randomize(DISTRIBUTIONS[that.template]['SIZE'][that.type]);
    }
    else if (that.template === "sakai-docs") {
        that.rows = general.ASM(DISTRIBUTIONS[that.template]['PAGE_COMPOSITION']['NUMBER_OF_ROWS']);
        that.columns = general.ASM(DISTRIBUTIONS[that.template]['PAGE_COMPOSITION']['NUMBER_OF_COLUMNS']);
        that.widgets_per_cell = general.ASM(DISTRIBUTIONS[that.template]['PAGE_COMPOSITION']['WIDGETS_PER_CELL']);
    }


    return that;
};

/**
 * Returns an array that holds rows*columns*widgets_per_cell widget names.
 */
exports.getWidgets = function(rows, columns, widgets_per_cell) {
    var widgets = [];
    var total = rows*columns*widgets_per_cell;
    for (var i = 0; i < total; i++) {
        var widgetName = general.randomize(DISTRIBUTIONS["sakai-docs"]["WIDGETS"].TYPE);
        widgets.push(createWidgetElement(widgetName));
    }
    return widgets;
}

var createWidgetElement = function(name) {
    var id = 'id' + Math.floor(Math.random() * 10000000);
    var element = {'id': id};
    var widgetData = {'sling/resourceType': 'sakai/widget-data'};
    //if (name === "text") {
        element.type = 'htmlblock';
        widgetData['content'] = general.generateSentence(general.ASM(DISTRIBUTIONS['sakai-docs']['WIDGETS']['text']));
        widgetData['sling/resourceType'] = 'sakai/widget-data';
        widgetData['sakai:indexed-fields'] = 'content';
    //}
    if (name === 'title') {
        element.type = 'htmlblock';
        widgetData['content'] = general.generateSentence(general.ASM(DISTRIBUTIONS['sakai-docs']['WIDGETS']['title']));
        widgetData['sakai:indexed-fields'] = 'content';
    }
    else if (name == 'embedcontent') {
        element.type = 'embedcontent';
        widgetData['content'] = general.generateSentence(general.ASM(DISTRIBUTIONS['sakai-docs']['WIDGETS']['title']));
        widgetData['sakai:indexed-fields'] = 'title,description';
        widgetData['download'] = false;
        widgetData['title'] = '';
        widgetData['embedmethod'] = 'thumbnail';
        widgetData['details'] = false;
        widgetData['description'] = '';
        widgetData['name'] = false;
        widgetData['layout'] = 'single';
        widgetData['items'] = {'__array__0__': "/p/mZGmIIaoN"};
    }
    else if (name === 'discussion') {
        // TODO
    }
    else if (name === 'comments') {
        // TODO
    }
    else if (name === 'googlemaps') {
        element.type = 'googlemaps';
        widgetData['mapzoom'] =  8;
        widgetData['sakai:indexed-fields'] = "mapinput,maphtml";
        widgetData['lng'] = 0.1312368000000106;
        widgetData['lat'] = 52.202544;
    }
    else if (name === 'rss') {
        element.type = 'rss';
        widgetData['feeds'] = '';
        widgetData['sakai:indexed-fields'] = 'title';
        widgetData['displayHeadlines'] = false;
        widgetData['numEntries'] = 25;
        widgetData['title'] = 'Sakai Project';
        widgetData['displaySource'] = false;
        widgetData['urlFeeds'] = {'__array__0__': 'http://www.sakaiproject.org/blog/feed'};
    }
    else if (name === 'basiclti') {
        
    }
    else if (name === 'googlegadget') {
        
    }


    return {'id': id, 'type': name, 'element': element, 'widgetData': widgetData};
};