'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SecurityPage() {
    const [activeTab, setActiveTab] = useState('2fa'); // '2fa', 'devices', 'logs'
    const [twoFAData, setTwoFAData] = useState(null);
    const [devices, setDevices] = useState([]);
    const [logs, setLogs] = useState([]);
    const [qrCode, setQrCode] = useState(null);
    const [secret, setSecret] = useState(null);
    const [backupCodes, setBackupCodes] = useState([]);
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSecurityData();
    }, [activeTab]);

    const fetchSecurityData = async () => {
        try {
            const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

            if (activeTab === '2fa') {
                const response = await axios.get('/api/security/2fa/status', { headers });
                setTwoFAData(response.data.data);
            } else if (activeTab === 'devices') {
                const response = await axios.get('/api/security/devices', { headers });
                setDevices(response.data.data || []);
            } else if (activeTab === 'logs') {
                const response = await axios.get('/api/security/logs?limit=20', { headers });
                setLogs(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching security data:', error);
        } finally {
            setLoading(false);
        }
    };

    const setup2FA = async () => {
        try {
            const response = await axios.post('/api/security/2fa/setup', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setQrCode(response.data.data.qrCode);
            setSecret(response.data.data.secret);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to setup 2FA');
        }
    };

    const enable2FA = async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            alert('Please enter a valid 6-digit code');
            return;
        }
        try {
            const response = await axios.post('/api/security/2fa/enable',
                { token: verificationCode },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setBackupCodes(response.data.data.backupCodes);
            setQrCode(null);
            fetchSecurityData();
            alert('2FA enabled successfully! Save your backup codes.');
        } catch (error) {
            alert(error.response?.data?.message || 'Invalid verification code');
        }
    };

    const disable2FA = async () => {
        if (!confirm('Are you sure you want to disable 2FA? This will reduce your account security.')) return;
        try {
            await axios.post('/api/security/2fa/disable', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchSecurityData();
            alert('2FA disabled');
        } catch (error) {
            alert('Failed to disable 2FA');
        }
    };

    const removeDevice = async (deviceId) => {
        if (!confirm('Remove this trusted device?')) return;
        try {
            await axios.delete(`/api/security/devices/${deviceId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchSecurityData();
        } catch (error) {
            alert('Failed to remove device');
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'text-red-400 bg-red-500/20';
            case 'high': return 'text-orange-400 bg-orange-500/20';
            case 'medium': return 'text-yellow-400 bg-yellow-500/20';
            default: return 'text-blue-400 bg-blue-500/20';
        }
    };

    const getEventIcon = (eventType) => {
        const icons = {
            login_success: '✅',
            login_failed: '❌',
            '2fa_enabled': '🔒',
            '2fa_disabled': '🔓',
            password_changed: '🔑',
            withdrawal: '💰',
            suspicious_activity: '⚠️'
        };
        return icons[eventType] || '📝';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 pt-16 sm:pt-20 pb-10 sm:pb-12 px-3 sm:px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-600 mb-4">
                        Security Settings
                    </h1>
                    <p className="text-gray-300 text-lg">Protect your account with advanced security features</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 sm:gap-4 mb-8 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab('2fa')}
                        className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all whitespace-nowrap text-sm sm:text-base ${activeTab === '2fa'
                            ? 'bg-red-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                    >
                        🔒 Two-Factor Auth
                    </button>
                    <button
                        onClick={() => setActiveTab('devices')}
                        className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all whitespace-nowrap text-sm sm:text-base ${activeTab === 'devices'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                    >
                        📱 Trusted Devices
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all whitespace-nowrap text-sm sm:text-base ${activeTab === 'logs'
                            ? 'bg-orange-600 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                    >
                        📜 Security Logs
                    </button>
                </div>

                {/* 2FA Tab */}
                {activeTab === '2fa' && (
                    <div className="space-y-6">
                        {/* Status Card */}
                        <div className={`bg-white/10 backdrop-blur-md rounded-3xl p-5 sm:p-8 border-2 ${twoFAData?.isEnabled ? 'border-green-500/50' : 'border-red-500/50'
                            }`}>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl ${twoFAData?.isEnabled ? 'bg-green-500/20' : 'bg-red-500/20'
                                        }`}>
                                        {twoFAData?.isEnabled ? '✓' : '✗'}
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-2xl font-bold text-white mb-1">
                                            Two-Factor Authentication
                                        </h3>
                                        <p className={`text-sm sm:text-base ${twoFAData?.isEnabled ? 'text-green-400' : 'text-red-400'}`}>
                                            {twoFAData?.isEnabled ? 'Enabled - Your account is protected' : 'Disabled - Enable for better security'}
                                        </p>
                                    </div>
                                </div>
                                {!twoFAData?.isEnabled && !qrCode && (
                                    <button
                                        onClick={setup2FA}
                                        className="px-5 sm:px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all min-h-[44px] w-full sm:w-auto"
                                    >
                                        Enable 2FA
                                    </button>
                                )}
                                {twoFAData?.isEnabled && (
                                    <button
                                        onClick={disable2FA}
                                        className="px-5 sm:px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all min-h-[44px] w-full sm:w-auto"
                                    >
                                        Disable 2FA
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Setup Flow */}
                        {qrCode && (
                            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 sm:p-8 border border-white/20">
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Setup Two-Factor Authentication</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Step 1: Scan QR */}
                                    <div>
                                        <div className="bg-white p-4 rounded-xl mb-4">
                                            <img src={qrCode} alt="QR Code" className="w-full" width="256" height="256" />
                                        </div>
                                        <p className="text-gray-300 text-sm">
                                            Scan this QR code with Google Authenticator, Authy, or any TOTP authenticator app
                                        </p>
                                        <div className="mt-4 p-4 bg-white/5 rounded-xl">
                                            <div className="text-gray-400 text-xs mb-1">Manual Entry Code:</div>
                                            <div className="text-white font-mono text-sm break-all">{secret}</div>
                                        </div>
                                    </div>

                                    {/* Step 2: Verify */}
                                    <div>
                                        <h4 className="text-white font-bold mb-4">Enter Verification Code</h4>
                                        <input
                                            type="text"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="000000"
                                            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-center text-2xl font-mono tracking-widest mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            maxLength={6}
                                        />
                                        <button
                                            onClick={enable2FA}
                                            disabled={verificationCode.length !== 6}
                                            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all"
                                        >
                                            Verify & Enable
                                        </button>
                                        <p className="text-gray-400 text-sm mt-4">
                                            Enter the 6-digit code from your authenticator app
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Backup Codes */}
                        {backupCodes.length > 0 && (
                            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-3xl p-5 sm:p-8 border-2 border-yellow-500/50">
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">⚠️ Save Your Backup Codes</h3>
                                <p className="text-gray-300 mb-6">
                                    These codes can be used to access your account if you lose your authenticator device.
                                    Each code can only be used once. Store them safely!
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                                    {backupCodes.map((code, idx) => (
                                        <div key={idx} className="bg-white/10 p-3 rounded-lg text-center">
                                            <div className="text-white font-mono font-bold">{code}</div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(backupCodes.join('\n'));
                                        alert('Backup codes copied to clipboard!');
                                    }}
                                    className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-semibold transition-all min-h-[44px] w-full sm:w-auto"
                                >
                                    📋 Copy All Codes
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Devices Tab */}
                {activeTab === 'devices' && (
                    <div className="space-y-4">
                        {devices.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📱</div>
                                <p className="text-gray-400 text-lg">No trusted devices</p>
                            </div>
                        ) : (
                            devices.map((device) => (
                                <div key={device._id} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-blue-500/20 flex items-center justify-center text-xl sm:text-2xl">
                                                {device.deviceType === 'mobile' ? '📱' : '💻'}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold text-base sm:text-lg">{device.deviceName}</h3>
                                                <p className="text-gray-400 text-sm">
                                                    Last used: {new Date(device.lastUsed).toLocaleString()}
                                                </p>
                                                <p className="text-gray-500 text-xs">IP: {device.ipAddress}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeDevice(device._id)}
                                            className="px-5 sm:px-6 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-semibold transition-all min-h-[44px] w-full sm:w-auto"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Logs Tab */}
                {activeTab === 'logs' && (
                    <div className="space-y-3">
                        {logs.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📜</div>
                                <p className="text-gray-400 text-lg">No security logs</p>
                            </div>
                        ) : (
                            logs.map((log) => (
                                <div key={log._id} className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-5 border border-white/20">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="text-2xl sm:text-3xl">{getEventIcon(log.eventType)}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                                    <h4 className="text-white font-semibold">
                                                        {log.eventType.replace(/_/g, ' ').toUpperCase()}
                                                    </h4>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(log.severity)}`}>
                                                        {log.severity}
                                                    </span>
                                                </div>
                                                <p className="text-gray-400 text-sm mb-2">{log.description}</p>
                                                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-gray-500">
                                                    <span>🕒 {new Date(log.createdAt).toLocaleString()}</span>
                                                    <span>📍 {log.ipAddress}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
