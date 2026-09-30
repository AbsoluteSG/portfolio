import { H, M, Eq, Key, Note, Method, Example, Given, Step, Op, Answer, Pitfall, Bullets, Chain, To, Mx } from "./prose";

export default function EchelonForms() {
  return (
    <>
      <p>
        Elimination stops when the matrix reaches a particular shape. This chapter names that shape, because almost
        every question on this material is answered by reducing a matrix and then <em>reading</em> the result — how many
        solutions, which variables are free, whether a set is independent, whether a vector is in a span. Learn to read
        the shape and those questions all become the same question.
      </p>

      <H>The two forms</H>
      <p>A matrix is in <strong>row echelon form</strong> (REF) when:</p>
      <Bullets>
        <li>Any rows of all zeros are at the bottom.</li>
        <li>
          The first nonzero entry of a row — its <strong>leading entry</strong> — is strictly to the right of the
          leading entry of the row above.
        </li>
        <li>Everything below a leading entry is zero.</li>
      </Bullets>
      <p>
        It is in <strong>reduced row echelon form</strong> (RREF) when, in addition, every leading entry is <M>1</M> and
        is the <em>only</em> nonzero entry in its column — zeros above it as well as below.
      </p>
      <Eq note="REF (any pivots), then RREF (ones, cleared above and below)">
        <Mx rows={[["2", "−1", "3"], ["0", "5", "1"], ["0", "0", "4"]]} /> vs{" "}
        <Mx rows={[["1", "0", "0"], ["0", "1", "0"], ["0", "0", "1"]]} />
      </Eq>
      <Note label="Uniqueness">
        A matrix has many row echelon forms — the answer depends on which operations you chose — but exactly{" "}
        <strong>one</strong> reduced row echelon form. So if two people reduce the same matrix fully and disagree, one
        of them made an arithmetic error. This is also why RREF is what a grader can check against.
      </Note>

      <H>Pivots, basic variables, free variables</H>
      <p>
        A <strong>pivot position</strong> is a location holding a leading entry in the echelon form; its column is a{" "}
        <strong>pivot column</strong>. Since the pivots move strictly right as you go down, each row has at most one and
        each column at most one.
      </p>
      <Bullets>
        <li>A variable whose column has a pivot is <strong>basic</strong> — it gets pinned down.</li>
        <li>A variable whose column has no pivot is <strong>free</strong> — it can be anything, and the basic ones adjust.</li>
      </Bullets>
      <p>
        Counting them gives a rule you will use constantly: with <M>n</M> unknowns and <M>r</M> pivots in the
        coefficient columns, there are <M>n − r</M> free variables. That number <M>r</M> is the <strong>rank</strong>,
        and the whole solution set is determined by it.
      </p>

      <H>The algorithm, in order</H>
      <Method>
        <li>Start at the leftmost nonzero column. This is a pivot column.</li>
        <li>If the top entry of that column (in the current row) is zero, swap in a row below that has a nonzero entry there.</li>
        <li>Add multiples of the pivot row to the rows below to make every entry <em>beneath</em> the pivot zero.</li>
        <li>Cover the pivot row and repeat on the rows below. When no rows are left, you are in REF.</li>
        <li>For RREF: scale each pivot row so its pivot is <M>1</M>, then work from the rightmost pivot leftward, clearing the entries <em>above</em> each pivot.</li>
      </Method>
      <p>
        Steps 1–4 are the <strong>forward phase</strong>, step 5 the <strong>backward phase</strong>. The forward phase
        alone is enough to count solutions; do the backward phase when you need the solution itself written out.
      </p>

      <Example title="Example 1 · reduce and read">
        <Given>
          <p>Find the RREF of the augmented matrix below, and identify the pivot columns and free variables.</p>
          <Eq><Mx rows={[["1", "2", "−1", "3", "1"], ["2", "4", "−1", "8", "5"], ["−1", "−2", "3", "−1", "3"]]} /></Eq>
        </Given>
        <Step do="Step 1 — pivot in column 1, clear below it">
          <p>
            The top-left entry is already <M>1</M>, which is the easiest possible pivot. Use it on both rows below:{" "}
            <Op>R₂ → R₂ − 2R₁</Op> and <Op>R₃ → R₃ + R₁</Op>.
          </p>
          <Chain>
            <Mx rows={[["1", "2", "−1", "3", "1"], ["2", "4", "−1", "8", "5"], ["−1", "−2", "3", "−1", "3"]]} />
            <To label="R₂−2R₁, R₃+R₁" />
            <Mx rows={[["1", "2", "−1", "3", "1"], ["0", "0", "1", "2", "3"], ["0", "0", "2", "2", "4"]]} />
          </Chain>
        </Step>
        <Step do="Step 2 — column 2 has no pivot">
          <p>
            Below the first row, column 2 is entirely zero. There is nothing to pivot on, so we move right and leave
            column 2 without a pivot — <M>x₂</M> is going to be free. This is the step people skip; you do not swap
            rows to force a pivot here, because no row has a nonzero entry in that column.
          </p>
        </Step>
        <Step do="Step 3 — pivot in column 3, clear below">
          <p>Row 2 now leads with <M>1</M> in column 3. <Op>R₃ → R₃ − 2R₂</Op>.</p>
          <Chain>
            <Mx rows={[["1", "2", "−1", "3", "1"], ["0", "0", "1", "2", "3"], ["0", "0", "2", "2", "4"]]} />
            <To label="R₃−2R₂" />
            <Mx rows={[["1", "2", "−1", "3", "1"], ["0", "0", "1", "2", "3"], ["0", "0", "0", "−2", "−2"]]} />
          </Chain>
          <p>This is row echelon form: the leading entries step strictly to the right, and all are clear below.</p>
        </Step>
        <Step do="Step 4 — backward phase, scale then clear above">
          <p>
            Scale <Op>R₃ → −½R₃</Op> to make its pivot <M>1</M>, then clear column 4 above it with{" "}
            <Op>R₁ → R₁ − 3R₃</Op> and <Op>R₂ → R₂ − 2R₃</Op>. Finally clear column 3 with <Op>R₁ → R₁ + R₂</Op>.
          </p>
          <Chain>
            <Mx rows={[["1", "2", "−1", "3", "1"], ["0", "0", "1", "2", "3"], ["0", "0", "0", "1", "1"]]} />
            <To label="clear above" />
            <Mx rows={[["1", "2", "0", "0", "−1"], ["0", "0", "1", "0", "1"], ["0", "0", "0", "1", "1"]]} />
          </Chain>
        </Step>
        <Step do="Step 5 — read the result">
          <p>
            Pivots sit in columns 1, 3 and 4, so <M>x₁</M>, <M>x₃</M>, <M>x₄</M> are basic and <M>x₂</M> is free. The
            rank is <M>3</M>; with <M>4</M> unknowns that leaves <M>4 − 3 = 1</M> free variable, as found. No pivot in
            the last column, so the system is consistent.
          </p>
        </Step>
        <Answer>
          RREF as above; pivot columns 1, 3, 4; <M>x₂</M> free; consistent with infinitely many solutions.
        </Answer>
      </Example>

      <H>Consistency, read off in one glance</H>
      <p>
        A row of the form <M>[ 0 0 ⋯ 0 | b ]</M> with <M>b ≠ 0</M> says <M>0 = b</M>, which is impossible. That is a
        pivot in the <em>augmented</em> column, and it is the only way a system can fail.
      </p>
      <Eq note="existence and uniqueness, in full">
        consistent ⟺ no pivot in the augmented column
      </Eq>
      <p>And when it is consistent, the count follows immediately:</p>
      <Bullets>
        <li>No free variables (a pivot in every coefficient column) → exactly one solution.</li>
        <li>At least one free variable → infinitely many solutions.</li>
      </Bullets>
      <Note label="A free count you can do in your head">
        A system with more unknowns than equations has at most one pivot per row, so at most <M>m</M> pivots for{" "}
        <M>n &gt; m</M> unknowns — there must be a free variable. So such a system is never uniquely solvable: it has
        either no solutions or infinitely many. Exam questions lean on this.
      </Note>
      <Pitfall>
        <ul>
          <li>
            Calling column 2 a pivot column in Example 1 because it &ldquo;looks like it should be.&rdquo; A pivot is
            where a leading entry <em>lands</em> after reduction, not where you&apos;d like one.
          </li>
          <li>
            Counting a pivot in the augmented column as a basic variable. That column is not a variable at all — it
            means the system is inconsistent, and the answer is &ldquo;no solution&rdquo; regardless of everything else.
          </li>
          <li>
            Starting the backward phase before the forward phase is finished. Clearing above a pivot while rows below
            are still uncleared reintroduces entries you already removed.
          </li>
          <li>Scaling a row by zero, or swapping in a row that has a zero in the pivot column. Neither is legal or useful.</li>
        </ul>
      </Pitfall>

      <Key>
        <p>
          Reduce, then read: pivot in the last column means inconsistent; a pivot in every variable&apos;s column means
          unique; anything left over is a free variable and infinitely many solutions. Rank counts the pivots, and{" "}
          <M>n − rank</M> counts the freedoms.
        </p>
      </Key>
    </>
  );
}
