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
        <table className="w-full text-left">
          <thead className="bg-muted/30 border-b border-border/60 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Origin Node / Producer</th>
              <th className="px-8 py-5 text-center">Declared Vol.</th>
              <th className="px-8 py-5 text-center">Verified Vol.</th>
              <th className="px-8 py-5 text-center">Quality</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right">Commit Date</th>
              {isAdmin && <th className="px-8 py-5 text-right">Operations</th>}
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-border/40">
            {items.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="px-8 py-12 text-center text-muted-foreground opacity-50 font-bold uppercase tracking-widest">
                  No active contribution records found
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/5 transition-colors group">
                  <td className="px-8 py-6 text-left">
                    <div className="space-y-1">
                      <p className="font-bold text-foreground uppercase tracking-tight">{item.farmerName || 'Anonymous Producer'}</p>
                      <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">Node: {item.farmerId.substring(0, 12)}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center font-bold text-foreground tabular-nums">
                    {item.quantityKuntal} <span className="opacity-40 text-[9px] uppercase">qt</span>
                  </td>
                  <td className="px-8 py-6 text-center font-bold text-primary tabular-nums">
                    {item.verifiedQuantityKuntal !== undefined ? `${item.verifiedQuantityKuntal} qt` : '--'}
                  </td>
                  <td className="px-8 py-6 text-center">
                    {item.qualityGrade ? (
                      <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border-amber-500/30 text-amber-600 bg-amber-500/5">Grade {item.qualityGrade}</Badge>
                    ) : (
                      <span className="text-muted-foreground/30 font-bold uppercase tracking-widest text-[9px]">Ungraded</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <Badge
                      variant={item.status === 'accepted' ? 'success' : item.status === 'rejected' ? 'error' : 'warning'}
                      className="text-[9px] font-bold uppercase tracking-widest"
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-6 text-right font-bold text-muted-foreground/40 text-[10px] uppercase">
                    <AdaptiveDate date={item.createdAt} />
                  </td>
                  {isAdmin && (
                    <td className="px-8 py-6 text-right">
                      {item.status === 'pending' ? (
                        <button
                          onClick={() => onVerify?.(item)}
                          className="h-8 px-4 rounded-md bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-widest shadow-minimal hover:bg-emerald-500 transition-all"
                        >
                          Verify Record
                        </button>
                      ) : (
                        <span className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-widest">Finalized</span>
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
