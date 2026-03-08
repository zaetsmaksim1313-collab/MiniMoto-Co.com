"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="admin-main">
                {children}
            </main>

            <style jsx global>{`
                body {
                    background: #f1f1f1;
                    color: #1a1a1a;
                    margin: 0;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                }

                .admin-container {
                    display: flex;
                    min-height: 100vh;
                }

                .admin-main {
                    flex: 1;
                    margin-left: 240px;
                    padding: 32px;
                    max-width: 1200px;
                }

                .admin-card {
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
                    padding: 24px;
                    margin-bottom: 24px;
                }

                .admin-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 24px;
                    color: #1a1a1a;
                }

                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .admin-table th {
                    text-align: left;
                    padding: 12px;
                    border-bottom: 1px solid #ebebeb;
                    color: #6d6d6d;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .admin-table td {
                    padding: 12px;
                    border-bottom: 1px solid #ebebeb;
                    vertical-align: middle;
                }

                .badge {
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .badge-active { background: #e3f9ee; color: #007f5f; }
                .badge-draft { background: #f1f1f1; color: #616161; }

                .btn-admin {
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 0.85rem;
                    cursor: pointer;
                    border: 1px solid #dcdcdc;
                    background: #fff;
                    color: #1a1a1a;
                }

                .btn-admin-primary {
                    background: #1a1a1a;
                    color: #fff;
                    border: none;
                }

                .btn-admin-primary:hover {
                    background: #333;
                }
            `}</style>
        </div>
    );
}
