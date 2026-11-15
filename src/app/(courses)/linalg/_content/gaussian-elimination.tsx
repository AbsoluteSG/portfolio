import { H, M, Eq, Key, Note, Try, Steps, Bullets, Mx } from "./prose";

export default function GaussianElimination() {
  return (
    <>
      <p>
        Here are three equations in three unknowns. Nothing about them is obviously solvable — the unknowns are tangled
        together, and staring at them harder doesn&apos;t help.
      </p>
      <Eq>
        2y + z = −8<br />
        x − 2y − 3z = 0<br />
        −x + y + 2z = 3
      </Eq>
      <p>
        But one of them could be solvable. If an equation read <M>z = 2</M>, we&apos;d be done with <M>z</M>. So the
        plan is not to solve the system; it&apos;s to <em>trade it for a simpler system with the same solution</em>, over
        and over, until the answer is written on the page.
      </p>

      <H>Three moves that never lose the answer</H>
      <p>
        Only three operations are allowed, and each one is reversible — which is exactly why the solution set
        can&apos;t change. Undoing the move gets you back to the system you started with, so anything satisfying the new
        equations satisfied the old ones too.
      </p>
      <Steps>
        <li><strong>Swap</strong> two equations. Order was never part of the problem.</li>
        <li><strong>Scale</strong> an equation by a nonzero constant. Doubling both sides of a true statement keeps it true.</li>
        <li><strong>Add</strong> a multiple of one equation to another. If both are true, so is their combination.</li>
      </Steps>
      <Note label="Why nonzero">
        Scaling by zero is the one move that breaks this. It turns an equation into <M>0 = 0</M>, which is true but
        forgetful: you&apos;ve thrown away a constraint and the solution set grows. It&apos;s not reversible, so it&apos;s not allowed.
      </Note>

      <H>Drop the letters</H>
      <p>
        The letters never do any work. Every operation only ever touches coefficients, so write down the coefficients
        and the right-hand side, and keep the columns in place as bookkeeping for which unknown is which. That&apos;s
        the <strong>augmented matrix</strong>:
      </p>
      <Eq
        note="the bar is where the equals signs were"
      >
        <Mx rows={[["0", "2", "1", "−8"], ["1", "−2", "−3", "0"], ["−1", "1", "2", "3"]]} />
      </Eq>
      <p>
        The three moves become <strong>row operations</strong>: swap two rows, scale a row, add a multiple of one row to
        another. Same moves, less writing.
      </p>

      <H>Working down the pivots</H>
      <p>
        The strategy is mechanical. Go column by column, left to right. In each column pick a nonzero entry at or below
        the current row — the <strong>pivot</strong> — and use it to clear every entry <em>beneath</em> it, by adding the
        right multiple of the pivot row to each row below. Then move down and right, and do it again.
      </p>
      <p>
        To clear the entry <M>a</M> sitting under a pivot <M>p</M>, add <M>−a/p</M> times the pivot row to it: the
        pivot contributes <M>−a</M>, and the <M>a</M> cancels. That ratio is the whole computation, repeated.
      </p>
      <p>
        This matrix starts with an obstacle: the top-left entry is <M>0</M>, and you can&apos;t divide by it. That&apos;s
        what swaps are for — exchange the first two rows and the pivot position holds a <M>1</M>. Elimination almost
        never needs cleverness, but it does need that one bit of housekeeping.
      </p>
      <Try>
        Step through it and watch the lower-left corner fill with zeros, one entry at a time. The panel on the right
        shows the multiplier being used at each step. Then edit any entry and run it again — the moves are chosen by the
        rule above, not scripted for this particular matrix.
      </Try>

      <H>Reading off the answer</H>
      <p>
        When everything below the pivots is zero, the last row involves only the last unknown, so you can solve it
        outright — and then the row above it has only one unknown left, and so on up. That&apos;s{" "}
        <strong>back-substitution</strong>, and for this system it lands on <M>x = −4</M>, <M>y = −5</M>, <M>z = 2</M>.
      </p>
      <p>
        You can also keep going: clear <em>above</em> each pivot as well, and scale each pivot to 1. Then the matrix
        carries the solution directly, with no substitution left to do.
      </p>
      <Eq note="reduced row echelon form — the answer, read straight off">
        <Mx rows={[["1", "0", "0", "−4"], ["0", "1", "0", "−5"], ["0", "0", "1", "2"]]} />
      </Eq>
      <Note label="Cost">
        Clearing one entry touches a whole row, and there are roughly <M>n²</M> entries to clear, so elimination
        costs about <M>n³/3</M> multiply-adds. That is genuinely cheap: it&apos;s the reason this 200-year-old algorithm
        is still what your computer runs. Cramer&apos;s rule, by contrast, costs on the order of <M>n!</M>.
      </Note>

      <H>When it doesn&apos;t come out clean</H>
      <p>Two things can go wrong, and both are informative rather than fatal.</p>
      <Bullets>
        <li>
          A pivot position holds a zero, and so does every entry below it. There&apos;s nothing to pivot on, so that
          column has no pivot: the corresponding unknown is never pinned down. It&apos;s <em>free</em>, and the system
          has infinitely many solutions.
        </li>
        <li>
          A row reduces to <M>0 0 0 | 5</M>. That reads <M>0 = 5</M>. The original equations contradicted each other
          and there is no solution at all.
        </li>
      </Bullets>
      <p>
        Those two cases, plus the clean one above, are the complete list — a linear system has no solutions, exactly
        one, or infinitely many, and elimination tells you which in one pass. Never two solutions, never seventeen.
        The next two chapters are about the shape elimination leaves behind and how to write down those infinite
        families.
      </p>

      <Key>
        <p>
          Solving a linear system is a sequence of reversible trades. Each one leaves the solution set untouched and
          the matrix a little emptier, and you stop when the answer is legible.
        </p>
      </Key>
    </>
  );
}
