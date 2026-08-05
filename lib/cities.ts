export interface City {
  id: string;
  name: string;
  short: string;
  x: number;
  y: number;
  desc: string;
  color: string;
}

export const CITIES: City[] = [
  {
    id: "gz",
    name: "广州",
    short: "GZ",
    x: 470,
    y: 170,
    desc: "千年商都，珠水长流。赛龙舟的传统在这里传承两千年。",
    color: "#ff2d55",
  },
  {
    id: "sz",
    name: "深圳",
    short: "SZ",
    x: 660,
    y: 370,
    desc: "年轻之城，最快的桨。本土龙舟联赛一年上百场。",
    color: "#00e5ff",
  },
  {
    id: "zh",
    name: "珠海",
    short: "ZH",
    x: 505,
    y: 440,
    desc: "百岛之市，湾区西岸门户，横琴就在这里。",
    color: "#ff9ad5",
  },
  {
    id: "fs",
    name: "佛山",
    short: "FS",
    x: 400,
    y: 240,
    desc: "岭南龙舟之乡，叠滘龙船漂移闻名全国。",
    color: "#ffa52c",
  },
  {
    id: "hz",
    name: "惠州",
    short: "HZ",
    x: 680,
    y: 150,
    desc: "东坡渡海处，东江入海前最后一座城市。",
    color: "#fee100",
  },
  {
    id: "dg",
    name: "东莞",
    short: "DG",
    x: 585,
    y: 265,
    desc: "制造业之都，也造最快的龙舟。",
    color: "#ff9ad5",
  },
  {
    id: "zs",
    name: "中山",
    short: "ZS",
    x: 450,
    y: 350,
    desc: "伟人故里，香山咸水歌里藏着百年龙舟记忆。",
    color: "#00e5ff",
  },
  {
    id: "jm",
    name: "江门",
    short: "JM",
    x: 315,
    y: 370,
    desc: "侨乡西江岸，龙舟与碉楼一样古老。",
    color: "#ff2d55",
  },
  {
    id: "zq",
    name: "肇庆",
    short: "ZQ",
    x: 175,
    y: 150,
    desc: "西江源头的文化重镇，端州古韵中的龙舟乡。",
    color: "#ffa52c",
  },
  {
    id: "hk",
    name: "香港",
    short: "HK",
    x: 760,
    y: 420,
    desc: "维多利亚港的赤柱国际龙舟赛，全球顶级。",
    color: "#fee100",
  },
  {
    id: "macau",
    name: "澳门",
    short: "MO",
    x: 615,
    y: 490,
    desc: "南湾湖上的国际龙舟赛，中西交融的竞渡。",
    color: "#00e5ff",
  },
];

export const HENGQIN = { x: 548, y: 468, name: "横琴" };

export const PEARL_CITIES = [
  "广州",
  "深圳",
  "珠海",
  "佛山",
  "惠州",
  "东莞",
  "中山",
  "江门",
  "肇庆",
];

export const TITLES: { min: number; name: string; emoji: string }[] = [
  { min: 1200, name: "大湾区龙舟王", emoji: "👑" },
  { min: 900, name: "湾区全明星预备役", emoji: "⭐" },
  { min: 600, name: "珠江弄潮儿", emoji: "🌊" },
  { min: 350, name: "湾区新桨手", emoji: "🚣" },
  { min: 0, name: "珠江探索者", emoji: "🧭" },
];

export function titleFor(score: number): { name: string; emoji: string } {
  return TITLES.find((t) => score >= t.min) ?? TITLES[TITLES.length - 1];
}

export function cityColor(id: string): string {
  return CITIES.find((c) => c.id === id)?.color ?? "#fee100";
}
