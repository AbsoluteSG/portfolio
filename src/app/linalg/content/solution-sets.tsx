import { H, M, Eq, Key, Note, Method, Example, Given, Step, Op, Answer, Pitfall, Chain, To, Mx } from "./prose";

export default function SolutionSets() {
  return (
    <>
      <p>
        When a system has infinitely many solutions, &ldquo;infinitely many&rdquo; is not the answer. The answer is a
        formula that produces every solution and nothing else. This chapter is the standard way to write one down —{" "}
        <strong>parametric vector form</strong> — and it is worth more marks than any other single skill on this
        material.
      </p>

      <H>Homogeneous systems first</H>
      <p>
        A system is <strong>homogeneous</strong> when every right-hand side is zero: <M>Ax = 0</M>. Such a system is
        always consistent, because <M>x = 0</M> always works. That solution is called <strong>trivial</strong>, and the
        only real question is whether there are others.
      </p>
      <Eq note="the one question worth asking about a homogeneous system">
        nontrivial solutions exist ⟺ there is at least one free variable
      </Eq>
      <p>
        The solution set of <M>Ax = 0</M> is exactly the set of combinations of one vector per free variable. Those
        vectors come straight out of the RREF, and finding them is the mechanical part below.
      </p>

      <H>The method</H>
      <Method>
        <li>Row reduce the augmented matrix to RREF.</li>
        <li>If there is a pivot in the augmented column, stop: no solution.</li>
        <li>Identify the basic and free variables from the pivot columns.</li>
        <li>Turn each nonzero row back into an equation and solve it for its basic variable, in terms of the free ones.</li>
        <li>Name each free variable as a parameter, and write the solution vector with one entry per variable.</li>
        <li>Split that vector into a constant part plus one vector per parameter.</li>
      </Method>

      <Example title="Example 1 · two free variables">
        <Given>
          <p>Describe all solutions of</p>
          <Eq>
            x₁ + 3x₂ + 4x₄ = 2<br />
            2x₁ + 6x₂ + x₃ + 6x₄ = 9<br />
            −x₁ − 3x₂ + x₃ − 6x₄ + x₅ = 6
          </Eq>
        </Given>
        <Step do="Step 1 — build and reduce the augmented matrix">
          <p>Five unknowns, so five coefficient columns plus the constants. Missing terms are zeros.</p>
          <Chain>
            <Mx rows={[["1", "3", "0", "4", "0", "2"], ["2", "6", "1", "6", "0", "9"], ["−1", "−3", "1", "−6", "1", "6"]]} />
            <To label="R₂−2R₁, R₃+R₁" />
            <Mx rows={[["1", "3", "0", "4", "0", "2"], ["0", "0", "1", "−2", "0", "5"], ["0", "0", "1", "−2", "1", "8"]]} />
          </Chain>
          <p>Then <Op>R₃ → R₃ − R₂</Op> clears column 3:</p>
          <Chain>
            <Mx rows={[["1", "3", "0", "4", "0", "2"], ["0", "0", "1", "−2", "0", "5"], ["0", "0", "0", "0", "1", "3"]]} />
          </Chain>
          <p>
            Every pivot is already a <M>1</M> with zeros above and below, so this is the RREF — no backward phase
            needed here.
          </p>
        </Step>
        <Step do="Step 2 — classify the variables">
          <p>
            Pivots in columns 1, 3, 5, so <M>x₁</M>, <M>x₃</M>, <M>x₅</M> are basic and <M>x₂</M>, <M>x₄</M> are free.
            Two free variables means two parameters in the answer. No pivot in the last column, so it is consistent.
          </p>
        </Step>
        <Step do="Step 3 — solve each row for its basic variable">
          <p>Read the rows back as equations and isolate the basic variable in each:</p>
          <Eq>
            x₁ + 3x₂ + 4x₄ = 2 → x₁ = 2 − 3x₂ − 4x₄<br />
            x₃ − 2x₄ = 5 → x₃ = 5 + 2x₄<br />
            x₅ = 3
          </Eq>
          <p>
            Free variables are never solved for — they are already as solved as they get. Write{" "}
            <M>x₂ = s</M> and <M>x₄ = t</M>.
          </p>
        </Step>
        <Step do="Step 4 — assemble the solution vector">
          <p>One entry per variable, in order, each written in terms of <M>s</M> and <M>t</M>:</p>
          <Eq>
            x = <Mx rows={[["2 − 3s − 4t"], ["s"], ["5 + 2t"], ["t"], ["3"]]} />
          </Eq>
        </Step>
        <Step do="Step 5 — split it apart">
          <p>
            Separate the constants, the <M>s</M> terms and the <M>t</M> terms into three vectors. This is the form the
            question wants.
          </p>
          <Eq note="particular solution + span of two vectors">
            x = <Mx rows={[["2"], ["0"], ["5"], ["0"], ["3"]]} /> + s <Mx rows={[["−3"], ["1"], ["0"], ["0"], ["0"]]} /> + t{" "}
            <Mx rows={[["−4"], ["0"], ["2"], ["1"], ["0"]]} />
          </Eq>
        </Step>
        <Step do="Step 6 — check">
          <p>
            Substitute into the first equation: <M>(2 − 3s − 4t) + 3(s) + 4(t) = 2</M> ✓ — the parameters cancel, as
            they must for <em>every</em> choice of <M>s</M> and <M>t</M>. Checking one equation this way catches most
            sign errors.
          </p>
        </Step>
        <Answer>
          The solution set is the plane through <M>(2, 0, 5, 0, 3)</M> spanned by <M>(−3, 1, 0, 0, 0)</M> and{" "}
          <M>(−4, 0, 2, 1, 0)</M>, with <M>s, t</M> ranging over all reals.
        </Answer>
      </Example>

      <H>The structure of every solution set</H>
      <p>
        Look at what Example 1 produced: a single specific solution, plus everything the parameters can add. That split
        is not an accident of this problem — it is always the shape.
      </p>
      <Eq note="p is any one solution of Ax = b; the rest solves Ax = 0">x = p + (solution of the homogeneous system)</Eq>
      <p>
        Setting <M>s = t = 0</M> in the answer gives <M>p</M>, a <strong>particular solution</strong>. Dropping{" "}
        <M>p</M> gives the solution set of the corresponding homogeneous system <M>Ax = 0</M>. So solving{" "}
        <M>Ax = b</M> and <M>Ax = 0</M> is the same labor, and the two answers differ only by that constant vector: the
        homogeneous solution set passes through the origin, and the other is that same flat set shifted off the origin
        by <M>p</M>.
      </p>
      <Note label="Why the homogeneous version matters">
        If <M>Ax = b</M> has a solution and <M>Ax = 0</M> has only the trivial one, the solution to <M>Ax = b</M> is
        unique — there is nothing to add to it. Uniqueness is a statement about the homogeneous system, never about{" "}
        <M>b</M>.
      </Note>

      <Example title="Example 2 · when it is inconsistent">
        <Given>
          <p>Solve the system with augmented matrix</p>
          <Eq><Mx rows={[["1", "2", "3", "4"], ["2", "5", "7", "10"], ["1", "3", "4", "7"]]} /></Eq>
        </Given>
        <Step do="Step 1 — forward phase">
          <p><Op>R₂ → R₂ − 2R₁</Op>, <Op>R₃ → R₃ − R₁</Op>, then <Op>R₃ → R₃ − R₂</Op>:</p>
          <Chain>
            <Mx rows={[["1", "2", "3", "4"], ["0", "1", "1", "2"], ["0", "1", "1", "3"]]} />
            <To label="R₃−R₂" />
            <Mx rows={[["1", "2", "3", "4"], ["0", "1", "1", "2"], ["0", "0", "0", "1"]]} />
          </Chain>
        </Step>
        <Step do="Step 2 — read the last row">
          <p>
            It says <M>0x₁ + 0x₂ + 0x₃ = 1</M>, that is <M>0 = 1</M>. There is a pivot in the augmented column, so the
            system is inconsistent. Stop here — there is nothing to parametrize, and continuing to RREF earns nothing.
          </p>
        </Step>
        <Answer>No solution. The system is inconsistent.</Answer>
      </Example>

      <Pitfall>
        <ul>
          <li>
            Leaving the answer as a list of equations like <M>x₁ = 2 − 3x₂ − 4x₄</M>. That is step 3 of 6. The
            question asks for vector form.
          </li>
          <li>
            Forgetting the free variables&apos; own rows. In Example 1, <M>x₂ = s</M> contributes a <M>1</M> in the
            second entry of the <M>s</M> vector — a very common dropped entry.
          </li>
          <li>
            Solving a basic variable in terms of another basic variable. After a full RREF each pivot column is clear,
            so every basic variable is written only in terms of free ones.
          </li>
          <li>
            Writing the vectors in the wrong order. Entry <M>k</M> of every vector belongs to <M>x<sub>k</sub></M>, in
            the original variable order.
          </li>
        </ul>
      </Pitfall>

      <Key>
        <p>
          Reduce, name a parameter for each free variable, solve each pivot row for its basic variable, and split the
          result into a particular solution plus one vector per parameter. Every solution set in this course has that
          shape.
        </p>
      </Key>
    </>
  );
}
