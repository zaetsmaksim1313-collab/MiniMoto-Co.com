'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
    { name: 'Home', href: '/admin', icon: '🏠' },
    { name: 'Orders', href: '/admin/orders', icon: '📦' },
    { name: 'Products', href: '/admin/products', icon: '🏷️' },
    { name: 'Finance', href: '/admin/finance', icon: '💰' },
    { name: 'Analytics', href: '/admin/analytics', icon: '📊' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <div className="shop-info">
                    <div className="shop-icon">M</div>
                    <div className="shop-details">
                        <span className="shop-name">Mini Moto & Co</span>
                        <span className="user-name">Maksim Zaets</span>
                    </div>
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                    >
                        <span className="icon">{item.icon}</span>
                        <span className="label">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <Link href="/admin/settings" className="nav-item">
                    <span className="icon">⚙️</span>
                    <span className="label">Settings</span>
                </Link>
            </div>

            <style jsx>{`
                .admin-sidebar {
                    width: 240px;
                    background: #ebebeb;
                    color: #1a1a1a;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid #dcdcdc;
                    position: fixed;
                    left: 0;
                    top: 0;
                    padding: 12px;
                }

                .sidebar-header {
                    padding: 12px 8px;
                    margin-bottom: 16px;
                }

                .shop-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: #fff;
                    padding: 8px;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .shop-icon {
                    width: 32px;
                    height: 32px;
                    background: #4a4a4a;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    font-weight: 700;
                }

                .shop-details {
                    display: flex;
                    flex-direction: column;
                }

                .shop-name {
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .user-name {
                    font-size: 0.75rem;
                    opacity: 0.6;
                }

                .sidebar-nav {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 8px 12px;
                    border-radius: 6px;
                    text-decoration: none;
                    color: #1a1a1a;
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: all 0.2s;
                }

                .nav-item:hover {
                    background: #e1e1e1;
                }

                .nav-item.active {
                    background: #fff;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }

                .icon {
                    font-size: 1.1rem;
                    width: 20px;
                    text-align: center;
                }

                .sidebar-footer {
                    margin-top: auto;
                    padding-top: 12px;
                    border-top: 1px solid #dcdcdc;
                }
            `}</style>
        </aside>
    );
}
