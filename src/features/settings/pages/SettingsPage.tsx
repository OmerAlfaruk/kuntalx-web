import { useState, useEffect, useCallback } from "react";
import { useToast } from "../../../lib/toast-context";
import { useAuth } from "../../../lib/auth-context";
import { useTheme } from "../../../lib/theme-context";
import { useI18n } from "../../../lib/i18n-context";
import {
  PageHeader,
  Badge,
} from "../../../shared/components/UI";
import {
  InformationCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { SkeletonDetail } from "../../../shared/components/Skeletons";
import { AccountSection } from "../components/AccountSection";
import { FinancialSection } from "../components/FinancialSection";
import { PreferencesSection } from "../components/PreferencesSection";
import { AssistanceSection } from "../components/AssistanceSection";

type Language = "en" | "am" | "om";

export const SettingsPage = () => {
  const toast = useToast();
  const { user, updateProfile, updatePin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useI18n();

  const [isSaving, setIsSaving] = useState(false);

  // Form states — synced with user data when section opens
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
  });

  const [financialForm, setFinancialForm] = useState({
    payoutMethod: "bank_transfer",
    payoutDetails: "",
  });

  const [securityForm, setSecurityForm] = useState({
    currentPin: "",
    newPin: "",
    confirmPin: "",
  });

  // Sync forms with latest user data on mount
  useEffect(() => {
    setProfileForm({
      fullName: user?.fullName || "",
      email: user?.email || "",
    });
    setFinancialForm({
      payoutMethod: user?.farmerData?.defaultPayoutMethod || "bank_transfer",
      payoutDetails: user?.farmerData?.payoutPaymentDetails || "",
    });
    setSecurityForm({ currentPin: "", newPin: "", confirmPin: "" });
  }, [user]);

  const handleProfileChange = useCallback((field: string, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSecurityChange = useCallback((field: string, value: string) => {
    setSecurityForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleFinancialChange = useCallback((field: string, value: string) => {
    setFinancialForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSaveProfile = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.fullName.trim()) {
      toast.error("Full name is required.");
      return;
    }
    setIsSaving(true);
    try {
      await updateProfile({
        fullName: profileForm.fullName,
        email: profileForm.email || undefined,
      } as any);
      // Success toast handled by auth-context
    } catch (error: any) {
      toast.error(
        error.message || "Synchronization failed. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }, [profileForm, updateProfile, toast]);

  const handleSaveFinancial = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        farmerData: {
          defaultPayoutMethod: financialForm.payoutMethod,
          payoutPaymentDetails: financialForm.payoutDetails,
        },
      } as any);
      // Success toast handled by auth-context
    } catch (error: any) {
      toast.error(
        error.message || "Failed to update financial settings.",
      );
    } finally {
      setIsSaving(false);
    }
  }, [financialForm, updateProfile, toast]);

  const handleSaveSecurity = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityForm.newPin.length < 4) {
      toast.error("PIN must be at least 4 digits.");
      return;
    }
    if (securityForm.newPin !== securityForm.confirmPin) {
      toast.error("New PIN and confirmation do not match.");
      return;
    }
    setIsSaving(true);
    try {
      await updatePin(securityForm.currentPin, securityForm.newPin);
      // Success toast handled by auth-context
      setSecurityForm({ currentPin: "", newPin: "", confirmPin: "" });
    } catch (error: any) {
      toast.error(
        error.message || "Incorrect current PIN or update rejected.",
      );
    } finally {
      setIsSaving(false);
    }
  }, [securityForm, updatePin, toast]);

  const handleLanguageChange = useCallback((lang: Language) => {
    changeLanguage(lang);
    toast.success(
      `Language switched to ${lang === "en" ? "English" : lang === "am" ? "Amharic" : "Oromo"}.`,
    );
  }, [changeLanguage, toast]);

  const handleThemeToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const SectionHeader = ({
    title,
  }: {
    title: string;
  }) => (
    <div className="mb-6 flex items-center gap-4">
      <h2 className="text-sm font-bold text-foreground tracking-widest uppercase shrink-0">
        {title}
      </h2>
      <div className="h-px flex-1 bg-border/50" />
    </div>
  );


  return (
    <div className="space-y-20 animate-in fade-in duration-500">
      <PageHeader
        title="Settings"
        description="Manage your account, preferences, and security."
      />
      <main className="w-full space-y-20 pb-20">
        {!user ? (
          <div className="space-y-12">
            <SkeletonDetail />
            <SkeletonDetail />
          </div>
        ) : (
          <>
            <AccountSection 
              user={user} 
              profileForm={profileForm} 
              securityForm={securityForm} 
              isSaving={isSaving}
              onProfileChange={handleProfileChange}
              onProfileSave={handleSaveProfile}
              onSecurityChange={handleSecurityChange}
              onSecuritySave={handleSaveSecurity}
            />

            <FinancialSection 
              user={user}
              financialForm={financialForm}
              onFinancialChange={handleFinancialChange}
              onFinancialSave={handleSaveFinancial}
            />

            <PreferencesSection 
              theme={theme}
              language={language as Language}
              onThemeToggle={handleThemeToggle}
              onLanguageChange={handleLanguageChange}
            />

            <AssistanceSection />
          </>
        )}

        {/* ===== ABOUT SECTION ===== */}
        <section className="space-y-8">
          <SectionHeader title="System Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-minimal p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-background-soft flex items-center justify-center text-muted-foreground">
                  <InformationCircleIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Version
                  </h4>
                  <p className="text-sm font-bold text-foreground mt-0.5">
                    v6.9.1
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-[8px] uppercase tracking-widest border-emerald-500/20 text-emerald-500 bg-emerald-500/5">
                Stable
              </Badge>
            </div>

            <button
              onClick={() => logout()}
              className="group p-6 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 rounded-xl transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:scale-105 transition-transform">
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-[10px] font-bold text-rose-500/60 uppercase tracking-widest">
                    Account
                  </h4>
                  <p className="text-sm font-bold text-rose-500 uppercase mt-0.5">
                    Logout
                  </p>
                </div>
              </div>
              <ChevronRightIcon
                className="w-4 h-4 text-rose-500/40 group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
