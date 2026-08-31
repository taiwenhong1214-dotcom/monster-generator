export type SlotType = 'base' | 'weapon' | 'theme';

export interface BaseItem {
  id: string;
  name: string;
  category: '生物变异' | '机械仿生' | '昆虫几丁质' | '深海异形' | '重型异构' | '灵能异界' | '植物异化' | '亡灵邪魔';
  silhouetteDesc: string; // 剪影与体态特征
  weakPoint: string; // FPS弱点/爆头判定区
  role: '突击先锋' | '重装肉盾' | '远程压制' | '敏捷刺客' | '浮空骚扰' | '自爆特攻' | '控制支援';
  tags: string[];
}

export interface WeaponItem {
  id: string;
  name: string;
  category: '实弹枪械' | '能量光束' | '重型火炮' | '生化强酸' | '近战动力' | '高科技战术' | '灵能异术' | '虫巢生物武器';
  mountingPosition: '肩部双挂架' | '前臂一体化' | '背负式发射井' | '胸腔内置' | '尾部自律炮塔' | '双持/下肢装载';
  attackPattern: string; // 射击/弹道/攻击模式
  visualVfx: string; // 开火光效与粒子特征
  tags: string[];
}

export interface ThemeItem {
  id: string;
  name: string;
  category: '废土辐射' | '赛博霓虹' | '极端生态' | '军工重装' | '异星灵能' | '生化灾变' | '暗黑哥特' | '东方神话' | '异域原始';
  palette: string[]; // 5 Hex colors
  lighting: string; // 光影与渲染氛围
  materials: string; // 材质与质感特征
  tags: string[];
}

export interface MonsterConcept {
  id: string;
  codeName: string;
  createdAt: string;
  dateStr: string; // YYYY-MM-DD for daily tracking
  base: BaseItem;
  weapon: WeaponItem;
  theme: ThemeItem;
  customNotes?: string;
  sketchDataUrl?: string; // Stored user thumbnail or uploaded sketch
  isCompleted: boolean; // Marked as sketched
  isFavorite: boolean;
}

export interface PresetPool {
  bases: BaseItem[];
  weapons: WeaponItem[];
  themes: ThemeItem[];
}
