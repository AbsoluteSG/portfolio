import { H, M, Eq, Key, Note, Method, Example, Given, Step, Op, Answer, Pitfall, Bullets, Chain, To, Mx } from "./prose";

export default function MatrixEquation() {
  return (
    <>
      <p>
        Three things you have been doing separately are the same thing. This chapter is the identification, and it is
        the hinge of the whole course.
      </p>

      <H>Defining Ax</H>
      <p>
        If <M>A</M> is <M>m × n</M> with columns <M>a₁, …, a<sub>n</sub></M> and <M>x</M> is in <M>ℝⁿ</M>, then{" "}
        <M>Ax</M> is <em>defined</em> to be the linear combination of the columns of <M>A</M> with the entries of{" "}
        <M>x</M> as weights:
      </p>
      <Eq note="this is the definition, not a theorem">
        Ax = x₁a₁ + x₂a₂ + ⋯ + x<sub>n</sub>a<sub>n</sub>
      </Eq>
      <p>
        The number of columns of <M>A</M> must equal the number of entries of <M>x</M>, or the expression is
        undefined. The result <M>Ax</M> is a vector in <M>ℝᵐ</M> — it has as many entries as <M>A</M> has rows.
      </p>
      <Eq>
        <Mx rows={[["1", "0", "5"], ["−2", "1", "−6"], ["0", "2", "8"]]} /> <Mx rows={[["2"], ["3"], ["0"]]} /> = 2{" "}
        <Mx rows={[["1"], ["−2"], ["0"]]} /> + 3 <Mx rows={[["0"], ["1"], ["2"]]} /> + 0 <Mx rows={[["5"], ["−6"], ["8"]]} /> ={" "}
        <Mx rows={[["2"], ["−1"], ["6"]]} />
      </Eq>
      <Note label="The row shortcut">
        In practice people compute <M>Ax</M> a row at a time: entry <M>i</M> is row <M>i</M> of <M>A</M> dotted with{" "}
        <M>x</M>. It gives the same answer and is faster by hand, but the column definition is the one to think with —
        every theorem in this unit is stated in terms of columns.
      </Note>

      <H>The three-way translation</H>
      <p>These are three notations for one problem, and you should be able to move between them without thinking:</p>
      <Eq note="matrix equation · vector equation · system of equations">
        Ax = b ⟺ x₁a₁ + ⋯ + x<sub>n</sub>a<sub>n</sub> = b ⟺ the system with augmented matrix [ A | b ]
      </Eq>
      <p>
        So every question of the form &ldquo;does <M>Ax = b</M> have a solution?&rdquo; is answered by row reducing{" "}
        <M>[ A | b ]</M>, and a solution <M>x</M> <em>is</em> the list of weights. Where the previous chapters asked
        about spans and combinations, this one gives the compact notation the rest of the course uses.
      </p>

      <Method title="Solving Ax = b">
        <li>Write the augmented matrix <M>[ A | b ]</M>.</li>
        <li>Row reduce. A pivot in the augmented column means no solution — stop.</li>
        <li>Otherwise identify basic and free variables from the pivot columns.</li>
        <li>No free variables → the unique solution is read straight off the RREF.</li>
        <li>Free variables → write the solution in parametric vector form.</li>
      </Method>

      <Example title="Example 1 · solving a matrix equation">
        <Given>
          <p>
            Solve <M>Ax = b</M> for <M>A = <Mx rows={[["1", "2", "3"], ["2", "5", "7"], ["1", "3", "5"]]} /></M> and{" "}
            <M>b = <Mx rows={[["4"], ["10"], ["7"]]} /></M>.
          </p>
        </Given>
        <Step do="Step 1 — augment and reduce">
          <p><Op>R₂ → R₂ − 2R₁</Op>, <Op>R₃ → R₃ − R₁</Op>:</p>
          <Chain>
            <Mx rows={[["1", "2", "3", "4"], ["2", "5", "7", "10"], ["1", "3", "5", "7"]]} />
            <To label="R₂−2R₁, R₃−R₁" />
            <Mx rows={[["1", "2", "3", "4"], ["0", "1", "1", "2"], ["0", "1", "2", "3"]]} />
          </Chain>
          <p>Then <Op>R₃ → R₃ − R₂</Op>:</p>
          <Chain>
            <Mx rows={[["1", "2", "3", "4"], ["0", "1", "1", "2"], ["0", "0", "1", "1"]]} />
          </Chain>
        </Step>
        <Step do="Step 2 — check consistency and count">
          <p>
            No pivot in the augmented column, so it is consistent. Pivots in all three coefficient columns, so there
            are no free variables and the solution is unique.
          </p>
        </Step>
        <Step do="Step 3 — back-substitute (or finish to RREF)">
          <p>
            The third row gives <M>x₃ = 1</M>. The second gives <M>x₂ + 1 = 2</M>, so <M>x₂ = 1</M>. The first gives{" "}
            <M>x₁ + 2(1) + 3(1) = 4</M>, so <M>x₁ = −1</M>.
          </p>
        </Step>
        <Step do="Step 4 — check in the original">
          <p>
            <M>−1(1, 2, 1) + 1(2, 5, 3) + 1(3, 7, 5) = (−1 + 2 + 3, −2 + 5 + 7, −1 + 3 + 5) = (4, 10, 7)</M> ✓ — using
            the column definition, which also checks that you assembled <M>A</M> correctly.
          </p>
        </Step>
        <Answer><M>x = (−1, 1, 1)</M>, the unique solution.</Answer>
      </Example>

      <H>When does Ax = b have a solution for every b?</H>
      <p>
        This is the existence theorem, and it says four things are equivalent for an <M>m × n</M> matrix <M>A</M>. Any
        one of them proves the others.
      </p>
      <Bullets>
        <li><M>Ax = b</M> has a solution for every <M>b</M> in <M>ℝᵐ</M>.</li>
        <li>Every <M>b</M> in <M>ℝᵐ</M> is a linear combination of the columns of <M>A</M>.</li>
        <li>The columns of <M>A</M> span <M>ℝᵐ</M>.</li>
        <li><M>A</M> has a pivot position in every <strong>row</strong>.</li>
      </Bullets>
      <Note label="Read the statement carefully">
        This is about <em>every</em> <M>b</M>. If a question gives you one specific <M>b</M>, do not use this theorem —
        just reduce <M>[ A | b ]</M>. A matrix can fail this test and still have solutions for many particular{" "}
        <M>b</M>, namely every <M>b</M> that happens to lie in the span of its columns.
      </Note>

      <Example title="Example 2 · does it work for every b?">
        <Given>
          <p>
            Does <M>Ax = b</M> have a solution for every <M>b</M> in <M>ℝ³</M>, where{" "}
            <M>A = <Mx rows={[["1", "0", "5"], ["−2", "1", "−6"], ["0", "2", "8"]]} /></M>?
          </p>
        </Given>
        <Step do="Step 1 — reduce A alone">
          <p>No <M>b</M> is involved. <Op>R₂ → R₂ + 2R₁</Op>, then <Op>R₃ → R₃ − 2R₂</Op>:</p>
          <Chain>
            <Mx rows={[["1", "0", "5"], ["0", "1", "4"], ["0", "2", "8"]]} />
            <To label="R₃−2R₂" />
            <Mx rows={[["1", "0", "5"], ["0", "1", "4"], ["0", "0", "0"]]} />
          </Chain>
        </Step>
        <Step do="Step 2 — count pivots by row">
          <p>
            Pivots in rows 1 and 2 only. Row 3 has none, so there is a <M>b</M> making the system inconsistent — any{" "}
            <M>b</M> whose reduction leaves a nonzero entry in that third row.
          </p>
        </Step>
        <Step do="Step 3 — say what is true instead">
          <p>
            The columns span a plane in <M>ℝ³</M>, not all of it. For <M>b</M> in that plane — such as{" "}
            <M>b = (2, −1, 6)</M> from the span chapter — solutions exist; for <M>b</M> off it, none do.
          </p>
        </Step>
        <Answer>
          No. <M>A</M> has only two pivots and no pivot in row 3, so its columns do not span <M>ℝ³</M>.
        </Answer>
      </Example>

      <H>Two rules you can use</H>
      <p>
        Matrix–vector multiplication is <strong>linear</strong>, meaning it satisfies exactly the two properties that
        define a linear transformation later:
      </p>
      <Eq>A(u + v) = Au + Av and A(cu) = c(Au)</Eq>
      <p>
        One immediate use: if <M>p</M> solves <M>Ax = b</M> and <M>h</M> solves <M>Ax = 0</M>, then{" "}
        <M>A(p + h) = Ap + Ah = b + 0 = b</M>, so <M>p + h</M> is another solution. That is the{" "}
        <M>x = p + h</M> structure from the solution-sets chapter, now in one line.
      </p>
      <Pitfall>
        <ul>
          <li>
            Computing <M>Ax</M> when the sizes don&apos;t match. A <M>3 × 4</M> matrix needs an <M>x</M> with four
            entries and returns a vector with three.
          </li>
          <li>
            Using the &ldquo;pivot in every row&rdquo; test on a question about one specific <M>b</M>, or the
            &ldquo;pivot in every column&rdquo; test on an existence question. Rows for existence, columns for
            uniqueness.
          </li>
          <li>
            Treating <M>Ax = b</M> as something you can divide by <M>A</M>. There is no division here; solving means
            row reduction. (Inverses come later, and only for some square matrices.)
          </li>
        </ul>
      </Pitfall>

      <Key>
        <p>
          <M>Ax</M> is the combination of <M>A</M>&apos;s columns weighted by <M>x</M>, so <M>Ax = b</M>, the vector
          equation, and the augmented matrix <M>[ A | b ]</M> are one problem in three notations. Solutions for every{" "}
          <M>b</M> means a pivot in every row.
        </p>
      </Key>
    </>
  );
}
