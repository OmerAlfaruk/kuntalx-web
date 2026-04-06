import React from 'react';
import { type Aggregation, type AggregationItem } from '../types/aggregation';
import { Badge, AdaptiveDate } from '../../../shared/components/UI';

interface Props {
  aggregation: Aggregation;
  isAdmin?: boolean;
  isBuyer?: boolean;
  onVerify?: (item: AggregationItem) => void;
}

export const AggregationInventory: React.FC<Props> = ({
  aggregation,
  isAdmin,
  onVerify,
}) => {
  const items = aggregation.items || [];

  return (
    <div className="card-minimal overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/50 bg-background-soft/50">
              <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Origin Node / Producer</th>
              <th className="px-10 py-5 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Declared Vol.</th>
              <th className="px-10 py-5 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Verified Vol.</th>
              <th className="px-10 py-5 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Quality</th>
              <th className="px-10 py-5 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
              <th className="px-10 py-5 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Commit Date</th>
              {isAdmin && <th className="px-10 py-5 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Operations</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {items.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="px-10 py-16 text-center">
                  <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">No active contribution records found in registry</p>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-background-soft/50 transition-all duration-300 group">
                  <td className="px-10 py-7 text-left">
                    <div className="space-y-1.5">
                      <p className="text-[13px] font-bold text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{item.farmerName || 'Anonymous Producer'}</p>
                      <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">Hash ID: {item.farmerId.substring(0, 12)}</p>
                    </div>
                  </td>
                  <td className="px-10 py-7 text-center">
                    <span className="text-[13px] font-bold text-foreground tabular-nums">
                      {item.quantityKuntal} <span className="text-[10px] font-bold text-muted-foreground/20 uppercase ml-1">QT</span>
                    </span>
                  </td>
                  <td className="px-10 py-7 text-center">
                    <span className={`text-[13px] font-bold tabular-nums ${item.verifiedQuantityKuntal !== undefined ? 'text-primary' : 'text-muted-foreground/20'}`}>
                      {item.verifiedQuantityKuntal !== undefined ? `${item.verifiedQuantityKuntal} QT` : 'PENDING'}
                    </span>
                  </td>
                  <td className="px-10 py-7 text-center">
                    {item.qualityGrade ? (
                      <Badge variant="outline" className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border-amber-500/20 text-amber-600 bg-amber-500/5">
                        Grade {item.qualityGrade}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground/20 font-bold uppercase tracking-[0.2em] text-[9px]">Unverified</span>
                    )}
                  </td>
                  <td className="px-10 py-7 text-center">
                    <Badge
                      variant={item.status === 'accepted' ? 'success' : item.status === 'rejected' ? 'error' : 'warning'}
                      className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest"
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                      <AdaptiveDate date={item.createdAt} />
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-10 py-7 text-right">
                      {item.status === 'pending' ? (
                        <button
                          onClick={() => onVerify?.(item)}
                          className="h-10 px-6 rounded-xl bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-widest shadow-minimal hover:bg-emerald-500 transition-all active:scale-95"
                        >
                          Verify Node
                        </button>
                      ) : (
                        <div className="flex items-center justify-end gap-2 text-[9px] font-bold text-muted-foreground/20 uppercase tracking-widest">
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
                          <span>Finalized</span>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
