import React, { useState } from "react";
import { Components } from "remoteApp/Components";
import { KuotaCuti1 } from "../json/DocsKuotaCuti1";
import { KuotaCuti2 } from "../json/DocsKuotaCuti2";
import { DateData } from "../json/DateData";
import { DataKuota } from "../json/DocsKuota";
import { DataCuti } from "../json/DocsCuti";
const Rating = () => {
  const [ratingValue, setRatingValue] = useState(1);

  return (
    <div>
      <Components.Navbar />
      <Components.Ratings value={ratingValue} />
      <Components.ArsipCuti />
      <Components.KuotaCutiSaatIni config1={KuotaCuti1} config2={KuotaCuti2} />
      <Components.ListDate config={DateData} />
      <Components.MonitoringKuota config={DataKuota} />
      <Components.StatusDokumenCutiDashboard config={DataCuti} />
    </div>
  );
};

export default Rating;
