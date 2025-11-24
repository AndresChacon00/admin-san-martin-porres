interface Topic {
  title: string;
  items: string[];
}

interface LayoutItem {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  fontSize?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  widthPercent?: number;
}

type LayoutElement =
  | LayoutItem
  | LayoutItem[]
  | Record<string, LayoutItem | LayoutItem[] | Topic[]>;

export interface Layout
  extends Record<string, LayoutElement | number | undefined> {
  name?: LayoutItem;
  description?: LayoutItem;
  course?: LayoutItem;
  signatures?: LayoutItem[];
  signaturesGap?: number;
  back?: {
    content?: LayoutItem;
    topicPositions?: LayoutItem[];
    stampPositions?: LayoutItem[];
    topicsList?: Topic[];
  };
}
