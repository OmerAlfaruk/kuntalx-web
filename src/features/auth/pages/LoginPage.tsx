import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth, type User } from '../../../lib/auth-context';
import { KuntalXLogo } from '../../../shared/components/Logo';
import { KuntalLoader, OtpInput } from '../../../shared/components/UI';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Login Flow State
    const [loginStep, setLoginStep] = useState<'PHONE' | 'PIN'>('PHONE');

    // Forget PIN Flow State
    const [mode, setMode] = useState<'LOGIN' | 'FORGOT_PIN'>('LOGIN');
    const [forgotStep, setForgotStep] = useState<'PHONE' | 'OTP' | 'RESET'>('PHONE');
    const [otpCode, setOtpCode] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [resetToken, setResetToken] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate({ to: '/dashboard' });
        }
    }, [isAuthenticated, navigate]);

    const formatPhone = (phone: string) => {
        let formatted = phone.trim();
        if (formatted.startsWith('0')) formatted = '+251' + formatted.slice(1);
        else if (!formatted.startsWith('+')) formatted = '+251' + formatted;
        return formatted;
    };

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (phoneNumber.length < 9) {
            setError('Please provide a valid phone number.');
            return;
        }
        setIsLoading(true);

        try {
            const { AuthRepositoryImpl } = await import('../api/auth-repository-impl');
            const { CheckPhoneUseCase } = await import('../services/check-phone-usecase');
            const repo = new AuthRepositoryImpl();
            const checkPhoneUseCase = new CheckPhoneUseCase(repo);

            const exists = await checkPhoneUseCase.execute(formatPhone(phoneNumber));
            if (exists) {
                setLoginStep('PIN');
            } else {
                setError('Phone number not registered. Please register first.');
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to verify phone number.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePinSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError(null);
        if (pinCode.length !== 6) {
            setError('Please provide a valid 6-digit PIN.');
            return;
        }
        setIsLoading(true);

        try {
            const { AuthRepositoryImpl } = await import('../api/auth-repository-impl');
            const { LoginUseCase } = await import('../services/login-usecase');
            const repo = new AuthRepositoryImpl();
            const loginUseCase = new LoginUseCase(repo);

            const response = await loginUseCase.execute(formatPhone(phoneNumber), pinCode);
            const user: User = {
                id: response.user.id,
                phone: response.user.phone,
                email: response.user.email,
                fullName: response.user.fullName,
                role: response.user.role as any,
                profileId: response.profileId,
                profileType: response.profileType,
                preferredLanguage: response.user.preferredLanguage
            };
            login(response.accessToken, response.refreshToken, user);
            navigate({ to: '/dashboard' });
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid phone or PIN. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPinRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const { AuthRepositoryImpl } = await import('../api/auth-repository-impl');
            const repo = new AuthRepositoryImpl();
            await repo.forgotPin(formatPhone(phoneNumber));
            setForgotStep('OTP');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Could not send reset code.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyForgotOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const { AuthRepositoryImpl } = await import('../api/auth-repository-impl');
            const repo = new AuthRepositoryImpl();
            const response = await repo.verifyForgotPinOtp(formatPhone(phoneNumber), otpCode);
            setResetToken(response.pinResetToken);
            setForgotStep('RESET');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid reset code.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (newPin !== confirmPin) {
            setError('PINs do not match.');
            return;
        }
        if (newPin.length !== 6) {
            setError('PIN must be 6 digits.');
            return;
        }
        setIsLoading(true);
        try {
            const { AuthRepositoryImpl } = await import('../api/auth-repository-impl');
            const repo = new AuthRepositoryImpl();
            await repo.resetPin(resetToken, newPin);
            setMode('LOGIN');
            setForgotStep('PHONE');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to reset PIN.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <KuntalLoader />;
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8 relative overflow-hidden font-sans transition-colors duration-500">
            {/* Back to Home */}
            <button
                onClick={() => navigate({ to: '/' })}
                className="fixed top-4 left-4 sm:top-12 sm:left-12 w-10 h-10 rounded-lg flex items-center justify-center bg-card border border-border shadow-minimal hover:bg-background-soft transition-all z-50 group"
            >
                <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            </button>

            {/* Background Blobs */}
            <div className="fixed inset-0 bg-secondary/[0.02] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />

            <div className="w-full max-w-[800px] relative z-10 animate-fade-in">
                <div className="mb-8 flex flex-col items-center group cursor-pointer" onClick={() => navigate({ to: '/' })}>
                    <KuntalXLogo showTagline={true} />
                </div>

                <div className="bg-card rounded-xl p-8 sm:p-12 card-minimal flex flex-col gap-8 relative transition-colors duration-500">
                    {/* Warm Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary/10 rounded-t-xl overflow-hidden">
                        <div className="h-full bg-secondary w-1/4 animate-pulse" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border">
                        <div className="space-y-1">
                            <h1 className="text-4xl font-bold text-primary tracking-tight uppercase leading-tight">
                                {mode === 'LOGIN' ? 'Welcome Back.' : 'Forgot PIN.'}
                            </h1>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                                {mode === 'LOGIN' ? 'Sign in to your account.' : 'Reset your security code.'}
                            </p>
                        </div>
                    </div>

                    {mode === 'LOGIN' ? (
                        <div className="space-y-8">
                            {loginStep === 'PHONE' ? (
                                <form onSubmit={handlePhoneSubmit} className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 items-end">
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Phone Number</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-primary/50 text-sm border-r border-border pr-4 group-focus-within:text-primary transition-colors leading-none">+251</div>
                                            <input
                                                type="tel"
                                                placeholder="911 000 000"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                className="w-full h-14 pl-24 pr-6 bg-background border border-border rounded-xl focus:bg-card focus:border-primary outline-none transition-all font-bold text-lg text-foreground"
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="md:col-span-3 p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl text-xs font-bold text-rose-500 text-center uppercase tracking-widest animate-pulse">
                                            [!] {error}
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-14 bg-primary text-white rounded-xl font-bold uppercase tracking-[0.2em] shadow-minimal hover:bg-primary-soft hover:-translate-y-0.5 transition-all flex items-center justify-center gap-4 group"
                                    >
                                        {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Next</span> <span className="text-xl text-secondary group-hover:translate-x-1 transition-transform">→</span></>}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handlePinSubmit} className="space-y-8">
                                    <div className="text-center mb-6">
                                        <p className="text-[10px] text-foreground font-bold uppercase tracking-widest opacity-60">Enter PIN for +251 {phoneNumber}</p>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center ml-1">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] block">PIN</label>
                                            <button
                                                type="button"
                                                onClick={() => setMode('FORGOT_PIN')}
                                                className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] hover:text-primary transition-all"
                                            >
                                                Forgot PIN?
                                            </button>
                                        </div>
                                        <OtpInput
                                            value={pinCode}
                                            onChange={(val) => setPinCode(val)}
                                            obscureText={true}
                                            disabled={isLoading}
                                            autoFocus
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl text-xs font-bold text-rose-500 text-center uppercase tracking-widest animate-pulse">
                                            [!] {error}
                                        </div>
                                    )}



                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-14 bg-primary text-white rounded-xl font-bold uppercase tracking-[0.2em] shadow-minimal hover:bg-primary-soft hover:-translate-y-0.5 transition-all flex items-center justify-center gap-6 group"
                                    >
                                        {isLoading ? 'Processing...' : <><span>Sign In</span> <span className="text-xl text-secondary group-hover:translate-x-1 transition-transform">→</span></>}
                                    </button>

                                    <div className="text-center mt-4">
                                        <button
                                            type="button"
                                            onClick={() => { setLoginStep('PHONE'); setError(null); setPinCode(''); }}
                                            className="text-[10px] font-bold text-primary hover:text-primary-soft transition-all uppercase tracking-[0.5em]"
                                        >
                                            ← Use different phone number
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {forgotStep === 'PHONE' && (
                                <form onSubmit={handleForgotPinRequest} className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 items-end">
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Phone Number</label>
                                        <div className="relative group">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-primary/50 text-sm border-r border-border pr-4 group-focus-within:text-primary transition-colors leading-none">+251</div>
                                            <input
                                                type="tel"
                                                placeholder="911 000 000"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                className="w-full h-14 pl-24 pr-6 bg-background border border-border rounded-xl focus:bg-card focus:border-primary outline-none transition-all font-bold text-lg text-foreground"
                                                required
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-14 bg-primary text-white rounded-xl font-bold uppercase tracking-[0.2em] shadow-minimal hover:bg-primary-soft hover:-translate-y-0.5 transition-all flex items-center justify-center gap-4 group"
                                    >
                                        {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Send Code</span> <span className="text-xl text-secondary group-hover:translate-x-1 transition-transform">→</span></>}
                                    </button>
                                </form>
                            )}

                            {forgotStep === 'OTP' && (
                                <form onSubmit={handleVerifyForgotOtp} className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 items-end">
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] block ml-1">Reset code sent to {phoneNumber}_</label>
                                        <OtpInput
                                            value={otpCode}
                                            onChange={(val) => setOtpCode(val)}
                                            obscureText={false}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-14 bg-primary-soft text-white rounded-xl font-bold uppercase tracking-[0.2em] shadow-minimal hover:-translate-y-0.5 transition-all flex items-center justify-center gap-4 group"
                                    >
                                        {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Verify</span> <span className="text-xl text-secondary group-hover:translate-x-1 transition-transform">→</span></>}
                                    </button>
                                </form>
                            )}

                            {forgotStep === 'RESET' && (
                                <form onSubmit={handleResetPin} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">New PIN</label>
                                            <OtpInput
                                                value={newPin}
                                                onChange={(val) => setNewPin(val)}
                                                obscureText={true}
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Confirm PIN</label>
                                            <OtpInput
                                                value={confirmPin}
                                                onChange={(val) => setConfirmPin(val)}
                                                obscureText={true}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-14 bg-primary text-white rounded-xl font-bold uppercase tracking-[0.2em] shadow-minimal hover:bg-primary-soft hover:-translate-y-0.5 transition-all flex items-center justify-center"
                                    >
                                        {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Set New PIN'}
                                    </button>
                                </form>
                            )}

                            {error && (
                                <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl text-xs font-bold text-rose-500 text-center uppercase tracking-widest animate-pulse">
                                    [!] {error}
                                </div>
                            )}

                            <div className="text-center">
                                <button
                                    onClick={() => { setMode('LOGIN'); setForgotStep('PHONE'); setError(null); setLoginStep('PHONE'); }}
                                    className="text-[10px] font-bold text-primary hover:text-primary-soft transition-all uppercase tracking-[0.4em]"
                                >
                                    ← Back to Login
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => navigate({ to: '/register' })}
                            className="text-[10px] font-bold text-primary hover:text-primary-soft transition-all uppercase tracking-[0.4em] text-center"
                        >
                            No account yet? Register Now →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
