import React from "react";
import "./ShiftDoc.css";

function CardinalityDoc() {
    return (
        <div>
            <h1>CardinalityTransform JOLT Transform Documentation</h1>
            <p>The CardinalityTransform changes the cardinality of input JSON data elements. The impetus for the CardinalityTransform was to deal with data sources that are inconsistent with respect to the cardinality of their returned data.</p>

            <h2>Example: Photos Element</h2>
            <p>For example, say you know that there will be a "photos" element in a document. If your underlying data source is trying to be nice, it may adjust the "type" of the photos element, depending on how many photos there actually are.</p>
            <p>Single photo:</p>
            <pre>{`"photos" : { "url" : "pants.com/1.jpg" }  // photos element is a "single" map entry`}</pre>
            <p>Or multiple photos:</p>
            <pre>{`"photos" : [
   { "url" : "pants.com/1.jpg" },
   { "url" : "pants.com/2.jpg" }
]`}</pre>
            <p>The Shiftr and Defaultr transforms can't handle that variability, so the CardinalityTransform was created to "fix" the document, so that the rest of the transforms can <em>assume</em> "photos" will be an Array.</p>

            <h2>Cardinality Command</h2>
            <p>At a base level, a single Cardinality "command" maps data into a "ONE" or "MANY" state.</p>
            <p>The idea is that you can start with a copy of your JSON input and modify it into a Cardinality spec by specifying a "cardinality" for each piece of data that you care about changing in the output. Input data that are not called out in the spec will remain in the output unchanged.</p>

            <h2>Simple Example</h2>
            <p>Given this simple input JSON:</p>
            <pre>{`{
  "review" : {
    "rating" : [ 5, 4 ]
  }
}`}</pre>
            <p>A simple Cardinality spec could be constructed by specifying that the "rating" should be a single value:</p>
            <pre>{`{
  "review" : {
    "rating" : "ONE"
  }
}`}</pre>
            <p>Would produce the following output JSON:</p>
            <pre>{`{
  "review" : {
    "rating" : 5
  }
}`}</pre>
            <p>In this case, we turn the array "[ 5, 4 ]" into a single value by pulling the first index of the array. Hence, the output has "rating : 5".</p>

            <h2>Valid Cardinality Values (RHS)</h2>
            <ul>
                <li><strong>ONE</strong>: If the input value is a List, grab the first element in that list, and set it as the data for that element. For all other input value types, no-op.</li>
                <li><strong>MANY</strong>: If the input is not a List, make a list and set the first element to be the input value. If the input is "null", make it be an empty list. If the input is a list, no-op.</li>
            </ul>

            <h2>Cardinality Wildcards</h2>
            <p>Cardinality specs can be entirely made up of literal string values, but wildcards similar to some of those used by Shiftr can be used.</p>
            <h3>* Wildcard</h3>
            <p>Valid only on the LHS (input JSON keys) side of a Cardinality Spec. Unlike shiftr, the '*' wildcard can only be used by itself. It can be used to achieve a for/each manner of processing input.</p>
            <p>Example input:</p>
            <pre>{`{
  "photosArray" : [
    {
      "url" :  [ "http://pants.com/123-normal.jpg", "http://pants.com/123-thumbnail.jpg" ],
      "caption" : "Nice pants"
    },
    {
      "url" :  [ "http://pants.com/123-thumbnail.jpg", "http://pants.com/123-normal.jpg" ],
      "caption" : "Nice pants"
    }
  ]
}`}</pre>
            <p>Spec:</p>
            <pre>{`{
  "photosArray" : {
    "*" : { // for each item in the array
      "url" : "ONE"   // url should be singular
    }
  }
}`}</pre>
            <p>Output:</p>
            <pre>{`{
  "photosArray" : [
    {
      "url" :  "http://pants.com/123-normal.jpg",
      "caption" : "Nice pants"
    },
    {
      "url" :  "http://pants.com/123-thumbnail.jpg",
      "caption" : "Nice pants"
    }
  ]
}`}</pre>

            <h3>@ Wildcard</h3>
            <p>Valid only on the LHS of the spec. This wildcard should be used when content nested within modified content needs to be modified as well.</p>
            <p>Example input:</p>
            <pre>{`{
  "views" : [
    { "count" : 1024 },
    { "count" : 2048 }
  ],
}`}</pre>
            <p>Spec:</p>
            <pre>{`{
  "views" : {
    "@" : "ONE",
    "count" : "MANY"
  }
}`}</pre>
            <p>Output:</p>
            <pre>{`{
  "views" : {
    "count" : [ 1024 ]
  }
}`}</pre>

            <h2>Cardinality Logic Table</h2>
            <pre>{`INPUT   CARDINALITY  OUTPUT   NOTE
String  ONE          String   no-op
Number  ONE          Number   no-op
Boolean ONE          Map      no-op
Map     ONE          Map      no-op
List    ONE          [0]      use whatever the first item in the list was
String  MANY         List     make the input String, be [0] in a new list
Number  MANY         List     make the input Number, be [0] in a new list
Boolean MANY         List     make the input Boolean, be [0] in a new list
Map     MANY         List     make the input Map, be [0] in a new list
List    MANY         List     no-op`}</pre>
        </div>
    );
}

export default CardinalityDoc;

