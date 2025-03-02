import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
  Container,
  AppBar,
  Toolbar,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Create a material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const App = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({
    end_year: [],
    topic: [],
    sector: [],
    region: [],
    pestle: [],
    source: [],
    country: [],
    city: [],
    swot: [],
  });
  const [visualizationData, setVisualizationData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from the backend
  const fetchData = async (filters) => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:5000/api/data", {
        params: filters,
      });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again later.");
      setLoading(false);
    }
  };

  // Fetch visualization data
  const fetchVisualizationData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/visualization-data");
      setVisualizationData(response.data);
    } catch (error) {
      console.error("Error fetching visualization data:", error);
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/filters");
      setFilterOptions(response.data);
    } catch (error) {
      console.error("Error fetching filter options:", error);
      alert("Failed to fetch filter options. Please try again later.");
    }
  };

  // Handle filter changes
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const updatedFilters = { ...filters };
    if (value === "" || value === "All") {
      delete updatedFilters[name];
    } else {
      updatedFilters[name] = value;
    }
    setFilters(updatedFilters);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({});
  };

  // Fetch data when filters change
  useEffect(() => {
    fetchData(filters);
  }, [filters]);

  // Fetch filter options and visualization data on component mount
  useEffect(() => {
    fetchFilterOptions();
    fetchVisualizationData();
  }, []);

  // Prepare chart data for intensity by region
  const intensityByRegionChart = {
    labels: visualizationData?.intensity_by_region.map(item => item.region).slice(0, 10) || [],
    datasets: [
      {
        label: "Average Intensity",
        data: visualizationData?.intensity_by_region.map(item => item.avg_intensity).slice(0, 10) || [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Prepare chart data for likelihood by topic
  const likelihoodByTopicChart = {
    labels: visualizationData?.likelihood_by_topic.map(item => item.topic).slice(0, 10) || [],
    datasets: [
      {
        label: "Average Likelihood",
        data: visualizationData?.likelihood_by_topic.map(item => item.avg_likelihood).slice(0, 10) || [],
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Prepare chart data for relevance by country
  const relevanceByCountryChart = {
    labels: visualizationData?.relevance_by_country.map(item => item.country).slice(0, 10) || [],
    datasets: [
      {
        label: "Average Relevance",
        data: visualizationData?.relevance_by_country.map(item => item.avg_relevance).slice(0, 10) || [],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  // Prepare chart data for intensity by year
  const intensityByYearChart = {
    labels: visualizationData?.intensity_by_year.map(item => item.year).filter(Boolean).sort() || [],
    datasets: [
      {
        label: "Average Intensity by Year",
        data: visualizationData?.intensity_by_year.map(item => item.avg_intensity) || [],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  // Prepare chart data for topic distribution
  const topicDistributionChart = {
    labels: visualizationData?.topic_distribution.map(item => item.topic).slice(0, 8) || [],
    datasets: [
      {
        label: "Topic Distribution",
        data: visualizationData?.topic_distribution.map(item => item.count).slice(0, 8) || [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(199, 199, 199, 0.6)",
          "rgba(83, 102, 255, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Filtered data counts
  const filteredDataCount = data.length;
  
  // Common chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 10,
      },
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Blackcoffer Visualization Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {/* Filters */}
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">Filters</Typography>
              <Button variant="outlined" onClick={resetFilters}>
                Reset Filters
              </Button>
            </Box>
            <Grid container spacing={3}>
              {Object.keys(filterOptions).map((filter) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={filter}>
                  <FormControl fullWidth>
                    <InputLabel>{filter.replace("_", " ").toUpperCase()}</InputLabel>
                    <Select
                      name={filter}
                      value={filters[filter] || ""}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="All">All</MenuItem>
                      {filterOptions[filter].map((option) => (
                        <MenuItem key={option} value={option}>
                          {option || "N/A"}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Data Summary */}
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Data Summary
            </Typography>
            <Typography variant="body1">
              {loading ? "Loading..." : `Showing ${filteredDataCount} records`}
            </Typography>
          </Paper>

          {loading ? (
            <Box display="flex" justifyContent="center" p={5}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Charts Row 1 */}
              <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                  <Paper elevation={3} sx={{ p: 3, height: "400px" }}>
                    <Typography variant="h6" gutterBottom>
                      Intensity by Region (Top 10)
                    </Typography>
                    <Box sx={{ height: "330px" }}>
                      <Bar data={intensityByRegionChart} options={chartOptions} />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={3} sx={{ p: 3, height: "400px" }}>
                    <Typography variant="h6" gutterBottom>
                      Topic Distribution
                    </Typography>
                    <Box sx={{ height: "330px" }}>
                      <Doughnut data={topicDistributionChart} options={chartOptions} />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              {/* Charts Row 2 */}
              <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 3, height: "400px" }}>
                    <Typography variant="h6" gutterBottom>
                      Likelihood by Topic (Top 10)
                    </Typography>
                    <Box sx={{ height: "330px" }}>
                      <Bar
                        data={likelihoodByTopicChart}
                        options={{
                          ...chartOptions,
                          indexAxis: 'y',
                        }}
                      />
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 3, height: "400px" }}>
                    <Typography variant="h6" gutterBottom>
                      Relevance by Country (Top 10)
                    </Typography>
                    <Box sx={{ height: "330px" }}>
                      <Line data={relevanceByCountryChart} options={chartOptions} />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              {/* Charts Row 3 */}
              <Grid container spacing={4} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ p: 3, height: "400px" }}>
                    <Typography variant="h6" gutterBottom>
                      Intensity Trend by Year
                    </Typography>
                    <Box sx={{ height: "330px" }}>
                      <Line data={intensityByYearChart} options={chartOptions} />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default App;