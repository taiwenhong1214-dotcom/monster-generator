import { BaseItem, WeaponItem, ThemeItem, MonsterConcept } from '../types';

const PREFIXES = ['SPECIMEN', 'PROJECT', 'MUTANT', 'TITAN', 'NEMESIS', 'BIO-UNIT', 'APEX'];
const ROMAN_OR_CODE = ['α-01', 'β-09', 'Ω-77', 'X-404', 'V-08', 'MK-IV', 'EX-12', 'Z-99', 'DS-03'];

export function generateCodeName(base: BaseItem, weapon: WeaponItem): string {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const code = ROMAN_OR_CODE[Math.floor(Math.random() * ROMAN_OR_CODE.length)];
  return `${prefix}-${code}「${base.name.slice(0, 4)}·${weapon.name.slice(0, 4)}」`;
}

export function formatPromptForCopy(concept: MonsterConcept): string {
  return `═══════════════════════════════════════════
🎮 FPS手游怪物概念设计草图速写卡
═══════════════════════════════════════════
【代号】${concept.codeName}
【定位】${concept.base.role}（${concept.base.category} × ${concept.weapon.category}）
───────────────────────────────────────────
【1. 躯体基底】${concept.base.name}
• 剪影与体态：${concept.base.silhouetteDesc}
• FPS弱点判定：${concept.base.weakPoint}

【2. 武器化搭载】${concept.weapon.name}
• 搭载部位：${concept.weapon.mountingPosition}
• 攻击与弹道：${concept.weapon.attackPattern}
• 开火光效粒子：${concept.weapon.visualVfx}

【3. 视觉主题与材质】${concept.theme.name}
• 光影氛围：${concept.theme.lighting}
• 材质与质感：${concept.theme.materials}
• 推荐色彩板：${concept.theme.palette.join(' | ')}
───────────────────────────────────────────
【速写动态建议】
抓取${concept.base.name}的典型${concept.base.silhouetteDesc.slice(0, 15)}剪影，将${concept.weapon.name}在${concept.weapon.mountingPosition}突出机械与肉质嫁接结构，利用${concept.theme.name}的主光源拉出高反差边缘光。
═══════════════════════════════════════════`;
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
