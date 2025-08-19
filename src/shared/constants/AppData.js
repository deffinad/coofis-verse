import { generateRandomId } from "../utils/utility";

import { DataCuti } from "../../json/DocsCuti";
import { DataKuota } from "../../json/DocsKuota";
import { DateData } from "../../json/DateData";
import { KuotaCuti1 } from "../../json/DocsKuotaCuti1";
import { KuotaCuti2 } from "../../json/DocsKuotaCuti2";

export const logoData = {
  imageUrl: "https://i.ibb.co/Vt4V2Vw/image.png",
  altText: "Coofis Verse Logo",
};

export const componentAttributes = {
  Navbar: {
    id: `component${generateRandomId()}`,
    name: "Navbar",
    properties: {
      title: "My Website",
      backgroundColor: "#ffffff",
      textColor: "#333333",
      activeTextColor: "#007bff",
    },
  },
  CustomCard: {
    id: `component${generateRandomId()}`,
    name: "CustomCard",
    properties: {
      mainTitle: "Card Title",
      description: "Card description text",
      buttonText: "Learn More",
    },
  },
  // ArsipCuti: {
  //   id: `component${generateRandomId()}`,
  //   name: "ArsipCuti",
  //   properties: {},
  // },
  // KuotaCutiSaatIni: {
  //   id: `component${generateRandomId()}`,
  //   name: "KuotaCutiSaatIni",
  //   properties: { config1: KuotaCuti1, config2: KuotaCuti2 },
  // },
  // ListDate: {
  //   id: `component${generateRandomId()}`,
  //   name: "ListDate",
  //   properties: { config: DateData },
  // },
  // MonitoringKuota: {
  //   id: `component${generateRandomId()}`,
  //   name: "MonitoringKuota",
  //   properties: { config: DataKuota },
  // },
  // StatusDokumenCutiDashboard: {
  //   id: `component${generateRandomId()}`,
  //   name: "StatusDokumenCutiDashboard",
  //   properties: { config: DataCuti },
  // },
};

/**
 * Sections for the components accordion in the LeftMenu.
 */
export const SECTION_COMPONENTS = [
  { title: "Layout" },
  { title: "Widget" },
];

/**
 * List of draggable widget components available in the LeftMenu.
 */
export const WIDGET_COMPONENTS = [
  "CustomCard",
  "Navbar",
  // "ArsipCuti",
  // "KuotaCutiSaatIni",
  // "ListDate",
  // "MonitoringKuota",
  // "StatusDokumenCutiDashboard",
];
