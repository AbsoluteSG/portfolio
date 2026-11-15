import { H, M, Eq, Key, Note, Example, Given, Step, Answer, Pitfall, Bullets, Mx } from "./prose";

export default function Vectors() {
  return (
    <>
      <p>
        A <strong>vector</strong> in <M>ℝⁿ</M> is an ordered list of <M>n</M> real numbers, written as a column. Two
        vectors are equal when <em>all</em> their corresponding entries agree — order matters, so{" "}
        <M>(1, 2) ≠ (2, 1)</M>.
      </p>
      <Eq note="a vector in ℝ³">
        v = <Mx rows={[["3"], ["−1"], ["4"]]} />
      </Eq>
      <p>
        Only two operations are defined, and everything in the course is built from them. <strong>Addition</strong> is
        entry by entry, and <strong>scalar multiplication</strong> multiplies every entry by the same number.
      </p>
      <Eq>
        <Mx rows={[["1"], ["2"]]} /> + <Mx rows={[["3"], ["−1"]]} /> = <Mx rows={[["4"], ["1"]]} /> and 3{" "}
        <Mx rows={[["1"], ["2"]]} /> = <Mx rows={[["3"], ["6"]]} />
      </Eq>
      <Note label="Only same-size vectors">
        Addition requires both vectors to live in the same <M>ℝⁿ</M>. A vector in <M>ℝ²</M> plus one in <M>ℝ³</M> is
        undefined — not zero, not padded, simply not a legal expression.
      </Note>

      <H>The rules you may use without proof</H>
      <p>
        For all <M>u, v, w</M> in <M>ℝⁿ</M> and scalars <M>c, d</M>, the eight algebraic rules hold: addition is
        commutative and associative, <M>0</M> is the additive identity, every <M>v</M> has a negative <M>−v</M>, and
        scalar multiplication distributes both ways with <M>c(du) = (cd)u</M> and <M>1u = u</M>.
      </p>
      <p>
        The practical upshot is that vector equations can be manipulated like ordinary algebra: collect like terms,
        move things across the equals sign, factor out scalars. What you <em>cannot</em> do is divide by a vector or
        multiply two vectors together — neither operation exists yet.
      </p>

      <H>Linear combinations</H>
      <p>
        Given vectors <M>v₁, …, v<sub>p</sub></M> and scalars <M>c₁, …, c<sub>p</sub></M>, the vector
      </p>
      <Eq note="the scalars are called weights">y = c₁v₁ + c₂v₂ + ⋯ + c<sub>p</sub>v<sub>p</sub></Eq>
      <p>
        is a <strong>linear combination</strong> of them. Weights may be any real numbers — positive, negative, or
        zero — so the zero vector is always a linear combination of any set, using all zero weights.
      </p>
      <p>
        This single definition carries the rest of the unit. Span, the matrix equation, independence and column space
        are all questions about which linear combinations are possible.
      </p>

      <Example title="Example 1 · computing a combination">
        <Given>
          <p>
            With <M>v₁ = (1, −2, 0)</M>, <M>v₂ = (0, 1, 2)</M>, compute <M>3v₁ − 2v₂</M>.
          </p>
        </Given>
        <Step do="Step 1 — scale each vector">
          <p>Multiply through entry by entry, keeping the minus sign attached to the 2.</p>
          <Eq>
            3v₁ = <Mx rows={[["3"], ["−6"], ["0"]]} />, −2v₂ = <Mx rows={[["0"], ["−2"], ["−4"]]} />
          </Eq>
        </Step>
        <Step do="Step 2 — add">
          <p>Add corresponding entries: <M>3 + 0</M>, <M>−6 + (−2)</M>, <M>0 + (−4)</M>.</p>
        </Step>
        <Answer>
          <M>3v₁ − 2v₂ = (3, −8, −4)</M>
        </Answer>
      </Example>

      <H>The question that actually gets asked</H>
      <p>
        Computing a combination is arithmetic. The exam question runs the other way: <em>is this vector a combination
        of those, and with what weights?</em> That is a system of equations in disguise, and the translation is worth
        doing slowly once.
      </p>

      <Example title="Example 2 · finding the weights">
        <Given>
          <p>
            Is <M>b = (2, −1, 6)</M> a linear combination of <M>a₁ = (1, −2, 0)</M> and <M>a₂ = (0, 1, 2)</M>? If so,
            find the weights.
          </p>
        </Given>
        <Step do="Step 1 — write the vector equation">
          <p>We are asking whether scalars <M>x₁, x₂</M> exist with</p>
          <Eq>
            x₁ <Mx rows={[["1"], ["−2"], ["0"]]} /> + x₂ <Mx rows={[["0"], ["1"], ["2"]]} /> ={" "}
            <Mx rows={[["2"], ["−1"], ["6"]]} />
          </Eq>
        </Step>
        <Step do="Step 2 — read it off one entry at a time">
          <p>
            Vector equality means every entry matches, so this single vector equation is three ordinary equations —
            one per row.
          </p>
          <Eq>
            x₁ = 2<br />
            −2x₁ + x₂ = −1<br />
            2x₂ = 6
          </Eq>
        </Step>
        <Step do="Step 3 — the augmented matrix is built from the vectors as columns">
          <p>
            Notice where the numbers went: <M>a₁</M> became the first column, <M>a₂</M> the second, <M>b</M> the
            augmented column. You never need to write the equations out — assemble the matrix directly.
          </p>
          <Eq>
            <Mx rows={[["1", "0", "2"], ["−2", "1", "−1"], ["0", "2", "6"]]} />
          </Eq>
        </Step>
        <Step do="Step 4 — reduce">
          <p>
            <M>R₂ → R₂ + 2R₁</M> gives row <M>(0, 1, 3)</M>; then <M>R₃ → R₃ − 2R₂</M> gives <M>(0, 0, 0)</M>. The
            result is consistent, with <M>x₁ = 2</M> and <M>x₂ = 3</M>.
          </p>
        </Step>
        <Step do="Step 5 — check">
          <p>
            <M>2(1, −2, 0) + 3(0, 1, 2) = (2, −4 + 3, 6) = (2, −1, 6)</M> ✓
          </p>
        </Step>
        <Answer>
          Yes: <M>b = 2a₁ + 3a₂</M>.
        </Answer>
      </Example>

      <Note label="The translation, once and for all">
        <p>
          &ldquo;Is <M>b</M> a combination of <M>a₁, …, a<sub>p</sub></M>?&rdquo; becomes &ldquo;is the system with
          augmented matrix <M>[ a₁ ⋯ a<sub>p</sub> | b ]</M> consistent?&rdquo; The vectors go in as{" "}
          <strong>columns</strong>, and the weights are the unknowns. Every remaining question in this unit reduces to
          this one.
        </p>
      </Note>
      <Pitfall>
        <ul>
          <li>
            Writing the vectors as <em>rows</em> of the matrix. The weights multiply whole vectors, so the vectors are
            columns; rows would answer a different question entirely.
          </li>
          <li>
            Concluding &ldquo;no&rdquo; from a messy reduction. Only an inconsistent row —{" "}
            <M>[0 ⋯ 0 | nonzero]</M> — proves it is not a combination.
          </li>
          <li>
            Mixing notation. <M>(2, −1, 6)</M> written on a line and the same numbers stacked in a column mean the
            same vector; a <M>1 × 3</M> row matrix is a different object.
          </li>
        </ul>
      </Pitfall>

      <Bullets>
        <li>Geometrically, <M>u + v</M> is the diagonal of the parallelogram they span, and <M>cv</M> stretches <M>v</M> by <M>c</M>, reversing it when <M>c &lt; 0</M>.</li>
        <li>The set of all multiples <M>cv</M> of a single nonzero <M>v</M> is a line through the origin.</li>
      </Bullets>

      <Key>
        <p>
          Vectors add and scale entry by entry, and a linear combination is a weighted sum. Asking whether <M>b</M> is
          one of them is asking whether <M>[ a₁ ⋯ a<sub>p</sub> | b ]</M> is consistent — a row reduction, every time.
        </p>
      </Key>
    </>
  );
}
