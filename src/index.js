import map from './scripts/map';
import Census from './scripts/census';
import Bea from './scripts/bea';
import Stats from './scripts/stats';
import State from './scripts/state';
import LineChart from '../dist/lineChart';


document.addEventListener('DOMContentLoaded', async () => {
    const mapDiv = document.getElementById('map');
    const statsEl = document.getElementById('stats');
    mapDiv.style.width = '100%';


    // Load map
    const res = await fetch(`https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json`)
    const mapJson = await res.json()


    // Fetch and setup data
    const data = await setupData()
    const states = State.setupStates(data);
    const stats = new Stats(statsEl, states);

    window['chartCategory'] = 'populationHistorical'
    window['usData'] = stats.chartData(data);

    let stateData = State.setUpLineChartHistorical(states['Ohio'].populationHist, 'Ohio');

    const loadMap = map(mapJson, stats, states, setupLineChart);
    let chart = setupLineChart(window['usData'].concat(stateData));
    mapDiv.appendChild(loadMap);


    let lineChart = document.getElementById('chart');
    lineChart.appendChild(chart)

    const loading = document.getElementsByClassName('loading');
    loading[0].style.display = 'none';

    let modButton = document.getElementById('modul_button')
    modButton.style.display = 'block';
    modButton.addEventListener('click', () => {
        document.getElementById('modul').remove();
    });
});


const setupData = async () => {
    const census = new Census();
    const bea = new Bea();
    const populationHistorical = await Census.fetchData(census.populationLinks);
    const employmentHistorical = await Census.fetchData(census.employmentLinks);
    const gdpHistorical = await Bea.fetchData(bea.gdpLink);
    const personalIncomeHistorical = await Bea.fetchData(bea.personalIncomeLink);

    const data = {
        'name': '',
        'populationHistorical': populationHistorical,
        'employmentHistorical': employmentHistorical,
        'gdpHistorical': gdpHistorical,
        'personalIncomeHistorical': personalIncomeHistorical,
        'getStatsCensus': census.getStateStats,
        'getStatsBea': bea.getStateStats,
    }

    return data;
}


const setupLineChart = (data) => {

    return LineChart(data, {
        x: d => d.date,
        y: d => d.populationHistorical,
        z: d => d.state,
        yDomain: [1, 30],
        yLabel: "??? Unemployment (%)",
        height: 500,
        width: 500,
        color: "#29DEF2",
    });
}
