import "./theme.css"

import "./ImageContent.css"

// TODO: Make this not awful
import pydantic1 from "../assets/pydantic1.png"
import pydantic2 from "../assets/pydantic2.png"

function ImageContent({ slide }) {
    const images = {
        placeholder: "https://placehold.co/300",
        pydantic1,
        pydantic2
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