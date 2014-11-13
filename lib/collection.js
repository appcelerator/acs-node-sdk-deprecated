var fs = require('fs'),
	_ = require('lodash');

const DOC_BASE_URL = 'http://docs.appcelerator.com/cloud/latest/#!/api/';

var acsCollection = {},
	globalOptions = {
		optionalParam: [{
			key: 'pretty_json',
			type: 'boolean'
		}]
	};

var collectionFolder = __dirname + '/acsObjects/',
	collectionFiles = fs.readdirSync(collectionFolder);
for (var collectionFileIndex in collectionFiles) {
	var collectionFile = collectionFiles[collectionFileIndex];
	var acsObject = require(collectionFolder + collectionFile);
	_.merge(acsCollection, acsObject);
}
for (var acsObjectKey in acsCollection) {
	var acsObject = acsCollection[acsObjectKey];
	acsObject.docUrl = DOC_BASE_URL + acsObjectKey;
	acsObject.fieldList = acsObject.fields;
	acsObject.methodList = Object.keys(acsObject.methods);
	for (var acsObjectMethodKey in acsObject.methods) {
		var acsObjectMethod = acsObject.methods[acsObjectMethodKey];
		for (var i in globalOptions.optionalParam) {
			var item = globalOptions.optionalParam[i];
			acsObjectMethod.optionalParam.push(item);
		}
	}
}
acsCollection.objectList = Object.keys(acsCollection);

module.exports = acsCollection;
