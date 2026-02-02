import book from "/book.svg";

import React from "react";
import css from "./Osdk.module.css";

function Osdk(): React.ReactElement {
  return (
    <div className={css.osdk}>
      <div>
        <span>OSDK: </span>
        <span className={css.tag}>@prototipometricasvalencia-application/sdk</span>
      </div>
      <a
        href="https://eysa.palantirfoundry.com/workspace/developer-console/app/ri.third-party-applications.main.application.4ca218fd-19ee-4ac0-a086-745b65ecee14/docs/guide/loading-data?language=typescript"
        className={css.docs}
        target="_blank"
        rel="noreferrer"
      >
        <img src={book} width={16} height={16} alt="Book icon"></img>
        <span>View documentation</span>
      </a>
    </div>
  );
}

export default Osdk;
