import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../../lib/toast-context';
import type { Toast as ToastType } from '../../lib/toast-context';

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-6 right-6 z-[10000] flex flex-col gap-3 pointer-events-none w-full max-w-xs sm:max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const Toast: React.FC<{ toast: ToastType }> = ({ toast }) => {
  const { removeToast } = useToast();

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-rose-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-sky-500" />,
  };

  const variants = {
    initial: { opacity: 0, x: 50, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      layout
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pointer-events-auto relative overflow-hidden group"
    >
      <div className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl p-4 pr-12 flex items-start gap-4 ring-1 ring-white/10">
        <div className="flex-shrink-0 mt-0.5">
          {icons[toast.type]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight tracking-tight">
            {toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}
          </p>
          <p className="text-xs text-muted-foreground/80 mt-1 font-medium leading-relaxed">
            {toast.message}
          </p>
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="absolute top-4 right-4 text-muted-foreground/40 hover:text-foreground transition-colors p-1 rounded-lg hover:bg-white/5"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dynamic progress bar if duration exists */}
        {toast.duration && toast.duration > 0 && (
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: toast.duration / 1000, ease: 'linear' }}
            className={`absolute bottom-0 left-0 right-0 h-1 origin-left opacity-20 ${
              toast.type === 'success' ? 'bg-emerald-500' :
              toast.type === 'error' ? 'bg-rose-500' :
              toast.type === 'warning' ? 'bg-amber-500' : 'bg-sky-500'
            }`}
          />
        )}
      </div>
    </motion.div>
  );
};
