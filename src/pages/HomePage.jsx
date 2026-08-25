
import "./theme.css"

import "./HomePage.css"

import HostSessionForm from "../components/HostSessionForm"
import JoinSessionForm from "../components/JoinSessionForm"

function HomePage() {


    return (
        <div id="">
            <JoinSessionForm />

            <HostSessionForm />
        </div>
    )
};

export default HomePage