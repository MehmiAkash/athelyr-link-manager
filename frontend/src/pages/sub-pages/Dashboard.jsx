import { useState } from "react";

import LinkTypeSwitch from "../../components/LinkTypeSwitch";
import CreateLink from "../../components/CreateLink";

function Dashboard() {

  const [linkType, setLinkType] = useState("short");

  return (

    <div className="w-full">

      <LinkTypeSwitch
        selected={linkType}
        onChange={setLinkType}
      />

      {linkType === "short" && (
        <CreateLink linktype={linkType}/>
      )}

      {linkType === "private" && (
         <CreateLink linktype={linkType}/>
      )}

    </div>

  );

}

export default Dashboard;