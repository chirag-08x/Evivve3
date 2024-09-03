export const LearnerActivationChecks = {
    id: "LEARNER_ACTIVATION",
    name: "Learner Activation",
    sublist: [
        {id: "WELCOME_MESSAGE", name: "Welcome Message", check: false},
        {id: "ACTIVATION_DURATION", name: "Acitvation Duration", check: false},
        {id: "QNA_DURATION", name: "Q&A Duration", check: false}
    ],
    check: false
};

export const StrategyPlanningChecks = {
    id: "STRATEGY_PLANNING",
    name: "Strategy & Planning",
    sublist: [
        {id: "DURATION", name: "Duration", check: false},
        {id: "SUBLIMINAL_MSGS", name: "Subliminal Messages", check: false}
    ],
    check: false
};

export const EvivveChecks = {
    id: "EVIVVE",
    name: "Evivve",
    sublist: [
        {id: "DURATION", name: "Duration", check: false},
        {id: "HEAD_START", name: "Head Start", check: false},
        {id: "CONSEQUENCE", name: "Consequence", check: false},
        {id: "OVERALL_DIFFICULTY", name: "Overall Difficulty", check: false},
        {id: "PACE", name: "Pace", check: false},
    ],
    check: false
};

export const ReflectionChecks = {
    id: "REFLECTION",
    name: "Reflection",
    sublist: [
        {id: "DURATION", name: "Duration", check: false},
        {id: "QUESTIONS", name: "Reflection Questions", check: false}
    ],
    check: false
};

export const DebriefChecks = {
    id: "DEBRIEF",
    name: "Debrief",
    sublist: [
        {id: "DURATION", name: "Duration", check: false},
        {id: "DEBRIEF_POINTS", name: "Debrief Points", check: false}
    ],
    check: false
};

export const FullChecklist = [
    LearnerActivationChecks,
    StrategyPlanningChecks,
    EvivveChecks,
    ReflectionChecks,
    DebriefChecks
];
