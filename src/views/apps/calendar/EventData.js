const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();
const d = today.getDate();

console.log("TODAY", today);

const Events = [
  {
    title: "Single event",
    start: new Date(y, m, 3),
    end: new Date(y, m, 3),
    color: "default",
  },
  {
    title: "Learn ReactJs",
    start: new Date(y, m, 10),
    end: new Date(y, m, 10),
    color: "green",
  },
  {
    title: "Launching MaterialArt Angular",
    start: new Date(y, m, 12),
    end: new Date(y, m, 12),
    color: "red",
  },
  {
    title: "Lunch with Mr.Raw",
    start: new Date(y, m, 15),
    end: new Date(y, m, 15),
    color: "azure",
  },
  {
    title: "Going For Party of Sahs",
    start: new Date(y, m, 17),
    end: new Date(y, m, 17),
    color: "azure",
  },
  {
    title: "Learn Ionic",
    start: new Date(y, m, 20),
    end: new Date(y, m, 20),
    color: "warning",
  },
  {
    title: "Research of making own Browser",
    start: new Date(y, m, 25),
    end: new Date(y, m, 25),
    color: "default",
  },
];

export default Events;
