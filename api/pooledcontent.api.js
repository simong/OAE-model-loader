var canvas = require('canvas');
var fs = require("fs");

var general = require("./general.js");
var userAPI = require("./user.api.js");
var pooledContentModel = require("./pooledcontent.model.js");

///////////////////////
// POOLEDCONTENT API //
///////////////////////

exports.loadPooledContent = function(pooledContent, users, SERVER_URL, ADMIN_PASSWORD, callback) {
    // TODO get random user.
    pooledContent.auth = getUserAuth(users);
    if (pooledContent.template === "files") {
        createFile(pooledContent, users, SERVER_URL, callback);
    }
    else if (pooledContent.template === "sakai-docs") {
        createSakaiDocument(pooledContent, users, SERVER_URL, callback);
    }
    else if (pooledContent.template === "links") {
        createLink(pooledContent, users, SERVER_URL, callback);
    }
};

/*
    File upload
    
    POST: /system/pool/createfile
        name="files[]" filename="Person.pdf"
    Response:
        {
            "Person RDF.txt": {
                "poolId": "mZbMaOHec",
                "item": {
                    "_length": 34412,
                    "_lastModifiedBy": "admin",
                    "sakai:needsprocessing": "true",
                    "_mimeType": "text/plain",
                    "_bodyLastModifiedBy": "admin",
                    "_createdBy": "admin",
                    "_path": "mZbMaOHec",
                    "_blockId": "4NFFEOrKEeGdrkIUrBBkOA+",
                    "sling:resourceType": "sakai/pooled-content",
                    "_created": 1345469287370,
                    "sakai:pooled-content-manager": ["simong"],
                    "sakai:pool-content-created-for": "simong",
                    "_bodyCreatedBy": "admin",
                    "_id": "4M3CoOrKEeGdrkIUrBBkOA+",
                    "sakai:pooled-content-file-name": "Person RDF.txt",
                    "_bodyLastModified": 1345469287395,
                    "_lastModified": 1345469287370,
                    "_bodyCreated": 1345469287395,
                    "_bodyLocation": "2012/7/8B/3i/HZ/8B3iHZs441fGk2uIuww5XPbz-6Y"
                }
            }
        }

    POST: /p/mZbMaOHec
        :operation:tag
        key:/tags/tag1
        key:/tags/tag2
        key:/tags/tag3


    POST: /system/batch
        requests:[{"url":"/p/mZbMaOHec.members.html","method":"POST","parameters":{":viewer":"everyone",":viewer@Delete":"anonymous"}},{"url":"/p/mZbMaOHec.modifyAce.html","method":"POST","parameters":{"principalId":"everyone","privilege@jcr:read":"granted"}},{"url":"/p/mZbMaOHec.modifyAce.html","method":"POST","parameters":{"principalId":"anonymous","privilege@jcr:read":"denied"}}]
        _charset_:utf-8
    Response:
        {"results":[{"url":"/p/mZeFcC6MZ.members.html","success":true,"body":"","status":200,"headers":{}},{"url":"/p/mZeFcC6MZ.modifyAce.html","success":true,"body":"<html>\n<head>\n    <title>Content modified /p/mZeFcC6MZ<\/title>\n<\/head>\n    <body>\n    <h1>Content modified /p/mZeFcC6MZ<\/h1>\n    <table>\n        <tbody>\n            <tr>\n                <td>Status<\/td>\n                <td><div id=\"Status\">200<\/div><\/td>\n            <\/tr>\n            <tr>\n                <td>Message<\/td>\n                <td><div id=\"Message\">OK<\/div><\/td>\n            <\/tr>\n            <tr>\n                <td>Location<\/td>\n                <td><a href=\"/mZeFcC6MZ\" id=\"Location\">/mZeFcC6MZ<\/a><\/td>\n            <\/tr>\n            <tr>\n                <td>Parent Location<\/td>\n                <td><a href=\"/p\" id=\"ParentLocation\">/p<\/a><\/td>\n            <\/tr>\n            <tr>\n                <td>Path<\/td>\n                <td><div id=\"Path\">/p/mZeFcC6MZ<\/div><\/td>\n            <\/tr>\n            <tr>\n                <td>Referer<\/td>\n                <td><a href=\"http://localhost:8080/me?welcome=true\" id=\"Referer\">http://localhost:8080/me?welcome=true<\/a><\/td>\n            <\/tr>\n            <tr>\n                <td>ChangeLog<\/td>\n                <td><div id=\"ChangeLog\">&lt;pre&gt;&lt;/pre&gt;<\/div><\/td>\n            <\/tr>\n        <\/tbody>\n    <\/table>\n    <p><a href=\"http://localhost:8080/me?welcome=true\">Go Back<\/a><\/p>\n    <p><a href=\"/mZeFcC6MZ\">Modified Resource<\/a><\/p>\n    <p><a href=\"/p\">Parent of Modified Resource<\/a><\/p>\n    <\/body>\n<\/html>","status":200,"headers":{"Content-Type":"text/html"}},{"url":"/p/mZeFcC6MZ.modifyAce.html","success":true,"body":"<html>\n<head>\n    <title>Content modified /p/mZeFcC6MZ<\/title>\n<\/head>\n    <body>\n    <h1>Content modified /p/mZeFcC6MZ<\/h1>\n    <table>\n        <tbody>\n            <tr>\n                <td>Status<\/td>\n                <td><div id=\"Status\">200<\/div><\/td>\n            <\/tr>\n            <tr>\n                <td>Message<\/td>\n                <td><div id=\"Message\">OK<\/div><\/td>\n            <\/tr>\n            <tr>\n                <td>Location<\/td>\n                <td><a href=\"/mZeFcC6MZ\" id=\"Location\">/mZeFcC6MZ<\/a><\/td>\n            <\/tr>\n            <tr>\n                <td>Parent Location<\/td>\n                <td><a href=\"/p\" id=\"ParentLocation\">/p<\/a><\/td>\n            <\/tr>\n            <tr>\n                <td>Path<\/td>\n                <td><div id=\"Path\">/p/mZeFcC6MZ<\/div><\/td>\n            <\/tr>\n            <tr>\n                <td>Referer<\/td>\n                <td><a href=\"http://localhost:8080/me?welcome=true\" id=\"Referer\">http://localhost:8080/me?welcome=true<\/a><\/td>\n            <\/tr>\n            <tr>\n                <td>ChangeLog<\/td>\n                <td><div id=\"ChangeLog\">&lt;pre&gt;&lt;/pre&gt;<\/div><\/td>\n            <\/tr>\n        <\/tbody>\n    <\/table>\n    <p><a href=\"http://localhost:8080/me?welcome=true\">Go Back<\/a><\/p>\n    <p><a href=\"/mZeFcC6MZ\">Modified Resource<\/a><\/p>\n    <p><a href=\"/p\">Parent of Modified Resource<\/a><\/p>\n    <\/body>\n<\/html>","status":200,"headers":{"Content-Type":"text/html"}}]}


    POST: /system/batch
        _charset_:utf-8
        requests:[{"url":"/p/mZbMaOHec","method":"POST","parameters":{"sakai:pooled-content-file-name":"Person RDF.txt","sakai:description":"Some weird description","sakai:permissions":"everyone","sakai:copyright":"nocopyright","sakai:allowcomments":"true","sakai:showcomments":"true","sakai:fileextension":"txt","_charset_":"utf-8"},"_charset_":"utf-8"},{"url":"/p/mZbMaOHec.save.json","method":"POST","_charset_":"utf-8"}]
    Response:
        {"results":[{"url":"/p/mZeFcC6MZ","success":true,"body":"<html>\n<head>\n    <title>Content modified /p/mZeFcC6MZ<\/title>\n<\/head>\n    <body>\n    <h1>Content modified /p/mZeFcC6MZ<\/h1>\n    <table>\n        <tbody>\n            <tr>\n                <td>Status<\/td>\n                <td><div id=\"Status\">200<\/div><\/td>\n            <\/tr>\n            <tr>\n                <td>Message<\/td>\n                <td><div id=\"Message\">OK<\/div><\/td>\n            <\/tr>\n            <tr>\n                <td>Location<\/td>\n                <td><a href=\"/p/mZeFcC6MZ\" id=\"Location\">/p/mZeFcC6MZ<\/a><\/td>\n            <\/tr>\n            <tr>\n                <td>Parent Location<\/td>\n                <td><a href=\"/p\" id=\"ParentLocation\">/p<\/a><\/td>\n            <\/tr>\n            <tr>\n                <td>Path<\/td>\n                <td><div id=\"Path\">/p/mZeFcC6MZ<\/div><\/td>\n            <\/tr>\n            <tr>\n                <td>Referer<\/td>\n                <td><a href=\"http://localhost:8080/me?welcome=true\" id=\"Referer\">http://localhost:8080/me?welcome=true<\/a><\/td>\n            <\/tr>\n            <tr>\n                <td>ChangeLog<\/td>\n                <td><div id=\"ChangeLog\">&lt;pre&gt;modified(\"/p/mZeFcC6MZ@sakai:showcomments\");&lt;br/&gt;modified(\"/p/mZeFcC6MZ@sakai:allowcomments\");&lt;br/&gt;modified(\"/p/mZeFcC6MZ@sakai:permissions\");&lt;br/&gt;modified(\"/p/mZeFcC6MZ@sakai:description\");&lt;br/&gt;modified(\"/p/mZeFcC6MZ@sakai:pooled-content-file-name\");&lt;br/&gt;modified(\"/p/mZeFcC6MZ@sakai:copyright\");&lt;br/&gt;&lt;/pre&gt;<\/div><\/td>\n            <\/tr>\n        <\/tbody>\n    <\/table>\n    <p><a href=\"http://localhost:8080/me?welcome=true\">Go Back<\/a><\/p>\n    <p><a href=\"/p/mZeFcC6MZ\">Modified Resource<\/a><\/p>\n    <p><a href=\"/p\">Parent of Modified Resource<\/a><\/p>\n    <\/body>\n<\/html>","status":200,"headers":{"Content-Type":"text/html"}},{"url":"/p/mZeFcC6MZ.save.json","success":true,"body":"{\"versionName\":\"xZteYOrLEeGdrkIUrBBkOA+\",\"_lastModifiedBy\":\"simong\",\"sakai:preview-type\":\"iframe\",\"_path\":\"mZeFcC6MZ\",\"_versionNumber\":1345469671582,\"sakai:description\":\"Zotte google description\",\"sakai:allowcomments\":\"true\",\"sakai:pooled-content-viewer\":[\"everyone\",\"anonymous\"],\"sakai:pool-content-created-for\":\"simong\",\"_id\":\"xZteYOrLEeGdrkIUrBBkOA+\",\"sakai:pooled-content-file-name\":\"Zotte google title\",\"_nextVersion\":\"xc_b4erLEeGdrkIUrBBkOA+\",\"sakai:pooled-content-editor\":[],\"sakai:copyright\":\"creativecommons\",\"_readOnly\":\"Y\",\"sakai:permissions\":\"public\",\"_mimeType\":\"x-sakai/link\",\"_createdBy\":\"admin\",\"commentCount\":0,\"sakai:preview-url\":\"http://www.google.com\",\"_versionHistoryId\":\"xc_b4OrLEeGdrkIUrBBkOA+\",\"sling:resourceType\":\"sakai/pooled-content\",\"sakai:tags\":[\"tag1\",\"tag2\",\"tag3\"],\"sakai:showcomments\":\"true\",\"sakai:pooled-content-manager\":[\"simong\"],\"_created\":1345469671238,\"_lastModified\":1345469671575,\"sakai:pooled-content-url\":\"http://www.google.com\"}","status":200,"headers":{"Content-Type":"application/json"}}]}
*/


/*
    LINKS

    POST: /system/pool/createfile
        sakai:pooled-content-url:http://www.google.com
        mimeType:x-sakai/link
        sakai:preview-url:http://www.google.com
        sakai:preview-type:iframe
        _charset_:utf-8
    Response:
        {"_contentItem":{"poolId":"mZeFcC6MZ","item":{"_lastModifiedBy":"admin","sakai:preview-type":"iframe","_mimeType":"x-sakai/link","commentCount":0,"_createdBy":"admin","sakai:preview-url":"http://www.google.com","_path":"mZeFcC6MZ","sling:resourceType":"sakai/pooled-content","sakai:pooled-content-manager":["simong"],"_created":1345469671238,"sakai:pool-content-created-for":"simong","_id":"xZteYOrLEeGdrkIUrBBkOA+","_lastModified":1345469671238,"sakai:pooled-content-url":"http://www.google.com"}}}

    POST: /p/mZeFcC..
        :operation:tag
        key:/tags/tag1
        key:/tags/tag2
        key:/tags/tag3
        _charset_:utf-8

    POST: /system/batch
        requests:[{"url":"/p/mZeFcC6MZ.members.html","method":"POST","parameters":{":viewer":["everyone","anonymous"]}},{"url":"/p/mZeFcC6MZ.modifyAce.html","method":"POST","parameters":{"principalId":["everyone"],"privilege@jcr:read":"granted"}},{"url":"/p/mZeFcC6MZ.modifyAce.html","method":"POST","parameters":{"principalId":["anonymous"],"privilege@jcr:read":"granted"}}]
        _charset_:utf-8

    POST: /system/batch
        charset_:utf-8
        requests:[{"url":"/p/mZeFcC6MZ","method":"POST","parameters":{"sakai:pooled-content-file-name":"Zotte google title","sakai:description":"Zotte google description","sakai:permissions":"public","sakai:copyright":"creativecommons","sakai:allowcomments":"true","sakai:showcomments":"true","_charset_":"utf-8"},"_charset_":"utf-8"},{"url":"/p/mZeFcC6MZ.save.json","method":"POST","_charset_":"utf-8"}]
*/


/*
    Sakai-doc:
    POST: /system/pool/createfile
        structure0:{"page1":{"_ref":"id4533042","_order":0,"_title":"The name of my doc","main":{"_ref":"id4533042","_order":0,"_title":"The name of my doc"}}}
        mimeType:x-sakai/document
        sakai:schemaversion:2
        _charset_:utf-8
    Response:
        {"_contentItem":{"poolId":"mZgnAikaa","item":{"_lastModifiedBy":"admin","sakai:schemaversion":"2","_mimeType":"x-sakai/document","commentCount":0,"_createdBy":"admin","_path":"mZgnAikaa","sling:resourceType":"sakai/pooled-content","sakai:pooled-content-manager":["simong"],"_created":1345469883105,"sakai:pool-content-created-for":"simong","_id":"Q-O1EOrMEeGdrkIUrBBkOA+","structure0":"{\"page1\":{\"_ref\":\"id4533042\",\"_order\":0,\"_title\":\"The name of my doc\",\"main\":{\"_ref\":\"id4533042\",\"_order\":0,\"_title\":\"The name of my doc\"}}}","_lastModified":1345469883105}}}

    POST: /p/mZgnAikaa
        :operation:import
        :contentType:json
        :merge:true
        :replace:true
        :replaceProperties:true
        _charset_:utf-8
        :content:{"id4533042":{"rows":{"__array__0__":{"id":"id6175204","columns":{"__array__0__":{"width":1,"elements":""}}}}}}
    Response:
        201

    POST: /p/mZgnAikaa/id4533042.save.json
        sling:resourceType:sakai/pagecontent
        sakai:pagecontent:{"rows":[{"id":"id6175204","columns":[{"width":1,"elements":[]}]}]}
        _charset_:utf-8
    Response:
        {"versionName":"RAthUOrMEeGdrkIUrBBkOA+","_versionNumber":1345469883423,"_created":1345469883365,"_id":"RAthUOrMEeGdrkIUrBBkOA+","_lastModifiedBy":"simong","_readOnly":"Y","_nextVersion":"RBQ68erMEeGdrkIUrBBkOA+","_lastModified":1345469883365,"_createdBy":"simong","_path":"mZgnAikaa/id4533042","_versionHistoryId":"RBQ68OrMEeGdrkIUrBBkOA+"}


    POST: /p/mZgnAikaa
        :operation:tag
        key:/tags/tag1
        key:/tags/tag2
        key:/tags/tag3
        _charset_:utf-8
    Response:
        200


    POST: /system/batch
        requests:[{"url":"/p/mZgnAikaa.members.html","method":"POST","parameters":{":viewer":"everyone",":viewer@Delete":"anonymous"}},{"url":"/p/mZgnAikaa.modifyAce.html","method":"POST","parameters":{"principalId":"everyone","privilege@jcr:read":"granted"}},{"url":"/p/mZgnAikaa.modifyAce.html","method":"POST","parameters":{"principalId":"anonymous","privilege@jcr:read":"denied"}}]
        _charset_:utf-8
    Response:
        {"results":[{"url":"/p/mZgnAikaa.members.html","success":true,"body":"","status":200,"headers":{}},{"url":"/p/mZgnAikaa.modifyAce.html","success":true,"body":"<html>\n<head>\n    <title>Content modified /p/mZgnAikaa<\/title>\n<\/head>\n    <body>\n    <h1>Content modified /p/mZgnAikaa<\/h1>\n    <table>\n        <tbody>\n            <tr>\n                <td>Status<\/td>\n                <td><div id=\"Status\">200<\/div><\/td>\n            <\/tr>\n            <tr>\n                <td>Message<\/td>\n                <td><div id=\"Message\">OK<\/div><\/td>\n            <\/tr>\n            <tr>\n                <td>Location<\/td>\n                <td><a href=\"/mZgnAikaa\" id=\"Location\">/mZgnAikaa<\/a><\/td>\n            <\/tr>\n            <tr>\n                <td>Parent Location<\/td>\n                <td><a href=\"/p\" id=\"ParentLocation\">/p<\/a><\/td>\n            <\/tr>\n            <tr>\n                <td>Path<\/td>\n                <td><div id=\"Path\">/p/mZgnAikaa<\/div><\/td>\n            <\/tr>\n            <tr>\n                <td>Referer<\/td>\n                <td><a href=\"http://localhost:8080/me?welcome=true\" id=\"Referer\">http://localhost:8080/me?welcome=true<\/a><\/td>\n            <\/tr>\n            <tr>\n                <td>ChangeLog<\/td>\n                <td><div id=\"ChangeLog\">&lt;pre&gt;&lt;/pre&gt;<\/div><\/td>\n            <\/tr>\n        <\/tbody>\n    <\/table>\n    <p><a href=\"http://localhost:8080/me?welcome=true\">Go Back<\/a><\/p>\n    <p><a href=\"/mZgnAikaa\">Modified Resource<\/a><\/p>\n    <p><a href=\"/p\">Parent of Modified Resource<\/a><\/p>\n    <\/body>\n<\/html>","status":200,"headers":{"Content-Type":"text/html"}},{"url":"/p/mZgnAikaa.modifyAce.html","success":true,"body":"<html>\n<head>\n    <title>Content modified /p/mZgnAikaa<\/title>\n<\/head>\n    <body>\n    <h1>Content modified /p/mZgnAikaa<\/h1>\n    <table>\n        <tbody>\n            <tr>\n                <td>Status<\/td>\n                <td><div id=\"Status\">200<\/div><\/td>\n            <\/tr>\n            <tr>\n                <td>Message<\/td>\n                <td><div id=\"Message\">OK<\/div><\/td>\n            <\/tr>\n            <tr>\n                <td>Location<\/td>\n                <td><a href=\"/mZgnAikaa\" id=\"Location\">/mZgnAikaa<\/a><\/td>\n            <\/tr>\n            <tr>\n                <td>Parent Location<\/td>\n                <td><a href=\"/p\" id=\"ParentLocation\">/p<\/a><\/td>\n            <\/tr>\n            <tr>\n                <td>Path<\/td>\n                <td><div id=\"Path\">/p/mZgnAikaa<\/div><\/td>\n            <\/tr>\n            <tr>\n                <td>Referer<\/td>\n                <td><a href=\"http://localhost:8080/me?welcome=true\" id=\"Referer\">http://localhost:8080/me?welcome=true<\/a><\/td>\n            <\/tr>\n            <tr>\n                <td>ChangeLog<\/td>\n                <td><div id=\"ChangeLog\">&lt;pre&gt;&lt;/pre&gt;<\/div><\/td>\n            <\/tr>\n        <\/tbody>\n    <\/table>\n    <p><a href=\"http://localhost:8080/me?welcome=true\">Go Back<\/a><\/p>\n    <p><a href=\"/mZgnAikaa\">Modified Resource<\/a><\/p>\n    <p><a href=\"/p\">Parent of Modified Resource<\/a><\/p>\n    <\/body>\n<\/html>","status":200,"headers":{"Content-Type":"text/html"}}]}

    POST: /p/mZgnAikaa
        sakai:pooled-content-file-name:The name of my doc
        sakai:description:The description of my doc
        sakai:permissions:everyone
        sakai:copyright:creativecommons
        sakai:allowcomments:true
        sakai:showcomments:true
        _charset_:utf-8
    Response:
        200
    */

/**
 * Create a sakai document.
 */
var createSakaiDocument = function(pooledContent, users, SERVER_URL, callback) {
    var docId = "id" + Math.floor(Math.random() * 10000000);
    var data = {
        "structure0": JSON.stringify({"page1":{"_ref":docId,"_order":0,"_title":pooledContent.title,"main":{"_ref":docId,"_order":0,"_title":pooledContent.title}}}),
        "mimeType": "x-sakai/document",
        "sakai:schemaversion": 2,
        "_charset_": "utf-8"
    };
    general.urlReq(SERVER_URL + "/system/pool/createfile", {
        method: 'POST',
        params: data,
        auth: pooledContent.auth
    }, function(res, success){
        var data = JSON.parse(res);
        pooledContent.id = data['_contentItem'].poolId;
        // Get all the widgets.
        var widgets = pooledContentModel.getWidgets(pooledContent.rows, pooledContent.columns, pooledContent.widgets_per_cell);
        console.log("    Sakai doc: " + pooledContent.id);

        // This is the object we'll import with the :import operation.
        var jsonData = {};
        jsonData[docId] = {};

        // Construct the page.
        var i = 0;
        var rows = {};
        var simplePageContent = {"rows":[]};
        for (var r=0; r<pooledContent.rows;r++) {
            var rowData = {};
            rowData.id = "id" + Math.floor(Math.random() * 10000000);
            rowData.columns = {};
            var simpleRowData = {'id': rowData.id, 'columns': []};
            for (var c=0; c<pooledContent.columns;c++) {
                var columnData = {'width': 1/pooledContent.columns, 'elements': {}};
                var simpleColumnData = {'width': 1/pooledContent.columns, 'elements': []};
                // Add the widgets in this cell.
                for (var w = 0; w<pooledContent.widgets_per_cell; w++) {
                    columnData['elements']['__array__' + w + '__'] = widgets[i].element;
                    console.log(JSON.stringify(widgets[i].element));
                    simpleColumnData.elements.push(widgets[i].element);
                    simplePageContent[widgets[i].id] = {};
                    simplePageContent[widgets[i].id][widgets[i].type] = widgets[i].widgetData;
                    i++;
                }
                rowData.columns['__array__' + c + '__'] = columnData;
                simpleRowData.columns.push(simpleColumnData);
            }

            rows['__array__' + r + '__'] = rowData;
            simplePageContent.rows.push(simpleRowData);
        }
        jsonData[docId]['rows'] = rows;

        // Add in all the widgets.
        for (var i = 0; i < widgets.length;i++) {
            jsonData[docId][widgets[i].id] = {};
            jsonData[docId][widgets[i].id][widgets[i].type] = widgets[i].widgetData;
        }

        data = {
            ":operation": "import",
            ":contentType": "json",
            ":merge": true,
            ":replace": true,
            ":replaceProperties": true,
            "_charset_": "utf-8",
            ":content": JSON.stringify(jsonData)
        };
        general.urlReq(SERVER_URL + "/p/" + pooledContent.id, {
            method: 'POST',
            params: data,
            auth: pooledContent.auth
        }, function(body, success, res){
            console.log("    saved.");
            // Save a version.
            console.log("   version: " + JSON.stringify(simplePageContent));
            general.urlReq(SERVER_URL + "/p/" + pooledContent.id + "/" + docId + ".save.json", {
                method: 'POST',
                params: {
                    'sling:resourceType': 'sakai/pagecontent',
                    'sakai:pagecontent': JSON.stringify(simplePageContent),
                    '_charset_': 'utf-8'
                },
                auth: pooledContent.auth
            }, function(res, success){
                console.log("    " + res);
                console.log("    versioned.");
                tagPooledContent(pooledContent, SERVER_URL, function() {
                    console.log("    tagged");
                    setPermissions(pooledContent, SERVER_URL, function() {
                        console.log("    permissions set");
                        // Set the description
                         general.urlReq(SERVER_URL + "/p/" + pooledContent.id, {
                            method: 'POST',
                            params: {
                                'sakai:pooled-content-file-name': pooledContent.title,
                                'sakai:description': pooledContent.description,
                                'sakai:permissions':pooledContent.visibility,
                                'sakai:copyright': pooledContent.copyright,
                                'sakai:allowcomments':true,
                                'sakai:showcomments':true,
                                '_charset_': 'utf-8'
                            },
                            auth: pooledContent.auth
                        }, function(res, success){
                            console.log("    added descr");
                            callback();
                        });
                    });
                });
            });
        });     
    });
};


/**
 * Uploads a file.
 */
var createFile = function(pooledContent, users, SERVER_URL, callback) {
    var file = getPooledContentFile(pooledContent.type, pooledContent.size);
    var path = file.path;
    var name = file.name;

    // Upload a file.
    general.filePost(
        SERVER_URL + "/system/pool/createfile",
        path, // path to the file
        name,  // the name of the file
        {
            auth: pooledContent.auth
        }, function(res, success) {
            var data = JSON.parse(res);
            pooledContent.id = data[name].poolId;
            // Tag it.
            tagPooledContent(pooledContent, SERVER_URL, function() {
                // Set the permissions.
                setPermissions(pooledContent, SERVER_URL, function() {
                    // Set meta data and save a version.
                    var requests = [{"url":"/p/" + pooledContent.id,
                                    "method":"POST",
                                    "parameters":{
                                        "sakai:pooled-content-file-name": pooledContent.title,
                                        "sakai:description":pooledContent.description,
                                        "sakai:permissions":pooledContent.visibility,
                                        "sakai:copyright":pooledContent.copyright,
                                        "sakai:allowcomments":pooledContent.hasComments,
                                        "sakai:showcomments":pooledContent.hasComments,
                                        "_charset_":"utf-8"
                                    },
                                    "_charset_":"utf-8"},
                                    {"url":"/p/" + pooledContent.id + ".save.json","method":"POST","_charset_":"utf-8"}];
                    if (requests.length > 0){
                        general.urlReq(SERVER_URL + "/system/batch", {
                            method: 'POST',
                            params: {"_charset_": "utf-8", "requests": JSON.stringify(requests)},
                            auth: pooledContent.auth
                        }, callback);
                    } else {
                        callback();
                    }
                });
            });
        }
    );    
};

var getPooledContentFile = function(type, size) {                                                                        
    var fs = require('fs');
    var dir = "./data/pooledcontent/" + size + "/" + type;
    var files = fs.readdirSync(dir);
    var name = files[Math.floor(Math.random() * files.length)];
    return {'path': dir + "/" + name, 'name': name};
};

var createLink = function(pooledContent, users, SERVER_URL, callback) {
    var url = general.generateRandomURL();
    var data = {
        "sakai:pooled-content-url": url,
        "mimeType": "x-sakai/link",
        "sakai:preview-url": url,
        "sakai:preview-type": "iframe"
    };

    // Create the link.
    general.urlReq(SERVER_URL + "/system/pool/createfile", {
        method: 'POST',
        params: data,
        auth: pooledContent.auth
    }, function(res, success){
        data = JSON.parse(res);
        pooledContent.id = data['_contentItem'].poolId;

        // Tag it.
        tagPooledContent(pooledContent, SERVER_URL, function() {
            // Set the permissions.
            setPermissions(pooledContent, SERVER_URL, function() {
                // Set meta data and save a version.
                var requests = [{"url":"/p/" + pooledContent.id,
                                "method":"POST",
                                "parameters":{
                                    "sakai:pooled-content-file-name": pooledContent.title,
                                    "sakai:description":pooledContent.description,
                                    "sakai:permissions":pooledContent.visibility,
                                    "sakai:copyright":pooledContent.copyright,
                                    "sakai:allowcomments":pooledContent.hasComments,
                                    "sakai:showcomments":pooledContent.hasComments,
                                    "_charset_":"utf-8"
                                },
                                "_charset_":"utf-8"},
                                {"url":"/p/" + pooledContent.id + ".save.json","method":"POST","_charset_":"utf-8"}];
                if (requests.length){
                    general.urlReq(SERVER_URL + "/system/batch", {
                        method: 'POST',
                        params: {"_charset_": "utf-8", "requests": JSON.stringify(requests)},
                        auth: pooledContent.auth
                    }, callback);
                } else {
                    callback();
                }
            });
        });

    });
};

var getUserAuth = function (users) {
    // TODO make this actually follow the distributions as set out in the performance document.
    var id = Math.floor(Math.random()*users.length);
    return users[id].userid + ":" + users[id].password;
}

var setPermissions = function(pooledContent, SERVER_URL, callback) {
    var requests = [];
    if (pooledContent.visibility === "public") {
        requests = [ {"url":"/p/" + pooledContent.id + ".members.html","method":"POST","parameters":{":viewer":["everyone","anonymous"]}},
                    {"url":"/p/" + pooledContent.id + ".modifyAce.html","method":"POST","parameters":{"principalId":["everyone"],"privilege@jcr:read":"granted"}},
                    {"url":"/p/" + pooledContent.id + ".modifyAce.html","method":"POST","parameters":{"principalId":["anonymous"],"privilege@jcr:read":"granted"}}];
    }
    else if (pooledContent.visibility === "everyone") {
        requests = [ {"url":"/p/" + pooledContent.id + ".members.html","method":"POST","parameters":{":viewer":"everyone",":viewer@Delete":"anonymous"}},
                    {"url":"/p/" + pooledContent.id + ".modifyAce.html","method":"POST","parameters":{"principalId":"everyone","privilege@jcr:read":"granted"}},
                    {"url":"/p/" + pooledContent.id + ".modifyAce.html","method":"POST","parameters":{"principalId":"anonymous","privilege@jcr:read":"denied"}}];
    }
    else if (pooledContent.visibility === "private") {
        requests = [ {"url":"/p/" + pooledContent.id + ".members.html","method":"POST","parameters":{":viewer@Delete":["anonymous","everyone"]}},
                    {"url":"/p/" + pooledContent.id + ".modifyAce.html","method":"POST","parameters":{"principalId":["everyone"],"privilege@jcr:read":"denied"}},
                    {"url":"/p/" + pooledContent.id + ".modifyAce.html","method":"POST","parameters":{"principalId":["anonymous"],"privilege@jcr:read":"denied"}}];   
    }
    if (requests.length > 0){
        general.urlReq(SERVER_URL + "/system/batch", {
            method: 'POST',
            params: {"_charset_": "utf-8", "requests": JSON.stringify(requests)},
            auth: pooledContent.auth
        }, function(res, success) {
            callback();
        });
    } else {
        callback();
    }
};

/**
 * Tags a pooled content item.
 */
var tagPooledContent = function(pooledContent, SERVER_URL, callback) {
    if (pooledContent.tags && pooledContent.tags.length > 0) {
        var tags = [];
        for (var t = 0; t < pooledContent.tags.length;t++) {
            tags.push("/tags/" + pooledContent.tags[t]);
        }
        // Tag it.
        var data = {
            ":operation": "tag",
            "_charset_": "utf-8",
            "key": tags
        };
        // Do post.
        general.urlReq(SERVER_URL + "/p/" + pooledContent.id, {
            method: 'POST',
            params: data,
            auth: pooledContent.auth
        }, function(body, success, res){
            callback();
        });
    } else {
        callback();
    }
};