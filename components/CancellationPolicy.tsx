import { fmtPrice } from '@/lib/hotels'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CancellationPolicy({ rate }: { rate: any }) {
  const policy = rate?.rates?.[0]?.cancellationPolicies
    ?? rate?.rates?.[0]?.cancelPolicy
    ?? rate?.cancellationPolicies
    ?? rate?.cancelPolicy

  if (!policy) return <div className="status-muted">Cancellation policy unavailable</div>

  const tag = policy.refundableTag ?? ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const infos: any[] = [...(policy.cancelPolicyInfos ?? [])].sort(
    (a, b) => new Date(a.cancelTime).getTime() - new Date(b.cancelTime).getTime()
  )
  const remarks: string[] = policy.hotelRemarks ?? []
  const isRFN = tag === 'RFN'
  const isNRFN = tag === 'NRFN'

  const first = infos[0]
  const cancelDate = first?.cancelTime ? first.cancelTime.split('T')[0] : ''

  let lines: React.ReactNode[] = []

  if (infos.length === 0) {
    if (isRFN) lines = [<div key="rfn" className="status-green">✓ Fully refundable options</div>]
    else if (isNRFN) lines = [<div key="nrfn" className="status-red">✗ Non-refundable</div>]
    else lines = [<div key="na" className="status-muted">Cancellation policy applies</div>]
  } else if (isRFN && infos.length === 1 && first.amount > 0) {
    lines = [
      <div key="rfn" className="status-green">✓ Free cancellation until {cancelDate}</div>,
      <div key="after" className="status-gold">After that: {fmtPrice(first.amount)} charged (no refund)</div>,
    ]
  } else if (isRFN && infos.length > 1) {
    lines = [
      <div key="rfn" className="status-green">✓ Free cancellation until {cancelDate}</div>,
      <div key="fee" className="status-gold">Cancellation fee increases closer to arrival</div>,
    ]
  } else if (isNRFN) {
    if (first.amount === 0 && infos.length > 1) {
      lines = [
        <div key="partial" className="status-gold">⚠ Partial refund if cancelled before {cancelDate}</div>,
        <div key="full" className="status-red">✗ Full cost charged if cancelled after that</div>,
      ]
    } else {
      lines = [<div key="nrfn" className="status-red">✗ Non-refundable — full cost charged if cancelled</div>]
    }
  } else if (cancelDate && first.amount === 0) {
    lines = [<div key="free" className="status-green">✓ Free cancellation until {cancelDate}</div>]
  } else {
    lines = [<div key="fee" className="status-gold">⚠ {fmtPrice(first.amount)} charged if cancelled after {cancelDate || 'booking'}</div>]
  }

  if (remarks.length > 0) {
    lines.push(<div key="remark" className="status-remark">{remarks[0]}</div>)
  }

  return <>{lines}</>
}
