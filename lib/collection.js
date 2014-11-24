// Collection generator to integrate all javascript files under acsObjects, to become an ACS objects collection

var fs = require('fs'),
	_ = require('lodash');

const DOC_BASE_URL = 'http://docs.appcelerator.com/cloud/latest/#!/api/';

var acsCollection = {};

var collectionFolder = __dirname + '/acsObjects/',
	collectionFiles = fs.readdirSync(collectionFolder);
// Read javascript files one by one
for (var collectionFileIndex in collectionFiles) {
	var collectionFile = collectionFiles[collectionFileIndex];
	var acsObject = require(collectionFolder + collectionFile);
	_.merge(acsCollection, acsObject);
}
// Add doc url and method list into each ACS objects
for (var acsObjectKey in acsCollection) {
	var acsObject = acsCollection[acsObjectKey];
	acsObject.docUrl = DOC_BASE_URL + acsObjectKey;
	acsObject.fieldList = acsObject.fields;
	acsObject.methodList = Object.keys(acsObject.methods);
}
acsCollection.objectList = Object.keys(acsCollection);

module.exports = acsCollection;
