import "./theme.css"

import "./ImageContent.css"

// TODO: Make this not awful
import fastapi2 from "../assets/fastapi2.png"
import goosebumps from "../assets/goosebumps.png"
import graph from "../assets/graph.svg"
import openapi1 from "../assets/openapi1.png"
import openapi2 from "../assets/openapi2.png"
import openapi3 from "../assets/openapi3.png"
import pydantic1 from "../assets/pydantic1.png"
import pydantic2 from "../assets/pydantic2.png"

function ImageContent({ slide }) {
    const images = {
        placeholder: "https://placehold.co/300",
        pydantic1,
        pydantic2,
        fastapi2,
        goosebumps,
        openapi1,
        openapi2,
        openapi3,
        graph,
    }

    return (
        <div id="comboDiv">
            <h1 className="title">{slide.title}</h1>
            <div id="imageContentPane">
                <img className="slideImage" src={images[slide.image]} alt={`Image for ${slide.title}`} />
            </div>
        </div>
    )
}

export default ImageContent