import {
  BuyIcon,
  ChiefIcon,
  TipsIcon,
  TribeIcon,
  HarvestIcon,
  MineIcon,
} from "src/assets/images/present";

//Poor use of module names
//Module names are being used to handle reload functionality
//Temporary fix, update the way this is handled in present mode
export const MODULE_TYPE = {
  loading_module: "Loading Module",
  "learner/activation": "Activation",
  "strategy&planning": "Forecasting",
  evivve: "Experimentation",
  debrief: "Learning",
  reflection: "Reflection",
};

export const PROGRAM_STEP = {
  BEGIN: {
    module: 0,
  },
  WELCOME: {
    type: MODULE_TYPE["learner/activation"],
    module: 1,
    screen: 1,
  },
  AC_BRIEFING: {
    type: MODULE_TYPE["learner/activation"],
    module: 1,
    screen: 2,
  },
  AC_VIDEO: {
    type: MODULE_TYPE["learner/activation"],
    module: 1,
    screen: 3,
  },
  AC_INSTALL: {
    type: MODULE_TYPE["learner/activation"],
    module: 1,
    screen: 4,
  },
  AC_QNA: {
    type: MODULE_TYPE["learner/activation"],
    module: 1,
    screen: 5,
  },

  STRATEGY_PLANNING: {
    module: 2,
  },

  EV_LAUNCH: {
    type: MODULE_TYPE.evivve,
    module: 3,
    screen: 1,
  },
  EV_PLAYER_CONSOLE: {
    type: MODULE_TYPE.evivve,
    module: 3,
    screen: 2,
  },
  EV_ADMIN_PANEL: {
    type: MODULE_TYPE.evivve,
    module: 3,
    screen: 4,
  },

  REFLECTION: {
    module: 4,
  },

  DEBRIEF: {
    module: 5,
  },
};

export const LEARNING_GUIDE_BTNS = [
  {
    id: 0,
    name: "Overview",
    subBtns: [{ title: "Overview", icon: TipsIcon }],
  },
  {
    id: 1,
    name: "Buy Lands",
    subBtns: [
      {
        title: "Buy Lands",
        icon: BuyIcon,
      },
      {
        title: "Buying Tips",
        icon: TipsIcon,
      },
    ],
  },
  {
    id: 2,
    name: "Harvest Lands",
    subBtns: [
      {
        title: "Harvest Land",
        icon: HarvestIcon,
      },
      {
        title: "Harvesting Tips",
        icon: TipsIcon,
      },
    ],
  },
  {
    id: 3,
    name: "Trade Resources",
    subBtns: [
      {
        title: "Trade with Chief",
        icon: ChiefIcon,
      },
      {
        title: "Trade with Tribe",
        icon: TribeIcon,
      },
      {
        title: "Trading Tip",
        icon: TipsIcon,
      },
    ],
  },
  {
    id: 4,
    name: "Mine Movilenniums",
    subBtns: [
      {
        title: "Mine Movilenniums",
        icon: MineIcon,
      },
      {
        title: "Mining Tip",
        icon: TipsIcon,
      },
    ],
  },
  {
    id: 5,
    name: "Conclusion",
    subBtns: [
      {
        title: "Conclusion",
        icon: TipsIcon,
      },
    ],
  },
  {
    id: 6,
    name: "Close",
  },
];
