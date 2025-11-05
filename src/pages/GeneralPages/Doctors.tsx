import React, { useEffect, useState } from 'react';
import { Row, Col, Pagination, Select, Input, Skeleton, Typography } from 'antd';
import Footer from '../../components/General/Footer';
import DoctorCard from '../../components/Doctor/DoctorCard';
import { getDoctors, type Doctor } from '../../services/DoctorService';
import { getSpecialties, type Specialty } from '../../services/SpecialtyService';
import { useNavigate } from 'react-router-dom';
import NavbarDark from '../../components/General/NavbarDark';

const { Title } = Typography;
const { Option } = Select;

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9); // 3 per row * 3 rows
  const [total, setTotal] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchSpecialties();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [page, limit, selectedSpecialty, search]);

  const fetchSpecialties = async () => {
    try {
      const list = await getSpecialties();
      setSpecialties(list || []);
    } catch (e) {
      // ignore
    }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      // Call backend with explicit param names expected by the API
      let res;
      if (selectedSpecialty) {
        res = await getDoctors({ page, limit, specialtyId: selectedSpecialty, name: search });
      } else {
        res = await getDoctors({ page, limit, name: search });
      }

      const items = res.items ?? [];
      setDoctors(items as any[]);
      setTotal(res.total ?? items.length ?? 0);
      setPage(res.page ?? page);
      setLimit(res.limit ?? limit);
    } catch (error) {
      console.error('Error fetching doctors', error);
      setDoctors([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const onChangePage = (p: number, pageSize?: number) => {
    setPage(p);
    if (pageSize && pageSize !== limit) setLimit(pageSize);
  };

  const handleSpecialtyChange = (val: string) => {
    if (val === 'all') setSelectedSpecialty(null);
    else setSelectedSpecialty(val);
    setPage(1);
  };

  // Trigger search only when user presses Enter or clicks the search icon
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div>
      <NavbarDark />
      <div className="container mx-auto px-4 py-8 pt-32">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <Title level={2} className="m-0">Doctors</Title>

          <div className="flex items-center gap-3">
            <Input.Search placeholder="Search doctors" onSearch={handleSearch} allowClear style={{ width: 280 }} />

            <Select
              value={selectedSpecialty ?? 'all'}
              onChange={handleSpecialtyChange}
              style={{ minWidth: 220 }}
              placeholder="Filter by specialty"
            >
              <Option value="all">All specialties</Option>
              {specialties.map(s => (
                <Option key={s._id} value={s._id}>{s.name}</Option>
              ))}
            </Select>
          </div>
        </div>

        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <>
            <Row gutter={[24, 24]}>
              {doctors.map((doc) => (
                <Col xs={24} sm={12} md={8} key={(doc as any)._id}>
                  <DoctorCard doctor={doc} onClick={() => navigate(`/doctors/${(doc as any)._id}`)} />
                </Col>
              ))}
            </Row>

            <div className="flex justify-center mt-8">
              <Pagination current={page} pageSize={limit} total={total} onChange={onChangePage} />
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DoctorsPage;
