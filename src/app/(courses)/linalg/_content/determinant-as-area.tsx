import { H, M, Eq, Key, Note, Try, Bullets, Mx } from "./prose";

export default function DeterminantAsArea() {
  return (
    <>
      <p>
        A linear map takes the grid and stretches it. Some maps spread things out, some crush them together, and one
        number measures which: the factor by which <em>every</em> area changes. That factor is the{" "}
        <strong>determinant</strong>, and the reason a single number suffices is that the stretching is uniform. A
        linear map treats every part of the plane alike, so if one region doubles, all of them do.
      </p>

      <H>Measure one shape and you&apos;ve measured all of them</H>
      <p>
        So pick the most convenient shape: the unit square, spanned by <M className="la-i">î</M> and{" "}
        <M className="la-j">ĵ</M>, of area 1. The map sends its corners to <M>0</M>, the first column, the second
        column, and their sum — a parallelogram. Its area <em>is</em> the scale factor, because the square it came from
        had area 1.
      </p>
      <p>
        Any other region can be approximated by tiny squares, each of which gets warped into a tiny copy of that same
        parallelogram. Their areas all change by the same factor, so the whole region does too. One measurement
        generalizes.
      </p>
      <Eq note="the area of the parallelogram the columns span">
        det <Mx rows={[["a", "b"], ["c", "d"]]} /> = ad − bc
      </Eq>
      <Try>
        Drag <span className="la-i">î</span> and <span className="la-j">ĵ</span> and watch the shaded area and the
        number track each other. The dashed square is where it started. Turn on <em>base × height</em> to see why the
        formula is what it is: the parallelogram has the same area as a rectangle on the same base.
      </Try>

      <H>Why ad − bc</H>
      <p>
        The diagonal cases are easy: <M><Mx rows={[["a", "0"], ["0", "d"]]} /></M> stretches one axis by <M>a</M> and the
        other by <M>d</M>, giving an <M>a</M>-by-<M>d</M> rectangle of area <M>ad</M>. The <M>−bc</M> is the correction
        for the off-diagonal part, which tips the sides over.
      </p>
      <p>
        You can see it directly. Enclose the parallelogram in the bounding rectangle of width <M>a + b</M> and
        height <M>c + d</M>, then subtract the two triangles and two rectangles left over in the corners. Everything
        cancels except <M>ad − bc</M>. A shear is the clean case: <M><Mx rows={[["1", "1"], ["0", "1"]]} /></M> tips the
        square into a leaning parallelogram, but the base and height are unchanged, so the area stays 1 — and{" "}
        <M>ad − bc = 1</M>.
      </p>

      <H>Zero means collapse</H>
      <p>
        Set the determinant to zero and the parallelogram has no area at all: the two columns lie on the same line, and
        the entire plane has been flattened onto it. Everything the course has said about singular matrices meets here.
      </p>
      <Bullets>
        <li>The columns are linearly dependent — one is a multiple of the other.</li>
        <li>
          The map is not reversible. Infinitely many inputs share each output, so no matrix can send them back to
          where they came from, and <M>A</M> has no inverse.
        </li>
        <li>
          <M>Ax = b</M> has either infinitely many solutions or none, depending on whether <M>b</M> landed on the
          surviving line. It never has exactly one.
        </li>
        <li>Elimination will find a column with no pivot, and produce a free variable.</li>
      </Bullets>
      <p>
        These are not four related facts; they are one fact seen from four directions. <M>det A = 0</M> is the quickest
        test for it.
      </p>

      <H>What the sign means</H>
      <p>
        Area can&apos;t be negative, but the determinant can, so it is measuring something extra:{" "}
        <strong>orientation</strong>. Going counterclockwise, <M>î</M> comes before <M>ĵ</M>. Most maps preserve that;
        a reflection doesn&apos;t, and it has to pass through the flattened state to swap them. A negative determinant
        says the plane has been turned over, and its magnitude is still the honest area factor.
      </p>
      <Note label="In three dimensions">
        Everything carries over with volumes in place of areas. The determinant of a 3×3 is the volume of the
        parallelepiped spanned by its columns, zero means the three columns lie in a common plane, and the sign
        distinguishes a right-handed frame from a left-handed one.
      </Note>

      <H>The product rule, for free</H>
      <p>
        Because the determinant is a scale factor, composing two maps has to multiply their factors. That gives a
        theorem which is unpleasant to prove by expanding the entries, and obvious here:
      </p>
      <Eq note="scale by one factor, then the other">det(AB) = det(A)·det(B)</Eq>
      <p>
        Two corollaries drop out immediately. A product is singular exactly when one of its factors is; and since{" "}
        <M>A</M> composed with <M>A<sup>−1</sup></M> does nothing, <M>det(A<sup>−1</sup>) = 1/det(A)</M> — which is
        another way of seeing that a zero determinant leaves no room for an inverse.
      </p>

      <Key>
        <p>
          The determinant is the factor by which a map scales area, with a sign for whether it flips the plane. Zero
          means the map collapsed a dimension, and that single number is the shortest answer to whether a matrix is
          invertible.
        </p>
      </Key>
    </>
  );
}
