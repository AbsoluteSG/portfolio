import { H, M, Eq, Key, Note, Try, Bullets, Mx } from "./prose";

export default function LinearTransformations() {
  return (
    <>
      <p>
        So far a matrix has been a container for coefficients — a way to write a system down without the letters. This
        chapter replaces that reading entirely. A matrix is a <strong>function</strong>: feed it a vector, get a vector
        back. And since it does this to every vector at once, the honest picture of a matrix is what it does to the
        whole plane.
      </p>

      <H>What &ldquo;linear&rdquo; rules out</H>
      <p>
        Not every way of moving points counts. A transformation <M>T</M> is linear when it respects the two operations
        vectors have:
      </p>
      <Eq note="additivity and homogeneity — nothing else is required">
        T(v + w) = T(v) + T(w)<br />
        T(cv) = c·T(v)
      </Eq>
      <p>
        Those two lines have a vivid geometric consequence. Straight, evenly spaced lines stay straight and evenly
        spaced, and the origin stays put. Bending the grid, spacing it unevenly, or sliding it off the origin are all
        ruled out. What&apos;s left is exactly: rotations, stretches, shears, reflections, and collapses — and
        compositions of those.
      </p>
      <Note label="A warning about names">
        A map like <M>x ↦ x + 3</M> is called linear in high school, and it isn&apos;t linear here: it moves the origin.
        It&apos;s <em>affine</em> — a linear map followed by a shift.
      </Note>

      <H>The whole map fits in two columns</H>
      <p>
        Here is the payoff of those two rules. Every vector is a combination of the two basis vectors{" "}
        <M className="la-i">î</M> = (1, 0) and <M className="la-j">ĵ</M> = (0, 1):
      </p>
      <Eq>
        v = <M>(3, 2)</M> = 3·<span className="la-i">î</span> + 2·<span className="la-j">ĵ</span>
      </Eq>
      <p>
        Apply <M>T</M> and use both rules: <M>T(v) = 3·T(î) + 2·T(ĵ)</M>. The coefficients <M>3</M> and <M>2</M> came
        along unchanged. So if you know where <M>î</M> and <M>ĵ</M> land, you know where <em>everything</em> lands —
        two vectors determine the entire transformation of the infinite plane.
      </p>
      <p>
        That&apos;s what a matrix stores. Its first column is where <M>î</M> goes, its second column is where{" "}
        <M>ĵ</M> goes, and matrix–vector multiplication is just the recombination above:
      </p>
      <Eq note="a weighted sum of the columns">
        <Mx rows={[["a", "b"], ["c", "d"]]} />
        <Mx rows={[["x"], ["y"]]} /> = x
        <Mx rows={[["a"], ["c"]]} /> + y
        <Mx rows={[["b"], ["d"]]} />
      </Eq>
      <Try>
        Drag the tip of <span className="la-i">î</span> or <span className="la-j">ĵ</span> and watch the matrix entries
        follow — you are editing the columns directly. Then edit a number instead and press play to see the plane travel
        from the identity to that matrix. The blue grid is where the original grid lines ended up.
      </Try>

      <H>Reading a matrix at a glance</H>
      <p>With that picture, common matrices become recognizable rather than memorized:</p>
      <Bullets>
        <li>
          <M><Mx rows={[["1", "0"], ["0", "1"]]} /></M> leaves both basis vectors alone — the <strong>identity</strong>,
          which does nothing.
        </li>
        <li>
          <M><Mx rows={[["0", "−1"], ["1", "0"]]} /></M> sends <M>î</M> to <M>(0, 1)</M> and <M>ĵ</M> to <M>(−1, 0)</M>:
          a quarter turn counterclockwise.
        </li>
        <li>
          <M><Mx rows={[["1", "1"], ["0", "1"]]} /></M> keeps <M>î</M> but tips <M>ĵ</M> to the right — a{" "}
          <strong>shear</strong>, which slides the grid sideways in proportion to height.
        </li>
        <li>
          <M><Mx rows={[["2", "1"], ["1", "0.5"]]} /></M> has a second column that is half the first. Both basis vectors
          land on the same line, so the entire plane collapses onto it. This map throws information away, and no matrix
          can undo it.
        </li>
      </Bullets>

      <H>The equation looks different now</H>
      <p>
        Go back to <M>Ax = b</M>. Under the old reading it was a compressed list of equations. Under this one it asks a
        geometric question: <em>which vector <M>x</M> does the map <M>A</M> send to <M>b</M>?</em> Elimination is one
        way to answer it, and the answer&apos;s shape is now predictable. If <M>A</M> collapses the plane to a line,
        then <M>b</M> is either on that line — in which case a whole line of inputs maps to it — or it isn&apos;t, and
        nothing does.
      </p>
      <p>
        That is exactly the trichotomy elimination handed us in chapter two, arrived at from the opposite direction.
        The two views keep meeting like this, and each chapter from here on is a translation between them.
      </p>

      <Key>
        <p>
          A matrix is a linear map, and its columns are the destinations of the basis vectors. Everything algebraic
          about the matrix is something geometric about the map.
        </p>
      </Key>
    </>
  );
}
