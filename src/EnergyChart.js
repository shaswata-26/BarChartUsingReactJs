
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EnergyChart = () => {
    const [chartData, setChartData] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const jsonUrl = "https://api.allorigins.win/get?url=https://drive.google.com/uc?id=1B3CPDaCTKRWD0EJuSFn5gfZd4vgygUMQ";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(jsonUrl);
                console.log('Response from AllOrigins:', response);  

                const base64Data = response.data.contents;

                const base64String = base64Data.split(',')[1];

                const jsonString = atob(base64String); 

                const data = JSON.parse(jsonString);

                console.log('Parsed Data:', data);  

                if (Array.isArray(data)) {
                    const dates = data.map(entry => entry.createdAt);
                    const energyConsumption = data.map(entry => entry.total_kwh);

                    
                    setChartData({
                        labels: dates,
                        datasets: [
                            {
                                label: 'Energy Consumption (kWh)',
                                data: energyConsumption,
                                backgroundColor: 'rgba(75,192,192,0.2)', 
                                borderColor: 'rgba(75,192,192,1)',
                                borderWidth: 1,
                            }
                        ]
                    });
                } else {
                    setError('Data is not in the expected format');
                }
            } catch (error) {
                setError('Error fetching data: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

   
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!chartData) {
        return <div>No data available to display.</div>;
    }

    return (
        <div>
            <h2>Energy Consumption vs Date (Bar Chart)</h2>
            <Bar data={chartData} />
        </div>
    );
};

export default EnergyChart;
