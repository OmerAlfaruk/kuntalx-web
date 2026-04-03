import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth, type User } from '../../../lib/auth-context';
import { AuthRepositoryImpl } from '../api/auth-repository-impl';
import type { RegisterRequest } from '../api/auth-repository';
import { KuntalXLogo } from '../../../shared/components/Logo';
import { KuntalLoader, OtpInput } from '../../../shared/components/UI';

const repo = new AuthRepositoryImpl();

type Step = 'PHONE' | 'OTP' | 'DETAILS';

const inputCls = "w-full h-14 px-6 bg-background border border-border rounded-xl focus:bg-card focus:border-primary outline-none font-bold text-sm text-foreground transition-all";

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [step, setStep] = useState<Step>('PHONE');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [regToken, setRegToken] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState<'buyer' | 'farmer'>('farmer');
    const [isMiniAssociation, setIsMiniAssociation] = useState(true);
    const [businessName, setBusinessName] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [region, setRegion] = useState('');
    const [zone, setZone] = useState('');
    const [woreda, setWoreda] = useState('');
    const [kebele, setKebele] = useState('');
    const [farmSize, setFarmSize] = useState('');
    const [capacity, setCapacity] = useState('');

    const [buyerType, setBuyerType] = useState('wholesaler');

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            let fP = phone;
            if (fP.startsWith('0')) fP = '+251' + fP.slice(1);
            else if (!fP.startsWith('+')) fP = '+251' + fP;
            await repo.requestOtp(fP);
            setPhone(fP);
            setStep('OTP');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Could not send verification code. Check your phone number.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const response = await repo.verifyOtp(phone, otp);
            setRegToken(response.registrationToken);
            setStep('DETAILS');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid verification code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (pin !== confirmPin) { setError('PINs do not match.'); return; }
        if (pin.length !== 6) { setError('PIN must be exactly 6 digits.'); return; }
        setIsLoading(true);
        try {
            const authData: RegisterRequest = {
                registrationToken: regToken,
                phone,
                fullName: fullName,
                pin,
                preferredLanguage: 'en',
                role: role,
            };

            if (role === 'buyer') {
                authData.buyerData = {
                    businessName: businessName,
                    buyerType: buyerType as any,
                    region: region,
                    woreda: woreda,
                    contactPhone: contactPhone || undefined,
                    licenseNumber: licenseNumber || undefined
                };
            } else {
                authData.farmerData = {
                    region: region,
                    zone: zone,
                    woreda: woreda,
                    kebele: kebele || undefined,
                    farmSizeHectares: farmSize ? parseFloat(farmSize) : undefined,
                    productionCapacityKuntal: capacity ? parseFloat(capacity) : 0,
                    isMiniAssociation: isMiniAssociation
                };
            }

            const response = await repo.register(authData);

            const user: User = {
                id: response.user.id,
                phone: response.user.phone,
                email: response.user.email,
                fullName: response.user.fullName,
                role: response.user.role as any,
                profileId: response.profileId,
                profileType: response.profileType,
                preferredLanguage: response.user.preferredLanguage,
                farmerData: response.user.farmerData ? {
                    isMiniAssociation: response.user.farmerData.isMiniAssociation,
                    defaultPayoutMethod: response.user.farmerData.defaultPayoutMethod,
                    payoutPaymentDetails: response.user.farmerData.payoutPaymentDetails
                } : undefined
            };
            login(response.accessToken, response.refreshToken, user);
            navigate({ to: '/dashboard' });
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Registration failed. Please check your details.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <KuntalLoader />;
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8 relative overflow-hidden font-sans transition-colors duration-500">
            <button
                onClick={() => navigate({ to: '/' })}
                className="fixed top-4 left-4 sm:top-12 sm:left-12 w-10 h-10 rounded-lg flex items-center justify-center bg-card border border-border shadow-minimal hover:bg-background-soft transition-all z-50 group"
            >
                <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            </button>

            <div className="fixed inset-0 bg-secondary/[0.02] pointer-events-none" />

            <div className={`w-full max-w-[800px] relative z-10 animate-fade-in`}>
                <div className="mb-8 flex flex-col items-center group cursor-pointer" onClick={() => navigate({ to: '/' })}>
                    <KuntalXLogo showTagline={true} />
                </div>

                <div className="bg-card rounded-xl p-8 sm:p-12 card-minimal flex flex-col gap-8 relative transition-colors duration-500">
                    {/* Dynamic Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary/10 rounded-t-xl overflow-hidden">
                        <div className={`h-full bg-secondary transition-all duration-700 ${step === 'PHONE' ? 'w-1/3' : step === 'OTP' ? 'w-2/3' : 'w-full'} animate-pulse`} />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border">
                        <div className="space-y-1">
                            <h1 className="text-4xl font-bold text-primary tracking-tight uppercase leading-tight">
                                {step === 'PHONE' && 'Join KuntalX.'}
                                {step === 'OTP' && 'Check Code.'}
                                {step === 'DETAILS' && 'Profile Details.'}
                            </h1>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                                {step === 'PHONE' && 'Enter your phone number.'}
                                {step === 'OTP' && 'Enter the 6-digit code we sent.'}
                                {step === 'DETAILS' && 'Finish your profile.'}
                            </p>
                        </div>
                    </div>



                    {step === 'PHONE' && (
                        <form onSubmit={handleRequestOtp} className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 items-end">
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Phone Number</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-primary/50 text-sm border-r border-border pr-4 group-focus-within:text-primary transition-colors leading-none">+251</div>
                                    <input
                                        type="tel"
                                        placeholder="911 000 000"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
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
                                {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Get Code</span> <span className="text-xl text-secondary group-hover:translate-x-1 transition-transform">→</span></>}
                            </button>
                        </form>
                    )}

                    {step === 'OTP' && (
                        <form onSubmit={handleVerifyOtp} className="space-y-8">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 items-end">
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] block ml-1">Code sent to {phone}_</label>
                                    <OtpInput
                                        value={otp}
                                        onChange={(val: string) => setOtp(val)}
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
                            </div>

                            {error && (
                                <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl text-xs font-bold text-rose-500 text-center uppercase tracking-widest animate-pulse">
                                    [!] {error}
                                </div>
                            )}

                            <div className="text-center">
                                <button type="button" onClick={() => setStep('PHONE')} className="text-[10px] font-bold text-muted-foreground hover:text-secondary uppercase tracking-[0.4em] transition-all">
                                    Use a different number
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 'DETAILS' && (
                        <form onSubmit={handleRegister} className="space-y-8">
                            {/* Role Selection */}
                            <div className="flex bg-background border border-border p-1 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setRole('farmer')}
                                    className={`flex-1 h-12 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-all ${role === 'farmer' ? 'bg-primary text-white shadow-minimal' : 'text-muted-foreground hover:text-primary'}`}
                                >
                                    Individual Producer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('buyer')}
                                    className={`flex-1 h-12 rounded-lg font-bold uppercase tracking-widest text-[10px] transition-all ${role === 'buyer' ? 'bg-primary text-white shadow-minimal' : 'text-muted-foreground hover:text-primary'}`}
                                >
                                    Institutional Buyer
                                </button>
                            </div>

                            {/* Mini-Association Toggle for Farmers */}
                            {role === 'farmer' && (
                                <div className="p-4 bg-secondary/5 border border-secondary/10 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-500">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-primary uppercase tracking-wider">Self-Managed (Mini-Association)</p>
                                        <p className="text-[10px] text-muted-foreground uppercase opacity-60">List produce & manage sales independently.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsMiniAssociation(!isMiniAssociation)}
                                        className={`w-12 h-6 rounded-full transition-all relative ${isMiniAssociation ? 'bg-secondary' : 'bg-muted'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${isMiniAssociation ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Full Name</label>
                                    <input type="text" className={inputCls} placeholder="e.g. Abebe Bikila" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                                </div>
                                {role === 'buyer' ? (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Business Name</label>
                                            <input type="text" className={inputCls} placeholder="e.g. Sidama Pride Coffee" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Category</label>
                                            <select className={inputCls} value={buyerType} onChange={(e) => setBuyerType(e.target.value)}>
                                                <option value="wholesaler">Institutional Wholesaler</option>
                                                <option value="retailer">Regional Aggregator</option>
                                                <option value="processor">Hub Processor</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">License Number</label>
                                            <input type="text" className={inputCls} placeholder="e.g. LIC-12345" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Contact Phone</label>
                                            <input type="tel" className={inputCls} placeholder="e.g. 0911000000" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Zone / Sub-City</label>
                                            <input type="text" className={inputCls} placeholder="e.g. West Arsi" value={zone} onChange={(e) => setZone(e.target.value)} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Kebele</label>
                                            <input type="text" className={inputCls} placeholder="e.g. 01" value={kebele} onChange={(e) => setKebele(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Farm Size (Hectares)</label>
                                            <input type="number" step="0.1" className={inputCls} placeholder="e.g. 2.5" value={farmSize} onChange={(e) => setFarmSize(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Production Capacity (Kuntal)</label>
                                            <input type="number" step="0.1" className={inputCls} placeholder="e.g. 100" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
                                        </div>
                                    </>
                                )}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Region</label>
                                    <input type="text" className={inputCls} placeholder="e.g. Oromia" value={region} onChange={(e) => setRegion(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Woreda</label>
                                    <input type="text" className={inputCls} placeholder="e.g. Dale" value={woreda} onChange={(e) => setWoreda(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">PIN (6 Digits)</label>
                                    <OtpInput value={pin} onChange={(val: string) => setPin(val)} obscureText={true} disabled={isLoading} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 block">Confirm PIN</label>
                                    <OtpInput value={confirmPin} onChange={(val: string) => setConfirmPin(val)} obscureText={true} disabled={isLoading} />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl text-xs font-bold text-rose-500 text-center uppercase tracking-widest animate-pulse">
                                    [!] {error}
                                </div>
                            )}

                            <button type="submit" disabled={isLoading} className="w-full h-14 bg-primary text-white rounded-xl font-bold uppercase tracking-[0.2em] shadow-minimal hover:bg-primary-soft hover:-translate-y-0.5 transition-all flex items-center justify-center">
                                {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Complete Registration'}
                            </button>
                        </form>
                    )}

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => navigate({ to: '/login' })}
                            className="text-[10px] font-bold text-primary hover:text-primary-soft transition-all uppercase tracking-[0.4em] text-center"
                        >
                            Have an account? Sign In →
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
