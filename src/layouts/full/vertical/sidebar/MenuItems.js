import {
  IconHome,
  IconFlag,
  IconCheckbox,
  IconUsers,
  IconHelp,
  IconSettings,
  IconLayoutBoardSplit,
} from "@tabler/icons";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconHome,
    href: "/dashboard",
  },
  {
    id: uniqueId(),
    title: "Programs",
    icon: IconLayoutBoardSplit,
    href: "/programs",
  },
  {
    id: uniqueId(),
    title: "Learn",
    icon: IconCheckbox,
    href: "/learn",
  },
  // {
  //   id: uniqueId(),
  //   title: "Transactions",
  //   icon: IconFlag,
  //   href: "/transactions",
  // },
  {
    id: uniqueId(),
    title: "Community",
    icon: IconUsers,
    href: "/community",
  },
  {
    id: uniqueId(),
    title: "Support",
    icon: IconHelp,
    href: "/support",
  },
  {
    id: uniqueId(),
    title: "Settings",
    icon: IconSettings,
    href: "/settings",
  },
];

export default Menuitems;
