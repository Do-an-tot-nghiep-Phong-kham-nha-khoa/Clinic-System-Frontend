import { useEffect, useState } from "react";
import { Card, Flex, Typography, message, Skeleton, Spin } from "antd";
import CountUp from "react-countup";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

import {
    getAppointmentsLast7Days,
    getRevenueLast7Days,
    getAppointmentStatusStats,
    getTotalRevenue
} from "../../services/StatsService";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const { Text } = Typography;

type StatCardProps = {
    title: string;
    value: number;
    height?: number;
    loading?: boolean;
};

const StatCard = ({ title, value, height, loading = false }: StatCardProps) => {
    return (
        <Card variant="outlined" style={{ height: height || 150 }}>
            <Flex vertical gap="large">
                <Text>{title}</Text>
                {loading ? (
                    <Skeleton.Input active size="large" style={{ width: '100%', height: '40px' }} />
                ) : (
                    <Typography.Title level={2} style={{ margin: 0 }}>
                        <CountUp end={value} separator="," />
                    </Typography.Title>
                )}
            </Flex>
        </Card>
    );
};

const AdminDashboard = () => {
    const [last7DaysAppointments, setLast7DaysAppointments] = useState<any[]>([]);
    const [statusStats, setStatusStats] = useState<any[]>([]);
    const [revenueLast7Days, setRevenueLast7Days] = useState<number>(0);
    const [totalRevenue, setTotalRevenue] = useState<number>(0);

    const [loading, setLoading] = useState(true);
    const [loadingRevenue, setLoadingRevenue] = useState<boolean>(true);

    useEffect(() => {
        loadStats();
    }, []);

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                setLoadingRevenue(true);

                const [last7Res, totalRes] = await Promise.all([
                    getRevenueLast7Days(),
                    getTotalRevenue()
                ]);

                // Hỗ trợ cả 2 cấu trúc: { data: ... } và trực tiếp object
                const getData = (res: any) => res?.data ?? res;

                // Tổng doanh thu
                setTotalRevenue(getData(totalRes)?.totalRevenue ?? 0);

                // Doanh thu 7 ngày
                const arr = getData(last7Res);
                if (Array.isArray(arr) && arr.length > 0) {
                    const sum = arr.reduce((acc: number, cur: any) => acc + (cur.totalRevenue || 0), 0);
                    setRevenueLast7Days(sum);
                } else {
                    setRevenueLast7Days(0);
                }

            } catch (error) {
                console.error("Lỗi load doanh thu:", error);
                message.error("Không thể tải dữ liệu doanh thu");
            } finally {
                setLoadingRevenue(false);
            }
        };

        fetchRevenue();
    }, []);

    const loadStats = async () => {
        try {
            const last7 = await getAppointmentsLast7Days();
            const status = await getAppointmentStatusStats();

            setLast7DaysAppointments(last7);
            setStatusStats(status);
        } catch (err) {
            message.error("Không thể tải dữ liệu thống kê");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /* PROCESS DATA FOR BAR CHART */
    const barLabels = last7DaysAppointments.map(item => item._id);
    const barValues = last7DaysAppointments.map(item => item.count);

    const barChartData = {
        labels: barLabels.map(date => {
            const d = new Date(date);
            return `${d.getDate()}/${d.getMonth() + 1}`;
        }),
        datasets: [
            {
                label: "Số lịch hẹn",
                data: barValues,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            }
        ],
    };

    const barChartOptions: any = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Lịch hẹn trong 7 ngày gần nhất" },
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    /* PROCESS DATA FOR PIE CHART */
    const pieLabels = statusStats.map(item => item._id);
    const pieValues = statusStats.map(item => item.count);

    const statusColorMap: Record<string, string> = {
        waiting_assigned: "rgba(153, 102, 255, 0.6)",
        pending: "rgba(255, 206, 86, 0.6)",
        confirmed: "rgba(54, 162, 235, 0.6)",
        cancelled: "rgba(255, 99, 132, 0.6)",
        completed: "rgba(75, 192, 192, 0.6)",
    };

    const pieChartData = {
        labels: pieLabels.map(label => {
            switch (label) {
                case "waiting_assigned": return "Chờ phân công";
                case "pending": return "Chờ xác nhận";
                case "confirmed": return "Đã xác nhận";
                case "completed": return "Hoàn thành";
                case "cancelled": return "Đã hủy";
                default: return label;
            }
        }),
        datasets: [
            {
                data: pieValues,
                backgroundColor: pieLabels.map(label => statusColorMap[label]),
                borderWidth: 1
            }
        ],
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
    };

    /* RENDER UI */
    return (
        <div className="p-6">
            <h1 className="font-bold text-2xl mb-4">Thống kê hệ thống</h1>            {/* LARGE CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <StatCard
                    title="Tổng số lịch hẹn 7 ngày"
                    value={barValues.reduce((a, b) => a + b, 0)}
                    loading={loading}
                />
                <StatCard
                    title="Tổng số trạng thái khác nhau"
                    value={statusStats.length}
                    loading={loading}
                />
                <StatCard
                    title="Doanh thu 7 ngày gần nhất (VND)"
                    value={revenueLast7Days}
                    loading={loadingRevenue}
                />
                <StatCard
                    title="Tổng doanh thu (VND)"
                    value={totalRevenue}
                    loading={loadingRevenue}
                />
            </div>
            {/* CHARTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                <Card title="Biểu đồ lịch hẹn 7 ngày" variant="outlined">
                    {loading ? (
                        <div className="flex justify-center items-center h-[300px]">
                            <Spin size="large" tip="Đang tải dữ liệu biểu đồ..." />
                        </div>
                    ) : (
                        <Bar data={barChartData} options={barChartOptions} />
                    )}
                </Card>

                <Card title="Biểu đồ trạng thái lịch hẹn" variant="outlined" className="h-full">
                    <div className="h-[300px]">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <Spin size="large" tip="Đang tải dữ liệu biểu đồ..." />
                            </div>
                        ) : (
                            <Pie data={pieChartData} options={pieChartOptions} />
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
