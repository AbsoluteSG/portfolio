import { H, M, Eq, Key, Note, Try, Bullets, Mx } from "./prose";

export default function LU() {
  return (
    <>
      <p>
        Two chapters ago, elimination was a procedure — a list of moves you carried out on a matrix. This chapter
        notices that each of those moves is itself a matrix, and that multiplying them together turns the whole
        procedure into a single algebraic statement about <M>A</M>.
      </p>

      <H>Row operations are matrices</H>
      <p>
        Take any row operation and apply it to the identity. The result is the{" "}
        <strong>elementary matrix</strong> for that operation, and multiplying it onto the left of <M>A</M> performs the
        operation on <M>A</M>.
      </p>
      <Eq note="add −2 × row 1 to row 2">
        E =
        <Mx rows={[["1", "0", "0"], ["−2", "1", "0"], ["0", "0", "1"]]} />
      </Eq>
      <p>
        Why it works is worth a moment: row <M>i</M> of a product <M>EA</M> is a combination of the rows of <M>A</M>,
        weighted by row <M>i</M> of <M>E</M>. The second row above says &ldquo;take <M>−2</M> of row 1 plus <M>1</M> of
        row 2&rdquo; — exactly the operation. Every row operation is a choice of those weights.
      </p>
      <Bullets>
        <li>A <strong>swap</strong> exchanges two rows of the identity.</li>
        <li>A <strong>scale</strong> puts <M>k</M> in one diagonal slot.</li>
        <li>An <strong>addition</strong> puts the multiplier in one off-diagonal slot.</li>
      </Bullets>
      <p>
        Each is invertible, and the inverse is obvious: swap back, scale by <M>1/k</M>, subtract what you added. This
        is the reversibility from chapter two, now written as a matrix fact.
      </p>

      <H>Composing them factors A</H>
      <p>
        Forward elimination — no scaling, just clearing below the pivots — is a sequence of elementary matrices applied
        to <M>A</M>, ending at an upper triangular <M>U</M>:
      </p>
      <Eq>E<sub>k</sub> ⋯ E<sub>2</sub> E<sub>1</sub> A = U</Eq>
      <p>
        Move them to the other side by inverting each one, in reverse order:
      </p>
      <Eq note="and that product of inverses is L">
        A = E<sub>1</sub><sup>−1</sup> E<sub>2</sub><sup>−1</sup> ⋯ E<sub>k</sub><sup>−1</sup> U = LU
      </Eq>
      <p>
        The remarkable part is what <M>L</M> turns out to be. Each inverse is lower triangular with a single multiplier
        below the diagonal, and multiplying such matrices in this order simply files each multiplier into its own slot —
        nothing interferes. So <M>L</M> is unit lower triangular and{" "}
        <strong>its entries are the multipliers elimination already computed</strong>. You get the factorization for
        free: do elimination, keep a record of the ratios you divided by, and you have both factors.
      </p>
      <Eq note="A = LU for the matrix on the stage">
        <Mx rows={[["2", "1", "1"], ["4", "−6", "0"], ["−2", "7", "2"]]} /> ={" "}
        <Mx rows={[["1", "0", "0"], ["2", "1", "0"], ["−1", "−1", "1"]]} />
        <Mx rows={[["2", "1", "1"], ["0", "−8", "−2"], ["0", "0", "1"]]} />
      </Eq>
      <Try>
        Step through the elimination and watch <M>L</M> assemble itself in the slot beside <M>U</M>. The number
        appearing in <M>L</M> at each step is the multiplier used in that step, negated — no separate computation
        happens.
      </Try>

      <H>Why anyone wants this</H>
      <p>
        Because of the equation <M>LUx = b</M>, which splits into two triangular solves: first <M>Ly = b</M> going
        downward, then <M>Ux = y</M> coming back up. Each costs about <M>n²</M> operations, against <M>n³/3</M> for a
        fresh elimination.
      </p>
      <p>
        So if you have one matrix and many right-hand sides — the usual situation in engineering, graphics, and
        statistics — you factor once and then every new <M>b</M> is nearly free. This is what a numerical library is
        doing when you ask it to &ldquo;solve&rdquo; a system: it factors, caches, and reuses.
      </p>
      <Note label="Permutations">
        Sometimes a pivot is zero and elimination has to swap rows, which spoils the triangular shape of <M>L</M>. The
        repair is to record the swaps in a permutation matrix <M>P</M> and factor the reordered matrix instead:{" "}
        <M>PA = LU</M>. In practice numerical code swaps deliberately even when it doesn&apos;t have to, choosing the
        largest available pivot to keep rounding errors small.
      </Note>

      <Key>
        <p>
          Elimination isn&apos;t only a way to solve a system — it&apos;s a factorization of the matrix. Once you can
          write <M>A</M> as a product, every question about <M>A</M> can be asked of the simpler factors instead. Two
          of the course&apos;s later peaks, diagonalization and the SVD, are that same move with better factors.
        </p>
      </Key>
    </>
  );
}
