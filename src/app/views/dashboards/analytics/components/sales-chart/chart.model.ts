export interface ChartOptions {
  series?: any; 
  chart?: {
    type?: string;
    height?: number;
    width?: number;
    toolbar?: { show?: boolean };
    dropShadow?: any;
    zoom?: { enabled?: boolean };
  };
  xaxis?: any;
  yaxis?: any;
  stroke?: any;
  markers?: any;
  colors?: string[];
  labels?: string[];
  dataLabels?: { enabled?: boolean };
  legend?: any;
  fill?: any;
  tooltip?: any;
  grid?: any;
  title?: { text?: string };
  theme?: any;
  responsive?: any[];
  noData?: { text?: string };
}
