import React from "react";
import "./ShiftDoc.css";

const SortDoc = () => {

    return (
        <div>
            <p>
                Recursively sorts all maps within a JSON object into new sorted LinkedHashMaps so that serialized
                representations are deterministic. Useful for debugging and making test fixtures.

                Note this will make a copy of the input Map and List objects.

                The sort order is standard alphabetical ascending, with a special case for "~" prefixed keys to be
                bumped to the top.
            </p>
        </div>
    )
}

export default SortDoc;