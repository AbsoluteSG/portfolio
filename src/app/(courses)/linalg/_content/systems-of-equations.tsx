import { H, M, Eq, Key, Note, Method, Example, Given, Step, Op, Answer, Pitfall, Bullets, Mx } from "./prose";

export default function SystemsOfEquations() {
  return (
    <>
      <p>
        A <strong>linear equation</strong> in the unknowns <M>x₁, …, x<sub>n</sub></M> is one where every unknown
        appears by itself, to the first power, multiplied by a constant:
      </p>
      <Eq note="a₁ … aₙ and b are known numbers">a₁x₁ + a₂x₂ + ⋯ + a<sub>n</sub>x<sub>n</sub> = b</Eq>
      <p>
        Nothing else is allowed — no <M>x²</M>, no <M>xy</M>, no <M>√x</M>, <M>sin x</M>, or <M>1/x</M>. A{" "}
        <strong>system</strong> is a finite list of such equations sharing the same unknowns, and a{" "}
        <strong>solution</strong> is a list of numbers that satisfies <em>every</em> equation at once. The{" "}
        <strong>solution set</strong> is the collection of all of them; two systems with the same solution set are
        called <strong>equivalent</strong>, which is the whole basis of the method in the next chapter.
      </p>
      <Note label="Which is a linear equation?">
        <M>3x₁ − 5x₂ = x₃ + 2</M> is linear — rearrange to <M>3x₁ − 5x₂ − x₃ = 2</M>. <M>x₁x₂ = 4</M> is not, because
        two unknowns are multiplied together. <M>x₁ = 4√2 − x₂</M> <em>is</em> linear: <M>√2</M> is a coefficient, not
        an unknown under a root.
      </Note>

      <H>Only three outcomes are possible</H>
      <p>
        Every linear system, of any size, has exactly one of these solution sets. This is worth knowing before you
        compute anything, because it tells you what a correct answer can look like.
      </p>
      <Bullets>
        <li><strong>No solution.</strong> The system is <strong>inconsistent</strong>.</li>
        <li><strong>Exactly one solution.</strong> Consistent, with a unique solution.</li>
        <li><strong>Infinitely many solutions.</strong> Consistent, with at least one free variable.</li>
      </Bullets>
      <p>
        For two equations in two unknowns you can see why: each equation is a line, and two lines either cross once,
        are parallel and never meet, or are the same line. There is no arrangement of straight lines that meets in
        exactly two points. The same argument runs in any dimension with planes and hyperplanes.
      </p>

      <H>Solving a 2×2 by elimination</H>
      <Method>
        <li>Pick an unknown to kill. Multiply one equation so that its coefficient matches the other equation&apos;s, up to sign.</li>
        <li>Add or subtract the equations to remove that unknown.</li>
        <li>Solve the resulting single-variable equation.</li>
        <li>Substitute back into an original equation to get the other unknown.</li>
        <li>Check the pair in <em>both</em> original equations.</li>
      </Method>

      <Example title="Example 1 · a unique solution">
        <Given>
          <p>Solve</p>
          <Eq>2x + 3y = 7<br />4x − y = 7</Eq>
        </Given>
        <Step do="Step 1 — eliminate x">
          <p>
            The second equation has twice the <M>x</M> of the first, so subtract <M>2×</M> the first from it:{" "}
            <Op>R₂ → R₂ − 2R₁</Op>.
          </p>
          <Eq>(4x − y) − 2(2x + 3y) = 7 − 2(7)</Eq>
          <p>
            The <M>x</M> terms cancel: <M>4x − 4x = 0</M>. What&apos;s left is <M>−y − 6y = −7y</M> on the left and{" "}
            <M>7 − 14 = −7</M> on the right.
          </p>
          <Eq>−7y = −7</Eq>
        </Step>
        <Step do="Step 2 — solve for y">
          <p>Divide by <M>−7</M>, giving <M>y = 1</M>.</p>
        </Step>
        <Step do="Step 3 — back-substitute">
          <p>Put <M>y = 1</M> into the first equation: <M>2x + 3(1) = 7</M>, so <M>2x = 4</M> and <M>x = 2</M>.</p>
        </Step>
        <Step do="Step 4 — check">
          <p>
            First: <M>2(2) + 3(1) = 7</M> ✓. Second: <M>4(2) − 1 = 7</M> ✓. Both, not just the one you substituted
            into — a mistake in step 2 would still satisfy that one.
          </p>
        </Step>
        <Answer><M>(x, y) = (2, 1)</M> — a unique solution.</Answer>
      </Example>

      <H>Recognizing the other two outcomes</H>
      <p>
        Nothing special is needed to detect them. Run the same elimination and read what it gives you.
      </p>

      <Example title="Example 2 · no solution">
        <Given>
          <Eq>x + 2y = 3<br />2x + 4y = 8</Eq>
        </Given>
        <Step do="Step 1 — eliminate x">
          <p><Op>R₂ → R₂ − 2R₁</Op> kills the <M>x</M> term — but it kills the <M>y</M> term too:</p>
          <Eq>(2x + 4y) − 2(x + 2y) = 8 − 6 → 0 = 2</Eq>
        </Step>
        <Step do="Step 2 — read it">
          <p>
            <M>0 = 2</M> is false for every <M>x</M> and <M>y</M>. No pair can satisfy both equations, because the
            second demands that <M>x + 2y</M> equal <M>4</M> while the first demands <M>3</M>.
          </p>
        </Step>
        <Answer>No solution — the system is inconsistent.</Answer>
      </Example>

      <Example title="Example 3 · infinitely many solutions">
        <Given>
          <Eq>x + 2y = 3<br />2x + 4y = 6</Eq>
        </Given>
        <Step do="Step 1 — eliminate x">
          <p>The same operation now gives <M>0 = 0</M>: a true statement carrying no information.</p>
        </Step>
        <Step do="Step 2 — describe the whole set">
          <p>
            The second equation was just the first one doubled, so there is really only one constraint. Let{" "}
            <M>y</M> be anything — call it <M>t</M> — and the first equation forces <M>x = 3 − 2t</M>.
          </p>
        </Step>
        <Answer>
          <M>(x, y) = (3 − 2t, t)</M> for every real <M>t</M> — infinitely many solutions, one per value of <M>t</M>.
        </Answer>
      </Example>
      <Pitfall>
        <ul>
          <li>
            Writing &ldquo;infinitely many solutions&rdquo; and stopping. Exam questions want the set{" "}
            <em>described</em> — a parameter and a formula, as in Example 3. Chapter 4 does this properly.
          </li>
          <li>
            Confusing <M>0 = 0</M> with <M>0 = 2</M>. The first means a redundant equation (infinitely many
            solutions); the second means a contradiction (none). One word of the answer changes.
          </li>
          <li>
            Dropping a minus sign while scaling. Subtracting <M>2R₁</M> means subtracting it from{" "}
            <em>every</em> term including the right-hand side.
          </li>
        </ul>
      </Pitfall>

      <H>Writing it as a matrix</H>
      <p>
        Every step above touched only coefficients, so the letters can go. Record the coefficients in the{" "}
        <strong>coefficient matrix</strong> and tack on the right-hand side to get the{" "}
        <strong>augmented matrix</strong>. For Example 1:
      </p>
      <Eq note="coefficient matrix, then augmented matrix">
        <Mx rows={[["2", "3"], ["4", "−1"]]} /> and <Mx rows={[["2", "3", "7"], ["4", "−1", "7"]]} />
      </Eq>
      <p>
        Column 1 holds every coefficient of <M>x</M>, column 2 every coefficient of <M>y</M>, and the last column the
        constants. A missing unknown is a <M>0</M> in that column — never a gap, or the columns stop lining up.
      </p>
      <p>
        A system with <M>m</M> equations and <M>n</M> unknowns therefore becomes an <M>m × n</M> coefficient matrix and
        an <M>m × (n+1)</M> augmented matrix. Rows are equations, columns are unknowns. Everything from here on is
        operations on those rows.
      </p>

      <Key>
        <p>
          A linear system has no solutions, one, or infinitely many — never any other count. Elimination decides which,
          and the augmented matrix is the shorthand that makes elimination fast to write.
        </p>
      </Key>
    </>
  );
}
