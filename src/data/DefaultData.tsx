import StandDensityData from './StandDensityData.json';

const treePrice: Array<number | string> = [
  9000, 9000, 9000, 9000, 9000, 12500, 12500, 13500, 13500, 14000, 14000,
];

const treeDiamter: Array<number | string> = [
  6, 8, 9, 12, 14, 15, 16, 18, 22, 24, 28,
];

const defaultInputValues = {
  treeGrowth: {
    treeHeight: [32.84414, 0.0136, 0, 0.92438],
    treeVolume: StandDensityData.tohokuSugi.SDMD.V,
    highStandShape: StandDensityData.tohokuSugi.SDMD.HF,
    dbh: StandDensityData.tohokuSugi.SDMD.DBH,
    nrf: StandDensityData.tohokuSugi.SDMD.NRf,
  },
  management: {
    minimumDensity: 500,
    maximumDensity: 5000,
    minimumClearcut: 450,
    reforestationCost: 1953682,
    priceSaplings: 375,
    minimumThinning: 10,
    maximumThinning: 50,
    annualProfit: 0.8,
    ageOfStartThinning: 10,
    ageOfEndThinning: 200,
    thinningInterval: 5,
    maximumNumberOfThinning: 10,
  },
  thinning: {
    thinningOther: {
      yieldRate: 0.58,
      cost: 10947,
      stumpHeight: 0.5,
    },
    sell: {
      price: treePrice,
      diamter: treeDiamter,
    },
  },
  clearCut: {
    clearCutOther: {
      yieldRate: 0.58,
      cost: 6869,
      stumpHeight: 0.5,
    },
    sell: {
      price: treePrice,
      diamter: treeDiamter,
    },
  },
};

export default defaultInputValues;
