import { H, M, Eq, Key, Note, Method, Example, Given, Step, Op, Answer, Pitfall, Bullets, Chain, To, Mx } from "./prose";

export default function LinearIndependence() {
  return (
    <>
      <p>
        In the span chapter, adding a third vector didn&apos;t enlarge the span, because that vector was already a
        combination of the other two. This chapter makes that precise and gives the test for it.
      </p>
      <p>
        A set <M>&#123;v₁, …, v<sub>p</sub>&#125;</M> is <strong>linearly independent</strong> when the only solution of
      </p>
      <Eq note="the trivial solution: all weights zero">x₁v₁ + x₂v₂ + ⋯ + x<sub>p</sub>v<sub>p</sub> = 0</Eq>
      <p>
        is <M>x₁ = x₂ = ⋯ = x<sub>p</sub> = 0</M>. If some solution has a nonzero weight, the set is{" "}
        <strong>linearly dependent</strong>, and that solution is called a <strong>dependence relation</strong>.
      </p>
      <p>
        Note what is being asked. The equation always <em>has</em> the all-zeros solution; independence is the claim
        that it has no others. So this is the homogeneous system <M>Ax = 0</M> from two chapters ago, and the question
        is whether it has nontrivial solutions — that is, whether there is a free variable.
      </p>
      <Eq note="the whole chapter in one line">
        independent ⟺ Ax = 0 has only the trivial solution ⟺ a pivot in every <em>column</em>
      </Eq>

      <H>The method</H>
      <Method>
        <li>Form the matrix <M>A = [ v₁ ⋯ v<sub>p</sub> ]</M> with the vectors as columns.</li>
        <li>Row reduce it. The augmented column of zeros never changes, so you can leave it off.</li>
        <li>A pivot in every column → only the trivial solution → <strong>independent</strong>.</li>
        <li>Any column without a pivot → a free variable → <strong>dependent</strong>.</li>
        <li>If dependent and a relation is wanted, finish to RREF, set the free variable to 1, and solve for the rest.</li>
      </Method>

      <Example title="Example 1 · dependent, with the relation">
        <Given>
          <p>
            Is <M>&#123;v₁, v₂, v₃&#125;</M> independent, where <M>v₁ = (1, 2, −1)</M>, <M>v₂ = (2, 5, 0)</M>,{" "}
            <M>v₃ = (3, 4, −7)</M>? If not, give a dependence relation.
          </p>
        </Given>
        <Step do="Step 1 — vectors as columns">
          <Eq><Mx rows={[["1", "2", "3"], ["2", "5", "4"], ["−1", "0", "−7"]]} /></Eq>
        </Step>
        <Step do="Step 2 — forward phase">
          <p><Op>R₂ → R₂ − 2R₁</Op> and <Op>R₃ → R₃ + R₁</Op>:</p>
          <Chain>
            <Mx rows={[["1", "2", "3"], ["2", "5", "4"], ["−1", "0", "−7"]]} />
            <To label="R₂−2R₁, R₃+R₁" />
            <Mx rows={[["1", "2", "3"], ["0", "1", "−2"], ["0", "2", "−4"]]} />
          </Chain>
          <p>Then <Op>R₃ → R₃ − 2R₂</Op> wipes out the last row:</p>
          <Chain>
            <Mx rows={[["1", "2", "3"], ["0", "1", "−2"], ["0", "0", "0"]]} />
          </Chain>
        </Step>
        <Step do="Step 3 — decide">
          <p>
            Two pivots, in columns 1 and 2. Column 3 has none, so <M>x₃</M> is free and nontrivial solutions exist.
            The set is dependent. That is already the full answer to the yes/no question.
          </p>
        </Step>
        <Step do="Step 4 — get the relation">
          <p>Finish to RREF with <Op>R₁ → R₁ − 2R₂</Op>:</p>
          <Chain>
            <Mx rows={[["1", "0", "7"], ["0", "1", "−2"], ["0", "0", "0"]]} />
          </Chain>
          <p>
            Reading the rows: <M>x₁ + 7x₃ = 0</M> and <M>x₂ − 2x₃ = 0</M>, so <M>x₁ = −7x₃</M> and{" "}
            <M>x₂ = 2x₃</M>. Choosing the convenient value <M>x₃ = 1</M> gives weights <M>(−7, 2, 1)</M>.
          </p>
        </Step>
        <Step do="Step 5 — check">
          <p>
            <M>−7(1, 2, −1) + 2(2, 5, 0) + (3, 4, −7)</M> = <M>(−7 + 4 + 3, −14 + 10 + 4, 7 + 0 − 7) = (0, 0, 0)</M> ✓
          </p>
        </Step>
        <Answer>
          Dependent, with <M>−7v₁ + 2v₂ + v₃ = 0</M>. Equivalently <M>v₃ = 7v₁ − 2v₂</M>.
        </Answer>
      </Example>

      <Example title="Example 2 · independent">
        <Given>
          <p>
            Same first two vectors, but <M>v₃ = (3, 4, 2)</M>. Independent?
          </p>
        </Given>
        <Step do="Step 1 — reduce">
          <p>The same two operations, and the third row now survives:</p>
          <Chain>
            <Mx rows={[["1", "2", "3"], ["2", "5", "4"], ["−1", "0", "2"]]} />
            <To label="R₂−2R₁, R₃+R₁" />
            <Mx rows={[["1", "2", "3"], ["0", "1", "−2"], ["0", "2", "5"]]} />
            <To label="R₃−2R₂" />
            <Mx rows={[["1", "2", "3"], ["0", "1", "−2"], ["0", "0", "9"]]} />
          </Chain>
        </Step>
        <Step do="Step 2 — decide">
          <p>
            Three pivots in three columns, no free variables, so <M>Ax = 0</M> forces <M>x = 0</M>. Notice you do not
            need the RREF — the echelon form already shows a pivot in every column.
          </p>
        </Step>
        <Answer>Independent.</Answer>
      </Example>

      <H>Shortcuts that save a reduction</H>
      <p>Each of these is worth recognizing on sight, because each turns a computation into one line of reasoning.</p>
      <Bullets>
        <li>
          <strong>Two vectors</strong> are dependent exactly when one is a scalar multiple of the other. No reduction
          needed — just look.
        </li>
        <li>
          <strong>More vectors than entries</strong>: any set of <M>p</M> vectors in <M>ℝⁿ</M> with <M>p &gt; n</M> is
          automatically dependent. The matrix is <M>n × p</M> with at most <M>n</M> pivots, so some column misses one.
          Four vectors in <M>ℝ³</M>, always dependent.
        </li>
        <li>
          <strong>A set containing the zero vector</strong> is always dependent: weight the zero vector by <M>1</M> and
          everything else by <M>0</M>.
        </li>
        <li>
          <strong>A set is dependent</strong> if and only if at least one vector is a combination of the{" "}
          <em>others</em> — not necessarily of the ones before it, and not necessarily every vector.
        </li>
      </Bullets>
      <Note label="Independence vs spanning, side by side">
        Both questions reduce the same matrix; they read different things off it. Independence asks for a pivot in
        every <strong>column</strong> (uniqueness). Spanning <M>ℝᵐ</M> asks for a pivot in every{" "}
        <strong>row</strong> (existence). For a square matrix the two coincide, which is why square matrices get a
        chapter of their own.
      </Note>
      <Pitfall>
        <ul>
          <li>
            Saying &ldquo;dependent because <M>v₃ = 7v₁ − 2v₂</M>, so <M>v₁</M> and <M>v₂</M> are the dependent
            ones.&rdquo; Dependence is a property of the whole set, not of particular members.
          </li>
          <li>
            Concluding independence from &ldquo;no vector is a multiple of another.&rdquo; That only settles sets of
            two. Example 1&apos;s three vectors are pairwise non-multiples and still dependent.
          </li>
          <li>
            Augmenting with a column of zeros and then treating a zero row as a contradiction. A homogeneous system is
            never inconsistent.
          </li>
          <li>
            Giving the trivial solution as the dependence relation. <M>0v₁ + 0v₂ + 0v₃ = 0</M> is true for every set
            and proves nothing.
          </li>
        </ul>
      </Pitfall>

      <Key>
        <p>
          Independence is uniqueness for <M>Ax = 0</M>: put the vectors in as columns, reduce, and look for a pivot in
          every column. A missing pivot marks a free variable, which is a dependence relation waiting to be written
          out.
        </p>
      </Key>
    </>
  );
}
