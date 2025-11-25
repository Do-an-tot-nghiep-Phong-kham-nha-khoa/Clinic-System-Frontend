import { useEffect, useState } from 'react';
import { Modal, Form, Button, message, Checkbox, Space, Input, Typography, Divider, Alert, Card, Tooltip } from 'antd';
import type { Role, PermissionItem } from '../../services/RoleService';
import { SaveOutlined, CloseOutlined, WarningOutlined, SettingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

type PermissionSchema = {
    module: string;
    actions: string[];
};

type Props = {
    visible: boolean;
    onClose: () => void;
    role?: Role;
    schema?: PermissionSchema[]; // available modules/actions
    onSave: (id: string, permissions: PermissionItem[]) => Promise<void>;
};

export default function RolePermissionsModal({ visible, onClose, role, schema = [], onSave }: Props) {
    // selected[module] = Set(actions)
    const [selected, setSelected] = useState<Record<string, Set<string>>>({});
    const [manualJson, setManualJson] = useState('');

    useEffect(() => {
        const map: Record<string, Set<string>> = {};
        if (role && Array.isArray(role.permissions)) {
            for (const p of role.permissions) {
                if (typeof p === 'object' && p !== null && 'module' in p && 'actions' in p) {
                    const mod = (p as any).module;
                    map[mod] = new Set((p as any).actions || []);
                }
            }
        }
        // ensure all modules exist
        for (const s of schema) {
            if (!map[s.module]) map[s.module] = new Set();
        }
        setSelected(map);
    }, [role, schema, visible]);

    // helper: update selected set for a module
    function updateSelectedSet(module: string, values: string[]) {
        setSelected((prev) => ({ ...prev, [module]: new Set(values) }));
    }

    async function handleSave() {
        if (!role) return;
        let out: PermissionItem[] = [];
        if (schema.length === 0) {
            // fallback: allow manual JSON input
            try {
                out = JSON.parse(manualJson || '[]') as PermissionItem[];
            } catch (e) {
                message.error('JSON không hợp lệ');
                return;
            }
        } else {
            for (const mod of Object.keys(selected)) {
                out.push({ module: mod, actions: Array.from(selected[mod] || []) });
            }
        }
        try {
            await onSave(role._id, out);
            message.success('Cập nhật quyền thành công');
            onClose();
        } catch (err: any) {
            message.error(err?.message || 'Lỗi khi lưu quyền');
        }
    }

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            // Cải thiện tiêu đề modal
            title={<Title level={4} className="!mb-0"><SettingOutlined /> Phân Quyền: <Text type="success">{role?.name || 'Vai trò'}</Text></Title>}
            footer={
                // Chuyển footer logic vào đây để đồng bộ
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={onClose} icon={<CloseOutlined />}>Hủy</Button>
                    <Button
                        type="primary"
                        onClick={handleSave}
                        icon={<SaveOutlined />}
                        disabled={!role}
                    >
                        Lưu Quyền
                    </Button>
                </Space>
            }
            width={700} // Mở rộng modal cho dễ thao tác
        >

            <Divider className="!my-4" />

            <Form layout="vertical">
                {schema.length === 0 ? (
                    // --- Fallback: Nhập JSON thủ công (Cải thiện UI) ---
                    <Form.Item
                        label={<Text strong><WarningOutlined style={{ color: '#faad14' }} /> Chỉnh sửa thủ công (Fallback)</Text>}
                        help="Không tìm thấy cấu trúc quyền (schema). Vui lòng nhập mảng JSON quyền trực tiếp."
                    >
                        <TextArea
                            rows={8}
                            value={manualJson}
                            onChange={(e) => setManualJson(e.target.value)}
                            placeholder='Ví dụ: [{"module":"appointments","actions":["read","create"]}]'
                        />
                        <Alert
                            message="Cảnh báo: Chế độ này yêu cầu nhập JSON chính xác. Lỗi cú pháp có thể ngăn việc lưu."
                            type="warning"
                            showIcon
                            className="mt-2"
                        />
                    </Form.Item>
                ) : (
                    // --- Chọn quyền theo Module (Cải thiện UI) ---
                    <Form.Item label={<Text strong>Chọn Quyền theo Module</Text>}>
                        <Space direction="vertical" style={{ width: '100%', maxHeight: '400px', overflowY: 'auto' }}>
                            {schema.map((s) => (
                                <Card
                                    variant='borderless'
                                    key={s.module}
                                    size="small"
                                    title={<Text strong>{s.module.toUpperCase()}</Text>}
                                    className="w-full transition duration-150"
                                    extra={
                                        <Tooltip title="Chọn/Bỏ chọn tất cả">
                                            <Checkbox
                                                checked={Array.from(selected[s.module] || []).length === s.actions.length && s.actions.length > 0}
                                                indeterminate={
                                                    (Array.from(selected[s.module] || []).length > 0) &&
                                                    (Array.from(selected[s.module] || []).length < s.actions.length)
                                                }
                                                onChange={(e) => {
                                                    updateSelectedSet(s.module, e.target.checked ? s.actions : []);
                                                }}
                                            />
                                        </Tooltip>
                                    }
                                >
                                    <Checkbox.Group
                                        value={Array.from(selected[s.module] || [])}
                                        onChange={(vals) => {
                                            updateSelectedSet(s.module, vals as string[]);
                                        }}
                                    >
                                        <Space wrap size={[16, 8]}>
                                            {s.actions.map((a) => (
                                                <Checkbox key={a} value={a}>
                                                    {a.charAt(0).toUpperCase() + a.slice(1)} {/* Viết hoa chữ cái đầu */}
                                                </Checkbox>
                                            ))}
                                        </Space>
                                    </Checkbox.Group>
                                </Card>
                            ))}
                        </Space>
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
}
