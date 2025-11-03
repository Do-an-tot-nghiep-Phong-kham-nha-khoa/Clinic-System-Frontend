import { Button, Input, message, Table, Modal } from "antd";
import { useEffect, useState } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { formatDateDDMMYYYY } from "../../utils/date";
import { getAccounts, deleteAccount, getRole } from "../../services/AccountService";
import type { Account, AccountMeta, Role } from "../../services/AccountService";
import ButtonPrimary from "../../utils/ButtonPrimary";
import { AiFillEdit } from "react-icons/ai";
import ModalCreateAccount from "../../components/Admin/ModalCreateAccount";
import ModalEditAccount from "../../components/Admin/ModalEditAccount";

const AccountManagement = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [meta, setMeta] = useState<AccountMeta | null>(null);

    // table query state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState<string | undefined>(undefined);
    const [q, setQ] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [createOpen, setCreateOpen] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | undefined>(undefined);
    // cache of roles keyed by id to avoid refetching
    const [roleCache, setRoleCache] = useState<Record<string, Role | null>>({});

    useEffect(() => {
        fetchAccounts();
    }, [page, pageSize, sort, q]);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const result = await getAccounts({ page, limit: pageSize, sort, q });
            // debug: log API response to help troubleshoot empty table
            // eslint-disable-next-line no-console
            console.debug('getAccounts result', result);
            const { items, meta } = result;
            setAccounts(items);
            setMeta(meta);
            // prefetch role objects for accounts
            try {
                const roleIds = Array.from(new Set(items
                    .flatMap((a: any) => Array.isArray(a.roleId) ? a.roleId : (a.roleId ? [a.roleId] : []))
                    .filter((id: any) => typeof id === 'string')));
                const missing = roleIds.filter((id: string) => !(id in roleCache));
                if (missing.length > 0) {
                    const fetched = await Promise.all(missing.map(async (id) => {
                        try {
                            const r = await getRole(id);
                            return [id, r] as const;
                        } catch (e) {
                            return [id, null] as const;
                        }
                    }));
                    if (fetched.length > 0) {
                        setRoleCache(prev => {
                            const copy = { ...prev };
                            for (const [id, r] of fetched) copy[id] = r;
                            return copy;
                        });
                    }
                }
            } catch (e) {
                // ignore role prefetch errors
            }
            return items;
        }
        catch (error) {
            message.error("Lỗi khi lấy danh sách tài khoản");
            return [];
        } finally {
            setLoading(false);
        }
    }

    const handleTableChange = (
        pagination: { current?: number; pageSize?: number },
        _filters: any,
        sorter: any
    ) => {
        if (pagination.current) setPage(pagination.current);
        if (pagination.pageSize) setPageSize(pagination.pageSize);

        if (Array.isArray(sorter)) {
            sorter = sorter[0];
        }
        if (sorter && sorter.field) {
            const field = sorter.field as string;
            const order = sorter.order as 'ascend' | 'descend' | undefined;
            if (order === 'ascend') setSort(field);
            else if (order === 'descend') setSort(`-${field}`);
            else setSort(undefined);
        } else {
            setSort(undefined);
        }
    };

    const onSearch = () => {
        setPage(1);
        setQ(searchInput.trim());
    };

    const handleOpenCreate = () => {
        setCreateOpen(true);
    };

    const openEditModal = async (record: Account) => {
        const id = String(record._id);
        setEditingId(id);
        setEditOpen(true);
    };

    type ID = string | number;
    const getRoleName = (account: Account): string => {
        const ids = Array.isArray(account.roleId) ? account.roleId : (account.roleId ? [account.roleId] : []);
        if (ids.length === 0) return 'Người dùng';

        const names: string[] = [];
        const missing: string[] = [];
        for (const id of ids) {
            const cached = (roleCache as any)[id];
            if (cached && cached.name) names.push(cached.name);
            else if (!(id in roleCache)) missing.push(id);
        }

        // Fetch missing roles in background and mark as pending to avoid duplicate requests
        if (missing.length > 0) {
            for (const id of missing) {
                setRoleCache(prev => ({ ...(prev as any), [id]: null }));
                getRole(id).then(r => setRoleCache(prev => ({ ...(prev as any), [id]: r }))).catch(() => setRoleCache(prev => ({ ...(prev as any), [id]: null })));
            }
        }

        if (names.length > 0) return names.join(', ');
        return 'Người dùng';
    }
    const handleDelete = async (_id: ID | undefined): Promise<void> => {
        Modal.confirm({
            title: 'Xoá tài khoản',
            content: 'Bạn có chắc muốn xoá tài khoản này? Hành động này không thể hoàn tác.',
            okText: 'Xoá',
            okType: 'danger',
            cancelText: 'Huỷ',
            onOk: async (): Promise<void> => {
                try {
                    const id = String(_id);
                    await deleteAccount(id);
                    message.success("Xoá tài khoản thành công");
                    fetchAccounts();
                } catch {
                    message.error("Xoá tài khoản thất bại");
                }
            },
        });
    };

    const columns = [
        { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Roles', dataIndex: 'roleId', key: 'roleId', render: (_: any, record: Account) => getRoleName(record) },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: true,
            width: 120,
            render: (value: string) => formatDateDDMMYYYY(value)
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (record: Account) => (
                <span className='flex gap-2'>
                    <ButtonPrimary type="link" shape="round" icon={<AiFillEdit />} onClick={() => openEditModal(record)}>Sửa</ButtonPrimary>
                    <Button type="link" color="danger" variant="solid" shape="round" icon={<FaTrash />} onClick={() => handleDelete(record._id)}>Xoá</Button>
                </span>
            ),
        },
    ]

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Quản lý tài khoản</h1>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <ButtonPrimary icon={<MdAdd />} size="large" onClick={handleOpenCreate}>
                        Thêm tài khoản
                    </ButtonPrimary>
                </div>
                <div style={{ minWidth: 240, width: '100%', maxWidth: 420 }}>
                    <Input.Search
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Tìm kiếm tài khoản..."
                        allowClear
                        enterButton={
                            <Button icon={<FaSearch />}
                                style={{
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    borderColor: 'var(--color-primary)'
                                }} >
                                Search
                            </Button>}
                        className='text-[var(--color-primary)]'
                        onSearch={onSearch}
                    />
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={accounts}
                rowKey={(record) => record._id || ''}
                loading={loading}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: meta?.total ?? accounts.length,
                    showSizeChanger: true,
                    pageSizeOptions: [5, 10, 20, 50],
                }}
                onChange={handleTableChange}
            />

            <ModalCreateAccount
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={() => {
                    setPage(1);
                    fetchAccounts();
                }}
            />

            <ModalEditAccount
                open={editOpen}
                id={editingId}
                onClose={() => { setEditOpen(false); setEditingId(undefined); }}
                onUpdated={() => fetchAccounts()}
            />

        </div>
    )
}

export default AccountManagement;
