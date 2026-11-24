import "./theme.css"

import "./ComboContent.css"

// TODO: Make this not awful
import azure from "../assets/azure.png"
import bored from "../assets/bored.jpg"
import butwhy from "../assets/butwhy.jpg"
import dnd from "../assets/dnd.png"
import fastapi1 from "../assets/fastapi.svg"
import finches from "../assets/finches.jpg"
import goosebumps from "../assets/goosebumps.jpg"
import graph from "../assets/graph.svg"
import meta from "../assets/meta6.png"
import postqr from "../assets/postqr.svg"
import pydantic from "../assets/pydantic.svg"
import qr from "../assets/qr.svg"
import qrcode from "../assets/qrcode.png"
import sonic from "../assets/sonic.png"
import timflannery from "../assets/timflannery.jpg"

function ComboContent({ slide }) {
    const images = {
        placeholder: "https://placehold.co/300",
        goosebumps,
        fastapi1,
        pydantic,
        meta,
        qr,
        qrcode,
        azure,
        postqr,
        bored,
        butwhy,
        timflannery,
        finches,
        dnd,
        sonic,
        graph,
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