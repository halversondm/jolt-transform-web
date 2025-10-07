import React from "react";
import "./ShiftDoc.css";

function RemovrDoc() {
    return (
        <div>
            <h1>Removr JOLT Transform Documentation</h1>
            <p>Removr is a kind of JOLT transform that removes content from the input JSON.</p>

            <h2>Comparison with Other Transforms</h2>
            <ul>
                <li>Shiftr walks the input data and asks its spec "Where should this go?"</li>
                <li>Defaultr walks the spec and asks "Does this exist in the data? If not, add it."</li>
                <li>Removr walks the spec and asks "If this exists, remove it."</li>
            </ul>

            <h2>Example</h2>
            <p>Given input JSON like:</p>
            <pre>{`{
  "~emVersion" : "2",
  "id":"123124",
  "productId":"31231231",
  "submissionId":"34343",
  "this" : "stays",
  "configured" : {
    "a" : "b",
    "c" : "d"
  }
}`}</pre>
            <p>With the desired output being:</p>
            <pre>{`{
  "id":"123124",
  "this" : "stays",
  "configured" : {
    "a" : "b"
  }
}`}</pre>
            <p>This is what the Removr Spec would look like:</p>
            <pre>{`{
  "~emVersion" : "",
  "productId":"",
  "submissionId":"",
  "configured" : {
    "c" : ""
  }
}`}</pre>

            <h2>Removr Wildcards</h2>
            <div className="wildcard">
                <h3>'*' Wildcard</h3>
                <p><strong>Valid only on the LHS (input JSON keys) side of a Removr Spec</strong></p>
                <p>The '*' wildcard can be used by itself or to match part of a key.</p>
                <h4>By itself:</h4>
                <p>To remove all keys under an input, use '*' by itself on the LHS.</p>
                <pre>{`// example input
{
 "ratings":{
    "Set1":{
       "a":"a",
       "b":"b"
    },
    "Set2":{
        "c":"c",
        "b":"b"
    }
  },
}
//desired output
{
 "ratings":{
    "Set1":{
       "a":"a"
    },
    "Set2":{
        "c":"c"
    }
  },
}
//Spec would be
{
 "ratings":{
    "*":{
      "b":""
    },
  },
}`}</pre>
                <p>In this example, "Set1" and "Set2" under ratings both have the same structure, and thus we can use the '*' to write compact rules to remove "b" from all children under ratings. This is especially useful when we don't know how many children will be under ratings, but we would like to remove certain parts across all.</p>
                <h4>As part of a key:</h4>
                <p>Useful for working with input JSON with keys that are prefixed. For example, if you had an input document like:</p>
                <pre>{`{
 "ratings_legacy":{
      "Set1":{
          "a":"a",
          "b":"b"
        },
      "Set2":{
          "a":"a",
           "b":"b"
       }
   },
 "ratings_new":{
       "Set1":{
           "a":"a",
           "b":"b"
       },
       "Set2":{
           "a":"a",
           "b":"b"
       }
  }
}`}</pre>
                <p>A 'ratings_*' would match both keys. As in Shiftr wildcard matching, * wildcard is as non-greedy as possible, which enables us to give more than one * in a key.</p>
                <p>For an output that removed Set1 from all ratings_* keys, the spec would be:</p>
                <pre>{`{
 "ratings_*":{
      "Set1":""
 }
}`}</pre>
            </div>

            <h2>Arrays</h2>
            <p>Removr can also handle data in Arrays. It can walk through all the elements of an array with the '*' wildcard.</p>
            <p>Additionally, it can remove individual array indices. To do this the LHS key must be a number but in String format.</p>
            <p>Example:</p>
            <pre>{`"spec": {
  "array": {
    "0" : ""
  }
}`}</pre>
            <p>In this case, Removr will remove the zero-th item from the input "array", which will cause data at index "1" to become the new "0". Because of this, Removr matches all the literal/explicit indices first, sorts them from Biggest to Smallest, then does the removing.</p>
        </div>
    );
}

export default RemovrDoc;

