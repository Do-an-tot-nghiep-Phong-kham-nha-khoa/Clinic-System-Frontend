import React, { useEffect, useState } from 'react';
import { Modal, Form, Button, message, Checkbox, Space, Input } from 'antd';
import type { Role, PermissionItem } from '../../services/RoleService';

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
        <Modal open={visible} onCancel={onClose} title={`Phân quyền: ${role?.name || ''}`} footer={null}>
            <Form layout="vertical">
                <Form.Item label="Chọn quyền theo module">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {schema.length === 0 && (
                            <div>
                                <div>Không có schema permissions từ backend. Bạn có thể dán JSON permissions hoặc thêm schema ở backend.</div>
                                <Input.TextArea rows={8} value={manualJson} onChange={(e) => setManualJson(e.target.value)} placeholder='Ví dụ: [{"module":"appointments","actions":["read","create"]}]' />
                            </div>
                        )}
                        {schema.map((s) => (
                            <div key={s.module} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                                <div style={{ fontWeight: 600 }}>{s.module}</div>
                                <Checkbox.Group value={Array.from(selected[s.module] || [])} onChange={(vals) => {
                                    // vals is array of checked action strings
                                    updateSelectedSet(s.module, vals as string[]);
                                }}>
                                    <Space>
                                        {s.actions.map((a) => (
                                            <Checkbox key={a} value={a}>{a}</Checkbox>
                                        ))}
                                    </Space>
                                </Checkbox.Group>
                            </div>
                        ))}
                    </Space>
                </Form.Item>

                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <Button onClick={onClose}>Hủy</Button>
                        <Button type="primary" onClick={handleSave}>Lưu</Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
}
