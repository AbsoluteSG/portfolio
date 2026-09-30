import { CaseSplit } from "../stages/case-split";
import { H, M, Eq, Key, Note, Try, Method, Example, Given, Step, Op, Answer, Pitfall, Bullets, Chain, To, Mx } from "./prose";

export default function Parameters() {
  return (
    <>
      <p>
        A whole genre of exam question replaces one entry of a matrix with a letter and asks{" "}
        <em>for what value does the system have no solution</em> — or one solution, or infinitely many. These look
        harder than they are. You do not need a new technique: you reduce exactly as always, carry the letter along as
        if it were a number, and read the last row.
      </p>

      <Method title="The method for any parameter question">
        <li>
          Row reduce as usual. <strong>Never divide by an expression containing the parameter</strong> — you don&apos;t
          know that it isn&apos;t zero, and dividing by it silently assumes it isn&apos;t.
        </li>
        <li>Pick pivots from entries that are plainly nonzero numbers, so the parameter ends up in the last row.</li>
        <li>Reduce until the bottom row reads <M>(expression in k)·x = (number)</M>.</li>
        <li>Set that coefficient to zero and solve for the parameter. That value is the only interesting one.</li>
        <li>
          At that value, look at the right-hand side: nonzero gives <M>0 = nonzero</M>, so <strong>no solution</strong>;
          zero gives <M>0 = 0</M>, so <strong>infinitely many</strong>.
        </li>
        <li>For every other value the pivot survives → <strong>unique solution</strong>.</li>
      </Method>

      <Example title="Example 1 · for what k is there no solution?">
        <Given>
          <p>The system with augmented matrix</p>
          <Eq><Mx rows={[["1", "1", "5", "1"], ["1", "2", "−4", "−1"], ["6", "13", "k", "−7"]]} /></Eq>
          <p>has no solutions for exactly one value of <M>k</M>. Find it.</p>
        </Given>
        <Step do="Step 1 — clear column 1 with the 1 in the corner">
          <p>
            The pivot is an honest <M>1</M>, nothing to do with <M>k</M>. <Op>R₂ → R₂ − R₁</Op> and{" "}
            <Op>R₃ → R₃ − 6R₁</Op>.
          </p>
          <Chain>
            <Mx rows={[["1", "1", "5", "1"], ["1", "2", "−4", "−1"], ["6", "13", "k", "−7"]]} />
            <To label="R₂−R₁, R₃−6R₁" />
            <Mx rows={[["1", "1", "5", "1"], ["0", "1", "−9", "−2"], ["0", "7", "k−30", "−13"]]} />
          </Chain>
          <p>
            The <M>k</M> entry became <M>k − 30</M>. Treat that as one quantity and keep going — it is no different
            from any other entry except that you can&apos;t evaluate it.
          </p>
        </Step>
        <Step do="Step 2 — clear column 2">
          <p><Op>R₃ → R₃ − 7R₂</Op>. The third entry becomes <M>(k − 30) − 7(−9) = k + 33</M>, and the last{" "}
            <M>−13 − 7(−2) = 1</M>.</p>
          <Chain>
            <Mx rows={[["1", "1", "5", "1"], ["0", "1", "−9", "−2"], ["0", "0", "k+33", "1"]]} />
          </Chain>
        </Step>
        <Step do="Step 3 — read the last row as an equation">
          <p>
            It says <M>(k + 33)·x₃ = 1</M>. Everything now depends on that one coefficient, and there are exactly two
            cases.
          </p>
          <Bullets>
            <li>
              <M>k + 33 ≠ 0</M>: divide, <M>x₃ = 1/(k + 33)</M>, then back-substitute. A pivot in every column, so the
              solution is <strong>unique</strong>.
            </li>
            <li>
              <M>k + 33 = 0</M>: the row is <M>[0 0 0 | 1]</M>, which says <M>0 = 1</M>. A pivot in the augmented
              column — <strong>no solution</strong>.
            </li>
          </Bullets>
        </Step>
        <Step do="Step 4 — solve for the parameter">
          <p><M>k + 33 = 0</M> gives <M>k = −33</M>. Check the right-hand side there: it is <M>1</M>, not zero, so this really is the inconsistent case rather than a redundant row.</p>
        </Step>
        <Answer>
          <M>k = −33</M>. For every other <M>k</M> the system has a unique solution, and no <M>k</M> gives infinitely
          many.
        </Answer>
      </Example>
      <Try>
        The stage above runs this method on <em>any</em> matrix. Click any entry and type over it — plain numbers,
        fractions like <M>−1/2</M>, or expressions in <M>k</M> such as <M>2k−1</M> — and add or drop equations and
        variables with the controls beneath. It reduces symbolically, lists every <strong>critical value</strong> it
        finds, and the slider tells you the verdict at any <M>k</M>: unique in green, infinitely many in amber, no
        solution in red. Paste your own homework problem in and step through it.
      </Try>

      <H>What that last row is actually saying</H>
      <p>
        Everything above hinges on reading one row correctly, and that step deserves slowing down. Suppose elimination
        leaves you with
      </p>
      <Eq>(k + 4)·x = 4</Eq>
      <p>
        The left side is <em>some number</em> times <M>x</M>, and which number depends on <M>k</M>. For most values
        there is nothing to think about — at <M>k = 0</M> it is <M>4x = 4</M>, at <M>k = −3</M> it is <M>1x = 4</M>,
        and each time you divide and get one value of <M>x</M>.
      </p>
      <p>
        The interesting value is <M>k = −4</M>, where the coefficient becomes zero and the row reads <M>0x = 4</M>.
        Now look at what that claims: <strong><M>0x</M> is zero for every <M>x</M> there is</strong>. Zero is never
        4. No <M>x</M> can satisfy it, so the system has <strong>no solution</strong> — the row has become a lie.
      </p>
      <p>
        Change only the right-hand side and the conclusion flips completely. If the row were <M>(k + 4)·x = 0</M>,
        then at <M>k = −4</M> it reads <M>0 = 0</M>: still true, but it no longer constrains <M>x</M> at all.{" "}
        <M>x</M> is <strong>free</strong>, and there are <strong>infinitely many solutions</strong>.
      </p>
      <Eq note="the same dead coefficient, two different meanings">
        0 = 4 is false → no solution &nbsp;·&nbsp; 0 = 0 is empty → infinitely many
      </Eq>
      <p>
        So pick a <M>k</M> and walk the row through three stages — substitute, see what it becomes, say what it
        means. Try the critical value marked ★, then one either side of it, and compare the four rows below:
      </p>

      <CaseSplit />

      <Note label="The order of the two questions">
        Ask them this way round, always. <strong>First</strong>: what value of <M>k</M> makes the coefficient zero?
        That is the only value worth discussing. <strong>Second</strong>, and only at that value: what is on the right?
        Nonzero means no solution, zero means infinitely many. Checking the right-hand side first tells you nothing,
        because while the coefficient is alive you can divide by it and the right side can be anything at all.
      </Note>

      <H>When all three outcomes are possible</H>
      <p>
        Example 1 could never produce infinitely many solutions, because the right-hand side of the critical row was
        stuck at <M>1</M>. Put a parameter on that side too and all three cases open up. This is the harder version,
        and it is the one worth practising.
      </p>

      <Example title="Example 2 · two parameters, three outcomes">
        <Given>
          <p>
            For which <M>h</M> and <M>k</M> does the system below have (a) no solution, (b) a unique solution,
            (c) infinitely many?
          </p>
          <Eq><Mx rows={[["1", "−3", "1"], ["2", "h", "k"]]} /></Eq>
        </Given>
        <Step do="Step 1 — one operation is enough">
          <p><Op>R₂ → R₂ − 2R₁</Op>:</p>
          <Chain>
            <Mx rows={[["1", "−3", "1"], ["0", "h+6", "k−2"]]} />
          </Chain>
          <p>The second row says <M>(h + 6)·x₂ = k − 2</M>.</p>
        </Step>
        <Step do="Step 2 — split on the coefficient first, the right-hand side second">
          <p>
            Always in this order. The coefficient decides whether there is a pivot; only if there isn&apos;t does the
            right-hand side matter.
          </p>
          <Bullets>
            <li><M>h + 6 ≠ 0</M>, i.e. <M>h ≠ −6</M>: pivot in both columns, <strong>unique solution</strong>, whatever <M>k</M> is.</li>
            <li><M>h = −6</M> and <M>k − 2 ≠ 0</M>: the row is <M>[0 0 | nonzero]</M> → <strong>no solution</strong>.</li>
            <li><M>h = −6</M> and <M>k = 2</M>: the row is <M>[0 0 | 0]</M>, a redundant equation. <M>x₂</M> is free → <strong>infinitely many</strong>.</li>
          </Bullets>
        </Step>
        <Answer>
          No solution: <M>h = −6, k ≠ 2</M>. Unique: <M>h ≠ −6</M> (any <M>k</M>). Infinitely many:{" "}
          <M>h = −6, k = 2</M>.
        </Answer>
      </Example>

      <H>The same trick, asked differently</H>
      <p>
        Once you can find the value that kills a pivot, several other exam questions are the same computation with a
        different sentence on the front. All of these are asking &ldquo;for what parameter does a pivot disappear?&rdquo;
      </p>
      <Bullets>
        <li><strong>For what <M>k</M> are these vectors linearly dependent?</strong> Columns, reduce, kill a pivot.</li>
        <li><strong>For what <M>k</M> do they fail to span <M>ℝ³</M>?</strong> Same reduction, same critical value.</li>
        <li><strong>For what <M>k</M> is <M>A</M> not invertible?</strong> Same again — and for a square matrix, <M>det A = 0</M> is usually the fastest route.</li>
      </Bullets>

      <Example title="Example 3 · for what k is the set dependent?">
        <Given>
          <p>
            Find all <M>k</M> making <M>&#123;(1, 2, −1), (2, 5, 0), (3, 7, k)&#125;</M> linearly dependent.
          </p>
        </Given>
        <Step do="Step 1 — vectors as columns, then reduce">
          <p><Op>R₂ → R₂ − 2R₁</Op> and <Op>R₃ → R₃ + R₁</Op>:</p>
          <Chain>
            <Mx rows={[["1", "2", "3"], ["2", "5", "7"], ["−1", "0", "k"]]} />
            <To label="R₂−2R₁, R₃+R₁" />
            <Mx rows={[["1", "2", "3"], ["0", "1", "1"], ["0", "2", "k+3"]]} />
          </Chain>
        </Step>
        <Step do="Step 2 — clear column 2">
          <p><Op>R₃ → R₃ − 2R₂</Op> leaves <M>(k + 3) − 2 = k + 1</M> in the corner:</p>
          <Chain>
            <Mx rows={[["1", "2", "3"], ["0", "1", "1"], ["0", "0", "k+1"]]} />
          </Chain>
        </Step>
        <Step do="Step 3 — dependence is a missing pivot">
          <p>
            The set is dependent exactly when column 3 has no pivot, which happens when <M>k + 1 = 0</M>. For any
            other <M>k</M> there is a pivot in every column and the set is independent.
          </p>
          <p>
            The determinant route agrees and is quicker here: expanding gives <M>det = k + 1</M>, zero at the same
            place.
          </p>
        </Step>
        <Answer>
          <M>k = −1</M>. At that value <M>(3, 7, −1) = (1, 2, −1) + (2, 5, 0)</M>, so the third vector was already in
          the span of the other two.
        </Answer>
      </Example>

      <Pitfall>
        <ul>
          <li>
            <strong>Dividing by the parameter.</strong> Scaling a row by <M>1/(k − 2)</M> quietly assumes{" "}
            <M>k ≠ 2</M> — and <M>k = 2</M> is exactly the case the question is about. Keep the parameter out of your
            denominators until you have split into cases.
          </li>
          <li>
            <strong>Choosing a pivot that contains the parameter.</strong> If a row with a plain number is available,
            swap it up and use that. Then the parameter can only ever end up in the final row, where you want it.
          </li>
          <li>
            <strong>Stopping at the critical value.</strong> &ldquo;<M>k = −33</M>&rdquo; answers only part of most
            questions. State what happens for the other values too, unless the question asks for one case.
          </li>
          <li>
            <strong>Forgetting to check the right-hand side.</strong> A zero coefficient alone does not mean
            inconsistent — <M>0 = 0</M> is infinitely many. Look right before you answer.
          </li>
          <li>
            <strong>Answering &ldquo;no solution&rdquo; when the right-hand column has no parameter and is zero.</strong>{" "}
            A homogeneous system is <em>never</em> inconsistent, so a &ldquo;for what k is there no solution&rdquo;
            question about <M>Ax = 0</M> has the answer: no such <M>k</M>.
          </li>
        </ul>
      </Pitfall>

      <Note label="Sanity check on the count">
        Before answering, reconcile with the counting rules. In Example 1 there are three equations and three
        unknowns, so unique is possible; had the system been <M>3 × 4</M>, no value of <M>k</M> could give a unique
        solution, because a free variable would survive regardless.
      </Note>

      <Key>
        <p>
          Reduce normally, never dividing by the parameter, until one row reads{" "}
          <M>(expression)·x = (number)</M>. Set the expression to zero: that is the only value worth discussing. Then
          the right-hand side decides between no solution and infinitely many, and every other value gives a unique
          one.
        </p>
      </Key>
    </>
  );
}
