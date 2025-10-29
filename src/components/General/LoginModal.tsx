import { useState } from 'react';
import { Modal, Input, Checkbox, Button, Form, Alert, message } from 'antd';
import backgroundImage from '../../assets/login_photo.jpg';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
    visible: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false); // Thêm trạng thái loading
    const { login } = useAuth();

    const handleSignIn = async () => {
        setError(null);
        setLoading(true);
        try {
            await login(email, password);
            message.success('Đăng nhập thành công! Chào mừng trở lại.', 2);
            onClose();
        } catch (err) {
            setError('Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            className="login-modal rounded-2xl overflow-hidden shadow-2xl"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={900}
            centered
            styles={{ body: { padding: 0 } }}
        >
            {/* Sử dụng grid với 2 cột bằng nhau: grid-cols-2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-[450px]">

                {/* Cột Trái: Form Đăng nhập */}
                <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12 bg-white order-2 md:order-1">
                    <h2 className="mb-2 text-3xl font-extrabold text-gray-800">Chào mừng trở lại 👋</h2>
                    <p className="font-light text-gray-500 mb-6 text-sm">
                        Vui lòng nhập thông tin chi tiết của bạn để tiếp tục.
                    </p>

                    {error && (
                        <Alert
                            message="Lỗi Đăng nhập"
                            description={error}
                            type="error"
                            showIcon
                            closable
                            onClose={() => setError(null)}
                            className="mb-4"
                        />
                    )}

                    <Form layout="vertical" onFinish={handleSignIn} className="space-y-4">
                        <Form.Item label={<span className="font-medium text-gray-700">Email</span>} required>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                size="large"
                                className="rounded-lg shadow-sm focus:border-indigo-500"
                            />
                        </Form.Item>

                        <Form.Item label={<span className="font-medium text-gray-700">Mật khẩu</span>} required>
                            <Input.Password
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                size="large"
                                className="rounded-lg shadow-sm focus:border-indigo-500"
                            />
                        </Form.Item>

                        <div className="flex justify-between items-center text-sm">
                            <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)}>
                                <span className="text-gray-600">Ghi nhớ trong 30 ngày</span>
                            </Checkbox>
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Quên mật khẩu?
                            </a>
                        </div>

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className="w-full h-10 bg-indigo-600 border-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150"
                        >
                            Đăng nhập
                        </Button>
                    </Form>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Hoặc</span>
                        </div>
                    </div>

                    <div className="text-center text-sm mt-3 text-gray-500">
                        Chưa có tài khoản?{' '}
                        <a href="#" className="font-semibold text-indigo-600 hover:underline">
                            Đăng ký miễn phí
                        </a>
                    </div>
                </div>

                {/* Cột Phải: Hình ảnh */}
                <div className="relative hidden md:block order-1 md:order-2">
                    <img
                        src={backgroundImage}
                        alt="Background"
                        className="w-full h-full object-cover rounded-t-2xl md:rounded-r-2xl md:rounded-tl-none"
                    />
                </div>
            </div>
        </Modal>
    );
};

export default LoginModal;