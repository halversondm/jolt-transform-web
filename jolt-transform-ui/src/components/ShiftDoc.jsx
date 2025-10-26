import React from "react";
import "./ShiftDoc.css";

const ShiftDoc = () => {
    return (<div>
            <h1>Shiftr JOLT Transform Documentation</h1>

            <p>Shiftr is a kind of JOLT transform that specifies where "data" from the input JSON should be placed in
                the output JSON, aka how the input JSON/data should be shifted around to make the output JSON/data.</p>

            <h2>Core Concept</h2>
            <p>At a base level, a single Shiftr "command" is a mapping from an input path to an output path, similar to
                the "mv" command in Unix, <code>mv /var/data/mysql/data /media/backup/mysql</code>.</p>

            <p>In Shiftr, the input path is a JSON tree structure, and the output path is flattened "dot notation" path
                notation.</p>

            <h2>Basic Example</h2>
            <p>Given this simple input JSON:</p>
            <pre>
{`{
    "rating": {
        "quality": {
            "value": 3,
            "max": 5
        }
    }
}`}
            </pre>

            <p>A simple Shiftr spec could be constructed by copying that input and modifying it to supply an output path
                for each piece of data:</p>
            <pre>
{`{
    "rating": {
        "quality": {
            "value": "SecondaryRatings.quality.Value",
            "max": "SecondaryRatings.quality.RatingRange"
        }
    }
}`}
            </pre>

            <p>This would produce the following output JSON:</p>
            <pre>
{`{
    "SecondaryRatings": {
        "quality": {
            "Value": 3,
            "RatingRange": 5
        }
    }
}`}
            </pre>

            <h2>Wildcards and Power</h2>
            <p>Shiftr specs can be entirely made up of literal string values, but its real power comes from its
                wildcards. Using wildcards, you can leverage the fact that you know, not just the data and its immediate
                key, but the whole input path to that data.</p>

            <h3>Expanded Example with Wildcards</h3>
            <p>Given this expanded input JSON:</p>
            <pre>
{`{
    "rating": {
        "primary": {
            "value": 3,
            "max": 5
        },
        "quality": {
            "value": 3,
            "max": 5
        },
        "sharpness": {
            "value": 7,
            "max": 10
        }
    }
}`}
            </pre>

            <p>The Spec would be:</p>
            <pre>
{`{
    "rating": {
        "primary": {
            "value": "Rating",
            "max": "RatingRange"
        },
        "*": {
            "value": "SecondaryRatings.&1.Value",
            "max": "SecondaryRatings.&1.Range",
            "$": "SecondaryRatings.&1.Id"
        }
    }
}`}
            </pre>

            <p>Yielding the following output:</p>
            <pre>
{`{
    "Rating": 3,
    "RatingRange": 5,
    "SecondaryRatings": {
        "quality": {
            "Range": 5,
            "Value": 3,
            "Id": "quality"
        },
        "sharpness": {
            "Range": 10,
            "Value": 7,
            "Id": "sharpness"
        }
    }
}`}
            </pre>

            <h2>Shiftr Wildcards</h2>

            <div className="wildcard">
                <h3>'*' Wildcard</h3>
                <p><strong>Valid only on the LHS (input JSON keys) side of a Shiftr Spec</strong></p>

                <h4>By itself:</h4>
                <p>The '*' wildcard by itself is useful for "templating" JSON maps, where each key/value has the same
                    "format".</p>

                <h4>As part of a key:</h4>
                <p>Useful for working with input JSON with keys that are "prefixed". For
                    example, <code>tag-*</code> would match both "tag-Pro" and "tag-Con", making the whole key and
                    "matched" part available to reference.</p>

                <div className="note">
                    <strong>Note:</strong> The '*' wildcard is as non-greedy as possible, so you can use more than one
                    '*' in a key. For example, <code>tag-*-*</code> would match "tag-Foo-Bar", making "tag-Foo-Bar",
                    "Foo", and "Bar" all available to reference.
                </div>
            </div>

            <div className="wildcard">
                <h3>'&' Wildcard</h3>
                <p><strong>Valid on both LHS and RHS</strong></p>
                <p>Means, dereference against a "path" to get a value and use that value as if it were a literal
                    key.</p>

                <h4>Canonical form:</h4>
                <p><code>&(0,0)</code> where the first parameter is where in the input path to look for a value, and the
                    second parameter is which part of the key to use (used with * key).</p>

                <h4>Syntactic sugar:</h4>
                <p><code>&</code> = <code>&0</code> = <code>&(0)</code> = <code>&(0,0)</code></p>

                <h4>Path lookup:</h4>
                <pre>
{`{
    "foo": {
        "bar": {
            "baz": // &0 = baz, &1 = bar, &2 = foo
        }
    }
}`}
                </pre>

                <h4>Subkey lookup:</h4>
                <p><code>tag-*-*</code> would match "tag-Foo-Bar", making:</p>
                <ul>
                    <li><code>&(0,0)</code> = "tag-Foo-Bar"</li>
                    <li><code>&(0,1)</code> = "Foo"</li>
                    <li><code>&(0,2)</code> = "Bar"</li>
                </ul>
            </div>

            <div className="wildcard">
                <h3>'$' Wildcard</h3>
                <p><strong>Valid only on the LHS</strong></p>
                <p>The existence of this wildcard reflects the fact that the "data" of the input JSON can be both in the
                    "values" and the "keys" of the input JSON.</p>

                <p>The '$' specifies that we want to use an input key, or input key derived value, as the data to be
                    placed in the output JSON.</p>

                <h4>Two useful cases:</h4>
                <ul>
                    <li>When a "key" in the input JSON needs to be an "id" value in the output JSON</li>
                    <li>You want to make a list of all the input keys</li>
                </ul>

                <h4>Example - List of input keys:</h4>
                <pre>
{`// input
{
    "rating": {
        "primary": {"value": 3, "max": 5},
        "quality": {"value": 3, "max": 7}
    }
}

// spec
{
    "rating": {
        "*": {
            "$": "ratings"
        }
    }
}

// output
{
    "ratings": ["primary", "quality"]
}`}
                </pre>
            </div>

            <div className="wildcard">
                <h3>'#' Wildcard</h3>
                <p><strong>Valid on both LHS and RHS</strong></p>
                <p>Allows you to specify a "synthetic" value, aka a value not found in the input data.</p>

                <h4>On the RHS:</h4>
                <p>Only valid in the context of an array, like <code>[#2]</code>. This means go up three levels and ask
                    that node how many matches it has had, then use that as an index in the array.</p>

                <h4>On the LHS:</h4>
                <p>Allows you to specify a hard coded String to be placed as a value in the output.</p>

                <h4>Example:</h4>
                <pre>
{`"hidden": {
    "true": {
        "#disabled": "clients.clientId"
    }
}`}
                </pre>
            </div>

            <div className="wildcard">
                <h3>'|' Wildcard</h3>
                <p><strong>Valid only on the LHS</strong></p>
                <p>This 'or' wildcard allows you to match multiple input keys. Useful if you don't always know exactly
                    what your input data will be.</p>

                <h4>Example:</h4>
                <pre>
{`{
    "rating|Rating": "rating-primary"
}`}
                </pre>
            </div>

            <div className="wildcard">
                <h3>'@' Wildcard</h3>
                <p><strong>Valid on both sides of the spec</strong></p>
                <p>This wildcard is necessary if you want to put both the input value and the input key somewhere in the
                    output JSON.</p>

                <h4>Basic usage:</h4>
                <pre>
{`{
    "foo": {
        "$": "place.to.put.key",
        "@": "place.to.put.value"
    }
}`}
                </pre>

                <h4>Advanced format:</h4>
                <p><code>@(3,title)</code> where "3" means go up the tree 3 levels and then lookup the key "title" and
                    use the value at that key.</p>
            </div>

            <h2>JSON Arrays</h2>
            <p>Reading from (input) and writing to (output) JSON Arrays is fully supported.</p>

            <h3>1. Handling Arrays in Input JSON</h3>
            <p>Shiftr treats JSON arrays in the input data as Maps with numeric keys.</p>
            <pre>
{`// input
{
    "Photos": ["AAA.jpg", "BBB.jpg"]
}

// spec
{
    "Photos": {
        "1": "photo-&-url"
    }
}

// output
{
    "photo-1-url": "BBB.jpg"
}`}
            </pre>

            <h3>2. Handling Arrays in Output JSON</h3>
            <p>Traditional array brackets, [ ], are used to specify array index in the output JSON. []'s are only valid
                on the RHS of the Shiftr spec.</p>
            <pre>
{`// input
{
    "photo-1-id": "327704",
    "photo-1-url": "http://bob.com/0001/327704/photo.jpg"
}

// spec
{
    "photo-1-id": "Photos[1].Id",
    "photo-1-url": "Photos[1].Url"
}

// output
{
    "Id": "327704",
    "Url": "http://bob.com/0001/327704/photo.jpg",
    "Photos": [
        null,
    ]
}`}
            </pre>

            <h3>3. JSON Arrays in the Spec File</h3>
            <p>JSON Arrays in Shiftr spec are used to specify that a piece of input data should be copied to two places
                in the output JSON.</p>
            <pre>
{`// input
{"foo": 3}

// spec
{"foo": ["bar", "baz"]}

// output
{
    "bar": 3,
    "baz": 3
}`}
            </pre>

            <h3>4. Implicit Array Creation in Output JSON</h3>
            <p>If a spec file is configured to output multiple pieces of data to the same output location, the output
                location will be turned into a JSON array.</p>
            <pre>
{`// input
{
    "foo": "bar",
    "tuna": "marlin"
}

// spec
{
    "foo": "baz",
    "tuna": "baz"
}

// output
{
    "baz": ["bar", "marlin"]
}`}
            </pre>
            <div className="note">
                <strong>Note:</strong> The order of this Array should not be relied upon.
            </div>

            <h2>Algorithm</h2>

            <h3>High Level</h3>
            <p>Walk the input data and Shiftr spec simultaneously, and execute the Shiftr command/mapping each time
                there is a match.</p>

            <h3>Low Level</h3>
            <p>Simultaneously walk the spec and input JSON, and maintain a walked "input" path data structure.</p>

            <p>Determine a match between input JSON key and LHS spec by matching LHS spec keys in the following
                order:</p>
            <ol>
                <li>Try to match the input key with "literal" spec key values</li>
                <li>If no literal match is found, try to match against LHS '&' computed values
                    <ul>
                        <li>For deterministic behavior, if there is more than one '&' LHS key, they are applied/matched
                            in alphabetical order, after the '&' syntactic sugar is replaced with its canonical form
                        </li>
                    </ul>
                </li>
                <li>If no match is found, try to match against LHS keys with '*' wildcard values
                    <ul>
                        <li>For deterministic behavior, '*' wildcard keys are sorted and applied/matched in alphabetical
                            order
                        </li>
                    </ul>
                </li>
            </ol>

            <div className="note">
                <strong>Note:</strong> Processing of the '@' and '$' LHS keys always occur if their parent's match, and
                do not block any other matching.
            </div>

            <h2>Implementation</h2>
            <p>Instances of this class execute Shiftr transformations given a transform spec of Jackson-style maps of
                maps and a Jackson-style map-of-maps input.</p>
        </div>);
}

export default ShiftDoc;
