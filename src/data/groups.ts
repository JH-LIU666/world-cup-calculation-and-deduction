import type { Match } from '../types/worldcup';

export interface GroupTeam {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  teams: GroupTeam[];
  matches: Match[];
}

// ──────────────── A 组 ────────────────
const groupA: Group = {
  id: 'A', name: 'A 组',
  teams: [
    { id: 'mex', name: '墨西哥' },
    { id: 'rsa', name: '南非' },
    { id: 'kor', name: '韩国' },
    { id: 'cze', name: '捷克' },
  ],
  matches: [
    { id: 'A-M1', teamA: 'mex', teamB: 'rsa', result: null, date: '6月12日', time: '03:00' },
    { id: 'A-M2', teamA: 'kor', teamB: 'cze', result: null, date: '6月12日', time: '10:00' },
    { id: 'A-M3', teamA: 'cze', teamB: 'rsa', result: null, date: '6月19日', time: '00:00' },
    { id: 'A-M4', teamA: 'mex', teamB: 'kor', result: null, date: '6月19日', time: '09:00' },
    { id: 'A-M5', teamA: 'cze', teamB: 'mex', result: null, date: '6月25日', time: '09:00' },
    { id: 'A-M6', teamA: 'rsa', teamB: 'kor', result: null, date: '6月25日', time: '09:00' },
  ],
};

// ──────────────── B 组 ────────────────
const groupB: Group = {
  id: 'B', name: 'B 组',
  teams: [
    { id: 'can', name: '加拿大' },
    { id: 'bih', name: '波黑' },
    { id: 'qat', name: '卡塔尔' },
    { id: 'sui', name: '瑞士' },
  ],
  matches: [
    { id: 'B-M1', teamA: 'can', teamB: 'bih', result: null, date: '6月13日', time: '03:00' },
    { id: 'B-M2', teamA: 'qat', teamB: 'sui', result: null, date: '6月14日', time: '03:00' },
    { id: 'B-M3', teamA: 'sui', teamB: 'bih', result: null, date: '6月19日', time: '03:00' },
    { id: 'B-M4', teamA: 'can', teamB: 'qat', result: null, date: '6月19日', time: '06:00' },
    { id: 'B-M5', teamA: 'sui', teamB: 'can', result: null, date: '6月25日', time: '03:00' },
    { id: 'B-M6', teamA: 'bih', teamB: 'qat', result: null, date: '6月25日', time: '03:00' },
  ],
};

// ──────────────── C 组 ────────────────
const groupC: Group = {
  id: 'C', name: 'C 组',
  teams: [
    { id: 'bra', name: '巴西' },
    { id: 'mar', name: '摩洛哥' },
    { id: 'hai', name: '海地' },
    { id: 'sco', name: '苏格兰' },
  ],
  matches: [
    { id: 'C-M1', teamA: 'bra', teamB: 'mar', result: null, date: '6月14日', time: '06:00' },
    { id: 'C-M2', teamA: 'hai', teamB: 'sco', result: null, date: '6月14日', time: '09:00' },
    { id: 'C-M3', teamA: 'sco', teamB: 'mar', result: null, date: '6月20日', time: '06:00' },
    { id: 'C-M4', teamA: 'bra', teamB: 'hai', result: null, date: '6月20日', time: '09:00' },
    { id: 'C-M5', teamA: 'sco', teamB: 'bra', result: null, date: '6月25日', time: '06:00' },
    { id: 'C-M6', teamA: 'mar', teamB: 'hai', result: null, date: '6月25日', time: '06:00' },
  ],
};

// ──────────────── D 组 ────────────────
const groupD: Group = {
  id: 'D', name: 'D 组',
  teams: [
    { id: 'usa', name: '美国' },
    { id: 'par', name: '巴拉圭' },
    { id: 'aus', name: '澳大利亚' },
    { id: 'tur', name: '土耳其' },
  ],
  matches: [
    { id: 'D-M1', teamA: 'usa', teamB: 'par', result: null, date: '6月13日', time: '09:00' },
    { id: 'D-M2', teamA: 'aus', teamB: 'tur', result: null, date: '6月14日', time: '12:00' },
    { id: 'D-M3', teamA: 'usa', teamB: 'aus', result: null, date: '6月20日', time: '03:00' },
    { id: 'D-M4', teamA: 'tur', teamB: 'par', result: null, date: '6月20日', time: '12:00' },
    { id: 'D-M5', teamA: 'tur', teamB: 'usa', result: null, date: '6月26日', time: '10:00' },
    { id: 'D-M6', teamA: 'par', teamB: 'aus', result: null, date: '6月26日', time: '10:00' },
  ],
};

// ──────────────── E 组 ────────────────
const groupE: Group = {
  id: 'E', name: 'E 组',
  teams: [
    { id: 'ger', name: '德国' },
    { id: 'cuw', name: '库拉索' },
    { id: 'civ', name: '科特迪瓦' },
    { id: 'ecu', name: '厄瓜多尔' },
  ],
  matches: [
    { id: 'E-M1', teamA: 'ger', teamB: 'cuw', result: null, date: '6月15日', time: '01:00' },
    { id: 'E-M2', teamA: 'civ', teamB: 'ecu', result: null, date: '6月15日', time: '07:00' },
    { id: 'E-M3', teamA: 'ger', teamB: 'civ', result: null, date: '6月21日', time: '04:00' },
    { id: 'E-M4', teamA: 'ecu', teamB: 'cuw', result: null, date: '6月21日', time: '08:00' },
    { id: 'E-M5', teamA: 'ecu', teamB: 'ger', result: null, date: '6月26日', time: '04:00' },
    { id: 'E-M6', teamA: 'cuw', teamB: 'civ', result: null, date: '6月26日', time: '04:00' },
  ],
};

// ──────────────── F 组 ────────────────
const groupF: Group = {
  id: 'F', name: 'F 组',
  teams: [
    { id: 'ned', name: '荷兰' },
    { id: 'jpn', name: '日本' },
    { id: 'swe', name: '瑞典' },
    { id: 'tun', name: '突尼斯' },
  ],
  matches: [
    { id: 'F-M1', teamA: 'ned', teamB: 'jpn', result: null, date: '6月15日', time: '04:00' },
    { id: 'F-M2', teamA: 'swe', teamB: 'tun', result: null, date: '6月15日', time: '10:00' },
    { id: 'F-M3', teamA: 'ned', teamB: 'swe', result: null, date: '6月21日', time: '01:00' },
    { id: 'F-M4', teamA: 'tun', teamB: 'jpn', result: null, date: '6月21日', time: '12:00' },
    { id: 'F-M5', teamA: 'jpn', teamB: 'swe', result: null, date: '6月26日', time: '07:00' },
    { id: 'F-M6', teamA: 'tun', teamB: 'ned', result: null, date: '6月26日', time: '07:00' },
  ],
};

// ──────────────── G 组 ────────────────
const groupG: Group = {
  id: 'G', name: 'G 组',
  teams: [
    { id: 'bel', name: '比利时' },
    { id: 'egy', name: '埃及' },
    { id: 'irn', name: '伊朗' },
    { id: 'nzl', name: '新西兰' },
  ],
  matches: [
    { id: 'G-M1', teamA: 'bel', teamB: 'egy', result: null, date: '6月16日', time: '03:00' },
    { id: 'G-M2', teamA: 'irn', teamB: 'nzl', result: null, date: '6月16日', time: '09:00' },
    { id: 'G-M3', teamA: 'bel', teamB: 'irn', result: null, date: '6月22日', time: '03:00' },
    { id: 'G-M4', teamA: 'nzl', teamB: 'egy', result: null, date: '6月22日', time: '09:00' },
    { id: 'G-M5', teamA: 'egy', teamB: 'irn', result: null, date: '6月27日', time: '11:00' },
    { id: 'G-M6', teamA: 'nzl', teamB: 'bel', result: null, date: '6月27日', time: '11:00' },
  ],
};

// ──────────────── H 组 ────────────────
const groupH: Group = {
  id: 'H', name: 'H 组',
  teams: [
    { id: 'esp', name: '西班牙' },
    { id: 'cpv', name: '佛得角' },
    { id: 'ksa', name: '沙特' },
    { id: 'uru', name: '乌拉圭' },
  ],
  matches: [
    { id: 'H-M1', teamA: 'esp', teamB: 'cpv', result: null, date: '6月16日', time: '00:00' },
    { id: 'H-M2', teamA: 'ksa', teamB: 'uru', result: null, date: '6月16日', time: '06:00' },
    { id: 'H-M3', teamA: 'esp', teamB: 'ksa', result: null, date: '6月22日', time: '00:00' },
    { id: 'H-M4', teamA: 'uru', teamB: 'cpv', result: null, date: '6月22日', time: '06:00' },
    { id: 'H-M5', teamA: 'cpv', teamB: 'ksa', result: null, date: '6月27日', time: '08:00' },
    { id: 'H-M6', teamA: 'uru', teamB: 'esp', result: null, date: '6月27日', time: '08:00' },
  ],
};

// ──────────────── I 组 ────────────────
const groupI: Group = {
  id: 'I', name: 'I 组',
  teams: [
    { id: 'fra', name: '法国' },
    { id: 'sen', name: '塞内加尔' },
    { id: 'irq', name: '伊拉克' },
    { id: 'nor', name: '挪威' },
  ],
  matches: [
    { id: 'I-M1', teamA: 'fra', teamB: 'sen', result: null, date: '6月17日', time: '03:00' },
    { id: 'I-M2', teamA: 'irq', teamB: 'nor', result: null, date: '6月17日', time: '06:00' },
    { id: 'I-M3', teamA: 'fra', teamB: 'irq', result: null, date: '6月23日', time: '05:00' },
    { id: 'I-M4', teamA: 'nor', teamB: 'sen', result: null, date: '6月23日', time: '08:00' },
    { id: 'I-M5', teamA: 'nor', teamB: 'fra', result: null, date: '6月27日', time: '03:00' },
    { id: 'I-M6', teamA: 'sen', teamB: 'irq', result: null, date: '6月27日', time: '03:00' },
  ],
};

// ──────────────── J 组 ────────────────
const groupJ: Group = {
  id: 'J', name: 'J 组',
  teams: [
    { id: 'arg', name: '阿根廷' },
    { id: 'alg', name: '阿尔及利亚' },
    { id: 'aut', name: '奥地利' },
    { id: 'jor', name: '约旦' },
  ],
  matches: [
    { id: 'J-M1', teamA: 'arg', teamB: 'alg', result: null, date: '6月17日', time: '09:00' },
    { id: 'J-M2', teamA: 'aut', teamB: 'jor', result: null, date: '6月17日', time: '12:00' },
    { id: 'J-M3', teamA: 'arg', teamB: 'aut', result: null, date: '6月23日', time: '01:00' },
    { id: 'J-M4', teamA: 'jor', teamB: 'alg', result: null, date: '6月23日', time: '11:00' },
    { id: 'J-M5', teamA: 'alg', teamB: 'aut', result: null, date: '6月28日', time: '10:00' },
    { id: 'J-M6', teamA: 'jor', teamB: 'arg', result: null, date: '6月28日', time: '10:00' },
  ],
};

// ──────────────── K 组 ────────────────
const groupK: Group = {
  id: 'K', name: 'K 组',
  teams: [
    { id: 'por', name: '葡萄牙' },
    { id: 'cod', name: '刚果（金）' },
    { id: 'uzb', name: '乌兹别克斯坦' },
    { id: 'col', name: '哥伦比亚' },
  ],
  matches: [
    { id: 'K-M1', teamA: 'por', teamB: 'cod', result: null, date: '6月18日', time: '01:00' },
    { id: 'K-M2', teamA: 'uzb', teamB: 'col', result: null, date: '6月18日', time: '10:00' },
    { id: 'K-M3', teamA: 'por', teamB: 'uzb', result: null, date: '6月24日', time: '01:00' },
    { id: 'K-M4', teamA: 'col', teamB: 'cod', result: null, date: '6月24日', time: '10:00' },
    { id: 'K-M5', teamA: 'col', teamB: 'por', result: null, date: '6月28日', time: '07:30' },
    { id: 'K-M6', teamA: 'cod', teamB: 'uzb', result: null, date: '6月28日', time: '07:30' },
  ],
};

// ──────────────── L 组 ────────────────
const groupL: Group = {
  id: 'L', name: 'L 组',
  teams: [
    { id: 'eng', name: '英格兰' },
    { id: 'cro', name: '克罗地亚' },
    { id: 'gha', name: '加纳' },
    { id: 'pan', name: '巴拿马' },
  ],
  matches: [
    { id: 'L-M1', teamA: 'eng', teamB: 'cro', result: null, date: '6月18日', time: '04:00' },
    { id: 'L-M2', teamA: 'gha', teamB: 'pan', result: null, date: '6月18日', time: '07:00' },
    { id: 'L-M3', teamA: 'eng', teamB: 'gha', result: null, date: '6月24日', time: '04:00' },
    { id: 'L-M4', teamA: 'pan', teamB: 'cro', result: null, date: '6月24日', time: '07:00' },
    { id: 'L-M5', teamA: 'pan', teamB: 'eng', result: null, date: '6月28日', time: '05:00' },
    { id: 'L-M6', teamA: 'cro', teamB: 'gha', result: null, date: '6月28日', time: '05:00' },
  ],
};

export const GROUPS: Group[] = [
  groupA, groupB, groupC, groupD, groupE, groupF,
  groupG, groupH, groupI, groupJ, groupK, groupL,
];
