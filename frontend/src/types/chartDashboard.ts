export interface ChartSeries {
  name: string;
  data: number[]; // An array of the sales numbers (item.y)
}

export interface ChartOptions {
  chart: {
    type: "line";
  };
  colors: string[];
  dataLabels: {
    enabled: boolean;
  };
  stroke: {
    curve: "smooth";
  };
  title: {
    text: string;
    align: "left";
  };
  grid: {
    borderColor: string;
  };
  markers: {
    size: number;
  };
  xaxis: {
    categories: string[]; // This is the array of dates (_id)
    title: {
      text: string;
    };
  };
  yaxis: {
    title: {
      text: string;
    };
    min: number;
  };
  legend: {
    position: "top";
    horizontalAlign: "right";
    floating: boolean;
    offsetY: number;
    offsetX: number;
  };
}

export interface SalesChartState {
  options: ChartOptions;
  series: ChartSeries[];
}
