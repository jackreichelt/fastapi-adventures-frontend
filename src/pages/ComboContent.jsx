import "./theme.css"

import "./ComboContent.css"

// TODO: Make this not awful
import azure from "../assets/azure.png"
import fastapi1 from "../assets/fastapi.svg"
import goosebumps from "../assets/goosebumps.jpg"
import meta from "../assets/meta6.png"
import pydantic from "../assets/pydantic.svg"
import qr from "../assets/qr.svg"

function ComboContent({ slide }) {
    const images = {
        placeholder: "https://placehold.co/300",
        goosebumps,
        fastapi1,
        pydantic,
        meta,
        qr,
        azure,
    }

    return (
        <div id="comboDiv">
            <h1 className="title">{slide.title}</h1>
            <div id="splitContentPane">
                <ul className="slideText">
                    {slide.contents.map((bulletPoint, key) => {
                        return (
                            <li key={key}>
                                {bulletPoint}
                            </li>
                        )
                    })}
                </ul>
                <div className="imageContainerDiv">
                    <img className="slideImage" src={images[slide.image]} alt={`Image for ${slide.title}`} />
                </div>
            </div>
        </div>
    )
}

export default ComboContent