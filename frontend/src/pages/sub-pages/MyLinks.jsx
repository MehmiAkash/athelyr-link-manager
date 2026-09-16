import { useState } from "react";
import LinkTypeSwitch from "../../components/LinkTypeSwitch";
import LinkTable from "../../components/LinkTable";

function MyLinks() {

    const [linkType, setLinkType] = useState("short");

    return (
        <div className="w-full">

            <LinkTypeSwitch
                selected={linkType}
                onChange={setLinkType}
            />

            {linkType === "short" && (
                <LinkTable
                    linktype={linkType}
                />
            )}

            {linkType === "private" && (
                <LinkTable
                    linktype={linkType}
                />
            )}

        </div>
    );
}

export default MyLinks;