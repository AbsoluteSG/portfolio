/** Typography for chapter bodies. Server components: no state, no hooks. */

export const H = ({ children }: { children: React.ReactNode }) => (
  <h2 className="la-display mt-12 mb-4 text-2xl md:text-3xl">{children}</h2>
);

/** An inline mathematical expression, set in the serif face. */
export const M = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`la-m ${className ?? ""}`}>{children}</span>
);

/** A display equation, centred, on its own line. */
export const Eq = ({ children, note }: { children: React.ReactNode; note?: React.ReactNode }) => (
  <div className="la-display-eq">
    <div className="la-m">{children}</div>
    {note && <p className="la-display-eq-note">{note}</p>}
  </div>
);

/** The idea worth carrying to the next chapter. */
export const Key = ({ children }: { children: React.ReactNode }) => (
  <aside className="la-key">
    <p className="la-eyebrow">The idea</p>
    <div className="mt-2">{children}</div>
  </aside>
);

/** An aside for a caveat, a name, or a piece of history. */
export const Note = ({ label = "Note", children }: { label?: string; children: React.ReactNode }) => (
  <aside className="la-note">
    <span className="la-note-label">{label}</span>
    <div>{children}</div>
  </aside>
);

/** Points at the interactive above the prose. */
export const Try = ({ children }: { children: React.ReactNode }) => (
  <aside className="la-try">
    <p className="la-eyebrow">On the stage above</p>
    <div className="mt-2">{children}</div>
  </aside>
);

export const Steps = ({ children }: { children: React.ReactNode }) => <ol className="la-steps">{children}</ol>;
export const Bullets = ({ children }: { children: React.ReactNode }) => <ul className="la-bullets">{children}</ul>;

/** A small inline vertical fraction, matching the stages. */
export const F = ({ n, d }: { n: React.ReactNode; d: React.ReactNode }) => (
  <span className="la-inline-frac">
    <span className="la-frac-stack"><span>{n}</span><span>{d}</span></span>
  </span>
);

/** A bracketed matrix or column vector, from rows of plain content. */
export const Mx = ({ rows }: { rows: React.ReactNode[][] }) => (
  <span className="la-mx">
    <span className="la-mx-bracket" aria-hidden />
    <span className="la-mx-grid" style={{ gridTemplateColumns: `repeat(${rows[0].length}, auto)` }}>
      {rows.flatMap((row, r) => row.map((cell, c) => <span key={`${r}-${c}`} className="la-mx-cell">{cell}</span>))}
    </span>
    <span className="la-mx-bracket la-mx-bracket-r" aria-hidden />
  </span>
);
