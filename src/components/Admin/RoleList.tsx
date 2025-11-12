import { Table, Button, Popconfirm } from 'antd';
import type { Role } from '../../services/RoleService';

type Props = {
    roles: Role[];
    loading?: boolean;
    onEdit: (r: Role) => void;
    onDelete: (id: string) => void;
    onPermissions?: (r: Role) => void;
};

export default function RoleList({ roles, loading, onEdit, onDelete, onPermissions }: Props) {
    const columns = [
        {
            title: 'Tên vai trò',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            key: 'description',
            render: (_: unknown, record: Role) => record.description ?? record.name,
        },
        {
            title: 'Số người',
            dataIndex: 'userCount',
            key: 'userCount',
            render: (v: number) => v ?? 0,
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_: unknown, record: Role) => (
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button size="small" onClick={() => onEdit(record)}>
                        Sửa
                    </Button>
                    <Button size="small" onClick={() => onPermissions?.(record)}>
                        Phân quyền
                    </Button>
                    <Popconfirm title="Bạn có muốn xóa?" onConfirm={() => onDelete(record._id)}>
                        <Button size="small" danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return <Table rowKey="_id" dataSource={roles} columns={columns} loading={loading} />;
}
