const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Analytics API utility functions
 */

// Get auth token from localStorage
const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

// Generic fetch with auth
const fetchWithAuth = async (endpoint, options = {}) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
    }

    return response.json();
};

// Dashboard
export const getDashboard = async () => {
    return fetchWithAuth('/api/player-analytics/dashboard');
};

// Performance Charts
export const getPerformanceChart = async (period = '7d', metric = 'kills') => {
    return fetchWithAuth(`/api/player-analytics/performance-chart?period=${period}&metric=${metric}`);
};

export const getEarningsChart = async (period = '30d') => {
    return fetchWithAuth(`/api/player-analytics/earnings-chart?period=${period}`);
};

// Performance Breakdown
export const getMapPerformance = async () => {
    return fetchWithAuth('/api/player-analytics/map-performance');
};

export const getModePerformance = async () => {
    return fetchWithAuth('/api/player-analytics/mode-performance');
};

export const getWeaponStats = async () => {
    return fetchWithAuth('/api/player-analytics/weapon-stats');
};

export const getTimeBasedPerformance = async () => {
    return fetchWithAuth('/api/player-analytics/time-based-performance');
};

// Trends and Insights
export const getPerformanceTrends = async () => {
    return fetchWithAuth('/api/player-analytics/performance-trends');
};

export const getInsights = async () => {
    return fetchWithAuth('/api/player-analytics/insights');
};

export const getEngagementMetrics = async () => {
    return fetchWithAuth('/api/player-analytics/engagement');
};

export const getComparativeStats = async () => {
    return fetchWithAuth('/api/player-analytics/comparative-stats');
};

// Match History
export const getMatchHistory = async (page = 1, limit = 20, gameType, mode) => {
    let url = `/api/player-analytics/match-history?page=${page}&limit=${limit}`;
    if (gameType) url += `&gameType=${gameType}`;
    if (mode) url += `&mode=${mode}`;
    return fetchWithAuth(url);
};

// Update Analytics (internal use)
export const updateAnalytics = async (matchId, matchData) => {
    return fetchWithAuth('/api/player-analytics/update', {
        method: 'POST',
        body: JSON.stringify({ matchId, matchData }),
    });
};

// React Hook for analytics data
export const useAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getDashboard();
                setData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error, refetch: fetchData };
};

// React Hook for performance chart
export const usePerformanceChart = (period = '7d', metric = 'kills') => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getPerformanceChart(period, metric);
                setData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [period, metric]);

    return { data, loading, error };
};

// React Hook for map performance
export const useMapPerformance = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getMapPerformance();
                setData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

// React Hook for mode performance
export const useModePerformance = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getModePerformance();
                setData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

// React Hook for weapon stats
export const useWeaponStats = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getWeaponStats();
                setData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

// React Hook for insights
export const useInsights = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getInsights();
                setData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

// React Hook for comparative stats
export const useComparativeStats = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getComparativeStats();
                setData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

// React Hook for match history
export const useMatchHistory = (page = 1, limit = 20, gameType, mode) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getMatchHistory(page, limit, gameType, mode);
                setData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, limit, gameType, mode]);

    return { data, loading, error };
};
