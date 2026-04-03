import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../lib/auth-context';
import { KuntalXLogo } from '../../../shared/components/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../lib/theme-context';
import { LanguageSwitcher } from '../../../shared/components/LanguageSwitcher';
import { useI18n } from '../../../lib/i18n-context';

export const LandingPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { t } = useI18n();
    const [scrolled, setScrolled] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            navigate({ to: '/dashboard' });
        }
    }, [isAuthenticated, navigate]);

    // INDUSTRY-STANDARD SEO & META REFINEMENT
    useEffect(() => {
        const pageTitle = `KuntalX | ${t('marketing.hero.title')}`;
        const pageDesc = t('marketing.hero.subtitle');

        document.title = pageTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', pageDesc);
        } else {
            const meta = document.createElement('meta');
            meta.name = "description";
            meta.content = pageDesc;
            document.head.appendChild(meta);
        }
    }, [t]);

    // STANDARD "LOADING" ANIMATION BUILDER
    const getAnim = (delay = 0) => ({
        initial: { opacity: 0, y: 100 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-10% 0px -10% 0px" },
        transition: {
            duration: 1.8,
            delay: delay,
            ease: [0.16, 1, 0.3, 1] as const // High-end "out-expo" characteristic
        }
    });

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/10 overflow-x-hidden font-sans">

            {/* 1. PROFESSIONAL FIXED HEADER */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-background/98 backdrop-blur-xl py-3 border-b border-border/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="cursor-pointer transition-transform hover:scale-105 duration-300" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <KuntalXLogo showTagline={!scrolled} variant={scrolled ? 'dark' : 'light'} />
                    </div>

                    <nav className="hidden xl:flex items-center gap-12">
                        {[
                            { key: 'features', id: 'features' },
                            { key: 'impact', id: 'impact' },
                            { key: 'howItWorks', id: 'how-it-works' },
                            { key: 'about', id: 'about' },
                            { key: 'contact', id: 'contact' }
                        ].map((item) => (
                            <a key={item.key} href={`#${item.id}`} className={`text-sm font-semibold hover:text-primary transition-all duration-300 relative group ${scrolled ? 'text-foreground' : 'text-white'}`}>
                                {t(`marketing.nav.${item.key}`)}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleTheme}
                            className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-center ${scrolled
                                ? 'bg-muted/10 border-border text-foreground hover:bg-muted/20 hover:border-primary/30'
                                : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40'
                                }`}
                            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={theme}
                                    initial={{ y: 10, opacity: 0, rotate: -90 }}
                                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                                    exit={{ y: -10, opacity: 0, rotate: 90 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                >
                                    {theme === 'light' ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="5"></circle>
                                            <line x1="12" y1="1" x2="12" y2="3"></line>
                                            <line x1="12" y1="21" x2="12" y2="23"></line>
                                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                            <line x1="1" y1="12" x2="3" y2="12"></line>
                                            <line x1="21" y1="12" x2="23" y2="12"></line>
                                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                        </svg>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </motion.button>

                        <LanguageSwitcher variant="dropdown" />

                        <div className="hidden lg:flex items-center gap-3 border-l border-white/10 pl-4 ml-2">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate({ to: '/login' })}
                                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${scrolled ? 'text-foreground hover:bg-muted/10' : 'text-white hover:bg-white/10'}`}
                            >
                                {t('nav.signIn')}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(var(--primary-rgb), 0.25)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate({ to: '/register' })}
                                className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-lg hover:bg-primary/90 transition-all duration-300"
                            >
                                {t('nav.getStarted')}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {/* 2. ENHANCED HERO SECTION */}
                <section id="home" className="relative min-h-screen flex items-center justify-center pt-32 pb-24 px-6 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80')] bg-cover bg-center brightness-[0.4]" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-background" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.15),transparent_70%)]" />
                    </div>

                    <motion.div
                        {...getAnim(0.2)}
                        className="relative z-10 max-w-6xl mx-auto text-center space-y-14"
                    >
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white/90 text-xs font-bold uppercase tracking-wider"
                            >
                                <span className="w-2 h-2 bg-secondary-soft rounded-full animate-pulse"></span>
                                Transforming Ethiopian Agriculture
                            </motion.div>

                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tight leading-[0.95] uppercase">
                                {t('marketing.hero.title')}
                            </h1>
                        </div>

                        <p className="text-xl md:text-2xl text-white/90 font-medium max-w-4xl mx-auto leading-relaxed">
                            {t('marketing.hero.subtitle')}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-4">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(var(--secondary-rgb), 0.3)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate({ to: '/register' })}
                                className="w-full sm:w-auto h-16 px-12 bg-secondary-soft text-white rounded-xl font-bold text-sm shadow-2xl hover:brightness-110 transition-all uppercase tracking-[0.15em] flex items-center justify-center gap-3"
                            >
                                {t('marketing.hero.ctaPrimary')}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </motion.button>
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href="#features"
                                className="w-full sm:w-auto h-16 px-12 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-xl font-bold text-sm hover:bg-white/20 hover:border-white/50 transition-all uppercase tracking-[0.15em] flex items-center justify-center"
                            >
                                {t('marketing.hero.ctaSecondary')}
                            </motion.a>
                        </div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="flex flex-wrap justify-center items-center gap-8 pt-8 text-white/70 text-sm"
                        >
                            <div className="flex items-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                </svg>
                                <span className="font-semibold">2,400+ Farmers</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                </svg>
                                <span className="font-semibold">38 Associations</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                </svg>
                                <span className="font-semibold">124+ Active Lots</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* 3. PARTNER LOGOS SECTION - HORIZONTAL MARQUEE */}
                <section className="py-24 border-y border-border/50 bg-background overflow-hidden relative">
                        <div className="max-w-7xl mx-auto px-6 mb-12">
                            <motion.div {...getAnim(0)} className="text-center">
                                <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] inline-block border-b-2 border-primary/20 pb-2">
                                    {t('marketing.partners.title')}
                                </span>
                            </motion.div>
                        </div>

                        <div className="relative mask-marquee py-4">
                            <div className="flex animate-marquee gap-12 md:gap-24 items-center">
                                {/* Duplicate sets to create seamless loop */}
                                {[1, 2].map((set) => (
                                    <div key={set} className="flex gap-12 md:gap-24 items-center">
                                        {['item1', 'item2', 'item3', 'item4', 'item5'].map((key) => (
                                            <span
                                                key={key}
                                                className="text-2xl md:text-5xl font-black text-foreground/30 hover:text-primary transition-colors duration-500 tracking-tighter uppercase whitespace-nowrap cursor-default px-4"
                                            >
                                                {t(`marketing.partners.items.${key}`)}
                                            </span>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 3.5 ABOUT KUNTALX */}
                    <section className="py-24 px-6 bg-background-soft">
                        <div className="max-w-5xl mx-auto">
                            <motion.div {...getAnim(0)} className="text-center space-y-6">
                                <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] inline-block border-b-2 border-primary/20 pb-2">{t('marketing.about.badge')}</span>
                                <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight uppercase">{t('marketing.about.title')}</h2>
                                <p className="text-base md:text-lg text-muted-foreground leading-loose max-w-4xl mx-auto">
                                    {t('marketing.about.body')}
                                </p>
                            </motion.div>
                        </div>
                    </section>

                    {/* 6. HOW IT WORKS SECTION */}
                    <section id="how-it-works" className="py-32 px-6 bg-background">
                        <div className="max-w-7xl mx-auto space-y-24">
                            <motion.div
                                {...getAnim(0)}
                                className="text-center space-y-4"
                            >
                                <span className="text-secondary-soft font-bold text-[10px] uppercase tracking-[0.3em] inline-block border-b-2 border-secondary-soft/20 pb-2">{t('marketing.howItWorks.badge')}</span>
                                <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight uppercase">{t('marketing.howItWorks.title')}</h2>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                                {[
                                    { step: '01', key: 'onboarding' },
                                    { step: '02', key: 'registration' },
                                    { step: '03', key: 'pooling' },
                                    { step: '04', key: 'matching' },
                                    { step: '05', key: 'logistics' },
                                    { step: '06', key: 'payouts' }
                                ].map((item, i) => (
                                    <motion.div {...getAnim(0.5 + i * 0.1)}
                                        key={i}
                                        className="space-y-6 relative group animate-slide-up"
                                        style={{ animationDelay: `${i * 150}ms` }}
                                    >
                                        <div className="text-xs font-bold text-primary tracking-widest">{item.step} —</div>
                                        <div className="space-y-2">
                                            <h4 className="text-xl font-bold text-foreground uppercase tracking-tight">{t(`marketing.howItWorks.steps.${item.key}.title`)}</h4>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{t(`marketing.howItWorks.steps.${item.key}.desc`)}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 4. SOLUTION SECTION */}
                    <section id="features" className="py-32 px-6 bg-background-soft">
                        <div className="max-w-7xl mx-auto space-y-20 relative z-10">
                            <motion.div
                                {...getAnim(0)}
                                className="text-center space-y-4"
                            >
                                <span className="text-primary font-bold text-[10px] uppercase tracking-[0.3em] inline-block border-b-2 border-primary/20 pb-2">{t('marketing.solutions.badge')}</span>
                                <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight uppercase">{t('marketing.solutions.title')}</h2>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[
                                    { key: 'directMarket', icon: '🧑‍🌾' },
                                    { key: 'digitalAggregation', icon: '🏗️' },
                                    { key: 'liveInventory', icon: '📊' },
                                    { key: 'verifiedSettlements', icon: '💳' },
                                    { key: 'logisticsTransparency', icon: '🛰️' },
                                    { key: 'flexibleTrading', icon: '🚛' }
                                ].map((card, i) => (
                                    <motion.div
                                        key={i}
                                        {...getAnim(0.1 * i)}
                                        className="p-10 card-minimal border-transparent hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-500 group relative"
                                    >
                                        <div className="text-4xl mb-8 group-hover:scale-110 transition-transform duration-300 inline-block focus-visible:ring-2 focus-visible:ring-primary rounded-lg">{card.icon}</div>
                                        <h3 className="text-lg font-bold text-foreground mb-4 uppercase tracking-tight">{t(`marketing.solutions.cards.${card.key}.title`)}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{t(`marketing.solutions.cards.${card.key}.desc`)}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 5.8 MARKETPLACE SHOWCASE */}
                    <section className="py-32 px-6 bg-background overflow-hidden relative">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                                <motion.div {...getAnim(0.2)} className="space-y-8">
                                    <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em] inline-block border-b-2 border-primary/20 pb-2">{t('marketing.marketplace.badge')}</span>
                                    <h2 className="text-5xl md:text-7xl font-bold text-foreground tracking-tighter uppercase leading-[0.9]">{t('marketing.marketplace.title')}</h2>
                                    <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                                        {t('marketing.marketplace.subtitle')}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8">
                                        {['lots', 'associations', 'farmers'].map((key, i) => (
                                            <div key={key} className="space-y-1">
                                                <p className="text-2xl font-black text-primary tracking-tighter">{['124+', '38', '2,400+'][i]}</p>
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{t(`marketing.marketplace.stats.${key}`)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-8">
                                        <a href="/marketplace" className="h-14 px-10 bg-primary text-white rounded-lg font-bold text-xs uppercase tracking-widest shadow-minimal hover:brightness-105 transition-all inline-flex items-center">
                                            View Live Marketplace
                                        </a>
                                    </div>
                                </motion.div>

                                <motion.div
                                    {...getAnim(0.4)}
                                    className="relative rounded-[3rem] border border-border/50 p-8 overflow-hidden space-y-4 bg-muted/5"
                                >
                                    {/* Mock Marketplace Lot Cards */}
                                    {[
                                        { crop: 'Arabica Coffee', assoc: 'Jimma Farmers Coop', qty: '8,400 kg', grade: 'Grade A', progress: 78 },
                                        { crop: 'White Teff', assoc: 'Addis Grain Alliance', qty: '12,000 kg', grade: 'Grade B+', progress: 55 },
                                        { crop: 'Sorghum', assoc: 'Oromia West Hub', qty: '5,200 kg', grade: 'Grade A', progress: 91 },
                                    ].map((lot, i) => (
                                        <motion.div
                                            key={lot.crop}
                                            {...getAnim(0.2 + i * 0.1)}
                                            className="card-minimal rounded-2xl p-5 space-y-3"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">{lot.crop}</p>
                                                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{lot.assoc}</p>
                                                </div>
                                                <span className="text-[9px] px-2 py-1 rounded-full bg-primary/10 text-primary font-bold tracking-widest">{lot.grade}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1 bg-border/30 rounded-full h-1">
                                                    <div className="bg-primary h-1 rounded-full transition-all" style={{ width: `${lot.progress}%` }} />
                                                </div>
                                                <span className="text-[10px] text-muted-foreground font-mono">{lot.progress}%</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{lot.qty} available</p>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </section>
                    {/* 4.5 ACTIVE MARKET STREAMS SECTION */}
                    <section id="streams" className="py-32 px-6 bg-background border-y border-border/50 relative overflow-hidden">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2" />

                        <div className="max-w-7xl mx-auto space-y-20 relative z-10">
                            <motion.div {...getAnim(0)} className="text-center space-y-4">
                                <span className="text-secondary-soft font-bold text-[10px] uppercase tracking-[0.4em]">{t('marketing.streams.badge')}</span>
                                <h2 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter">{t('marketing.streams.title')}</h2>
                            </motion.div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {[
                                    {
                                        key: 'coffee',
                                        target: '12,500 KG',
                                        progress: 85,
                                        image: 'coffee_aggregation_placeholder_1773749982228.png',
                                        tags: ['Grade A', 'Verified']
                                    },
                                    {
                                        key: 'teff',
                                        target: '45,000 KG',
                                        progress: 92,
                                        image: 'grain_aggregation_placeholder_1773750010258.png',
                                        tags: ['Premium', 'Organic']
                                    }
                                ].map((stream, i) => (
                                    <motion.div
                                        key={i}
                                        {...getAnim(0.2 * i)}
                                        className="group relative bg-background-soft border border-border rounded-3xl overflow-hidden card-minimal border-transparent"
                                    >
                                        <div className="aspect-[21/9] overflow-hidden relative">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                                            <img
                                                src={`/artifacts/${stream.image}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                alt={t(`marketing.streams.${stream.key}`)}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    if (!target.src.includes('https')) {
                                                        target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80';
                                                    }
                                                }}
                                            />
                                            <div className="absolute bottom-6 left-6 z-20 flex gap-2">
                                                {stream.tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 text-white text-[9px] font-black uppercase tracking-widest rounded-full">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-8 space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-2xl font-black text-foreground uppercase tracking-tighter">{t(`marketing.streams.${stream.key}`)}</h4>
                                                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">{t('marketing.impact.badge')}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t('marketing.streams.yield')}</p>
                                                    <p className="text-lg font-black text-primary">{stream.target}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-end">
                                                    <p className="text-[10px] font-black text-foreground uppercase tracking-widest text-secondary-soft">{t('marketing.streams.progress')}</p>
                                                    <p className="text-xl font-black text-foreground">{stream.progress}%</p>
                                                </div>
                                                <div className="h-3 bg-muted/20 rounded-full overflow-hidden border border-border/50 p-0.5">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${stream.progress}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 2, ease: "easeOut", delay: 0.5 + (0.2 * i) }}
                                                        className="h-full bg-primary rounded-full relative shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                                                    />
                                                </div>
                                            </div>

                                            <button className="w-full py-4 bg-muted/10 hover:bg-primary hover:text-white border border-border hover:border-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-xl transition-all duration-300">
                                                {t('marketing.streams.viewProtocol')}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 5. INTERACTIVE HUB MAP SECTION */}
                    <section id="impact" className="py-32 px-6 bg-card relative overflow-hidden">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                                <motion.div {...getAnim(0.2)} className="space-y-8">
                                    <span className="text-secondary-soft font-bold text-[10px] uppercase tracking-[0.4em] inline-block border-b-2 border-secondary-soft/20 pb-2">{t('marketing.impact.badge')}</span>
                                    <h2 className="text-5xl md:text-7xl font-bold text-primary tracking-tighter uppercase leading-[0.9]">{t('marketing.impact.title')}</h2>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        {t('marketing.impact.subtitle')}
                                    </p>
                                    <div className="space-y-4 pt-8">
                                        {['hub1', 'hub2', 'hub3'].map((key) => (
                                            <div key={key} className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-foreground">
                                                <span className="w-2 h-2 rounded-full bg-secondary-soft animate-pulse" />
                                                {t(`marketing.impact.${key}`)}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                <motion.div
                                    {...getAnim(0.4)}
                                    className="relative aspect-square bg-muted/5 rounded-3xl border border-border/50 p-8 flex items-center justify-center group"
                                >
                                    <svg viewBox="0 0 400 400" className="w-[80%] h-auto opacity-20">
                                        <path d="M100,50 L300,50 L350,200 L300,350 L100,350 L50,200 Z" fill="currentColor" />
                                    </svg>
                                    <div className="absolute inset-0 z-10">
                                        <div className="absolute top-[30%] left-[45%] group-hover:scale-125 transition-transform duration-500">
                                            <div className="w-4 h-4 bg-secondary-soft rounded-full animate-ping absolute opacity-75" />
                                            <div className="w-4 h-4 bg-secondary-soft rounded-full" />
                                        </div>
                                        <div className="absolute top-[60%] left-[30%] group-hover:scale-125 transition-transform duration-500">
                                            <div className="w-4 h-4 bg-primary rounded-full animate-ping absolute opacity-75" />
                                            <div className="w-4 h-4 bg-primary rounded-full" />
                                        </div>
                                        <div className="absolute top-[50%] left-[70%] group-hover:scale-125 transition-transform duration-500">
                                            <div className="w-4 h-4 bg-secondary-soft rounded-full animate-ping absolute opacity-75" />
                                            <div className="w-4 h-4 bg-secondary-soft rounded-full" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-8 left-8 right-8 p-6 bg-background/80 backdrop-blur-md rounded-2xl border border-border flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{t('marketing.impact.activeCollectors')}</p>
                                            <p className="text-2xl font-black text-primary">1,240+</p>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{t('marketing.impact.realtimeGrade')}</p>
                                            <p className="text-2xl font-black text-secondary-soft text-nowrap">PREMIUM</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* 5.5 DETAILED REACH STATS ROW */}
                            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { key: 'farmers', value: '1.2M+' },
                                    { key: 'associations', value: '250+' },
                                    { key: 'hubs', value: '45+' }
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        {...getAnim(0.6 + (0.1 * i))}
                                        className="p-8 bg-background-soft/50 backdrop-blur-sm border border-border rounded-2xl text-center card-minimal border-transparent"
                                    >
                                        <p className="text-4xl font-black text-primary mb-2 tracking-tighter">{stat.value}</p>
                                        <p className="text-[10px] font-black text-foreground uppercase tracking-widest mb-1">{t(`marketing.stats.${stat.key}`)}</p>
                                        <p className="text-xs text-muted-foreground font-medium">{t(`marketing.stats.${stat.key}Desc`)}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 5.7 TRANSPARENCY ARCHITECTURE (HARVEST TO GLOBAL HUB) */}
                    <section className="py-32 px-6 bg-background-soft relative">
                        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border hidden lg:block" />

                        <div className="max-w-7xl mx-auto space-y-24 relative z-10">
                            <motion.div {...getAnim(0)} className="text-center space-y-4">
                                <span className="text-secondary-soft font-bold text-[10px] uppercase tracking-[0.4em]">{t('marketing.transparency.badge')}</span>
                                <h2 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter">{t('marketing.transparency.title')}</h2>
                            </motion.div>

                            <div className="space-y-12 lg:space-y-0">
                                {[1, 2, 3, 4].map((step, i) => (
                                    <div key={step} className={`flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                                        <motion.div
                                            {...getAnim(0.2 * i)}
                                            className="w-full lg:w-[40%] space-y-6 p-8 bg-background border border-border rounded-3xl card-minimal border-transparent"
                                        >
                                            <div className="text-xs font-black text-primary uppercase tracking-widest">Protocol Phase 0{step} —</div>
                                            <div className="space-y-2">
                                                <h4 className="text-2xl font-black text-foreground uppercase tracking-tighter">{t(`marketing.transparency.steps.step${step}.title`)}</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{t(`marketing.transparency.steps.step${step}.desc`)}</p>
                                            </div>
                                        </motion.div>

                                        <div className="hidden lg:flex w-12 h-12 rounded-full bg-background border-4 border-primary items-center justify-center z-10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] shrink-0">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        </div>

                                        <div className="hidden lg:block w-[40%]" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>



                    {/* 5.6 DIGITAL ADVANTAGE COMPARISON SECTION */}
                    <section className="py-32 px-6 bg-background">
                        <div className="max-w-5xl mx-auto space-y-20">
                            <motion.div {...getAnim(0)} className="text-center space-y-4">
                                <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em]">{t('marketing.advantage.badge')}</span>
                                <h2 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter">{t('marketing.advantage.title')}</h2>
                            </motion.div>

                            <div className="overflow-hidden bg-background-soft/50 backdrop-blur-md rounded-3xl border border-border shadow-soft card-minimal border-transparent">
                                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-border">
                                    <div className="p-8 bg-muted/5 flex items-center"><span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Protocol Metric</span></div>
                                    <div className="p-8 hidden md:flex items-center justify-center border-x border-border bg-red-500/5"><span className="text-[10px] font-black uppercase tracking-widest text-red-500/60">{t('marketing.advantage.labels.traditional')}</span></div>
                                    <div className="p-8 hidden md:flex items-center justify-center bg-primary/5"><span className="text-[10px] font-black uppercase tracking-widest text-primary">{t('marketing.advantage.labels.kuntalx')}</span></div>
                                </div>

                                {['pricing', 'settlement', 'traceability', 'loss'].map((rowKey, i) => (
                                    <motion.div
                                        key={rowKey}
                                        {...getAnim(0.1 * i)}
                                        className="grid grid-cols-1 md:grid-cols-3 border-b border-border last:border-0 hover:bg-muted/5 transition-colors"
                                    >
                                        <div className="p-8 flex items-center">
                                            <p className="text-sm font-bold text-foreground uppercase tracking-tight">{t(`marketing.advantage.rows.${rowKey}.label`)}</p>
                                        </div>
                                        <div className="p-8 flex items-center md:justify-center md:border-x border-border bg-red-500/5 md:bg-transparent">
                                            <div className="md:hidden text-[10px] font-black uppercase tracking-widest text-red-500/40 mr-4">Old:</div>
                                            <p className="text-sm text-muted-foreground font-medium">{t(`marketing.advantage.rows.${rowKey}.traditional`)}</p>
                                        </div>
                                        <div className="p-8 flex items-center md:justify-center bg-primary/5 md:bg-transparent">
                                            <div className="md:hidden text-[10px] font-black uppercase tracking-widest text-primary/40 mr-4">New:</div>
                                            <p className="text-sm text-primary font-black tracking-tight">{t(`marketing.advantage.rows.${rowKey}.kuntalx`)}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 8. UNIQUE VALUE SECTION */}
                    <section id="about" className="py-24 px-6 bg-background">
                        <div className="max-w-7xl mx-auto rounded-3xl bg-primary p-16 md:p-24 text-center space-y-24 relative overflow-hidden shadow-soft border-transparent card-minimal">
                            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-card/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />

                            <motion.div
                                {...getAnim(0)}
                                className="space-y-8 relative z-10"
                            >
                                <span className="text-secondary-soft font-bold text-xs uppercase tracking-[0.6em] inline-block border-b-4 border-secondary-soft pb-2">{t('marketing.whyKuntalX.badge')}</span>
                                <h2 className="text-5xl md:text-8xl font-bold text-white tracking-tight">{t('marketing.whyKuntalX.title')}</h2>
                            </motion.div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                                {[
                                    { icon: '🔄', key: 'item1' },
                                    { icon: '🚀', key: 'item2' },
                                    { icon: '🌾', key: 'item3' },
                                    { icon: '🛡️', key: 'item4' }
                                ].map((v, i) => (
                                    <motion.div
                                        key={i}
                                        {...getAnim(0.1 * i)}
                                        className="space-y-6 group text-center"
                                    >
                                        <div className="text-6xl group-hover:scale-110 transition-transform duration-500 inline-block mb-4">{v.icon}</div>
                                        <div className="space-y-2">
                                            <h4 className="text-xl font-bold text-secondary-soft tracking-tight">{t(`marketing.whyKuntalX.items.${v.key}.title`)}</h4>
                                            <p className="text-white/60 text-sm font-medium leading-relaxed">{t(`marketing.whyKuntalX.items.${v.key}.desc`)}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 7. TESTIMONIALS SECTION */}
                    <section className="py-32 px-6 bg-background-soft">
                        <div className="max-w-7xl mx-auto space-y-20">
                            <motion.div {...getAnim(0)} className="text-center space-y-4">
                                <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em]">{t('marketing.testimonials.badge')}</span>
                                <h2 className="text-4xl md:text-6xl font-bold text-foreground uppercase tracking-tighter leading-none">{t('marketing.testimonials.title')}</h2>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {['item1', 'item2'].map((key, i) => (
                                    <motion.div
                                        key={i}
                                        {...getAnim(0.2 * i)}
                                        className="p-12 bg-background border border-transparent shadow-soft rounded-3xl space-y-8 relative group card-minimal"
                                    >
                                        <div className="text-5xl text-primary opacity-20 font-serif">"</div>
                                        <p className="text-xl text-foreground font-medium leading-relaxed italic relative z-10">{t(`marketing.testimonials.items.${key}.quote`)}</p>
                                        <div className="flex items-center gap-4 pt-6 border-t border-border">
                                            <div className="w-12 h-12 rounded-full bg-muted/20 shrink-0" />
                                            <div>
                                                <p className="font-bold text-foreground uppercase tracking-tight text-sm">{t(`marketing.testimonials.items.${key}.name`)}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{t(`marketing.testimonials.items.${key}.role`)}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 9. FAQ SECTION */}
                    <section className="py-32 px-6 bg-background">
                        <div className="max-w-3xl mx-auto space-y-16">
                            <motion.div {...getAnim(0)} className="text-center space-y-4">
                                <span className="text-secondary-soft font-bold text-[10px] uppercase tracking-[0.4em]">{t('marketing.faq.badge')}</span>
                                <h2 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter">{t('marketing.faq.title')}</h2>
                            </motion.div>

                            <div className="space-y-4">
                                {[1, 2, 3].map((n, i) => (
                                    <motion.div
                                        key={i}
                                        {...getAnim(0.1 * i)}
                                        className="bg-background-soft border border-transparent rounded-2xl overflow-visible shadow-minimal card-minimal"
                                    >
                                        <button
                                            onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                            className="w-full p-8 flex items-center justify-between text-left hover:bg-muted/5 transition-colors group rounded-t-2xl"
                                        >
                                            <span className="text-sm md:text-base font-bold text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{t(`marketing.faq.q${n}`)}</span>
                                            <span className={`text-xl transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`}>↓</span>
                                        </button>
                                        <AnimatePresence>
                                            {activeFaq === i && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                                >
                                                    <div className="px-8 pb-8 pt-0">
                                                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">{t(`marketing.faq.a${n}`)}</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 10. RESTORED CONTACT US SECTION */}
                    <section id="contact" className="py-32 px-6 bg-background relative overflow-hidden">
                        <div className="max-w-7xl mx-auto space-y-20 relative z-10">
                            <motion.div {...getAnim(0)} className="text-center space-y-4">
                                <span className="text-primary font-bold text-[10px] uppercase tracking-[0.4em]">{t('marketing.contact.badge')}</span>
                                <h2 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter">{t('marketing.contact.title')}</h2>
                            </motion.div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                {/* CONTACT INFO CARD COLUMN */}
                                <div className="lg:col-span-5 space-y-6">
                                    {[
                                        { title: 'Email Support', detail: 'hello@kuntalx.com', icon: '✉️' },
                                        { title: 'Direct Reach', detail: '+251 912 345 678', icon: '📞' },
                                        { title: 'Main Hub', detail: 'Addis Ababa, Ethiopia', icon: '📍' }
                                    ].map((info, i) => (
                                        <motion.div
                                            key={i}
                                            {...getAnim(0.1 * i)}
                                            className="p-8 bg-background-soft border border-border rounded-2xl flex items-center gap-6 group hover:translate-x-2 transition-all duration-300 card-minimal border-transparent"
                                        >
                                            <div className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-300">{info.icon}</div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">{info.title}</p>
                                                <p className="text-sm font-bold text-foreground tracking-tight">{info.detail}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* CONTACT FORM COLUMN */}
                                <motion.div
                                    {...getAnim(0.2)}
                                    className="lg:col-span-7 bg-background-soft border border-border rounded-3xl p-10 md:p-12 shadow-soft relative overflow-hidden card-minimal border-transparent"
                                >
                                    <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="contact-name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('marketing.contact.form.name')}</label>
                                                <input id="contact-name" type="text" placeholder={t('marketing.contact.form.placeholderName')} className="w-full h-14 bg-background border border-border rounded-xl px-6 text-sm font-bold focus:outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="contact-email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('marketing.contact.form.email')}</label>
                                                <input id="contact-email" type="email" placeholder={t('marketing.contact.form.placeholderEmail')} className="w-full h-14 bg-background border border-border rounded-xl px-6 text-sm font-bold focus:outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20" required />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="contact-message" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('marketing.contact.form.message')}</label>
                                            <textarea id="contact-message" rows={4} placeholder={t('marketing.contact.form.placeholderMessage')} className="w-full bg-background border border-border rounded-xl p-6 text-sm font-bold focus:outline-none focus:border-primary transition-colors resize-none focus:ring-2 focus:ring-primary/20" required />
                                        </div>
                                        <button type="submit" className="w-full h-16 bg-primary text-white rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-minimal hover:brightness-110 active:scale-[0.98] transition-all">{t('marketing.contact.form.submit')}</button>
                                    </form>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* 11. NEWSLETTER PRE-FOOTER SECTION */}
                    <section className="py-24 px-6 bg-primary overflow-hidden relative">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-10" />
                        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                            <motion.div {...getAnim(0)} className="text-center lg:text-left space-y-4">
                                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">{t('marketing.newsletter.title')}</h2>
                                <p className="text-lg text-white/70 font-medium tracking-tight">{t('marketing.newsletter.desc')}</p>
                            </motion.div>
                            <motion.div {...getAnim(0.2)} className="w-full max-w-md">
                                <form className="flex gap-2 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 group focus-within:bg-white/20 transition-all duration-300">
                                    <input
                                        type="email"
                                        placeholder={t('marketing.newsletter.placeholder')}
                                        className="flex-1 h-14 bg-transparent px-6 text-white text-sm font-bold uppercase tracking-widest placeholder:text-white/40 focus:outline-none"
                                    />
                                    <button className="h-14 px-8 bg-secondary-soft text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">{t('marketing.newsletter.cta')}</button>
                                </form>
                            </motion.div>
                        </div>
                    </section>
            </main>

            {/* 11. STANDARDIZED FOOTER */}
            <footer className="bg-background border-t border-border mt-auto pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto space-y-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 md:gap-12 lg:gap-8">
                        {/* BRAND COLUMN */}
                        <div className="lg:col-span-4 space-y-8">
                            <KuntalXLogo showTagline={false} variant={theme === 'dark' ? 'light' : 'dark'} />
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                                {t('marketing.footer.desc')}
                            </p>
                            <div className="flex gap-4">
                                {['Facebook', 'LinkedIn', 'Twitter'].map((social) => (
                                    <a key={social} href="#" aria-label={`Follow KuntalX on ${social}`} className="w-10 h-10 rounded-xl bg-muted/10 border border-border flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-500 focus:ring-2 focus:ring-primary">
                                        <span className="sr-only">{social}</span>
                                        <div className="w-4 h-4 bg-current rounded-sm opacity-50" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* PRODUCT COLUMN */}
                        <div className="lg:col-span-2 space-y-6">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">{t('marketing.footer.categories.solutions')}</h5>
                            <nav className="flex flex-col gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                <a href="#features" className="hover:text-primary transition-colors">{t('marketing.footer.links.directSourcing')}</a>
                                <a href="#features" className="hover:text-primary transition-colors">{t('marketing.footer.links.hubOperations')}</a>
                                <a href="#impact" className="hover:text-primary transition-colors">{t('marketing.footer.links.marketStats')}</a>
                                <a href="#how-it-works" className="hover:text-primary transition-colors">{t('marketing.footer.links.digitalLedger')}</a>
                            </nav>
                        </div>

                        {/* COMPANY COLUMN */}
                        <div className="lg:col-span-2 space-y-6">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">{t('marketing.footer.categories.company')}</h5>
                            <nav className="flex flex-col gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                <a href="#about" className="hover:text-primary transition-colors">{t('marketing.footer.links.aboutUs')}</a>
                                <a href="#about" className="hover:text-primary transition-colors">{t('marketing.footer.links.ourMission')}</a>
                                <a href="#contact" className="hover:text-primary transition-colors">{t('marketing.footer.links.journal')}</a>
                                <a href="#contact" className="hover:text-primary transition-colors">{t('marketing.footer.links.contact')}</a>
                            </nav>
                        </div>

                        {/* SUPPORT COLUMN */}
                        <div className="lg:col-span-2 space-y-6">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">{t('marketing.footer.categories.support')}</h5>
                            <nav className="flex flex-col gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                <a href="#" className="hover:text-primary transition-colors">{t('marketing.footer.links.helpCenter')}</a>
                                <a href="#" className="hover:text-primary transition-colors">{t('marketing.footer.links.faq')}</a>
                                <a href="#" className="hover:text-primary transition-colors">{t('marketing.footer.links.documentation')}</a>
                                <a href="#" className="hover:text-primary transition-colors">{t('marketing.footer.links.security')}</a>
                            </nav>
                        </div>

                        {/* LEGAL COLUMN */}
                        <div className="lg:col-span-2 space-y-6">
                            <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">{t('marketing.footer.categories.legal')}</h5>
                            <nav className="flex flex-col gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                <a href="#" className="hover:text-primary transition-colors">{t('marketing.footer.links.privacyPolicy')}</a>
                                <a href="#" className="hover:text-primary transition-colors">{t('marketing.footer.links.termsOfUse')}</a>
                                <a href="#" className="hover:text-primary transition-colors">{t('marketing.footer.links.compliance')}</a>
                            </nav>
                        </div>
                    </div>

                    {/* BOTTOM ROW */}
                    <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary-soft animate-pulse" />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('marketing.footer.operational')}</p>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.3em]">{t('marketing.footer.copyright')}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
