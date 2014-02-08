xmljs_trans_js
================

* Reads a JSON file and converts it to XML.
* Reads an XML file and converts it to JSON.

Why did you create this?
------------------------

I spent lot of time looking at JS to XML converters that would work without the browser. I found that each tool had its own way of doing things, but nothing that really mapped up to how I thought a converter should work.

I found [this website on utilities-online.info](http://www.utilities-online.info/xmltojson/) which is based off of [the objtree project](https://github.com/thatcher/jquery-objtree). Unfortunuely it was made for the browser, and won't work in node.

I found an online JSON to XML converter that I liked here: [http://www.freeformatter.com/json-to-xml-converter.html](http://www.freeformatter.com/json-to-xml-converter.html)

It assigns a name to entities inside of an array, which means that GeoJSON can easily be converted to XML, if GeoXML is your thing. (I don't think it is anyboby's thing, but the option is there!)

I thought, wouldn't it be great if I could find a library that would convert JSON into XML like that, but also convert it back to JSON. So after a lot of interweb searching, that's what I decided to do.

How is this different from [xmljs_translator](https://github.com/jimmyrocks/xmljs_translator)
-------------------------------------------
xml_translator uses the awesome library [libxmljs](https://github.com/polotek/libxmljs) to build XML and json. Unfortunately it doesn't work with Windows, and the current solution is to ["use something else"](https://github.com/polotek/libxmljs/issues/123#issuecomment-11554032). So I took that advice, and I did use something else.

* [node-xml2js](https://github.com/Leonidas-from-XIV/node-xml2js): The tool used to translate XML -> JSON
* [xmlbuilder](https://github.com/oozcitak/xmlbuilder-js): xml2js didn't cover everything I wanted out of a JS -> XML, but its dependence (xmlbuilder) can be coded to do what I wanted.

I am using xmljs_translator for a project the needs to run on a Windows server, so I needed to make this a little more friendly to our Window using friends.


What does this project do?
--------------------------
This project aims to convert JSON to XML and XML to JSON in a consistent manor.

Example:

This input from JavaScript

```
{root: {
    name: 'test JSON',
    arrays: [[1,2,3],[[4,7,8],5,6]],
    tags: [
      {'k': 'key1', 'v': 'value1'},
      {'k': 'key2', 'v': 'key2'},
    ]
  }
}
```

Becomes:

```
<?xml version="1.0" encoding="UTF-8"?>
<root name="test JSON">
  <arrays>
    <_element>1</_element>
    <_element>2</_element>
    <_element>3</_element>
  </arrays>
  <arrays>
    <_element>
      <_element>4</_element>
      <_element>7</_element>
      <_element>8</_element>
    </_element>
    <_element>5</_element>
    <_element>6</_element>
  </arrays>
  <tags k="key1" v="value1"/>
  <tags k="key2" v="key2"/>
</root>
```

Which gets translated to JSON as:

```
{"root": {
    "name": "test JSON",
    "arrays": [["1","2","3"],[["4","7","8"],"5","6"]],
    "tags": [
      {"k": "key1", "v": "value1"},
      {"k": "key2", "v": "key2"}
    ]
  }
}
```

Options
-------
These are the default options:
```
defaults = {
  'xmlRootElement': 'document',
  'textField': '_text',
  'arrayField': '_element',
  'cdataField': '_cdata',
  'breakOutSingleField': true,
  'alwaysUseRootElement': false
};
```

### xmlRootElement ###
An XML document has to have a single tag at its root, if your JS document has more than one root object, this will wrap it inside of another tag. Example

```
{
  "group1": {
    "name": "test1"
  },
  "group2": {
    "name": "test2"
  }
}
```

Becomes:

```
<?xml version="1.0" encoding="UTF-8"?>
<document>
  <group1 name="test1"/>
  <group2 name="test2"/>
</document>
```

### textField ###

It's easy to think of the text between tags as just another attribute, by naming it, we can define what is going to show up as the text field in the XML.

Example

```
{
  "group1": {
    "name": "test1"
  },
  "group2": {
    "name": "test2",
    "_text": "test3",
  }
}
```

Becomes:

```
<?xml version="1.0" encoding="UTF-8"?>
<document>
  <group1 name="test1"/>
  <group2 name="test2">test3</group2>
</document>
```


### arrayField ###
If there's an array in Javascript, there's no defined name for the tag. This option allows the user to set that name.

```
{"group1": {
    "data": ["1","2","3"]
}}
```
Becomes:

```
<?xml version="1.0" encoding="UTF-8"?>
<group1>
  <data>
    <_element>1</_element>
    <_element>2</_element>
    <_element>3</_element>
  </data>
</group1>
```
### cdataField ###
This works similarly to the textField, except it deals with cdata.  This functionality is still in testing.

### breakOutSingleField ###
This works on the Text, CData, and Array Element fields when translating back to JSON from XML. It is set to true by default, if it is changed to false, it will convert `{"_text": "value"}` to `"value"` and will do the same with CData and Array Elements.

### alwaysUseRootElement ###
This functionality is not implemented. The idea is that it will force wrapping the XML in the xmlRootElement even if there is only one root object in the input JSON.

Requirements
------------
This project requires libxmljs, which it uses to build and manipulate the XML files.
