import { H, M, Eq, Key, Note, Method, Example, Given, Step, Op, Answer, Pitfall, Bullets, Chain, To, Mx } from "./prose";

export default function Span() {
  return (
    <>
      <p>
        The <strong>span</strong> of a set of vectors is the collection of <em>all</em> their linear combinations:
      </p>
      <Eq note="every weight ranges over all real numbers">
        Span&#123;v₁, …, v<sub>p</sub>&#125; = &#123; c₁v₁ + ⋯ + c<sub>p</sub>v<sub>p</sub> : c₁, …, c<sub>p</sub> ∈ ℝ &#125;
      </Eq>
      <p>
        It is the set of places you can reach using only these vectors, and it is always nonempty — taking all weights
        zero shows the zero vector is in every span. Two kinds of question get asked about it, and they have different
        methods.
      </p>
      <Bullets>
        <li><strong>Is this particular <M>b</M> in the span?</strong> One consistency check.</li>
        <li><strong>Is the span all of <M>ℝᵐ</M>?</strong> A statement about every possible <M>b</M> at once.</li>
      </Bullets>

      <H>What a span looks like</H>
      <Bullets>
        <li>Span of one nonzero vector: a <strong>line</strong> through the origin.</li>
        <li>Span of two vectors that are not multiples of each other: a <strong>plane</strong> through the origin.</li>
        <li>Span of two vectors where one <em>is</em> a multiple of the other: still just a line — the second adds nothing.</li>
      </Bullets>
      <p>
        Every span contains the origin, which is why the sets in this course always pass through it. A line or plane
        that misses the origin is never a span (it is a shifted one — the solution set of an inconsistent-free{" "}
        <M>Ax = b</M>, from the previous chapter).
      </p>

      <H>Question 1 — is b in the span?</H>
      <Method>
        <li>Form the augmented matrix <M>[ v₁ ⋯ v<sub>p</sub> | b ]</M>, the vectors as columns.</li>
        <li>Row reduce to echelon form — REF is enough to answer yes or no.</li>
        <li>If a row reads <M>[0 ⋯ 0 | nonzero]</M>, then <M>b</M> is <em>not</em> in the span.</li>
        <li>Otherwise it is. To exhibit the weights, finish to RREF and read them off.</li>
      </Method>

      <Example title="Example 1 · yes, and in infinitely many ways">
        <Given>
          <p>
            Is <M>b = (2, −1, 6)</M> in <M>Span&#123;a₁, a₂, a₃&#125;</M> for <M>a₁ = (1, −2, 0)</M>,{" "}
            <M>a₂ = (0, 1, 2)</M>, <M>a₃ = (5, −6, 8)</M>?
          </p>
        </Given>
        <Step do="Step 1 — assemble the augmented matrix">
          <Eq><Mx rows={[["1", "0", "5", "2"], ["−2", "1", "−6", "−1"], ["0", "2", "8", "6"]]} /></Eq>
        </Step>
        <Step do="Step 2 — reduce">
          <p><Op>R₂ → R₂ + 2R₁</Op>, then <Op>R₃ → R₃ − 2R₂</Op>:</p>
          <Chain>
            <Mx rows={[["1", "0", "5", "2"], ["0", "1", "4", "3"], ["0", "2", "8", "6"]]} />
            <To label="R₃−2R₂" />
            <Mx rows={[["1", "0", "5", "2"], ["0", "1", "4", "3"], ["0", "0", "0", "0"]]} />
          </Chain>
        </Step>
        <Step do="Step 3 — read it">
          <p>
            The bottom row is all zeros, including the augmented entry — that is a redundant equation, not a
            contradiction. No pivot in the last column, so the system is consistent and <M>b</M> is in the span.
          </p>
          <p>
            Column 3 has no pivot, so <M>x₃</M> is free: there are infinitely many ways to write <M>b</M>. Taking{" "}
            <M>x₃ = 0</M> gives the simplest one, <M>x₁ = 2</M> and <M>x₂ = 3</M>.
          </p>
        </Step>
        <Answer>
          Yes. For instance <M>b = 2a₁ + 3a₂ + 0a₃</M>, and more generally{" "}
          <M>b = (2 − 5t)a₁ + (3 − 4t)a₂ + t a₃</M>.
        </Answer>
      </Example>
      <Note label="Why a₃ was redundant">
        The free column means <M>a₃</M> is itself a combination of <M>a₁</M> and <M>a₂</M> — in fact{" "}
        <M>a₃ = 5a₁ + 4a₂</M>, which you can read out of the reduced third column. Adding it to the set did not
        enlarge the span at all. That observation is the subject of the independence chapter.
      </Note>

      <H>Question 2 — does the set span all of ℝᵐ?</H>
      <p>
        Now <M>b</M> is arbitrary, so the requirement is that <M>[ A | b ]</M> be consistent for <em>every</em>{" "}
        <M>b</M>. An inconsistency is a zero row in <M>A</M> paired with a nonzero entry in the augmented column — so
        the set spans <M>ℝᵐ</M> exactly when <M>A</M> has no zero row after reduction, that is:
      </p>
      <Eq note="a row without a pivot is a row that can be made to fail">
        Span&#123;v₁, …, v<sub>p</sub>&#125; = ℝᵐ ⟺ A has a pivot in every <em>row</em>
      </Eq>
      <p>
        Note the word <em>row</em>. Consistency questions count pivots by row; uniqueness and independence questions
        count them by column. Mixing the two is the single most common error on this material.
      </p>

      <Example title="Example 2 · testing a spanning set in ℝ³">
        <Given>
          <p>
            Do <M>v₁ = (1, −2, 0)</M>, <M>v₂ = (2, −4, 1)</M>, <M>v₃ = (0, 1, 1)</M> span <M>ℝ³</M>?
          </p>
        </Given>
        <Step do="Step 1 — no augmented column is needed">
          <p>
            The question is about the coefficient matrix alone. Put the vectors in as columns and reduce.
          </p>
          <Eq><Mx rows={[["1", "2", "0"], ["−2", "−4", "1"], ["0", "1", "1"]]} /></Eq>
        </Step>
        <Step do="Step 2 — forward phase">
          <p><Op>R₂ → R₂ + 2R₁</Op>:</p>
          <Chain>
            <Mx rows={[["1", "2", "0"], ["0", "0", "1"], ["0", "1", "1"]]} />
            <To label="R₂ ↔ R₃" />
            <Mx rows={[["1", "2", "0"], ["0", "1", "1"], ["0", "0", "1"]]} />
          </Chain>
        </Step>
        <Step do="Step 3 — count pivots by row">
          <p>
            Three pivots, in rows 1, 2 and 3 — every row has one. So no choice of <M>b</M> can produce an
            inconsistent row, and every <M>b</M> in <M>ℝ³</M> is reachable.
          </p>
        </Step>
        <Answer>Yes, these three vectors span <M>ℝ³</M>.</Answer>
      </Example>

      <Note label="Counting shortcut">
        <M>p</M> vectors in <M>ℝᵐ</M> give an <M>m × p</M> matrix, which has at most one pivot per column and at most
        one per row. So if <M>p &lt; m</M> — fewer vectors than entries — there cannot be a pivot in every row, and the
        set <strong>cannot</strong> span <M>ℝᵐ</M>. Two vectors never span <M>ℝ³</M>, no matter which two.
      </Note>
      <Pitfall>
        <ul>
          <li>
            Answering &ldquo;pivot in every column&rdquo; for a spanning question. That is the test for independence.
            Spanning is about rows.
          </li>
          <li>
            Treating a zero row <M>[0 0 0 | 0]</M> as a failure. It means one equation was redundant. Only a nonzero
            augmented entry makes it inconsistent.
          </li>
          <li>
            Saying the span &ldquo;is <M>ℝ²</M>&rdquo; for two vectors in <M>ℝ³</M>. The span is a plane <em>inside</em>{" "}
            <M>ℝ³</M>; it resembles <M>ℝ²</M> but its vectors have three entries.
          </li>
          <li>Forgetting that a set containing the zero vector still spans whatever the others do — <M>0</M> contributes nothing.</li>
        </ul>
      </Pitfall>

      <Key>
        <p>
          Span is every linear combination. <M>b</M> in the span is one consistency check on{" "}
          <M>[ v₁ ⋯ v<sub>p</sub> | b ]</M>; spanning all of <M>ℝᵐ</M> is a pivot in every <em>row</em> of{" "}
          <M>[ v₁ ⋯ v<sub>p</sub> ]</M>.
        </p>
      </Key>
    </>
  );
}
