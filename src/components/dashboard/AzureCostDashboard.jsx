import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import TopKPIs from './TopKPIs';
import DailyCostTrend from './DailyCostTrend';
import ServiceCosts from './ServiceCosts';
import ResourceGroupCosts from './ResourceGroupCosts';
import OptimizationRecommendations from './OptimizationRecommendations';
import { processCSVData } from '../../utils/dataProcessing';

const AzureCostDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      setError(null);

      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          try {
            const processedData = processCSVData(results.data);
            setDashboardData(processedData);
          } catch (err) {
            setError('Error processing data: ' + err.message);
          } finally {
            setIsLoading(false);
          }
        },
        error: (error) => {
          setError('Error parsing CSV: ' + error.message);
          setIsLoading(false);
        }
      });
    }
  };

  if (!dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Azure Cost Analysis Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Upload className="w-16 h-16 text-blue-500" />
              <p className="text-center text-gray-600">
                Upload your Azure usage CSV file to view the cost analysis dashboard
              </p>
              <label className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                Select CSV File
              </label>
              {isLoading && (
                <p className="text-blue-500">Processing file...</p>
              )}
              {error && (
                <p className="text-red-500">{error}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Azure Cost Analysis Dashboard</h1>
        <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          Upload New File
        </label>
      </div>

      <TopKPIs data={dashboardData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DailyCostTrend data={dashboardData.dailyCosts} />
        <ServiceCosts data={dashboardData.serviceBreakdown} />
      </div>

      <ResourceGroupCosts data={dashboardData.resourceGroupCosts} />
      <OptimizationRecommendations data={dashboardData} />
    </div>
  );
};

export default AzureCostDashboard;