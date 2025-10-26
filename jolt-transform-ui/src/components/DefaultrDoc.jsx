import React from "react";
import "./ShiftDoc.css";

const DefaultrDoc = () => {
    return (
        <div>
            <h1>Defaultr JOLT Transform Documentation</h1>
            <p>Defaultr is a kind of JOLT transform that applies default values in a non-destructive way.</p>

            <h2>Comparison with Shiftr</h2>
            <ul>
                <li>Shiftr walks the input data and asks its spec "Where should this go?"</li>
                <li>Defaultr walks the spec and asks "Does this exist in the data? If not, add it."</li>
            </ul>

            <h2>Example</h2>
            <p>Given input JSON like:</p>
            <pre>{`{
  "Rating":3,
  "SecondaryRatings":{
     "quality":{
        "Range":7,
        "Value":3,
        "Id":"quality"
     },
     "sharpness": {
        "Value":4,
        "Id":"sharpness"
     }
  }
}`}</pre>
            <p>With the desired output being:</p>
            <pre>{`{
  "Rating":3,
  "RatingRange" : 5,
  "SecondaryRatings":{
     "quality":{
        "Range":7,
        "Value":3,
        "Id":"quality",
        "ValueLabel": null,
        "Label": null,
        "MaxLabel": "Great",
        "MinLabel": "Terrible",
        "DisplayType": "NORMAL"
     },
     "sharpness": {
        "Range":5,
        "Value":4,
        "Id":"sharpness",
        "ValueLabel": null,
        "Label": null,
        "MaxLabel": "High",
        "MinLabel": "Low",
        "DisplayType": "NORMAL"
     }
  }
}`}</pre>
            <p>This is what the Defaultr Spec would look like:</p>
            <pre>{`{
  "RatingRange" : 5,
  "SecondaryRatings": {
    "quality|value" : {
       "ValueLabel": null,
       "Label": null,
       "MaxLabel": "Great",
       "MinLabel": "Terrible",
       "DisplayType": "NORMAL"
    },
    "*": {
       "Range" : 5,
       "ValueLabel": null,
       "Label": null,
       "MaxLabel": "High",
       "MinLabel": "Low",
       "DisplayType": "NORMAL"
    }
  }
}`}</pre>

            <h2>Spec File Format</h2>
            <p>The Spec file format for Defaultr is a tree of <code>Map&lt;String, Object&gt;</code> objects. Defaultr handles outputting of JSON Arrays via special wildcard in the Spec.</p>

            <h2>Defaultr Spec Wildcards and Flags</h2>
            <ul>
                <li><strong>"*" aka STAR</strong>: Apply these defaults to all input keys at this level</li>
                <li><strong>"|" aka OR</strong>: Apply these defaults to input keys, if they exist</li>
                <li><strong>"[]"</strong>: Signal to Defaultr that the data for this key should be an array. This means all defaultr keys below this entry have to be "integers".</li>
            </ul>

            <h3>Valid Array Specification</h3>
            <pre>{`{
  "photos[]" : {
    "2" : {
      "url" : "http://www.bazaarvoice.com",
      "caption" : ""
    }
  }
}`}</pre>
            <h3>Invalid Array Specification</h3>
            <pre>{`{
  "photos[]" : {
    "photo-id-1234" : {
      "url" : "http://www.bazaarvoice.com",
      "caption" : ""
    }
  }
}`}</pre>

            <h2>Algorithm</h2>
            <p>Defaultr walks its Spec in a depth first way. At each level in the Spec tree, Defaultr works from most specific to least specific Spec key:</p>
            <ul>
                <li>Literal key values</li>
                <li>"|", sub-sorted by how many or values there are, then alphabetically (for deterministic behavior)</li>
                <li>"*"</li>
            </ul>
            <p>At a given level in the Defaultr Spec tree, only literal keys force Defaultr to create new entries in the input data: either as a single literal value or adding new nested Array or Map objects. The wildcard operators are applied after the literal keys, and will not cause those keys to be added if they are not already present in the input document (either naturally or having been defaulted in from literal spec keys).</p>

            <h3>Algorithm Steps</h3>
            <ol>
                <li>Walk the spec</li>
                <li>For each literal key in the spec (specKey):
                    <ol type="a">
                        <li>If the specKey is a map or array, and the input is null, default an empty Map or Array into the output</li>
                        <li>Recurse on the literal spec</li>
                        <li>If the specKey is a map or array, and the input is not null, but of the "wrong" type, skip and do not recurse</li>
                        <li>If the specKey is a literal value, default the literal and value into the output and do not recurse</li>
                    </ol>
                </li>
                <li>For each wildcard in the spec:
                    <ol type="a">
                        <li>Find all keys from the defaultee that match the wildcard</li>
                        <li>Treat each key as a literal specKey</li>
                    </ol>
                </li>
            </ol>

            <h2>Corner Cases</h2>
            <div className="note">
                <p>Due to Defaultr's array syntax, we can't actually express that we expect the top level of the input to be an Array. The workaround for this is that we check the type of the object that is at the root level of the input. If it is a map, no problem. If it is an array, we treat the "root" level of the Defaultr spec, as if it were the child of an Array type Defaultr entry. To force unambiguity, Defaultr throws an Exception if the input is null.</p>
            </div>
        </div>
    );
}

export default DefaultrDoc;

